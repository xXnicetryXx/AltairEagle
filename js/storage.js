const Storage = (() => {
  const KEYS = {
    USERS:   'ae_users_v1',
    SESSION: 'ae_session_v1',
    ROOMS:   'ae_rooms_v1',
    MSGS:    'ae_msgs_v1_',
    UNLOCKED:'ae_unlocked_v1',
  };
  const hasWS = (() => { try { return typeof window.storage === 'object' && window.storage !== null; } catch { return false; } })();
  function localGet(k) { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } }
  function localSet(k,v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }
  async function sharedGet(k) {
    if (hasWS) { try { const r = await window.storage.get(k,true); return r ? JSON.parse(r.value) : null; } catch {} }
    return localGet(k);
  }
  async function sharedSet(k,v) {
    if (hasWS) { try { await window.storage.set(k, JSON.stringify(v), true); return; } catch {} }
    localSet(k,v);
  }
  async function sharedDelete(k) {
    if (hasWS) { try { await window.storage.delete(k,true); } catch {} }
    try { localStorage.removeItem(k); } catch {}
  }
  function getUsers()   { return localGet(KEYS.USERS) || {}; }
  function saveUsers(u) { localSet(KEYS.USERS, u); }
  function getSession()   { try { return JSON.parse(sessionStorage.getItem(KEYS.SESSION)); } catch { return null; } }
  function saveSession(u) { try { sessionStorage.setItem(KEYS.SESSION, JSON.stringify(u)); } catch {} }
  function clearSession() { try { sessionStorage.removeItem(KEYS.SESSION); } catch {} }
  function getUnlocked()      { return localGet(KEYS.UNLOCKED) || []; }
  function addUnlocked(id)    { const u=getUnlocked(); if(!u.includes(id)){u.push(id);localSet(KEYS.UNLOCKED,u);} }
  function removeUnlocked(id) { localSet(KEYS.UNLOCKED, getUnlocked().filter(x=>x!==id)); }
  function isUnlocked(id)     { return getUnlocked().includes(id); }
  async function getRooms()       { return (await sharedGet(KEYS.ROOMS)) || []; }
  async function saveRooms(rooms) { await sharedSet(KEYS.ROOMS, rooms); }
  async function getMsgs(rid)        { return (await sharedGet(KEYS.MSGS+rid)) || []; }
  async function saveMsgs(rid, msgs) { await sharedSet(KEYS.MSGS+rid, msgs); }
  async function deleteMsgs(rid)     { await sharedDelete(KEYS.MSGS+rid); }
  return { getUsers,saveUsers, getSession,saveSession,clearSession, getUnlocked,addUnlocked,removeUnlocked,isUnlocked, getRooms,saveRooms, getMsgs,saveMsgs,deleteMsgs };
})();
