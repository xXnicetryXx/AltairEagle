// ═══════════════════════════════════════════════════════
//  GAMES ENGINE — AltairEagle Educational Mini-Games
// ═══════════════════════════════════════════════════════
const Games = (() => {

  // ── GAME CATALOG ─────────────────────────────────────
  const CATALOG = [
    { id:'math',      emoji:'🔢', name:'Math Blitz',      tag:'ARITHMETIC', desc:'Quick math questions against the clock' },
    { id:'geo',       emoji:'🌍', name:'World Quiz',      tag:'GEOGRAPHY',  desc:'Countries & capitals multiple choice' },
    { id:'memory',    emoji:'🧠', name:'Memory Match',    tag:'MEMORY',     desc:'Flip cards and find matching pairs' },
    { id:'scramble',  emoji:'🔤', name:'Word Scramble',   tag:'SPELLING',   desc:'Unscramble jumbled educational words' },
    { id:'typing',    emoji:'⌨️', name:'Speed Typing',    tag:'TYPING',     desc:'Type science facts as fast as you can' },
    { id:'trivia',    emoji:'🎓', name:'Science Trivia',  tag:'SCIENCE',    desc:'Multiple choice science questions' },
    { id:'hangman',   emoji:'🪢', name:'Hangman',         tag:'VOCABULARY', desc:'Guess the hidden word letter by letter' },
    { id:'timeline',  emoji:'📅', name:'History Timeline',tag:'HISTORY',    desc:'Put historical events in the right order' },
    { id:'equation',  emoji:'⚖️', name:'Equation Solver', tag:'ALGEBRA',    desc:'Balance the equation — find X' },
    { id:'flags',     emoji:'🚩', name:'Flag Finder',     tag:'GEOGRAPHY',  desc:'Identify countries by their flag emoji' },
    { id:'periodic',  emoji:'⚗️', name:'Periodic Table',  tag:'CHEMISTRY',  desc:'Match elements to their symbols' },
    { id:'trufalse',  emoji:'✅', name:'True or False',   tag:'GENERAL',    desc:'Is this fact true or false?' },
    { id:'snake',     emoji:'🐍', name:'Snake',           tag:'REFLEX',     desc:'Classic snake — eat and grow!' },
    { id:'numberline',emoji:'📏', name:'Number Line',     tag:'ESTIMATION', desc:'Place the number on the line accurately' },
  ];

  // ── RENDER AD PANEL ───────────────────────────────────
  function renderPanel() {
    const grid = document.getElementById('gamesGrid');
    if (!grid) return;
    grid.innerHTML = '';
    CATALOG.forEach(g => {
      const card = document.createElement('div');
      card.className = 'game-card';
      card.innerHTML = `<div class="game-card-emoji">${g.emoji}</div><div class="game-card-name">${g.name}</div><div class="game-card-tag">${g.tag}</div>`;
      card.title = g.desc;
      card.addEventListener('click', () => openGame(g.id));
      grid.appendChild(card);
    });
  }

  // ── OPEN GAME ─────────────────────────────────────────
  function openGame(id) {
    const g = CATALOG.find(x => x.id === id);
    if (!g) return;
    document.getElementById('welcomePane').classList.add('hidden');
    document.getElementById('chatPane').classList.add('hidden');
    document.getElementById('gamePane').classList.remove('hidden');
    document.getElementById('gamePaneTitle').textContent = g.emoji + ' ' + g.name;
    document.getElementById('gamePaneScore').textContent = '';
    const container = document.getElementById('gameContainer');
    container.innerHTML = '';
    switch(id) {
      case 'math':     playMath(container);    break;
      case 'geo':      playGeo(container);     break;
      case 'memory':   playMemory(container);  break;
      case 'scramble': playScramble(container);break;
      case 'typing':   playTyping(container);  break;
      case 'trivia':     playTrivia(container);     break;
      case 'hangman':    playHangman(container);    break;
      case 'timeline':   playTimeline(container);   break;
      case 'equation':   playEquation(container);   break;
      case 'flags':      playFlags(container);      break;
      case 'periodic':   playPeriodic(container);   break;
      case 'trufalse':   playTrueFalse(container);  break;
      case 'snake':      playSnake(container);      break;
      case 'numberline': playNumberLine(container); break;
    }
  }

  function closeGame() {
    document.getElementById('gamePane').classList.add('hidden');
    if (Chat.currentRoom) {
      document.getElementById('chatPane').classList.remove('hidden');
    } else {
      document.getElementById('welcomePane').classList.remove('hidden');
    }
  }

  function setScore(text) {
    document.getElementById('gamePaneScore').textContent = text;
  }

  // ── SHARED HELPERS ────────────────────────────────────
  function shuffle(arr) { return [...arr].sort(() => Math.random() - .5); }
  function pick(arr, n) { return shuffle(arr).slice(0, n); }

  function makeScreen(container) {
    const s = document.createElement('div');
    s.className = 'game-screen';
    container.appendChild(s);
    return s;
  }

  function showEnd(screen, { trophy, title, scoreLabel, scoreVal, onReplay }) {
    screen.innerHTML = `
      <div class="game-end">
        <div class="game-end-trophy">${trophy}</div>
        <h3>${title}</h3>
        <div class="game-end-score">${scoreVal}</div>
        <p>${scoreLabel}</p>
        <button class="game-next-btn" id="replayBtn">Play Again</button>
      </div>`;
    screen.querySelector('#replayBtn').addEventListener('click', onReplay);
  }

  // ═══════════════════════════════════════════════════════
  //  GAME 1: MATH BLITZ
  // ═══════════════════════════════════════════════════════
  function playMath(container) {
    const state = { score: 0, round: 0, total: 10, streak: 0 };
    const screen = makeScreen(container);

    function genQ() {
      const ops = ['+', '-', '×', '÷'];
      const op  = state.score > 30 ? ops[Math.floor(Math.random()*4)] : ops[Math.floor(Math.random()*2)];
      let a, b, ans;
      if (op === '+') { a=r(1,50); b=r(1,50); ans=a+b; }
      else if (op === '-') { a=r(10,99); b=r(1,a); ans=a-b; }
      else if (op === '×') { a=r(2,12); b=r(2,12); ans=a*b; }
      else { a=r(1,12); b=r(1,12); ans=a; a=a*b; } // ensure whole
      return { q:`${a} ${op} ${b}`, ans };
    }
    function r(a,b) { return Math.floor(Math.random()*(b-a+1))+a; }

    function nextRound() {
      if (state.round >= state.total) return endGame();
      state.round++;
      const {q, ans} = genQ();
      // Generate 3 wrong answers
      const wrongs = new Set();
      while(wrongs.size < 3) {
        const w = ans + r(-15,15);
        if (w !== ans && w > 0) wrongs.add(w);
      }
      const choices = shuffle([ans, ...[...wrongs].slice(0,3)]);
      setScore(`${state.score} pts · Q ${state.round}/${state.total}`);

      screen.innerHTML = `
        <div class="game-stats">
          <div class="stat-chip">Score <span class="stat-val">${state.score}</span></div>
          <div class="stat-chip">Round <span class="stat-val">${state.round}/${state.total}</span></div>
          <div class="stat-chip">Streak 🔥<span class="stat-val">${state.streak}</span></div>
        </div>
        <div class="game-prompt">
          <div class="game-prompt-label">Solve the equation</div>
          <div class="game-question">${q} = ?</div>
        </div>
        <div class="game-answers">
          ${choices.map(c=>`<button class="game-answer-btn" data-val="${c}">${c}</button>`).join('')}
        </div>
        <div class="game-feedback" id="mathFeedback" style="display:none"></div>
      `;

      screen.querySelectorAll('.game-answer-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const chosen = +btn.dataset.val;
          const correct = chosen === ans;
          screen.querySelectorAll('.game-answer-btn').forEach(b => {
            b.disabled = true;
            if (+b.dataset.val === ans) b.classList.add('correct');
          });
          if (!correct) { btn.classList.add('wrong'); state.streak=0; }
          else { state.score += 10 + state.streak*2; state.streak++; }
          const fb = document.getElementById('mathFeedback');
          fb.style.display='block';
          fb.className='game-feedback '+(correct?'correct':'wrong');
          fb.textContent = correct ? `✓ Correct! +${10+(state.streak-1)*2} pts` : `✗ Answer was ${ans}`;
          setTimeout(nextRound, 1200);
        });
      });
    }

    function endGame() {
      const trophy = state.score>=80?'🏆':state.score>=50?'🥇':'🎯';
      showEnd(screen, { trophy, title: 'Math Blitz Complete!', scoreVal: state.score+' pts', scoreLabel:`You answered ${state.total} questions. ${state.score>=80?'Incredible! 🔥':'Keep practicing!'}`, onReplay:()=>playMath(container) });
      setScore(state.score+' pts');
    }

    nextRound();
  }

  // ═══════════════════════════════════════════════════════
  //  GAME 2: WORLD GEOGRAPHY QUIZ
  // ═══════════════════════════════════════════════════════
  function playGeo(container) {
    const COUNTRIES = [
      {c:'France',cap:'Paris'},{c:'Japan',cap:'Tokyo'},{c:'Brazil',cap:'Brasília'},
      {c:'Egypt',cap:'Cairo'},{c:'Canada',cap:'Ottawa'},{c:'Australia',cap:'Canberra'},
      {c:'Germany',cap:'Berlin'},{c:'China',cap:'Beijing'},{c:'India',cap:'New Delhi'},
      {c:'Mexico',cap:'Mexico City'},{c:'Italy',cap:'Rome'},{c:'Spain',cap:'Madrid'},
      {c:'South Korea',cap:'Seoul'},{c:'Argentina',cap:'Buenos Aires'},{c:'Nigeria',cap:'Abuja'},
      {c:'Russia',cap:'Moscow'},{c:'UK',cap:'London'},{c:'USA',cap:'Washington D.C.'},
      {c:'South Africa',cap:'Pretoria'},{c:'Kenya',cap:'Nairobi'},{c:'Turkey',cap:'Ankara'},
      {c:'Saudi Arabia',cap:'Riyadh'},{c:'Pakistan',cap:'Islamabad'},{c:'Indonesia',cap:'Jakarta'},
      {c:'Thailand',cap:'Bangkok'},{c:'Vietnam',cap:'Hanoi'},{c:'Portugal',cap:'Lisbon'},
      {c:'Netherlands',cap:'Amsterdam'},{c:'Sweden',cap:'Stockholm'},{c:'Norway',cap:'Oslo'},
    ];
    const state = { score:0, round:0, total:10, qs: shuffle(COUNTRIES).slice(0,10) };
    const screen = makeScreen(container);

    function nextRound() {
      if (state.round >= state.total) return endGame();
      const q = state.qs[state.round++];
      const mode = Math.random() > .5 ? 'cap' : 'country';
      const prompt = mode==='cap' ? `What is the capital of ${q.c}?` : `${q.cap} is the capital of which country?`;
      const correct = mode==='cap' ? q.cap : q.c;
      const pool = COUNTRIES.filter(x=>x!==q);
      const wrongs = pick(pool,3).map(x => mode==='cap'?x.cap:x.c);
      const choices = shuffle([correct,...wrongs]);
      setScore(`${state.score} pts · Q ${state.round}/${state.total}`);

      screen.innerHTML=`
        <div class="game-stats">
          <div class="stat-chip">Score <span class="stat-val">${state.score}</span></div>
          <div class="stat-chip">Round <span class="stat-val">${state.round}/${state.total}</span></div>
        </div>
        <div class="game-prompt">
          <div class="game-prompt-label">🌍 Geography</div>
          <div class="game-question" style="font-size:20px">${prompt}</div>
        </div>
        <div class="game-answers">
          ${choices.map(c=>`<button class="game-answer-btn" data-val="${c}">${c}</button>`).join('')}
        </div>
        <div class="game-feedback" id="geoFb" style="display:none"></div>
      `;
      screen.querySelectorAll('.game-answer-btn').forEach(btn=>{
        btn.addEventListener('click',()=>{
          const ok=btn.dataset.val===correct;
          screen.querySelectorAll('.game-answer-btn').forEach(b=>{b.disabled=true;if(b.dataset.val===correct)b.classList.add('correct');});
          if(!ok)btn.classList.add('wrong'); else state.score+=10;
          const fb=document.getElementById('geoFb');fb.style.display='block';
          fb.className='game-feedback '+(ok?'correct':'wrong');
          fb.textContent=ok?'✓ Correct! +10 pts':`✗ Answer: ${correct}`;
          setTimeout(nextRound,1300);
        });
      });
    }
    function endGame(){showEnd(screen,{trophy:state.score>=80?'🏆':state.score>=50?'🥇':'🌍',title:'World Quiz Complete!',scoreVal:state.score+' pts',scoreLabel:`You got ${state.score/10}/${state.total} correct!`,onReplay:()=>playGeo(container)});setScore(state.score+' pts');}
    nextRound();
  }

  // ═══════════════════════════════════════════════════════
  //  GAME 3: MEMORY MATCH
  // ═══════════════════════════════════════════════════════
  function playMemory(container) {
    const PAIRS = ['🦅','🦁','🐬','🦋','🌟','🔥','⚡','🎯','🧪','🎨'];
    const state = { moves:0, matched:0, flipped:[], locked:false };
    const pairs = pick(PAIRS, 8);
    const cards = shuffle([...pairs,...pairs]).map((e,i)=>({e,i,flipped:false,matched:false}));
    const screen = makeScreen(container);

    function render() {
      setScore(`Moves: ${state.moves} · Matched: ${state.matched}/${pairs.length}`);
      screen.innerHTML=`
        <div class="game-stats">
          <div class="stat-chip">Moves <span class="stat-val">${state.moves}</span></div>
          <div class="stat-chip">Pairs <span class="stat-val">${state.matched}/${pairs.length}</span></div>
        </div>
        <div class="memory-grid" style="grid-template-columns:repeat(4,1fr);max-width:360px;margin:0 auto">
          ${cards.map((c,i)=>`<div class="memory-card${c.flipped?' flipped':''}${c.matched?' matched':''}" data-i="${i}">${c.flipped||c.matched?c.e:'?'}</div>`).join('')}
        </div>
      `;
      if(state.matched===pairs.length){
        setTimeout(()=>showEnd(screen,{trophy:state.moves<=18?'🏆':state.moves<=24?'🥇':'🧠',title:'Memory Complete!',scoreVal:state.moves+' moves',scoreLabel:`You matched all ${pairs.length} pairs in ${state.moves} moves!`,onReplay:()=>playMemory(container)}),600);
        return;
      }
      screen.querySelectorAll('.memory-card:not(.matched)').forEach(el=>{
        el.addEventListener('click',()=>flipCard(+el.dataset.i));
      });
    }

    function flipCard(i) {
      if(state.locked||cards[i].flipped||cards[i].matched) return;
      cards[i].flipped=true; state.flipped.push(i);
      if(state.flipped.length===2){
        state.moves++;state.locked=true;
        const [a,b]=state.flipped;
        if(cards[a].e===cards[b].e){cards[a].matched=cards[b].matched=true;state.matched++;state.flipped=[];state.locked=false;}
        else{setTimeout(()=>{cards[a].flipped=cards[b].flipped=false;state.flipped=[];state.locked=false;render();},900);}
      }
      render();
    }
    render();
  }

  // ═══════════════════════════════════════════════════════
  //  GAME 4: WORD SCRAMBLE
  // ═══════════════════════════════════════════════════════
  function playScramble(container) {
    const WORDS = [
      {w:'PHOTOSYNTHESIS',h:'Plants make food with sunlight'},
      {w:'DEMOCRACY',h:'A system of government by the people'},
      {w:'VELOCITY',h:'Speed in a given direction'},
      {w:'HYPOTHESIS',h:'A testable scientific prediction'},
      {w:'METAMORPHOSIS',h:'A transformation process in nature'},
      {w:'ALGORITHM',h:'A step-by-step problem-solving method'},
      {w:'ATMOSPHERE',h:'Layer of gases around a planet'},
      {w:'CHROMOSOME',h:'Structure carrying genetic information'},
      {w:'ECOSYSTEM',h:'Community of living things and environment'},
      {w:'GEOGRAPHY',h:'Study of Earth\'s lands and features'},
      {w:'PARLIAMENT',h:'Legislative body of government'},
      {w:'RENAISSANCE',h:'Cultural rebirth in 14th-17th century Europe'},
      {w:'MOLECULE',h:'Two or more atoms bonded together'},
      {w:'LATITUDE',h:'Distance north or south of the equator'},
      {w:'POLYNOMIAL',h:'Algebraic expression with multiple terms'},
    ];
    const state = { score:0, round:0, total:8, qs:shuffle(WORDS).slice(0,8) };
    const screen = makeScreen(container);

    function scramble(word) {
      let s; do { s=shuffle([...word]).join(''); } while(s===word);
      return s;
    }

    function nextRound() {
      if(state.round>=state.total) return endGame();
      const {w,h}=state.qs[state.round++];
      const sc=scramble(w);
      setScore(`${state.score} pts · Q ${state.round}/${state.total}`);

      screen.innerHTML=`
        <div class="game-stats">
          <div class="stat-chip">Score <span class="stat-val">${state.score}</span></div>
          <div class="stat-chip">Round <span class="stat-val">${state.round}/${state.total}</span></div>
        </div>
        <div class="game-prompt">
          <div class="game-prompt-label">Unscramble the word</div>
          <div class="game-question" style="letter-spacing:6px;font-size:24px">${sc}</div>
          <div class="game-sub">💡 Hint: ${h}</div>
        </div>
        <div class="game-input-row">
          <input class="game-text-input" id="scrambleInput" type="text" placeholder="Your answer…" maxlength="${w.length}" autocomplete="off" autocorrect="off" spellcheck="false"/>
          <button class="game-submit-btn" id="scrambleSubmit">Check</button>
        </div>
        <div class="game-feedback" id="scrambleFb" style="display:none"></div>
        <button class="game-next-btn" id="scrambleSkip" style="background:var(--surface2);color:var(--muted);border:1px solid var(--border)">Skip →</button>
      `;

      const inp=document.getElementById('scrambleInput');
      inp.focus();
      function check(){
        const ans=inp.value.trim().toUpperCase();
        if(!ans)return;
        const ok=ans===w;
        if(ok)state.score+=15; 
        const fb=document.getElementById('scrambleFb');fb.style.display='block';
        fb.className='game-feedback '+(ok?'correct':'wrong');
        fb.textContent=ok?`✓ Correct! "${w}" — +15 pts`:`✗ The word was "${w}"`;
        inp.disabled=true;document.getElementById('scrambleSubmit').disabled=true;
        setTimeout(nextRound,1400);
      }
      document.getElementById('scrambleSubmit').addEventListener('click',check);
      inp.addEventListener('keydown',e=>{if(e.key==='Enter')check();});
      document.getElementById('scrambleSkip').addEventListener('click',()=>{
        const fb=document.getElementById('scrambleFb');fb.style.display='block';
        fb.className='game-feedback wrong';fb.textContent=`Skipped — the word was "${w}"`;
        setTimeout(nextRound,1200);
      });
    }
    function endGame(){showEnd(screen,{trophy:state.score>=90?'🏆':state.score>=60?'🥇':'🔤',title:'Scramble Complete!',scoreVal:state.score+' pts',scoreLabel:`Great vocabulary work! ${state.score>=90?'You\'re a spelling master! 🎉':'Keep it up!'}`,onReplay:()=>playScramble(container)});setScore(state.score+' pts');}
    nextRound();
  }

  // ═══════════════════════════════════════════════════════
  //  GAME 5: SPEED TYPING
  // ═══════════════════════════════════════════════════════
  function playTyping(container) {
    const SENTENCES = [
      'The mitochondria is the powerhouse of the cell.',
      'Water freezes at zero degrees Celsius.',
      'The speed of light is approximately 300000 kilometers per second.',
      'Photosynthesis converts sunlight into chemical energy.',
      'The Earth orbits the Sun once every 365 days.',
      'Gravity is a fundamental force of the universe.',
      'DNA carries the genetic instructions for life.',
      'The French Revolution began in 1789.',
      'A quadratic equation has at most two solutions.',
      'The capital of Australia is Canberra not Sydney.',
    ];
    const state = { wpm:0, chars:0, errors:0, done:false };
    const text = pick(SENTENCES,1)[0];
    const screen = makeScreen(container);
    let typed='', startTime=null, timerInterval=null;

    function render() {
      screen.innerHTML=`
        <div class="game-stats">
          <div class="stat-chip">WPM <span class="stat-val" id="wpmStat">0</span></div>
          <div class="stat-chip">Errors <span class="stat-val" id="errStat">0</span></div>
          <div class="stat-chip">Time <span class="stat-val" id="timeStat">0s</span></div>
        </div>
        <div class="game-prompt">
          <div class="game-prompt-label">Type the sentence below as fast as you can</div>
          <div class="typing-target" id="typingTarget"></div>
        </div>
        <input class="typing-input" id="typingInput" placeholder="Start typing…" autocomplete="off" autocorrect="off" spellcheck="false"/>
      `;
      renderTarget('');
      const inp=document.getElementById('typingInput');
      inp.focus();
      inp.addEventListener('input',()=>onType(inp.value));
    }

    function renderTarget(val) {
      const tgt=document.getElementById('typingTarget');if(!tgt)return;
      tgt.innerHTML=text.split('').map((ch,i)=>{
        if(i<val.length) return`<span class="${val[i]===ch?'char-done':'char-wrong'}">${ch}</span>`;
        if(i===val.length) return`<span class="char-current">${ch}</span>`;
        return`<span class="char-pending">${ch}</span>`;
      }).join('');
    }

    let elapsed=0;
    function onType(val) {
      if(state.done)return;
      if(!startTime){startTime=Date.now();timerInterval=setInterval(()=>{elapsed=Math.floor((Date.now()-startTime)/1000);const ts=document.getElementById('timeStat');if(ts)ts.textContent=elapsed+'s';const ws=document.getElementById('wpmStat');if(ws)ws.textContent=Math.round((val.split(' ').length/(elapsed||1))*60);},200);}
      typed=val;
      let errors=0;for(let i=0;i<val.length;i++){if(val[i]!==text[i])errors++;}
      state.errors=errors;
      const es=document.getElementById('errStat');if(es)es.textContent=errors;
      renderTarget(val);
      if(val===text){
        state.done=true;clearInterval(timerInterval);
        const t=Math.max(1,(Date.now()-startTime)/1000);
        const wpm=Math.round((text.split(' ').length/t)*60);
        setScore(wpm+' WPM');
        setTimeout(()=>showEnd(screen,{trophy:wpm>=60?'🏆':wpm>=40?'🥇':'⌨️',title:'Typing Complete!',scoreVal:wpm+' WPM',scoreLabel:`You typed with ${errors} errors in ${Math.round(t)}s. ${wpm>=60?'Blazing fast! 🔥':wpm>=40?'Great job!':'Keep practicing!'}`,onReplay:()=>playTyping(container)}),400);
      }
    }
    render();
  }

  // ═══════════════════════════════════════════════════════
  //  GAME 6: SCIENCE TRIVIA
  // ═══════════════════════════════════════════════════════
  function playTrivia(container) {
    const QS = [
      {q:'What is the chemical symbol for water?',a:'H₂O',w:['HO₂','H₂O₂','OH']},
      {q:'How many bones are in the adult human body?',a:'206',w:['196','218','230']},
      {q:'What planet is known as the Red Planet?',a:'Mars',w:['Venus','Jupiter','Saturn']},
      {q:'What is the speed of light in km/s?',a:'~300,000 km/s',w:['~150,000 km/s','~500,000 km/s','~30,000 km/s']},
      {q:'What gas do plants absorb during photosynthesis?',a:'Carbon Dioxide',w:['Oxygen','Nitrogen','Hydrogen']},
      {q:'What is the powerhouse of the cell?',a:'Mitochondria',w:['Nucleus','Ribosome','Chloroplast']},
      {q:'How many elements are on the periodic table?',a:'118',w:['92','108','128']},
      {q:'What force keeps planets in orbit?',a:'Gravity',w:['Magnetism','Nuclear force','Friction']},
      {q:'What is the largest organ of the human body?',a:'Skin',w:['Liver','Brain','Lungs']},
      {q:'What particle has a negative charge?',a:'Electron',w:['Proton','Neutron','Positron']},
      {q:'What is 2 to the power of 10?',a:'1024',w:['512','2048','512']},
      {q:'In what year did World War II end?',a:'1945',w:['1944','1946','1943']},
      {q:'What is the capital of Japan?',a:'Tokyo',w:['Osaka','Kyoto','Hiroshima']},
      {q:'What is the hardest natural mineral?',a:'Diamond',w:['Ruby','Quartz','Titanium']},
      {q:'How many continents are there?',a:'7',w:['5','6','8']},
    ];
    const state={score:0,round:0,total:10,qs:shuffle(QS).slice(0,10)};
    const screen=makeScreen(container);

    function nextRound(){
      if(state.round>=state.total)return endGame();
      const {q,a,w}=state.qs[state.round++];
      const choices=shuffle([a,...w]);
      setScore(`${state.score} pts · Q ${state.round}/${state.total}`);
      screen.innerHTML=`
        <div class="game-stats">
          <div class="stat-chip">Score <span class="stat-val">${state.score}</span></div>
          <div class="stat-chip">Round <span class="stat-val">${state.round}/${state.total}</span></div>
        </div>
        <div class="game-prompt">
          <div class="game-prompt-label">🎓 Science Trivia</div>
          <div class="game-question" style="font-size:18px;line-height:1.4">${q}</div>
        </div>
        <div class="game-answers">
          ${choices.map(c=>`<button class="game-answer-btn" data-val="${c}">${c}</button>`).join('')}
        </div>
        <div class="game-feedback" id="triviaFb" style="display:none"></div>
      `;
      screen.querySelectorAll('.game-answer-btn').forEach(btn=>{
        btn.addEventListener('click',()=>{
          const ok=btn.dataset.val===a;
          screen.querySelectorAll('.game-answer-btn').forEach(b=>{b.disabled=true;if(b.dataset.val===a)b.classList.add('correct');});
          if(!ok){btn.classList.add('wrong');}else{state.score+=10;}
          const fb=document.getElementById('triviaFb');fb.style.display='block';
          fb.className='game-feedback '+(ok?'correct':'wrong');
          fb.textContent=ok?'✓ Correct! +10 pts':`✗ Answer: ${a}`;
          setTimeout(nextRound,1300);
        });
      });
    }
    function endGame(){showEnd(screen,{trophy:state.score>=80?'🏆':state.score>=50?'🥇':'🎓',title:'Science Trivia Complete!',scoreVal:state.score+' pts',scoreLabel:`${state.score>=80?'Science genius! 🔬':'Keep studying and try again!'}`,onReplay:()=>playTrivia(container)});setScore(state.score+' pts');}
    nextRound();
  }

  // ═══════════════════════════════════════════════════════
  //  GAME 7: HANGMAN
  // ═══════════════════════════════════════════════════════
  function playHangman(container) {
    const WORDS = [
      {w:'VOLCANO',    h:'A mountain that can erupt'},
      {w:'DEMOCRACY',  h:'Government by the people'},
      {w:'GRAVITY',    h:'Force that pulls objects together'},
      {w:'PHOTON',     h:'A particle of light'},
      {w:'ECLIPSE',    h:'When one body blocks light from another'},
      {w:'NUCLEUS',    h:'Center of an atom or cell'},
      {w:'LATITUDE',   h:'Distance north or south of the equator'},
      {w:'BACTERIA',   h:'Single-celled microorganisms'},
      {w:'CONTINENT',  h:'One of seven large landmasses'},
      {w:'FRACTION',   h:'A part of a whole number'},
      {w:'SYMMETRY',   h:'Mirror-image balance in shape'},
      {w:'MIGRATION',  h:'Seasonal movement of animals'},
      {w:'EXPONENT',   h:'A number indicating repeated multiplication'},
      {w:'AMPHIBIAN',  h:'Cold-blooded vertebrate living in water & land'},
      {w:'REFRACTION', h:'Bending of light through a medium'},
    ];
    const {w, h} = WORDS[Math.floor(Math.random()*WORDS.length)];
    const state = { word:w, hint:h, guessed:new Set(), wrong:0, maxWrong:6 };
    const screen = makeScreen(container);

    const HANGMAN_ART = [
      '😐', // 0 wrong — face only
      '😟', // 1
      '😨', // 2
      '😰', // 3
      '😱', // 4
      '😵', // 5
      '💀', // 6 — dead
    ];
    const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

    function render() {
      const display = w.split('').map(c => state.guessed.has(c) ? c : '_').join(' ');
      const won  = w.split('').every(c => state.guessed.has(c));
      const lost = state.wrong >= state.maxWrong;
      setScore(`Wrong: ${state.wrong}/${state.maxWrong}`);

      screen.innerHTML = `
        <div class="game-stats">
          <div class="stat-chip">Wrong <span class="stat-val">${state.wrong}/${state.maxWrong}</span></div>
          <div class="stat-chip">Letters <span class="stat-val">${state.guessed.size}</span></div>
        </div>
        <div class="game-prompt">
          <div style="font-size:52px;text-align:center;padding:8px 0">${HANGMAN_ART[state.wrong]}</div>
          <div class="game-question" style="letter-spacing:10px;font-size:22px">${display}</div>
          <div class="game-sub">💡 ${h}</div>
        </div>
        ${won ? `<div class="game-feedback correct">🎉 You got it! The word was <strong>${w}</strong></div><button class="game-next-btn" id="hReplay">Play Again</button>` :
          lost ? `<div class="game-feedback wrong">💀 Game over! The word was <strong>${w}</strong></div><button class="game-next-btn" id="hReplay">Play Again</button>` :
          `<div class="hangman-keys" id="hangmanKeys" style="display:flex;flex-wrap:wrap;gap:5px;justify-content:center">
            ${ALPHABET.map(l => `<button class="hangman-key${state.guessed.has(l)?' used':''}" data-l="${l}" ${state.guessed.has(l)?'disabled':''}>${l}</button>`).join('')}
          </div>`
        }
      `;

      screen.querySelectorAll('.hangman-key').forEach(btn => {
        btn.addEventListener('click', () => {
          const l = btn.dataset.l;
          state.guessed.add(l);
          if (!w.includes(l)) state.wrong++;
          render();
        });
      });
      screen.querySelector('#hReplay')?.addEventListener('click', () => playHangman(container));
    }
    render();
  }

  // ═══════════════════════════════════════════════════════
  //  GAME 8: HISTORY TIMELINE
  // ═══════════════════════════════════════════════════════
  function playTimeline(container) {
    const EVENTS = [
      {e:'First Moon Landing',             y:1969},
      {e:'World War II ends',              y:1945},
      {e:'American Declaration of Independence', y:1776},
      {e:'Fall of the Berlin Wall',        y:1989},
      {e:'French Revolution begins',       y:1789},
      {e:'Columbus reaches the Americas',  y:1492},
      {e:'World Wide Web invented',        y:1991},
      {e:'First iPhone released',          y:2007},
      {e:'Great Wall of China completed (major)',y:1644},
      {e:'World War I begins',             y:1914},
      {e:'Einstein publishes Special Relativity',y:1905},
      {e:'Russian Revolution',             y:1917},
      {e:'Printing press invented by Gutenberg',y:1440},
      {e:'Charles Darwin publishes Origin of Species',y:1859},
      {e:'Titanic sinks',                  y:1912},
      {e:'First aeroplane flight by Wright Brothers',y:1903},
      {e:'End of apartheid in South Africa',y:1994},
      {e:'Atomic bomb dropped on Hiroshima',y:1945},
    ];
    const state = { score:0, round:0, total:8, qs: [] };
    state.qs = shuffle(EVENTS).slice(0, 12);
    const screen = makeScreen(container);

    function nextRound() {
      if (state.round >= state.total) return endGame();
      // Pick 4 events and ask player to order them oldest → newest
      const batch = state.qs.slice(state.round * 0, state.round + 4);
      state.round += 4;
      if (state.round > state.total + 4) return endGame();

      // Pick 4 unique events for this round
      const events = shuffle(EVENTS).slice(0, 4);
      const correct = [...events].sort((a,b)=>a.y-b.y);
      let order = [...events]; // current player order
      let selected = null;

      setScore(`${state.score} pts`);

      function renderBoard() {
        screen.innerHTML = `
          <div class="game-stats">
            <div class="stat-chip">Score <span class="stat-val">${state.score}</span></div>
            <div class="stat-chip">Round <span class="stat-val">${state.round/4}/${state.total/4}</span></div>
          </div>
          <div class="game-prompt">
            <div class="game-prompt-label">📅 Drag to sort oldest → newest</div>
            <div class="game-sub" style="margin-top:4px">Tap an event, then tap where to move it</div>
          </div>
          <div id="timelineList" style="display:flex;flex-direction:column;gap:8px">
            ${order.map((ev,i)=>`
              <div class="timeline-item${selected===i?' tl-selected':''}" data-i="${i}" style="
                background:${selected===i?'var(--accent-dim)':'var(--surface2)'};
                border:2px solid ${selected===i?'var(--accent)':'var(--border2)'};
                border-radius:var(--radius-sm);padding:12px 14px;cursor:pointer;
                display:flex;align-items:center;gap:10px;transition:all .15s">
                <span style="font-size:18px;color:var(--muted)">${i+1}.</span>
                <span style="flex:1;font-size:12px;color:var(--text)">${ev.e}</span>
                ${selected===i?'<span style="color:var(--accent);font-size:11px">← move here</span>':''}
              </div>`).join('')}
          </div>
          <button class="game-next-btn" id="tlCheck" style="margin-top:8px">Check Order ✓</button>
        `;
        screen.querySelectorAll('.timeline-item').forEach(item => {
          item.addEventListener('click', () => {
            const i = +item.dataset.i;
            if (selected === null) { selected = i; }
            else if (selected === i) { selected = null; }
            else {
              // Swap
              [order[selected], order[i]] = [order[i], order[selected]];
              selected = null;
            }
            renderBoard();
          });
        });
        screen.querySelector('#tlCheck').addEventListener('click', () => {
          const isCorrect = order.every((ev,i) => ev === correct[i]);
          if (isCorrect) state.score += 25;
          screen.innerHTML = `
            <div class="game-feedback ${isCorrect?'correct':'wrong'}" style="margin-bottom:12px">
              ${isCorrect ? '✓ Perfect order! +25 pts' : '✗ Not quite — correct order was:'}
            </div>
            <div style="display:flex;flex-direction:column;gap:6px">
              ${correct.map((ev,i)=>`<div style="background:var(--surface2);border:1px solid var(--border);border-radius:var(--radius-sm);padding:10px 14px;display:flex;gap:10px;align-items:center">
                <span style="color:var(--muted);font-size:11px">${i+1}.</span>
                <span style="flex:1;font-size:12px">${ev.e}</span>
                <span style="color:var(--accent2);font-size:11px">${ev.y}</span>
              </div>`).join('')}
            </div>
            <button class="game-next-btn" id="tlNext" style="margin-top:12px">Next Round →</button>
          `;
          screen.querySelector('#tlNext').addEventListener('click', nextRound);
        });
      }
      renderBoard();
    }

    function endGame() {
      showEnd(screen, { trophy:state.score>=75?'🏆':state.score>=50?'🥇':'📅', title:'Timeline Complete!', scoreVal:state.score+' pts', scoreLabel:`History master! ${state.score>=75?'Incredible recall! 🎉':'Keep learning!'}`, onReplay:()=>playTimeline(container) });
      setScore(state.score+' pts');
    }
    nextRound();
  }

  // ═══════════════════════════════════════════════════════
  //  GAME 9: EQUATION SOLVER (find X)
  // ═══════════════════════════════════════════════════════
  function playEquation(container) {
    const state = { score:0, round:0, total:10, streak:0 };
    const screen = makeScreen(container);
    function r(a,b){return Math.floor(Math.random()*(b-a+1))+a;}

    function genEq() {
      const type = r(0,3);
      let eq, ans;
      if (type===0) { // ax + b = c
        const a=r(2,9), x=r(1,15), b=r(1,20);
        const c=a*x+b; eq=`${a}x + ${b} = ${c}`; ans=x;
      } else if (type===1) { // ax - b = c
        const a=r(2,9), x=r(2,15), b=r(1,20);
        const c=a*x-b; eq=`${a}x − ${b} = ${c}`; ans=x;
      } else if (type===2) { // x/a + b = c
        const a=r(2,6), x=r(1,10)*a, b=r(1,15);
        const c=x/a+b; eq=`x ÷ ${a} + ${b} = ${c}`; ans=x;
      } else { // ax + bx = c
        const a=r(2,6), b=r(1,5), x=r(1,10);
        const c=(a+b)*x; eq=`${a}x + ${b}x = ${c}`; ans=x;
      }
      return {eq, ans};
    }

    function nextRound() {
      if (state.round>=state.total) return endGame();
      state.round++;
      const {eq, ans} = genEq();
      const wrongs=new Set();
      while(wrongs.size<3){const w=ans+r(-8,8);if(w!==ans&&w>0)wrongs.add(w);}
      const choices=shuffle([ans,...[...wrongs]]);
      setScore(`${state.score} pts · Q ${state.round}/${state.total}`);

      screen.innerHTML=`
        <div class="game-stats">
          <div class="stat-chip">Score <span class="stat-val">${state.score}</span></div>
          <div class="stat-chip">Q <span class="stat-val">${state.round}/${state.total}</span></div>
          <div class="stat-chip">Streak 🔥<span class="stat-val">${state.streak}</span></div>
        </div>
        <div class="game-prompt">
          <div class="game-prompt-label">⚖️ Solve for x</div>
          <div class="game-question" style="font-size:22px;letter-spacing:1px">${eq}</div>
          <div class="game-sub">x = ?</div>
        </div>
        <div class="game-answers">
          ${choices.map(c=>`<button class="game-answer-btn" data-val="${c}">x = ${c}</button>`).join('')}
        </div>
        <div class="game-feedback" id="eqFb" style="display:none"></div>
      `;
      screen.querySelectorAll('.game-answer-btn').forEach(btn=>{
        btn.addEventListener('click',()=>{
          const ok=+btn.dataset.val===ans;
          screen.querySelectorAll('.game-answer-btn').forEach(b=>{b.disabled=true;if(+b.dataset.val===ans)b.classList.add('correct');});
          if(!ok){btn.classList.add('wrong');state.streak=0;}else{state.score+=10+state.streak*3;state.streak++;}
          const fb=document.getElementById('eqFb');fb.style.display='block';
          fb.className='game-feedback '+(ok?'correct':'wrong');
          fb.textContent=ok?`✓ Correct! x = ${ans} · +${10+(state.streak-1)*3} pts`:`✗ x = ${ans}`;
          setTimeout(nextRound,1300);
        });
      });
    }
    function endGame(){showEnd(screen,{trophy:state.score>=80?'🏆':state.score>=50?'🥇':'⚖️',title:'Equation Solver Complete!',scoreVal:state.score+' pts',scoreLabel:`Algebra skills: ${state.score>=80?'Elite! 🧮':'Keep practicing!'}`,onReplay:()=>playEquation(container)});setScore(state.score+' pts');}
    nextRound();
  }

  // ═══════════════════════════════════════════════════════
  //  GAME 10: FLAG FINDER
  // ═══════════════════════════════════════════════════════
  function playFlags(container) {
    const FLAGS = [
      {f:'🇯🇵',c:'Japan'},{f:'🇧🇷',c:'Brazil'},{f:'🇩🇪',c:'Germany'},{f:'🇫🇷',c:'France'},
      {f:'🇮🇹',c:'Italy'},{f:'🇨🇳',c:'China'},{f:'🇮🇳',c:'India'},{f:'🇷🇺',c:'Russia'},
      {f:'🇬🇧',c:'United Kingdom'},{f:'🇺🇸',c:'United States'},{f:'🇨🇦',c:'Canada'},
      {f:'🇦🇺',c:'Australia'},{f:'🇲🇽',c:'Mexico'},{f:'🇪🇸',c:'Spain'},{f:'🇰🇷',c:'South Korea'},
      {f:'🇸🇦',c:'Saudi Arabia'},{f:'🇿🇦',c:'South Africa'},{f:'🇦🇷',c:'Argentina'},
      {f:'🇳🇬',c:'Nigeria'},{f:'🇹🇷',c:'Turkey'},{f:'🇵🇹',c:'Portugal'},{f:'🇸🇪',c:'Sweden'},
      {f:'🇳🇱',c:'Netherlands'},{f:'🇵🇱',c:'Poland'},{f:'🇨🇭',c:'Switzerland'},
      {f:'🇧🇪',c:'Belgium'},{f:'🇦🇹',c:'Austria'},{f:'🇬🇷',c:'Greece'},
      {f:'🇮🇩',c:'Indonesia'},{f:'🇹🇭',c:'Thailand'},{f:'🇻🇳',c:'Vietnam'},
      {f:'🇵🇰',c:'Pakistan'},{f:'🇪🇬',c:'Egypt'},{f:'🇰🇪',c:'Kenya'},
    ];
    const state={score:0,round:0,total:12,qs:shuffle(FLAGS).slice(0,12)};
    const screen=makeScreen(container);

    function nextRound(){
      if(state.round>=state.total)return endGame();
      const q=state.qs[state.round++];
      const wrongs=pick(FLAGS.filter(f=>f!==q),3);
      const choices=shuffle([q,...wrongs]);
      setScore(`${state.score} pts · Q ${state.round}/${state.total}`);
      screen.innerHTML=`
        <div class="game-stats">
          <div class="stat-chip">Score <span class="stat-val">${state.score}</span></div>
          <div class="stat-chip">Q <span class="stat-val">${state.round}/${state.total}</span></div>
        </div>
        <div class="game-prompt">
          <div class="game-prompt-label">🚩 Which country is this?</div>
          <div style="font-size:80px;text-align:center;padding:10px 0;line-height:1">${q.f}</div>
        </div>
        <div class="game-answers">
          ${choices.map(c=>`<button class="game-answer-btn" data-val="${c.c}">${c.c}</button>`).join('')}
        </div>
        <div class="game-feedback" id="flagFb" style="display:none"></div>
      `;
      screen.querySelectorAll('.game-answer-btn').forEach(btn=>{
        btn.addEventListener('click',()=>{
          const ok=btn.dataset.val===q.c;
          screen.querySelectorAll('.game-answer-btn').forEach(b=>{b.disabled=true;if(b.dataset.val===q.c)b.classList.add('correct');});
          if(!ok)btn.classList.add('wrong'); else state.score+=10;
          const fb=document.getElementById('flagFb');fb.style.display='block';
          fb.className='game-feedback '+(ok?'correct':'wrong');
          fb.textContent=ok?`✓ Correct! +10 pts`:`✗ That's ${q.c}`;
          setTimeout(nextRound,1200);
        });
      });
    }
    function endGame(){showEnd(screen,{trophy:state.score>=100?'🏆':state.score>=70?'🥇':'🚩',title:'Flag Finder Complete!',scoreVal:state.score+' pts',scoreLabel:`You got ${state.score/10}/${state.total} flags right!`,onReplay:()=>playFlags(container)});setScore(state.score+' pts');}
    nextRound();
  }

  // ═══════════════════════════════════════════════════════
  //  GAME 11: PERIODIC TABLE
  // ═══════════════════════════════════════════════════════
  function playPeriodic(container) {
    const ELEMENTS = [
      {n:'Hydrogen',s:'H',num:1},{n:'Helium',s:'He',num:2},{n:'Lithium',s:'Li',num:3},
      {n:'Carbon',s:'C',num:6},{n:'Nitrogen',s:'N',num:7},{n:'Oxygen',s:'O',num:8},
      {n:'Sodium',s:'Na',num:11},{n:'Magnesium',s:'Mg',num:12},{n:'Aluminium',s:'Al',num:13},
      {n:'Silicon',s:'Si',num:14},{n:'Phosphorus',s:'P',num:15},{n:'Sulfur',s:'S',num:16},
      {n:'Chlorine',s:'Cl',num:17},{n:'Potassium',s:'K',num:19},{n:'Calcium',s:'Ca',num:20},
      {n:'Iron',s:'Fe',num:26},{n:'Copper',s:'Cu',num:29},{n:'Zinc',s:'Zn',num:30},
      {n:'Silver',s:'Ag',num:47},{n:'Gold',s:'Au',num:79},{n:'Mercury',s:'Hg',num:80},
      {n:'Lead',s:'Pb',num:82},{n:'Uranium',s:'U',num:92},{n:'Neon',s:'Ne',num:10},
      {n:'Fluorine',s:'F',num:9},{n:'Argon',s:'Ar',num:18},{n:'Titanium',s:'Ti',num:22},
      {n:'Chromium',s:'Cr',num:24},{n:'Nickel',s:'Ni',num:28},{n:'Bromine',s:'Br',num:35},
    ];
    const state={score:0,round:0,total:10,qs:shuffle(ELEMENTS).slice(0,10)};
    const screen=makeScreen(container);
    function nextRound(){
      if(state.round>=state.total)return endGame();
      const q=state.qs[state.round++];
      const mode=Math.random()>.5?'symbol':'name';
      const prompt=mode==='symbol'?`What is the symbol for <strong>${q.n}</strong>?`:`What element has the symbol <strong>${q.s}</strong>?`;
      const correct=mode==='symbol'?q.s:q.n;
      const wrongs=pick(ELEMENTS.filter(e=>e!==q),3).map(e=>mode==='symbol'?e.s:e.n);
      const choices=shuffle([correct,...wrongs]);
      setScore(`${state.score} pts · Q ${state.round}/${state.total}`);
      screen.innerHTML=`
        <div class="game-stats">
          <div class="stat-chip">Score <span class="stat-val">${state.score}</span></div>
          <div class="stat-chip">Q <span class="stat-val">${state.round}/${state.total}</span></div>
        </div>
        <div class="game-prompt">
          <div class="game-prompt-label">⚗️ Periodic Table</div>
          <div class="game-question" style="font-size:18px">${prompt}</div>
          <div class="game-sub">Atomic number: ${q.num}</div>
        </div>
        <div class="game-answers">
          ${choices.map(c=>`<button class="game-answer-btn" data-val="${c}">${c}</button>`).join('')}
        </div>
        <div class="game-feedback" id="perFb" style="display:none"></div>
      `;
      screen.querySelectorAll('.game-answer-btn').forEach(btn=>{
        btn.addEventListener('click',()=>{
          const ok=btn.dataset.val===correct;
          screen.querySelectorAll('.game-answer-btn').forEach(b=>{b.disabled=true;if(b.dataset.val===correct)b.classList.add('correct');});
          if(!ok)btn.classList.add('wrong'); else state.score+=10;
          const fb=document.getElementById('perFb');fb.style.display='block';
          fb.className='game-feedback '+(ok?'correct':'wrong');
          fb.textContent=ok?`✓ Correct! +10 pts`:`✗ Answer: ${correct}`;
          setTimeout(nextRound,1200);
        });
      });
    }
    function endGame(){showEnd(screen,{trophy:state.score>=80?'🏆':state.score>=50?'🥇':'⚗️',title:'Periodic Table Complete!',scoreVal:state.score+' pts',scoreLabel:`Chemistry score: ${state.score>=80?'Brilliant scientist! 🧪':'Keep studying the table!'}`,onReplay:()=>playPeriodic(container)});setScore(state.score+' pts');}
    nextRound();
  }

  // ═══════════════════════════════════════════════════════
  //  GAME 12: TRUE OR FALSE
  // ═══════════════════════════════════════════════════════
  function playTrueFalse(container) {
    const FACTS = [
      {f:'The Great Wall of China is visible from space with the naked eye.',a:false},
      {f:'Lightning never strikes the same place twice.',a:false},
      {f:'Humans share about 60% of their DNA with bananas.',a:true},
      {f:'Sound travels faster than light.',a:false},
      {f:'The heart beats about 100,000 times a day.',a:true},
      {f:'Sharks are mammals.',a:false},
      {f:'Water boils at 100°C at sea level.',a:true},
      {f:'The Amazon rainforest produces 20% of the world\'s oxygen.',a:true},
      {f:'Mount Everest is the tallest mountain measured from Earth\'s center.',a:false},
      {f:'Electrons orbit the nucleus like planets orbit the sun.',a:false},
      {f:'The Earth is closer to the Sun in January than in July.',a:true},
      {f:'All planets in our solar system rotate in the same direction.',a:false},
      {f:'Hot water freezes faster than cold water in some conditions.',a:true},
      {f:'Diamonds are made of carbon.',a:true},
      {f:'Napoleon Bonaparte was very short for his time.',a:false},
      {f:'The tongue is the strongest muscle in the human body.',a:false},
      {f:'Bats are blind.',a:false},
      {f:'Cleopatra lived closer in time to the Moon landing than to the building of the Great Pyramid.',a:true},
      {f:'The Pacific Ocean is larger than all land on Earth combined.',a:true},
      {f:'Trees are the oldest living organisms on Earth.',a:false},
    ];
    const state={score:0,round:0,total:12,streak:0,qs:shuffle(FACTS).slice(0,12)};
    const screen=makeScreen(container);
    function nextRound(){
      if(state.round>=state.total)return endGame();
      const {f,a}=state.qs[state.round++];
      setScore(`${state.score} pts · Q ${state.round}/${state.total}`);
      screen.innerHTML=`
        <div class="game-stats">
          <div class="stat-chip">Score <span class="stat-val">${state.score}</span></div>
          <div class="stat-chip">Q <span class="stat-val">${state.round}/${state.total}</span></div>
          <div class="stat-chip">Streak 🔥<span class="stat-val">${state.streak}</span></div>
        </div>
        <div class="game-prompt">
          <div class="game-prompt-label">✅ True or False?</div>
          <div class="game-question" style="font-size:16px;line-height:1.5">${f}</div>
        </div>
        <div class="game-answers" style="grid-template-columns:1fr 1fr">
          <button class="game-answer-btn" data-val="true" style="font-size:20px">✅ True</button>
          <button class="game-answer-btn" data-val="false" style="font-size:20px">❌ False</button>
        </div>
        <div class="game-feedback" id="tfFb" style="display:none"></div>
      `;
      screen.querySelectorAll('.game-answer-btn').forEach(btn=>{
        btn.addEventListener('click',()=>{
          const chosen=btn.dataset.val==='true';
          const ok=chosen===a;
          screen.querySelectorAll('.game-answer-btn').forEach(b=>{b.disabled=true;if((b.dataset.val==='true')===a)b.classList.add('correct');});
          if(!ok){btn.classList.add('wrong');state.streak=0;}else{state.score+=10+state.streak*2;state.streak++;}
          const fb=document.getElementById('tfFb');fb.style.display='block';
          fb.className='game-feedback '+(ok?'correct':'wrong');
          fb.textContent=ok?`✓ Correct! It's ${a?'TRUE':'FALSE'}. +${10+(state.streak-1)*2} pts`:`✗ It's actually ${a?'TRUE':'FALSE'}`;
          setTimeout(nextRound,1400);
        });
      });
    }
    function endGame(){showEnd(screen,{trophy:state.score>=100?'🏆':state.score>=70?'🥇':'✅',title:'True or False Complete!',scoreVal:state.score+' pts',scoreLabel:`You got ${Math.round(state.score/10)} of ${state.total} right!`,onReplay:()=>playTrueFalse(container)});setScore(state.score+' pts');}
    nextRound();
  }

  // ═══════════════════════════════════════════════════════
  //  GAME 13: SNAKE
  // ═══════════════════════════════════════════════════════
  function playSnake(container) {
    const GRID=20, CELL=22;
    container.style.padding='0';
    container.style.background='#0a0c12';
    const screen=document.createElement('div');
    screen.style.cssText=`display:flex;flex-direction:column;align-items:center;padding:20px;gap:16px;width:100%;min-height:100%`;
    container.appendChild(screen);

    let snake=[{x:10,y:10}], dir={x:1,y:0}, nextDir={x:1,y:0};
    let food=randomFood(), score=0, best=+(localStorage.getItem('ae_snake_best')||0);
    let running=false, interval=null;

    function randomFood(){
      let f;
      do{f={x:Math.floor(Math.random()*GRID),y:Math.floor(Math.random()*GRID)};}
      while(snake.some(s=>s.x===f.x&&s.y===f.y));
      return f;
    }

    const canvas=document.createElement('canvas');
    canvas.width=GRID*CELL; canvas.height=GRID*CELL;
    canvas.style.cssText=`border-radius:10px;border:2px solid var(--border2);display:block;cursor:pointer;touch-action:none`;
    const ctx=canvas.getContext('2d');

    const statsDiv=document.createElement('div');
    statsDiv.className='game-stats';
    statsDiv.innerHTML=`<div class="stat-chip">Score <span class="stat-val" id="snakeScore">0</span></div><div class="stat-chip">Best <span class="stat-val" id="snakeBest">${best}</span></div>`;

    const hint=document.createElement('div');
    hint.style.cssText='font-size:11px;color:var(--muted);text-align:center';
    hint.textContent='Arrow keys or WASD • Tap screen to start • Swipe to steer';

    const startBtn=document.createElement('button');
    startBtn.className='game-next-btn';startBtn.style.width='200px';
    startBtn.textContent='▶ Start Game';

    screen.appendChild(statsDiv);
    screen.appendChild(canvas);
    screen.appendChild(hint);
    screen.appendChild(startBtn);

    function draw(){
      ctx.fillStyle='#0a0c12';ctx.fillRect(0,0,canvas.width,canvas.height);
      // Grid dots
      ctx.fillStyle='#1a1f2e';
      for(let x=0;x<GRID;x++)for(let y=0;y<GRID;y++)ctx.fillRect(x*CELL+CELL/2-1,y*CELL+CELL/2-1,2,2);
      // Food
      ctx.font=`${CELL-2}px serif`;ctx.textAlign='center';ctx.textBaseline='middle';
      ctx.fillText('🍎',food.x*CELL+CELL/2,food.y*CELL+CELL/2);
      // Snake
      snake.forEach((s,i)=>{
        const t=1-i/snake.length;
        ctx.fillStyle=`rgba(${Math.round(232*t+96*(1-t))},${Math.round(160*t+200*(1-t))},${Math.round(32*t+240*(1-t))},1)`;
        ctx.beginPath();ctx.roundRect(s.x*CELL+1,s.y*CELL+1,CELL-2,CELL-2,4);ctx.fill();
      });
      // Head eyes
      const h=snake[0];
      ctx.fillStyle='#0a0c12';
      ctx.beginPath();ctx.arc(h.x*CELL+CELL*0.35,h.y*CELL+CELL*0.35,2.5,0,Math.PI*2);ctx.fill();
      ctx.beginPath();ctx.arc(h.x*CELL+CELL*0.65,h.y*CELL+CELL*0.35,2.5,0,Math.PI*2);ctx.fill();
    }

    function step(){
      dir={...nextDir};
      const head={x:(snake[0].x+dir.x+GRID)%GRID,y:(snake[0].y+dir.y+GRID)%GRID};
      if(snake.some(s=>s.x===head.x&&s.y===head.y)){return gameOver();}
      snake.unshift(head);
      if(head.x===food.x&&head.y===food.y){score++;food=randomFood();if(score>best){best=score;localStorage.setItem('ae_snake_best',best);document.getElementById('snakeBest').textContent=best;}}
      else snake.pop();
      document.getElementById('snakeScore').textContent=score;
      setScore('Score: '+score+' · Best: '+best);
      draw();
    }

    function startGame(){
      snake=[{x:10,y:10}];dir={x:1,y:0};nextDir={x:1,y:0};food=randomFood();score=0;running=true;
      document.getElementById('snakeScore').textContent='0';
      startBtn.style.display='none';
      clearInterval(interval);interval=setInterval(step,120);
      canvas.focus();
    }

    function gameOver(){
      running=false;clearInterval(interval);
      draw();
      ctx.fillStyle='rgba(0,0,0,0.6)';ctx.fillRect(0,0,canvas.width,canvas.height);
      ctx.fillStyle='#f06060';ctx.font='bold 24px DM Mono, monospace';ctx.textAlign='center';ctx.textBaseline='middle';
      ctx.fillText('GAME OVER',canvas.width/2,canvas.height/2-16);
      ctx.fillStyle='#e8eaf0';ctx.font='16px DM Mono, monospace';
      ctx.fillText('Score: '+score,canvas.width/2,canvas.height/2+16);
      startBtn.style.display='block';startBtn.textContent='↺ Play Again';
      if(score>best){best=score;localStorage.setItem('ae_snake_best',best);document.getElementById('snakeBest').textContent=best;}
      setScore('Score: '+score+' · Best: '+best);
    }

    // Controls
    document.addEventListener('keydown', function snakeKeys(e){
      if(!document.getElementById('gamePane')||document.getElementById('gamePane').classList.contains('hidden')){document.removeEventListener('keydown',snakeKeys);return;}
      const map={ArrowUp:{x:0,y:-1},ArrowDown:{x:0,y:1},ArrowLeft:{x:-1,y:0},ArrowRight:{x:1,y:0},w:{x:0,y:-1},s:{x:0,y:1},a:{x:-1,y:0},d:{x:1,y:0}};
      const nd=map[e.key];
      if(nd&&!(nd.x===-dir.x&&nd.y===-dir.y)){nextDir=nd;e.preventDefault();}
    });

    // Touch/swipe
    let tx=0,ty=0;
    canvas.addEventListener('touchstart',e=>{tx=e.touches[0].clientX;ty=e.touches[0].clientY;e.preventDefault();},{passive:false});
    canvas.addEventListener('touchend',e=>{
      const dx=e.changedTouches[0].clientX-tx, dy=e.changedTouches[0].clientY-ty;
      if(Math.abs(dx)<5&&Math.abs(dy)<5){if(!running)startGame();return;}
      if(Math.abs(dx)>Math.abs(dy)){nextDir=dx>0?{x:1,y:0}:{x:-1,y:0};}
      else{nextDir=dy>0?{x:0,y:1}:{x:0,y:-1};}
      e.preventDefault();
    },{passive:false});

    canvas.addEventListener('click',()=>{if(!running)startGame();});
    startBtn.addEventListener('click',startGame);
    draw();
    setScore('Best: '+best);
  }

  // ═══════════════════════════════════════════════════════
  //  GAME 14: NUMBER LINE ESTIMATION
  // ═══════════════════════════════════════════════════════
  function playNumberLine(container) {
    const state={score:0,round:0,total:10};
    const screen=makeScreen(container);

    function nextRound(){
      if(state.round>=state.total)return endGame();
      state.round++;
      // Pick a random range and target
      const ranges=[{min:0,max:100},{min:0,max:1000},{min:0,max:10},{min:0,max:50},{min:50,max:150}];
      const range=ranges[Math.floor(Math.random()*ranges.length)];
      const target=Math.floor(Math.random()*(range.max-range.min+1))+range.min;
      let guess=null;
      setScore(`${state.score} pts · Q ${state.round}/${state.total}`);

      screen.innerHTML=`
        <div class="game-stats">
          <div class="stat-chip">Score <span class="stat-val">${state.score}</span></div>
          <div class="stat-chip">Q <span class="stat-val">${state.round}/${state.total}</span></div>
        </div>
        <div class="game-prompt">
          <div class="game-prompt-label">📏 Click the number line</div>
          <div class="game-question" style="font-size:28px">${target}</div>
          <div class="game-sub">Place ${target} on the number line below</div>
        </div>
        <div style="padding:20px 10px">
          <div style="position:relative;height:60px;cursor:crosshair" id="nlContainer">
            <div style="position:absolute;top:28px;left:0;right:0;height:4px;background:var(--border2);border-radius:2px"></div>
            <div style="position:absolute;top:20px;left:0;font-size:11px;color:var(--muted)">${range.min}</div>
            <div style="position:absolute;top:20px;right:0;font-size:11px;color:var(--muted)">${range.max}</div>
            <div id="nlMarker" style="display:none;position:absolute;top:14px;width:4px;height:32px;background:var(--accent);border-radius:2px;transform:translateX(-50%)"></div>
            <div id="nlCorrect" style="display:none;position:absolute;top:14px;width:4px;height:32px;background:var(--success);border-radius:2px;transform:translateX(-50%)"></div>
          </div>
          <div id="nlGuessLabel" style="text-align:center;font-size:12px;color:var(--muted);margin-top:4px">Click on the line to place your guess</div>
        </div>
        <button class="game-next-btn" id="nlSubmit" disabled style="opacity:.5">Confirm Guess ✓</button>
        <div class="game-feedback" id="nlFb" style="display:none"></div>
      `;

      const nlc=document.getElementById('nlContainer');
      const marker=document.getElementById('nlMarker');
      const lbl=document.getElementById('nlGuessLabel');
      const submitBtn=document.getElementById('nlSubmit');

      nlc.addEventListener('click',e=>{
        if(submitBtn.disabled===false&&document.getElementById('nlFb').style.display!=='none')return;
        const rect=nlc.getBoundingClientRect();
        const pct=(e.clientX-rect.left)/rect.width;
        guess=Math.round(range.min+pct*(range.max-range.min));
        guess=Math.max(range.min,Math.min(range.max,guess));
        marker.style.left=(pct*100)+'%';
        marker.style.display='block';
        lbl.textContent=`Your guess: ${guess}`;
        submitBtn.disabled=false;submitBtn.style.opacity='1';
      });

      submitBtn.addEventListener('click',()=>{
        if(guess===null)return;
        submitBtn.disabled=true;
        const correctPct=(target-range.min)/(range.max-range.min);
        const correct=document.getElementById('nlCorrect');
        correct.style.left=(correctPct*100)+'%';correct.style.display='block';
        const off=Math.abs(guess-target);
        const rangeSz=range.max-range.min;
        const pctOff=off/rangeSz;
        let pts=0,msg='';
        if(pctOff<=0.02){pts=20;msg='🎯 Perfect! +20 pts';}
        else if(pctOff<=0.05){pts=15;msg=`Great! Off by ${off}. +15 pts`;}
        else if(pctOff<=0.10){pts=10;msg=`Good! Off by ${off}. +10 pts`;}
        else if(pctOff<=0.20){pts=5;msg=`Close-ish! Off by ${off}. +5 pts`;}
        else{pts=0;msg=`Off by ${off}. The answer was ${target}.`;}
        state.score+=pts;
        lbl.textContent=`Your guess: ${guess} · Correct: ${target} · Off by ${off}`;
        const fb=document.getElementById('nlFb');fb.style.display='block';
        fb.className='game-feedback '+(pts>=10?'correct':'wrong');fb.textContent=msg;
        setTimeout(nextRound,1600);
      });
    }
    function endGame(){showEnd(screen,{trophy:state.score>=140?'🏆':state.score>=100?'🥇':'📏',title:'Number Line Complete!',scoreVal:state.score+' pts',scoreLabel:`Estimation master! ${state.score>=140?'Incredible precision! 🎯':'Keep practicing!'}`,onReplay:()=>playNumberLine(container)});setScore(state.score+' pts');}
    nextRound();
  }

  // ── INIT ─────────────────────────────────────────────
  function init() {
    renderPanel();
    document.getElementById('closeGameBtn')?.addEventListener('click', closeGame);
  }

  return { init, openGame, renderPanel };
})();
