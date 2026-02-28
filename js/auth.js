const Auth = (() => {
  function hashPass(p) { let h=5381; for(let i=0;i<p.length;i++) h=((h<<5)+h)^p.charCodeAt(i); return (h>>>0).toString(16); }
  function showMsg(id,text,type) { const el=document.getElementById(id); if(!el)return; el.textContent=text; el.className='auth-msg '+type+' show'; }
  function clearMsgs(...ids) { ids.forEach(id=>{const el=document.getElementById(id);if(el){el.textContent='';el.className='auth-msg';}}); }

  function switchTab(tab) {
    document.getElementById('tabLogin').classList.toggle('active', tab==='login');
    document.getElementById('tabRegister').classList.toggle('active', tab!=='login');
    document.getElementById('loginForm').classList.toggle('hidden', tab!=='login');
    document.getElementById('registerForm').classList.toggle('hidden', tab==='login');
    clearMsgs('loginErr','regErr','regOk');
  }

  function register() {
    clearMsgs('regErr','regOk');
    const username = document.getElementById('regUser').value.trim().toLowerCase();
    const pass     = document.getElementById('regPass').value;
    const pass2    = document.getElementById('regPass2').value;
    if (!username)                            return showMsg('regErr','Please enter a username.','err');
    if (!/^[a-z0-9_]{2,24}$/.test(username)) return showMsg('regErr','Username: 2–24 chars, letters/numbers/underscores.','err');
    if (pass.length < 4)                      return showMsg('regErr','Password must be at least 4 characters.','err');
    if (pass !== pass2)                       return showMsg('regErr','Passwords do not match.','err');
    const users = Storage.getUsers();
    if (users[username])                      return showMsg('regErr','Username taken — try another.','err');
    users[username] = { hash: hashPass(pass), joinedAt: Date.now() };
    Storage.saveUsers(users);
    showMsg('regOk','✓ Account created! Signing you in…','ok');
    setTimeout(() => {
      const user = { username, joinedAt: users[username].joinedAt };
      Storage.saveSession(user);
      App.enterApp(user);
    }, 800);
  }

  function login() {
    clearMsgs('loginErr');
    const username = document.getElementById('loginUser').value.trim().toLowerCase();
    const pass     = document.getElementById('loginPass').value;
    if (!username) return showMsg('loginErr','Please enter your username.','err');
    if (!pass)     return showMsg('loginErr','Please enter your password.','err');
    const users  = Storage.getUsers();
    const record = users[username];
    if (!record || record.hash !== hashPass(pass)) return showMsg('loginErr','Wrong username or password.','err');
    const user = { username, joinedAt: record.joinedAt };
    Storage.saveSession(user);
    App.enterApp(user);
  }

  function logout() {
    Storage.clearSession();
    App.currentUser = null;
    Rooms.stopPoll(); Chat.stopPoll();
    Chat.currentRoom = null;
    document.getElementById('appScreen').classList.add('hidden');
    document.getElementById('authScreen').classList.remove('hidden');
    document.getElementById('loginUser').value = '';
    document.getElementById('loginPass').value = '';
    clearMsgs('loginErr','regErr','regOk');
    switchTab('login');
  }

  function init() {
    document.getElementById('loginBtn').addEventListener('click', login);
    document.getElementById('regBtn').addEventListener('click', register);
    document.getElementById('logoutBtn').addEventListener('click', logout);
    ['loginUser','loginPass'].forEach(id => document.getElementById(id).addEventListener('keydown', e => { if(e.key==='Enter') login(); }));
    ['regUser','regPass','regPass2'].forEach(id => document.getElementById(id).addEventListener('keydown', e => { if(e.key==='Enter') register(); }));
  }

  return { switchTab, register, login, logout, init };
})();
