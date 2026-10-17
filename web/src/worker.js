import {RoomCore,ROOM_TTL} from './room.js';
const json=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
const alphabet='ABCDEFGHJKMNPQRSTUVWXYZ23456789';
function code() {const bytes=crypto.getRandomValues(new Uint8Array(6));return [...bytes].map(b=>alphabet[b%alphabet.length]).join('');}
async function body(request) {
  const text=await request.text(); if(text.length>2048) throw new Error('요청이 너무 큽니다.');
  return JSON.parse(text);
}
export default {
  async fetch(request,env) {
    const url=new URL(request.url);
    if(!url.pathname.startsWith('/api/')) return env.ASSETS.fetch(request);
    const origin=request.headers.get('Origin');
    if(origin && origin!==url.origin) return json({error:'다른 사이트에서 보낸 요청입니다.'},403);
    if(url.pathname==='/api/health') return json({ok:true,app:'focus-forest',maxMembers:4});
    try {
      if(url.pathname==='/api/rooms' && request.method==='POST') {
        const input=await body(request);
        for(let attempt=0;attempt<4;attempt++) {
          const roomCode=code(), stub=env.ROOMS.get(env.ROOMS.idFromName(roomCode));
          const result=await stub.fetch(new Request('https://room/create',{method:'POST',body:JSON.stringify({...input,code:roomCode})}));
          if(result.status!==409) return result;
        }
        return json({error:'잠시 후 다시 방을 만들어 주세요.'},503);
      }
      const match=url.pathname.match(/^\/api\/rooms\/([A-Z2-9]{6})\/(join|ws)$/);
      if(match) {
        const stub=env.ROOMS.get(env.ROOMS.idFromName(match[1]));
        if(match[2]==='join' && request.method==='POST') {
          const input=await body(request);
          return stub.fetch(new Request('https://room/join',{method:'POST',body:JSON.stringify(input)}));
        }
        return stub.fetch(new Request(`https://room/${match[2]}`,request));
      }
      return json({error:'요청한 주소를 찾을 수 없습니다.'},404);
    } catch(error) { return json({error:error instanceof SyntaxError?'입력 형식을 확인해 주세요.':error.message},400); }
  }
};
export class FocusRoom {
  constructor(ctx,env) {
    this.ctx=ctx;this.env=env;this.core=null;
    ctx.blockConcurrencyWhile(async()=>{const data=await ctx.storage.get('room');if(data)this.core=new RoomCore(data);});
  }
  async save() {if(this.core) await this.ctx.storage.put('room',this.core.data);}
  async schedule() {
    if(!this.core) return;
    const d=this.core.data;
    await this.ctx.storage.setAlarm(['completed','aborted'].includes(d.status)?Math.max(Date.now()+1000,d.expiresAt):Date.now()+3000);
  }
  broadcast() {
    if(!this.core)return;
    const message=JSON.stringify({type:'state',state:this.core.snapshot()});
    for(const ws of this.ctx.getWebSockets()) {try{ws.send(message);}catch{}}
  }
  async fetch(request) {
    const path=new URL(request.url).pathname;
    try {
      if(path==='/create' && request.method==='POST') {
        if(this.core) return json({error:'이미 사용 중인 코드'},409);
        const input=await body(request); const {room,member}=RoomCore.create(input.code,input);
        this.core=room;await this.save();await this.schedule();
        return json({code:input.code,memberId:member.id,token:member.token,state:room.snapshot()},201);
      }
      if(!this.core) return json({error:'방을 찾을 수 없어요. 초대코드를 확인해 주세요.'},404);
      this.core.tick();
      if(Date.now()>=this.core.data.expiresAt) return json({error:'만료된 방입니다. 새 방을 만들어 주세요.'},410);
      if(path==='/join' && request.method==='POST') {
        const {nickname}=await body(request);const member=this.core.add(nickname);
        await this.save();this.broadcast();await this.schedule();
        return json({code:this.core.data.code,memberId:member.id,token:member.token,state:this.core.snapshot()},201);
      }
      if(path==='/ws' && request.headers.get('Upgrade')?.toLowerCase()==='websocket') {
        const protocols=(request.headers.get('Sec-WebSocket-Protocol')||'').split(',').map(s=>s.trim());
        if(protocols[0]!=='focus-v1')return json({error:'지원하지 않는 연결입니다.'},400);
        const member=this.core.authenticate(protocols[1]);
        if(!member)return json({error:'참여 인증이 만료되었습니다.'},403);
        const connectionId=crypto.randomUUID();
        for(const old of this.ctx.getWebSockets()) {
          const a=old.deserializeAttachment(); if(a?.memberId===member.id){try{old.close(4001,'Replaced by a new connection');}catch{}}
        }
        this.core.connect(member.id,connectionId);
        const pair=new WebSocketPair();this.ctx.acceptWebSocket(pair[1]);
        pair[1].serializeAttachment({memberId:member.id,connectionId});
        await this.save();this.broadcast();await this.schedule();
        return new Response(null,{status:101,webSocket:pair[0],headers:{'Sec-WebSocket-Protocol':'focus-v1'}});
      }
      return json({error:'요청 방법을 확인해 주세요.'},405);
    }catch(error){return json({error:error.message},400);}
  }
  async webSocketMessage(ws,raw) {
    try {
      if(typeof raw!=='string' || raw.length>1024)throw new Error('요청이 너무 큽니다.');
      const message=JSON.parse(raw),a=ws.deserializeAttachment();
      this.core.action(a.memberId,a.connectionId,message);
      await this.save();
      // Heartbeats acknowledge connection without flooding every other client.
      if(message.type==='heartbeat') ws.send(JSON.stringify({type:'state',state:this.core.snapshot()}));
      else this.broadcast();
    }catch(error){try{ws.send(JSON.stringify({type:'error',message:error.message}));}catch{}}
  }
  async webSocketClose(ws,code,reason,wasClean) {
    const a=ws.deserializeAttachment();if(!this.core||!a)return;
    this.core.disconnect(a.memberId,a.connectionId);await this.save();this.broadcast();
    try{ws.close(code===1006?1000:code,'Connection closed');}catch{}
  }
  async webSocketError(ws) {await this.webSocketClose(ws,1000,'error',false);}
  async alarm() {
    if(!this.core)return;
    if(Date.now()>=this.core.data.expiresAt) {
      this.core.tick();this.broadcast();
      for(const ws of this.ctx.getWebSockets()){try{ws.close(1000,'Room expired');}catch{}}
      await this.ctx.storage.deleteAll();this.core=null;return;
    }
    this.core.tick();await this.save();this.broadcast();await this.schedule();
  }
}
