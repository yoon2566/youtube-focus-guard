import test from 'node:test';
import assert from 'node:assert/strict';
import {RoomCore,HEARTBEAT_TIMEOUT} from '../src/room.js';
const setup=(n=2)=>{
 const {room,member}=RoomCore.create('ABC234',{nickname:'host',mode:n===1?'solo':'group',durationMinutes:1,goal:'책 읽기'},1000);
 const members=[member];for(let i=1;i<n;i++)members.push(room.add('친구'+i,1000));
 members.forEach((m,i)=>{room.connect(m.id,'c'+i,1000);room.action(m.id,'c'+i,{type:'ready',ready:true},1000);});
 return {room,members,send:(i,msg,now=1000)=>room.action(members[i].id,'c'+i,msg,now)};
};
test('maximum four participants, no late join, no solo join',()=>{
 const x=setup(4);assert.throws(()=>x.room.add('five',1000),/4명/);
 x.send(0,{type:'start'});assert.throws(()=>x.room.add('late',1000),/시작/);
 const solo=setup(1);assert.throws(()=>solo.room.add('second',1000));
});
test('only host starts after all ready',()=>{
 const x=setup();assert.throws(()=>x.send(1,{type:'start'}),/방장/);
 x.send(1,{type:'ready',ready:false});assert.throws(()=>x.send(0,{type:'start'}),/준비/);
 x.send(1,{type:'ready',ready:true});x.send(0,{type:'start'});assert.equal(x.room.data.status,'running');
});
test('one hidden member pauses entire room; only explicit return resumes',()=>{
 const x=setup();x.send(0,{type:'start'});
 x.send(1,{type:'active',active:false},4000);assert.equal(x.room.snapshot(6000).elapsedMs,3000);
 x.send(0,{type:'heartbeat'},6000);assert.equal(x.room.data.status,'paused');
 x.send(1,{type:'heartbeat'},6000);assert.equal(x.room.data.status,'paused');
 x.send(1,{type:'active',active:true},6000);assert.equal(x.room.data.status,'running');
 assert.equal(x.room.snapshot(8000).elapsedMs,5000);
});
test('all hidden members must return',()=>{
 const x=setup();x.send(0,{type:'start'});x.send(0,{type:'active',active:false},2000);x.send(1,{type:'active',active:false},2100);
 x.send(0,{type:'active',active:true},3000);assert.equal(x.room.data.status,'paused');
 x.send(1,{type:'active',active:true},3100);assert.equal(x.room.data.status,'running');
});
test('disconnect and reconnect never silently resume',()=>{
 const x=setup();x.send(0,{type:'start'});x.room.disconnect(x.members[1].id,'c1',2500);
 assert.equal(x.room.data.status,'paused');x.room.connect(x.members[1].id,'new',3000);
 assert.equal(x.room.data.status,'paused');assert.equal(x.members[1].active,false);
 x.room.action(x.members[1].id,'new',{type:'active',active:true},3500);assert.equal(x.room.data.status,'running');
 // Close from stale connection must not disconnect the replacement.
 x.room.disconnect(x.members[1].id,'c1',3600);assert.equal(x.members[1].connected,true);
});
test('silent lost heartbeat rolls back to last verified presence',()=>{
 const x=setup();x.send(0,{type:'start'});x.send(0,{type:'heartbeat'},7000);x.send(1,{type:'heartbeat'},7000);
 x.send(0,{type:'heartbeat'},12000);x.room.tick(7000+HEARTBEAT_TIMEOUT+1);
 assert.equal(x.room.data.status,'paused');assert.equal(x.room.data.elapsedMs,6000);
});
test('abort affects all and no points',()=>{
 const x=setup();x.send(0,{type:'start'});x.send(1,{type:'abort'},2000);
 assert.equal(x.room.data.status,'aborted');assert.equal(x.room.data.points,0);
 assert.throws(()=>x.send(0,{type:'active',active:true},2100),/종료/);
});
for(const [n,mult] of [[1,1],[2,1.2],[3,1.5],[4,1.5]])test(`completion rewards ${n} members`,()=>{
 const x=setup(n);x.send(0,{type:'start'});
 for(let t=3000;t<=61000;t+=2000)x.members.forEach((m,i)=>x.send(i,{type:'heartbeat'},t));
 assert.equal(x.room.data.status,'completed');assert.equal(x.room.data.multiplier,mult);
 assert.equal(x.room.data.points,Math.round(2*mult));assert.equal(x.room.data.elapsedMs,60000);
 x.room.tick(120000);assert.equal(x.room.data.points,Math.round(2*mult));
});
test('snapshot does not disclose tokens and persisted state can resume',()=>{
 const x=setup();assert.ok(!JSON.stringify(x.room.snapshot()).includes(x.members[0].token));
 const restored=new RoomCore(JSON.parse(JSON.stringify(x.room.data)));assert.equal(restored.authenticate(x.members[0].token).id,x.members[0].id);
});
test('lobby leave transfers host',()=>{
 const x=setup();x.send(0,{type:'leave'});assert.equal(x.room.data.hostId,x.members[1].id);
});
