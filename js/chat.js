const Chat = (() => {
  const MAX_MSGS=200, POLL_MS=2000;
  let pollTimer=null, lastCount=-1, _currentRoom=null;
  function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
  function fmt(ts){return new Date(ts).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});}
  function fmtDate(ts){const d=new Date(ts),t=new Date();t.setHours(0,0,0,0);const y=new Date(t);y.setDate(t.getDate()-1);if(d>=t)return'Today';if(d>=y)return'Yesterday';return d.toLocaleDateString([],{weekday:'long',month:'short',day:'numeric'});}

  async function joinRoom(room) {
    if(room.passHash&&!Storage.isUnlocked(room.id)){UI.openRoomPassModal(room);return;}
    _enterRoom(room);
  }

  function _enterRoom(room) {
    _currentRoom=room; lastCount=-1; stopPoll();
    const emoji=Rooms.getRoomEmoji(room.name);
    document.getElementById('chatRoomName').textContent=emoji+' '+room.name;
    document.getElementById('chatRoomMeta').textContent=(room.description||'')+(room.passHash?' · 🔒 Password protected':'')+' · by '+( room.createdBy||'unknown');
    const db=document.getElementById('deleteRoomBtn');
    if(db)db.style.display=(App.currentUser?.username===room.createdBy)?'flex':'none';
    document.getElementById('welcomePane').classList.add('hidden');
    document.getElementById('gamePane').classList.add('hidden');
    document.getElementById('chatPane').classList.remove('hidden');
    document.querySelectorAll('.room-item').forEach(el=>el.classList.toggle('active',el.dataset.id===room.id));
    const sidebar=document.getElementById('sidebar');
    if(window.innerWidth<=640)sidebar.classList.add('slide-out');
    document.getElementById('messages').innerHTML='<div class="loading-msg">loading messages…</div>';
    startPoll();
    setTimeout(()=>document.getElementById('msgInput')?.focus(),100);
  }

  async function send() {
    if(!_currentRoom||!App.currentUser)return;
    const inp=document.getElementById('msgInput');
    const text=inp.value.trim(), files=Files.getPending();
    if(!text&&!files.length)return;
    const sb=document.getElementById('sendBtn');if(sb)sb.disabled=true;
    const msg={id:Math.random().toString(36).slice(2),username:App.currentUser.username,text,files:files.map(f=>({name:f.name,size:f.size,type:f.type,dataUrl:f.dataUrl})),ts:Date.now()};
    inp.value='';inp.style.height='auto';Files.clearPending();
    let msgs=await Storage.getMsgs(_currentRoom.id);msgs.push(msg);
    if(msgs.length>MAX_MSGS)msgs=msgs.slice(-MAX_MSGS);
    await Storage.saveMsgs(_currentRoom.id,msgs);
    const rooms=await Storage.getRooms();const room=rooms.find(r=>r.id===_currentRoom.id);
    if(room){room.lastActivity=Date.now();await Storage.saveRooms(rooms);}
    renderMsgs(msgs);if(sb)sb.disabled=false;
  }

  function renderMsgs(msgs) {
    if(msgs.length===lastCount)return;
    const area=document.getElementById('messages');if(!area)return;
    const atBottom=area.scrollTop+area.clientHeight>=area.scrollHeight-100;
    lastCount=msgs.length;area.innerHTML='';
    if(!msgs.length){area.innerHTML='<div class="system-msg">No messages yet — say something! 👋</div>';return;}
    let lastDate='';
    msgs.forEach(m=>{
      const ds=fmtDate(m.ts);
      if(ds!==lastDate){lastDate=ds;const div=document.createElement('div');div.className='date-divider';div.textContent=ds;area.appendChild(div);}
      const own=App.currentUser&&m.username===App.currentUser.username;
      const d=document.createElement('div');d.className='msg '+(own?'own':'other');
      d.innerHTML=`<div class="msg-meta"><span class="name">${esc(m.username||'unknown')}</span><span>${fmt(m.ts)}</span></div><div class="bubble">${m.text?`<span>${esc(m.text)}</span>`:''}${Files.buildBubbleFiles(m.files)}</div>`;
      area.appendChild(d);
    });
    area.querySelectorAll('.bubble-img').forEach(img=>img.addEventListener('click',()=>UI.openLightbox(img.dataset.src)));
    if(atBottom||msgs.at(-1)?.username===App.currentUser?.username)area.scrollTop=area.scrollHeight;
  }

  async function poll(){if(!_currentRoom)return;try{const msgs=await Storage.getMsgs(_currentRoom.id);renderMsgs(msgs);}catch{}}
  function startPoll(){poll();pollTimer=setInterval(poll,POLL_MS);}
  function stopPoll(){clearInterval(pollTimer);pollTimer=null;lastCount=-1;}

  function init(){
    const sb=document.getElementById('sendBtn'),inp=document.getElementById('msgInput');
    if(sb)sb.addEventListener('click',send);
    if(inp){inp.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send();}});inp.addEventListener('input',()=>{inp.style.height='auto';inp.style.height=Math.min(inp.scrollHeight,120)+'px';});}
    document.getElementById('backBtn')?.addEventListener('click',()=>document.getElementById('sidebar').classList.remove('slide-out'));
  }

  return { get currentRoom(){return _currentRoom;}, set currentRoom(v){_currentRoom=v;}, joinRoom,send,startPoll,stopPoll,renderMsgs,init };
})();
