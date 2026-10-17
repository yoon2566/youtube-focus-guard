export const MAX_MEMBERS = 4;
export const HEARTBEAT_TIMEOUT = 9000;
export const ROOM_TTL = 2 * 60 * 60 * 1000;
const DURATIONS = [1, 10, 25, 50];
const clean = (s, limit) => typeof s === 'string' ? s.trim().replace(/[\u0000-\u001f]/g, '').slice(0, limit) : '';
const id = () => crypto.randomUUID();
export class RoomCore {
  constructor(data) { this.data = data; }
  static create(code, input, now = Date.now()) {
    if (!DURATIONS.includes(input.durationMinutes)) throw new Error('집중 시간은 1·10·25·50분 중 선택해 주세요.');
    if (!['solo','group'].includes(input.mode)) throw new Error('집중 모드를 선택해 주세요.');
    const room = new RoomCore({ code, sessionId:id(), mode:input.mode, status:'lobby', durationMs:input.durationMinutes*60000,
      goal:clean(input.goal,80) || '나만의 집중 시간', hostId:null, members:[], elapsedMs:0, runningSince:null,
      points:0, multiplier:1, reason:'친구들과 준비해 주세요.', createdAt:now, expiresAt:now+ROOM_TTL });
    const member = room.add(input.nickname, now);
    room.data.hostId = member.id;
    return { room, member };
  }
  add(nickname, now=Date.now()) {
    const d=this.data;
    if(now>=d.expiresAt) throw new Error('만료된 방입니다. 새 방을 만들어 주세요.');
    if(d.status!=='lobby') throw new Error('이미 시작했거나 종료된 방입니다.');
    if(d.members.length >= (d.mode==='solo'?1:MAX_MEMBERS)) throw new Error('방이 가득 찼습니다. 최대 4명까지 참여할 수 있어요.');
    const name=clean(nickname,16);
    if(!name) throw new Error('닉네임을 입력해 주세요.');
    const member={id:id(),token:id().replaceAll('-',''),nickname:name,ready:false,active:false,connected:false,lastSeenAt:now,connectionId:null,everConnected:false};
    d.members.push(member);
    return member;
  }
  authenticate(token) { return this.data.members.find(m=>m.token===token); }
  connect(memberId, connectionId, now=Date.now()) {
    this.tick(now);
    const m=this.member(memberId);
    this.reset('친구가 다시 연결해 집중 시간이 초기화됐어요. 모두 돌아오면 처음부터 시작해요.');
    const first=!m.everConnected;
    Object.assign(m,{connected:true,active:first && this.data.status==='lobby',ready:false,lastSeenAt:now,connectionId,everConnected:true});
  }
  member(memberId) {
    const m=this.data.members.find(x=>x.id===memberId);
    if(!m) throw new Error('참여 정보를 찾을 수 없습니다.');
    return m;
  }
  disconnect(memberId, connectionId, now=Date.now()) {
    const m=this.data.members.find(x=>x.id===memberId);
    if(!m || m.connectionId!==connectionId) return;
    this.tick(now);
    this.reset(`${m.nickname}님의 연결이 끊겨 모두의 집중 시간이 초기화됐어요.`);
    Object.assign(m,{connected:false,active:false,ready:false,connectionId:null});
  }
  pause(now, reason) {
    const d=this.data;
    if(d.status==='running') {
      d.elapsedMs=Math.min(d.durationMs,d.elapsedMs+Math.max(0,now-d.runningSince));
      d.runningSince=null; d.status='paused'; d.reason=reason;
    }
  }
  reset(reason) {
    const d=this.data;
    if(!['running','paused'].includes(d.status)) return;
    d.elapsedMs=0; d.runningSince=null; d.status='paused'; d.reason=reason;
  }
  allActive() { return this.data.members.length>0 && this.data.members.every(m=>m.connected&&m.active); }
  tick(now=Date.now()) {
    const d=this.data;
    if(now>=d.expiresAt && !['completed','aborted'].includes(d.status)) {
      this.pause(Math.min(now,d.runningSince || now),'방 유효 시간이 끝났어요.');
      d.status='aborted'; d.runningSince=null; d.reason='방 유효 시간이 끝났어요. 새 방을 만들어 주세요.'; return;
    }
    const stale=d.members.filter(m=>m.connected && now-m.lastSeenAt>HEARTBEAT_TIMEOUT);
    if(stale.length) {
      // A lost client may have left the page without delivering visibilitychange.
      this.reset('연결이 끊겨 모두의 집중 시간이 초기화됐어요.');
      for(const m of stale) { m.connected=false; m.active=false; m.ready=false; }
    }
    if(d.status==='running' && d.elapsedMs+Math.max(0,now-d.runningSince)>=d.durationMs) {
      d.elapsedMs=d.durationMs; d.runningSince=null; d.status='completed';
      d.multiplier=d.members.length>=3?1.5:d.members.length===2?1.2:1;
      d.points=Math.round(d.durationMs/60000*2*d.multiplier);
      d.reason='모두 함께 나무 한 그루를 키웠어요!';
    }
  }
  action(memberId, connectionId, message, now=Date.now()) {
    this.tick(now);
    const d=this.data, m=this.member(memberId);
    if(m.connectionId!==connectionId) throw new Error('다른 연결에서 접속했어요. 이 화면을 다시 열어 주세요.');
    if(!message || typeof message.type!=='string') throw new Error('올바르지 않은 요청입니다.');
    if(message.type==='heartbeat' || message.type==='sync') {
      m.lastSeenAt=now;
      // A stale connection requires explicit reactivation, never auto-resume.
      m.connected=true;
      return;
    }
    if(['completed','aborted'].includes(d.status)) throw new Error('종료된 도전입니다. 새 나무를 심어 주세요.');
    if(message.type==='active') {
      if(typeof message.active!=='boolean') throw new Error('상태를 확인해 주세요.');
      m.lastSeenAt=now; m.connected=true; m.active=message.active;
      if(!m.active) { m.ready=false; this.reset(`${m.nickname}님이 집중을 벗어나 모두의 시간이 초기화됐어요.`); }
      else if(d.status==='paused' && this.allActive()) { d.status='running'; d.runningSince=now; d.reason='처음부터 다시 함께 자라는 중'; }
    } else if(message.type==='ready') {
      if(d.status!=='lobby') throw new Error('이미 시작한 도전입니다.');
      if(!m.connected || !m.active) throw new Error('먼저 화면으로 돌아와 주세요.');
      m.ready=message.ready===true; m.lastSeenAt=now;
    } else if(message.type==='start') {
      if(m.id!==d.hostId) throw new Error('방장만 시작할 수 있어요.');
      if(d.status!=='lobby') throw new Error('이미 시작한 도전입니다.');
      if(!this.allActive() || !d.members.every(x=>x.ready)) throw new Error('모두 준비를 완료해야 시작할 수 있어요.');
      d.status='running'; d.runningSince=now; d.reason='함께 자라는 중';
      d.multiplier=d.members.length>=3?1.5:d.members.length===2?1.2:1;
    } else if(message.type==='abort') {
      this.pause(now,'도전을 종료했어요.'); d.status='aborted'; d.runningSince=null;
      d.reason=`${m.nickname}님이 도전을 종료했어요. 완성 보상은 지급되지 않습니다.`;
    } else if(message.type==='leave') {
      if(d.status!=='lobby') throw new Error('진행 중에는 도전 종료를 사용해 주세요.');
      d.members=d.members.filter(x=>x.id!==m.id);
      if(d.hostId===m.id) d.hostId=d.members[0]?.id || null;
      if(d.members.length===0) {d.status='aborted';d.reason='모든 참여자가 나갔어요.';}
    } else throw new Error('지원하지 않는 요청입니다.');
  }
  snapshot(now=Date.now()) {
    const d=this.data;
    return {code:d.code,sessionId:d.sessionId,mode:d.mode,status:d.status,durationMs:d.durationMs,goal:d.goal,hostId:d.hostId,
      members:d.members.map(({id,nickname,ready,active,connected})=>({id,nickname,ready,active,connected})),
      elapsedMs:Math.min(d.durationMs,d.elapsedMs+(d.status==='running'?Math.max(0,now-d.runningSince):0)),
      runningSince:d.runningSince,serverNow:now,points:d.points,multiplier:d.multiplier,reason:d.reason};
  }
}
