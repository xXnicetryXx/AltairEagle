const App = (() => {
  let _currentUser = null;

  async function enterApp(user) {
    _currentUser = user;
    document.getElementById('sidebarAvatar').textContent   = user.username[0].toUpperCase();
    document.getElementById('sidebarUsername').textContent = user.username;
    document.getElementById('authScreen').classList.add('hidden');
    document.getElementById('appScreen').classList.remove('hidden');
    Rooms.startPoll();
    await seedDefaultRooms();
  }

  async function seedDefaultRooms() {
    const rooms = await Storage.getRooms();
    if (rooms.length > 0) return;
    const defaults = [
      { name: 'General',        description: 'A place for everyone',           type: 'public' },
      { name: 'Math Help',      description: 'Stuck on a problem? Ask here!',  type: 'public' },
      { name: 'Science Corner', description: 'Bio, chem, physics & more',      type: 'public' },
      { name: 'Coding Lounge',  description: 'Debug and learn together',       type: 'public' },
      { name: 'Study Hall',     description: 'Focus mode — share notes here',  type: 'public' },
    ];
    for (const d of defaults) await Rooms.createRoom(d);
  }

  function init() {
    Auth.init();
    Chat.init();
    Files.init();
    UI.init();
    Games.init();

    const sess = Storage.getSession();
    if (sess && sess.username) {
      const users = Storage.getUsers();
      if (users[sess.username]) { enterApp(sess); return; }
      Storage.clearSession();
    }
  }

  return {
    get currentUser() { return _currentUser; },
    set currentUser(v) { _currentUser = v; },
    enterApp, init,
  };
})();

document.addEventListener('DOMContentLoaded', () => App.init());
