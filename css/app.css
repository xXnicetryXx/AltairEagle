#appScreen { display: flex; height: 100vh; overflow: hidden; }

/* ── SIDEBAR ── */
#sidebar {
  width: var(--sidebar-w); flex-shrink: 0; background: var(--surface);
  border-right: 1px solid var(--border); display: flex; flex-direction: column; overflow: hidden;
}
.sidebar-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 14px 14px 12px; border-bottom: 1px solid var(--border); flex-shrink: 0;
}
.sidebar-logo { display: flex; align-items: center; gap: 8px; }
.logo-eagle { font-size: 22px; }
.logo-name { font-family: 'Playfair Display', serif; font-size: 15px; font-weight: 700; color: var(--accent); }
.sidebar-section-label { font-size: 9px; color: var(--muted2); letter-spacing: 1px; text-transform: uppercase; padding: 10px 14px 5px; flex-shrink: 0; }
.room-list { flex: 1; overflow-y: auto; padding: 3px 7px; min-height: 0; }
.room-loading { font-size: 11px; color: var(--muted); padding: 14px 7px; }

.room-item {
  display: flex; align-items: center; gap: 10px;
  padding: 9px 8px; border-radius: var(--radius-sm);
  cursor: pointer; transition: background .15s; margin-bottom: 2px;
}
.room-item:hover { background: var(--surface2); }
.room-item.active { background: var(--accent-dim); }
.room-item.active .room-name { color: var(--accent); }
.room-icon {
  width: 34px; height: 34px; border-radius: 9px; background: var(--surface3);
  display: flex; align-items: center; justify-content: center; font-size: 15px; flex-shrink: 0;
  border: 1px solid var(--border);
}
.room-item.active .room-icon { border-color: var(--accent); background: var(--accent-dim); }
.room-text { flex: 1; overflow: hidden; }
.room-name { font-size: 12px; color: var(--text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-weight: 500; }
.room-preview { font-size: 10px; color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 1px; }
.room-badges { display: flex; align-items: center; gap: 4px; flex-shrink: 0; }
.badge-lock { font-size: 11px; color: var(--muted); }
.badge-private { font-size: 9px; color: var(--accent2); background: var(--accent2-dim); padding: 1px 5px; border-radius: 4px; }

.sidebar-footer {
  display: flex; align-items: center; gap: 8px;
  padding: 11px 11px; border-top: 1px solid var(--border); flex-shrink: 0;
}
.user-pill { display: flex; align-items: center; gap: 10px; flex: 1; overflow: hidden; }
.avatar {
  width: 30px; height: 30px; border-radius: 50%; background: var(--accent);
  display: flex; align-items: center; justify-content: center;
  font-size: 13px; font-weight: 700; color: #0d0f14; flex-shrink: 0;
}
.user-info { overflow: hidden; }
.user-name { font-size: 12px; color: var(--accent); display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.user-status { font-size: 9px; color: var(--success); display: block; }

/* ── MAIN ── */
#mainArea { flex: 1; display: flex; flex-direction: column; overflow: hidden; }

.welcome-pane {
  flex: 1; display: flex; flex-direction: column;
  align-items: center; justify-content: center; gap: 14px; padding: 40px; text-align: center;
}
.welcome-eagle { font-size: 60px; }
.welcome-pane h2 { font-size: 24px; color: var(--accent); }
.welcome-pane p  { font-size: 12px; color: var(--muted); max-width: 300px; line-height: 1.7; }

/* ── GAME PANE ── */
#gamePane { display: flex; flex-direction: column; height: 100%; }
.game-topbar {
  display: flex; align-items: center; gap: 12px;
  background: var(--surface); border-bottom: 1px solid var(--border);
  padding: 10px 16px; flex-shrink: 0;
}
.game-topbar .icon-btn { width: auto; padding: 6px 10px; font-size: 12px; color: var(--muted); }
.game-topbar-title { font-family: 'Playfair Display', serif; font-size: 16px; color: var(--accent); flex: 1; }
.game-topbar-score { font-size: 12px; color: var(--accent2); letter-spacing: .5px; }
#gameContainer { flex: 1; overflow: auto; padding: 0; }

/* ── CHAT PANE ── */
#chatPane { display: flex; flex-direction: column; height: 100%; position: relative; }
.chat-header {
  background: var(--surface); border-bottom: 1px solid var(--border);
  padding: 11px 18px; display: flex; align-items: center; gap: 10px; flex-shrink: 0;
}
.mobile-back { display: none; }
.chat-header-info { flex: 1; overflow: hidden; }
.chat-room-name { font-size: 14px; font-weight: 500; color: var(--text); display: block; }
.chat-room-meta { font-size: 10px; color: var(--muted); display: block; margin-top: 1px; }
.chat-header-actions { display: flex; gap: 4px; flex-shrink: 0; }

.file-strip {
  display: none; flex-wrap: wrap; gap: 8px; padding: 9px 18px;
  background: var(--surface2); border-bottom: 1px solid var(--border);
  flex-shrink: 0; max-height: 130px; overflow-y: auto;
}
.file-strip.active { display: flex; }
.preview-chip { display: flex; align-items: center; gap: 6px; background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 4px 7px; max-width: 200px; }
.preview-chip img { width: 32px; height: 32px; object-fit: cover; border-radius: 4px; }
.chip-icon { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
.chip-name { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 10px; color: var(--muted); }
.chip-remove { background: none; border: none; cursor: pointer; color: var(--muted); font-size: 13px; padding: 0 2px; transition: color .15s; flex-shrink: 0; }
.chip-remove:hover { color: var(--danger); }

.messages-area {
  flex: 1; overflow-y: auto; padding: 18px;
  display: flex; flex-direction: column; gap: 7px; scroll-behavior: smooth;
}
.msg { display: flex; flex-direction: column; gap: 3px; max-width: 68%; animation: fadeUp .2s ease; }
.msg.own   { align-self: flex-end;   align-items: flex-end; }
.msg.other { align-self: flex-start; align-items: flex-start; }
.msg-meta { font-size: 9px; color: var(--muted); letter-spacing: .5px; text-transform: uppercase; display: flex; gap: 8px; }
.msg-meta .name { color: var(--accent); }
.bubble { padding: 9px 13px; border-radius: 14px; font-size: 13px; line-height: 1.6; word-break: break-word; white-space: pre-wrap; }
.msg.own .bubble   { background: var(--bubble-own); border: 1px solid var(--bubble-own-border); border-bottom-right-radius: 4px; color: var(--bubble-own-text); }
.msg.other .bubble { background: var(--bubble-other); border: 1px solid var(--border); border-bottom-left-radius: 4px; color: var(--text); }
.bubble-img { max-width: 250px; max-height: 190px; border-radius: 8px; display: block; cursor: zoom-in; margin-top: 4px; }
.bubble video { border-radius: 8px; margin-top: 4px; max-width: 250px; }
.bubble audio { margin-top: 5px; display: block; max-width: 250px; }
.file-card { display: flex; align-items: center; gap: 9px; background: rgba(255,255,255,.04); border: 1px solid var(--border); border-radius: 10px; padding: 8px 11px; margin-top: 4px; text-decoration: none; transition: background .15s; max-width: 250px; }
.file-card:hover { background: rgba(255,255,255,.08); }
.fc-icon { font-size: 22px; flex-shrink: 0; }
.fc-info { flex: 1; overflow: hidden; }
.fc-name { font-size: 11px; color: var(--text); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; display: block; }
.fc-size { font-size: 9px; color: var(--muted); display: block; margin-top: 1px; }
.fc-dl   { font-size: 14px; color: var(--accent2); flex-shrink: 0; }

.system-msg { text-align: center; font-size: 10px; color: var(--muted); padding: 6px 0; }
.date-divider { text-align: center; font-size: 9px; color: var(--muted2); letter-spacing: 1px; text-transform: uppercase; padding: 5px 0; display: flex; align-items: center; gap: 10px; }
.date-divider::before, .date-divider::after { content: ''; flex: 1; height: 1px; background: var(--border); }

.drag-overlay {
  display: none; position: absolute; inset: 0;
  background: rgba(96,200,240,.07); border: 3px dashed var(--accent2);
  z-index: 100; align-items: center; justify-content: center;
  font-size: 20px; color: var(--accent2); pointer-events: none;
}
.drag-overlay.active { display: flex; }

.input-area { background: var(--surface); border-top: 1px solid var(--border); padding: 11px 18px; flex-shrink: 0; }
.msg-row { display: flex; gap: 7px; align-items: flex-end; }
.attach-btn { background: var(--surface2); border: 1px solid var(--border); border-radius: var(--radius-sm); color: var(--accent2); cursor: pointer; width: 40px; height: 40px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 17px; transition: all .15s; }
.attach-btn:hover { border-color: var(--accent2); }
.attach-btn.has-files { border-color: var(--accent); color: var(--accent); }
#fileInput { display: none; }
#msgInput { flex: 1; background: var(--surface2); border: 1px solid var(--border); border-radius: var(--radius-sm); color: var(--text); font-family: 'DM Mono', monospace; font-size: 13px; padding: 9px 12px; outline: none; resize: none; min-height: 40px; max-height: 120px; line-height: 1.5; transition: border-color .2s; }
#msgInput:focus { border-color: var(--accent2); }
#msgInput::placeholder { color: var(--muted2); }
.send-btn { background: var(--accent); border: none; border-radius: var(--radius-sm); color: #0d0f14; cursor: pointer; font-family: 'DM Mono', monospace; font-size: 12px; font-weight: 500; padding: 9px 15px; white-space: nowrap; transition: all .15s; text-transform: uppercase; letter-spacing: .5px; height: 40px; }
.send-btn:hover { filter: brightness(1.1); transform: translateY(-1px); }
.send-btn:active { transform: translateY(0); }
.send-btn:disabled { opacity: .5; cursor: default; transform: none; }
.upload-progress { height: 2px; background: var(--border); border-radius: 2px; margin-top: 7px; overflow: hidden; }
.upload-bar { height: 100%; background: var(--accent2); border-radius: 2px; width: 0%; transition: width .3s; }
.input-footer { font-size: 9px; color: var(--muted2); text-align: center; margin-top: 5px; }

#lightbox { display: none; position: fixed; inset: 0; background: rgba(0,0,0,.93); z-index: 10000; align-items: center; justify-content: center; cursor: zoom-out; }
#lightbox.open { display: flex; }
#lightbox img { max-width: 92vw; max-height: 90vh; border-radius: 10px; }

@media(max-width:640px) {
  #sidebar { width: 100%; position: absolute; z-index: 200; transition: transform .25s; }
  #sidebar.slide-out { transform: translateX(-100%); }
  #mainArea { width: 100%; }
  .mobile-back { display: flex; }
  .msg { max-width: 86%; }
  .auth-card { padding: 28px 20px; }
}
