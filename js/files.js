const Files = (() => {
  const MAX_MB=4, MAX_BYTES=4*1024*1024;
  let pendingFiles=[], dragDepth=0;
  const el = id => document.getElementById(id);
  function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
  function fileIcon(type,name){const t=(type+name).toLowerCase();if(type.startsWith('image/'))return'🖼️';if(type.startsWith('video/'))return'🎬';if(type.startsWith('audio/'))return'🎵';if(t.includes('pdf'))return'📄';if(/zip|rar|7z|tar|gz/.test(t))return'📦';if(/word|\.docx?$/.test(t))return'📝';if(/excel|\.xlsx?$/.test(t))return'📊';if(/powerpoint|\.pptx?$/.test(t))return'📑';if(/text|\.md$|\.txt$/.test(t))return'📃';if(/\.js$|\.ts$|\.py$|\.html?$|\.css$|\.json$|\.java$|\.c$|\.cpp$/.test(t))return'💻';return'📎';}
  function fmtBytes(b){if(b<1024)return b+' B';if(b<1048576)return(b/1024).toFixed(1)+' KB';return(b/1048576).toFixed(1)+' MB';}
  function readFile(file){return new Promise((res,rej)=>{const r=new FileReader();r.onload=e=>res(e.target.result);r.onerror=rej;r.readAsDataURL(file);});}
  function setProgress(pct,on){const p=el('uploadProgress'),b=el('uploadBar');if(!p||!b)return;p.classList.toggle('hidden',!on);b.style.width=pct+'%';}

  async function addFiles(list) {
    const arr=Array.from(list);
    for(let i=0;i<arr.length;i++){
      const file=arr[i];
      if(file.size>MAX_BYTES){alert(`"${file.name}" is over ${MAX_MB} MB.`);continue;}
      setProgress((i/arr.length)*80,true);
      try{const dataUrl=await readFile(file);pendingFiles.push({name:file.name,size:file.size,type:file.type||'application/octet-stream',dataUrl});}catch{alert(`Could not read "${file.name}".`);}
    }
    setProgress(100,true);setTimeout(()=>setProgress(0,false),400);renderStrip();
  }

  function renderStrip(){
    const strip=el('filePreviewStrip'),btn=el('attachBtn');if(!strip)return;
    strip.innerHTML='';const has=pendingFiles.length>0;
    strip.classList.toggle('active',has);if(btn)btn.classList.toggle('has-files',has);
    pendingFiles.forEach((f,i)=>{
      const chip=document.createElement('div');chip.className='preview-chip';
      chip.innerHTML=`${f.type.startsWith('image/')?`<img src="${f.dataUrl}" alt="">`:`<div class="chip-icon">${fileIcon(f.type,f.name)}</div>`}<span class="chip-name" title="${esc(f.name)}">${esc(f.name)}</span><button class="chip-remove" data-i="${i}">✕</button>`;
      strip.appendChild(chip);
    });
    strip.querySelectorAll('.chip-remove').forEach(b=>b.addEventListener('click',()=>{pendingFiles.splice(+b.dataset.i,1);renderStrip();}));
  }

  function getPending(){return[...pendingFiles];}
  function clearPending(){pendingFiles=[];renderStrip();}

  function buildBubbleFiles(files){
    if(!files||!files.length)return'';let h='';
    files.forEach(f=>{
      if(f.type.startsWith('image/')){h+=`<img class="bubble-img" src="${f.dataUrl}" alt="${esc(f.name)}" data-src="${f.dataUrl}">`;}
      else if(f.type.startsWith('video/')){h+=`<video controls><source src="${f.dataUrl}" type="${esc(f.type)}"></video>`;}
      else if(f.type.startsWith('audio/')){h+=`<audio controls><source src="${f.dataUrl}" type="${esc(f.type)}"></audio>`;}
      else{h+=`<a class="file-card" href="${f.dataUrl}" download="${esc(f.name)}"><span class="fc-icon">${fileIcon(f.type,f.name)}</span><span class="fc-info"><span class="fc-name">${esc(f.name)}</span><span class="fc-size">${fmtBytes(f.size)}</span></span><span class="fc-dl">⬇</span></a>`;}
    });
    return h;
  }

  function init(){
    const btn=el('attachBtn'),inp=el('fileInput');
    if(btn)btn.addEventListener('click',()=>inp&&inp.click());
    if(inp)inp.addEventListener('change',()=>{addFiles(inp.files);inp.value='';});
    document.addEventListener('dragenter',e=>{e.preventDefault();if(!App.currentUser||!Chat.currentRoom)return;dragDepth++;const ov=el('dragOverlay');if(ov)ov.classList.add('active');});
    document.addEventListener('dragleave',()=>{dragDepth--;if(dragDepth<=0){dragDepth=0;const ov=el('dragOverlay');if(ov)ov.classList.remove('active');}});
    document.addEventListener('dragover',e=>e.preventDefault());
    document.addEventListener('drop',e=>{e.preventDefault();dragDepth=0;const ov=el('dragOverlay');if(ov)ov.classList.remove('active');if(e.dataTransfer.files.length&&App.currentUser&&Chat.currentRoom)addFiles(e.dataTransfer.files);});
    document.addEventListener('paste',e=>{if(!App.currentUser||!Chat.currentRoom)return;const files=Array.from(e.clipboardData?.items||[]).filter(i=>i.kind==='file').map(i=>i.getAsFile()).filter(Boolean);if(files.length)addFiles(files);});
  }
  return{init,addFiles,getPending,clearPending,buildBubbleFiles,fileIcon,fmtBytes};
})();
