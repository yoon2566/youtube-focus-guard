import assert from 'node:assert/strict';
const base=process.argv[2]||'http://127.0.0.1:8787';
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const clients=[];
async function api(path,input){const response=await fetch(base+path,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(input)});return {status:response.status,...await response.json()};}
async function connect(session){
 const ws=new WebSocket(base.replace(/^http/,'ws')+`/api/rooms/${session.code}/ws`,['focus-v1',session.token]);
 const c={ws,state:null,errors:[],session};clients.push(c);
 ws.addEventListener('message',e=>{const m=JSON.parse(e.data);if(m.type==='state')c.state=m.state;else c.errors.push(m.message);});
 await wait(()=>c.state,8000);c.send=m=>ws.send(JSON.stringify(m));
 c.beat=setInterval(()=>{if(ws.readyState===1)c.send({type:'heartbeat'});},2000);return c;
}
async function wait(predicate,timeout=6000){const end=Date.now()+timeout;while(Date.now()<end){if(predicate())return;await sleep(40);}throw new Error('Timed out waiting for expected state');}
try{
 assert.equal((await fetch(base+'/api/health').then(r=>r.json())).maxMembers,4);
 assert.equal((await api('/api/rooms/AAAAAA/join',{nickname:'none'})).status,404);
 const first=await api('/api/rooms',{nickname:'TEST 호스트',mode:'group',durationMinutes:1,goal:'자동 검증'});assert.equal(first.status,201);
 const a=await connect(first), participants=[a];
 for(let i=1;i<4;i++)participants.push(await connect(await api(`/api/rooms/${first.code}/join`,{nickname:`TEST ${i}`})));
 assert.equal((await api(`/api/rooms/${first.code}/join`,{nickname:'fifth'})).status,400);
 await wait(()=>participants.every(c=>c.state.members.length===4));
 participants[1].send({type:'start'});await wait(()=>participants[1].errors.length>0);
 for(const c of participants)c.send({type:'ready',ready:true});
 await wait(()=>a.state.members.every(m=>m.ready));a.send({type:'start'});
 await wait(()=>participants.every(c=>c.state.status==='running'));
 assert.equal((await api(`/api/rooms/${first.code}/join`,{nickname:'late'})).status,400);
 participants[1].send({type:'active',active:false});await wait(()=>participants.every(c=>c.state.status==='paused'));
 const stopped=a.state.elapsedMs;await sleep(1100);a.send({type:'sync'});await sleep(150);assert.equal(a.state.elapsedMs,stopped);
 participants[2].send({type:'active',active:false});await sleep(120);
 participants[1].send({type:'active',active:true});await sleep(120);assert.equal(a.state.status,'paused');
 participants[2].send({type:'active',active:true});await wait(()=>a.state.status==='running');
 const old=participants[3];clearInterval(old.beat);old.ws.close();await wait(()=>a.state.status==='paused');
 const replacement=await connect(old.session);assert.equal(replacement.state.status,'paused');
 replacement.send({type:'active',active:true});await wait(()=>a.state.status==='running');
 replacement.send({type:'abort'});await wait(()=>a.state.status==='aborted');assert.equal(a.state.points,0);
 console.log('PASS: HTTP + four WebSocket clients, capacity, host readiness, late join, shared pause, explicit resume, reconnect, abort');
 if(process.argv.includes('--complete')){
  const solo=await connect(await api('/api/rooms',{nickname:'TEST 완료',mode:'solo',durationMinutes:1,goal:'완료 검증'}));
  solo.send({type:'ready',ready:true});await wait(()=>solo.state.members[0].ready);solo.send({type:'start'});
  await wait(()=>solo.state.status==='running');console.log('1 minute real-time completion test running...');
  await wait(()=>solo.state.status==='completed',68000);assert.equal(solo.state.elapsedMs,60000);assert.equal(solo.state.points,2);
  console.log('PASS: actual 60-second server completion and reward');
 }
}finally{for(const c of clients){clearInterval(c.beat);try{c.ws.close();}catch{}}}
