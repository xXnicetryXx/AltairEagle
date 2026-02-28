const Rooms = (() => {
  let pollTimer = null, lastHash = '';
  function hashPass(p) { let h=5381; for(let i=0;i<p.length;i++) h=((h<<5)+h)^p.charCodeAt(i); return (h>>>0).toString(16); }
  function genId() { return Math.random().toString(36).slice(2,10)+Date.now().toString(36); }
  function esc(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  async function createRoom({name,description,password,type}) {
    if (!name||!name.trim()) return {error:'Room name is required.'};
    if (name.trim().length>40) return {error:'Name too long.'};
    const rooms = await Storage.getRooms();
    if (rooms.length>=50) return {error:'Max rooms reached.'};
    if (rooms.some(r=>r.name.toLowerCase()===name.trim().toLowerCase())) return {error:'A room with that name already exists.'};
    const room = { id:genId(), name:name.trim(), description:description?.trim()||'', type:type||'public', passHash:password?hashPass(password):null, createdBy:App.currentUser?.username||'unknown', createdAt:Date.now(), lastActivity:Date.now() };
    rooms.push(room);
    await Storage.saveRooms(rooms);
    if (room.passHash) Storage.addUnlocked(room.id);
    return {room};
  }

  async function deleteRoom(roomId) {
    const rooms = await Storage.getRooms();
    const idx = rooms.findIndex(r=>r.id===roomId);
    if (idx===-1) return {error:'Room not found.'};
    rooms.splice(idx,1);
    await Storage.saveRooms(rooms);
    await Storage.deleteMsgs(roomId);
    Storage.removeUnlocked(roomId);
    return {ok:true};
  }

  async function changeRoomPassword(roomId, newPassword) {
    const rooms = await Storage.getRooms();
    const room = rooms.find(r=>r.id===roomId);
    if (!room) return {error:'Room not found.'};
    room.passHash = newPassword ? hashPass(newPassword) : null;
    await Storage.saveRooms(rooms);
    if (room.passHash) Storage.addUnlocked(roomId); else Storage.removeUnlocked(roomId);
    return {ok:true};
  }

  function verifyPassword(room, attempt) {
    if (!room.passHash) return true;
    return hashPass(attempt) === room.passHash;
  }

  function getRoomEmoji(name) {
    const n = name.toLowerCase();
    if (/math|calc|algebra|geometry|trig/.test(n)) return '🔢';
    if (/science|bio|chem|physics/.test(n))        return '🔬';
    if (/history|hist/.test(n))                    return '📜';
    if (/english|literature|writing|essay/.test(n))return '📚';
    if (/art|design|draw|creative/.test(n))        return '🎨';
    if (/music|audio|theory/.test(n))              return '🎵';
    if (/code|program|dev|cs|computer/.test(n))    return '💻';
    if (/language|spanish|french|german|japanese/.test(n)) return '🌍';
    if (/general|chat|lounge|main/.test(n))        return '💬';
    if (/help|support|question|ask/.test(n))       return '🙋';
    if (/random|fun|off|memes/.test(n))            return '🎲';
    if (/announce|news|updates/.test(n))           return '📢';
    if (/study|homework|hw/.test(n))               return '📖';
    if (/geography|geo|map/.test(n))               return '🗺️';
    return '💬';
  }

  function renderRoomList(rooms) {
    const hash = rooms.map(r=>r.id+r.name+r.lastActivity).join('|');
    if (hash===lastHash) return; lastHash=hash;
    const list = document.getElementById('roomList');
    if (!list) return;
    if (!rooms.length) { list.innerHTML='<div class="room-loading">No rooms yet — create one!</div>'; return; }
    const sorted = [...rooms].sort((a,b)=>(b.lastActivity||0)-(a.lastActivity||0));
    list.innerHTML='';
    sorted.forEach(room => {
      const item = document.createElement('div');
      item.className='room-item'+(Chat.currentRoom?.id===room.id?' active':'');
      item.dataset.id=room.id;
      const isLocked=!!room.passHash, isPrivate=room.type==='private', unlocked=Storage.isUnlocked(room.id);
      item.innerHTML=`
        <div class="room-icon">${getRoomEmoji(room.name)}</div>
        <div class="room-text">
          <div class="room-name">${esc(room.name)}</div>
          <div class="room-preview">${room.description?esc(room.description):(isLocked?'🔒 Password protected':'Public room')}</div>
        </div>
        <div class="room-badges">
          ${isLocked?`<span class="badge-lock">${unlocked?'🔓':'🔒'}</span>`:''}
          ${isPrivate?`<span class="badge-private">PRIVATE</span>`:''}
        </div>`;
      item.addEventListener('click', ()=>Chat.joinRoom(room));
      list.appendChild(item);
    });
  }

  async function pollRooms() {
    try { const rooms=await Storage.getRooms(); renderRoomList(rooms); } catch {}
  }
  function startPoll() { pollRooms(); pollTimer=setInterval(pollRooms,3000); }
  function stopPoll()  { clearInterval(pollTimer); pollTimer=null; lastHash=''; }

  return { createRoom,deleteRoom,changeRoomPassword,verifyPassword,renderRoomList,startPoll,stopPoll,pollRooms,getRoomEmoji };
})();
