(() => {
  'use strict';
  const root = document.querySelector('.slap-case');
  if (!root) return;
  const lang = document.documentElement.lang.slice(0, 2);
  const words = ({ko:['크게 보기','닫기','반복 영상 일시정지','반복 영상 재생','확대 재생'],ja:['拡大表示','閉じる','プレビューを一時停止','プレビューを再生','拡大再生']})[lang] || ['Enlarge','Close','Pause previews','Play previews','Enlarge video'];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let paused = reduced.matches, previousFocus = null;
  const previews = new Set();
  const dialog = document.createElement('dialog');dialog.className='slap-media-dialog';
  dialog.setAttribute('aria-label',words[0]);
  const close = document.createElement('button');close.type='button';close.className='slap-media-close';close.textContent=words[1];
  const content = document.createElement('div');content.className='slap-media-content';
  const caption = document.createElement('p');caption.className='slap-media-caption';
  dialog.append(close,content,caption);document.body.append(dialog);
  function stopModal() {
    content.querySelectorAll('video').forEach(v=>{v.pause();v.removeAttribute('src');v.load();});
    content.replaceChildren();document.documentElement.classList.remove('slap-modal-open');
    if(previousFocus && previousFocus.isConnected)previousFocus.focus();
    refresh();
  }
  function dismiss(){dialog.close();stopModal();}
  dialog.addEventListener('close',()=>{if(!dialog.open)stopModal();});
  close.addEventListener('click',dismiss);
  dialog.addEventListener('cancel',e=>{e.preventDefault();dismiss();});
  dialog.addEventListener('click',e=>{if(e.target===dialog)dismiss();});
  function show(src, text, video, trigger) {
    previousFocus=trigger;previews.forEach(v=>v.pause());
    const media=document.createElement(video?'video':'img');
    if(video){media.controls=true;media.muted=true;media.defaultMuted=true;media.playsInline=true;media.loop=true;}
    else media.alt=text;
    media.src=src;content.replaceChildren(media);caption.textContent=text;
    dialog.showModal();document.documentElement.classList.add('slap-modal-open');close.focus();
    if(video && !reduced.matches)media.play().catch(()=>{});
  }
  const mapping = {
    'slap-four-game.webp':'movement','slap-four-map.webp':'balloons','slap-four-balloons.webp':'balloons','slap-shop-after.webp':'shop','slap-shop-before.webp':'shop'
  };
  ['sword','arrow','spell','mace','melody','pitchfork','laser'].forEach(n=>mapping['slap-weapon-'+n+'.webp']=n+'-focus');
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(({target,isIntersecting})=>{target.dataset.visible=String(isIntersecting);update(target);});
  },{threshold:.15});
  function update(v) {
    if(paused || dialog.open || document.hidden || v.dataset.visible!=='true'){v.pause();return;}
    if(!v.getAttribute('src'))v.src=v.dataset.src;
    v.play().catch(()=>{});
  }
  function refresh(){previews.forEach(update);}
  root.querySelectorAll('a[href]').forEach(a=>{
    const img=a.querySelector('img');if(!img)return;
    const url=new URL(a.href,location.href);if(url.origin!==location.origin || !/\.(svg|png|jpe?g|webp)$/i.test(url.pathname))return;
    const button=document.createElement('button');button.type='button';button.className='slap-media-trigger';
    const text=img.alt || a.closest('figure')?.querySelector('figcaption')?.textContent || words[0];
    button.setAttribute('aria-label',words[0]+': '+text);
    const name=mapping[url.pathname.split('/').pop()];
    let src=url.pathname;
    if(name){
      src='/assets/slap-squad/previews/'+name+'.mp4';
      const video=document.createElement('video');video.muted=true;video.defaultMuted=true;video.loop=true;video.playsInline=true;video.preload='none';video.poster=name.endsWith('-focus')?'/assets/slap-squad/previews/'+name+'.webp':img.src;video.dataset.src=src;video.setAttribute('aria-hidden','true');
      button.append(video);previews.add(video);observer.observe(video);
    }else {
      const copy=img.cloneNode(true);
      const width=Number(img.getAttribute('width')),height=Number(img.getAttribute('height'));
      if(width>0 && height>0)copy.style.aspectRatio=width+' / '+height;
      button.append(copy);
    }
    const badge=document.createElement('span');badge.className='slap-media-hint';badge.textContent=words[0];button.append(badge);
    button.addEventListener('click',()=>show(src,text,!!name,button));a.replaceWith(button);
  });
  // Caption links use the same dialog as the image itself.
  root.querySelectorAll('a[href]').forEach(a=>{
    const url=new URL(a.href,location.href);
    if(url.origin!==location.origin || !/\.(svg|png|jpe?g|webp)$/i.test(url.pathname))return;
    a.addEventListener('click',e=>{e.preventDefault();show(url.pathname,a.closest('figure')?.querySelector('img')?.alt || a.textContent,false,a);});
  });
  // Existing full recordings retain their controls and get an explicit modal action.
  root.querySelectorAll('video[controls]').forEach(video=>{
    video.muted=true;video.defaultMuted=true;
    const button=document.createElement('button');button.type='button';button.className='slap-video-enlarge';button.textContent=words[4];
    button.addEventListener('click',()=>{video.pause();show(video.currentSrc || video.querySelector('source')?.src,video.getAttribute('aria-label') || words[4],true,button);});
    video.insertAdjacentElement('afterend',button);
  });
  const toggle=document.createElement('button');toggle.type='button';toggle.className='slap-preview-toggle';
  const sync=()=>{toggle.textContent=paused?words[3]:words[2];toggle.setAttribute('aria-pressed',String(paused));};
  toggle.addEventListener('click',()=>{paused=!paused;sync();refresh();});sync();
  (root.querySelector('.case-reading-nav') || root).append(toggle);
  reduced.addEventListener('change',()=>{paused=reduced.matches;sync();refresh();});
  document.addEventListener('visibilitychange',refresh);
})();
