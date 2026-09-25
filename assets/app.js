(() => {
'use strict';
const root=document.querySelector('#app');
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const safe=s=>{const v=String(s||'').trim();return /^(https?:\/\/|(?:\.\/)?assets\/)/i.test(v)?esc(v):''};
const route=document.body.dataset.page;
const P=window.PROFILE;
if(!P||!Array.isArray(window.POSTS)||!Array.isArray(window.WORKS)){root.innerHTML='<div class="error">データを読み込めませんでした。dataフォルダーのファイルと記号の抜けを確認してください。</div>';return;}
const posts=[...window.POSTS].sort((a,b)=>b.date.localeCompare(a.date));
const params=new URLSearchParams(location.search);
const months=['JANUARY','FEBRUARY','MARCH','APRIL','MAY','JUNE','JULY','AUGUST','SEPTEMBER','OCTOBER','NOVEMBER','DECEMBER'];
const types=['ALL','STUDY','WORK','NOTE','MONTHLY'];

// 1ページに表示する投稿数。変更するときは、この数字だけ変えてください。
const POSTS_PER_PAGE = 10;
function paginate(list) {
  const total = Math.max(1, Math.ceil(list.length / POSTS_PER_PAGE));
  const requested = Number(params.get('page'));
  const page = Number.isSafeInteger(requested) && requested > 0
    ? Math.min(requested, total) : 1;
  const start = (page - 1) * POSTS_PER_PAGE;
  return { items: list.slice(start, start + POSTS_PER_PAGE), page, total };
}
function pagination(state, filters = {}) {
  if (state.total <= 1) return '';
  const link = (page, label, disabled, rel = '') => {
    if (disabled) return `<span class="page-link" aria-disabled="true">${label}</span>`;
    const query = new URLSearchParams({ ...filters, page: String(page) });
    const href = (route === 'home' ? 'index.html' : 'archive.html') + '?' + query + '#entries';
    return `<a class="page-link" href="${esc(href)}"${rel ? ` rel="${rel}"` : ''}>${label}</a>`;
  };
  return `<nav class="pagination" aria-label="投稿一覧のページ移動">
    <p class="page-status">${state.page} / ${state.total} ページ</p>
    <div class="page-links">
      ${link(1, '最新のページ', state.page === 1)}
      ${link(state.page - 1, '← 前のページ', state.page === 1, 'prev')}
      ${link(state.page + 1, '次のページ →', state.page === state.total, 'next')}
      ${link(state.total, '最古のページ', state.page === state.total)}
    </div>
  </nav>`;
}

const date=s=>esc(s.replaceAll('-','.'));
const avatar=()=>`<span class="avatar ${P.avatarFromScreenshot?'screenshot':''}"><img src="${safe(P.avatar)}" alt="${esc(P.name)}のプロフィール画像"></span>`;
function prose(text){return String(text||'').split(/\n\s*\n/).map(block=>block.split(/(?=^## )/m).filter(Boolean).map(part=>{if(part.startsWith('## ')){const [title,...rest]=part.split('\n');return `<h3>${esc(title.slice(3))}</h3>${rest.length?`<p>${esc(rest.join('\n'))}</p>`:''}`;}return `<p>${esc(part)}</p>`;}).join('')).join('');}
function meta(p){return `<div class="entry-meta"><time datetime="${esc(p.date)}">${date(p.date)}</time><span class="tag">${esc(p.type)}</span>${p.sample?'<span class="sample">記入例</span>':''}</div>`;}
function images(list){return list?.length?`<div class="entry-images ${list.length===1?'single':''}">${list.map(im=>`<button class="image-button" type="button" data-image="${safe(im.src)}" data-alt="${esc(im.alt)}" aria-label="${esc(im.alt||'画像')}を拡大"><img src="${safe(im.src)}" alt="${esc(im.alt)}" loading="lazy"></button>`).join('')}</div>`:'';}
function entry(p){const raw=String(p.body||'').replace(/^## /gm,'');const excerpt=raw.length>135?raw.slice(0,135)+'…':raw;return `<article class="entry">${meta(p)}<div><h2><a href="post.html?id=${encodeURIComponent(p.id)}">${esc(p.title)}</a></h2>${images(p.images||[])}<p class="excerpt">${esc(excerpt)}</p><a class="read-more" href="post.html?id=${encodeURIComponent(p.id)}">記録を読む</a></div></article>`;}
const nav=[['home','index.html','HOME'],['archive','archive.html','ARCHIVE'],['works','works.html','WORKS'],['about','about.html','ABOUT'],['links','links.html','LINKS']];
const current=route==='post'?'archive':route;
const header=`<a class="skip" href="#main">本文へ移動</a><div class="shell"><header class="header"><a class="wordmark" href="index.html">${esc(P.name)}<small>DRAWING ARCHIVE / JOURNAL</small></a><button class="menu-toggle" type="button" aria-expanded="false" aria-controls="navigation">MENU ＋</button><nav class="nav" id="navigation" aria-label="メインナビゲーション">${nav.map(([key,url,label])=>`<a href="${url}" ${current===key?'aria-current="page"':''}>${label}</a>`).join('')}</nav></header>`;
const heading=(title,desc)=>`<div class="page-head"><h1>${title}</h1><p>${desc}</p></div>`;
let content='';
if(route==='home'){
const paged = paginate(posts);
content=`<section class="hero"><div class="hero-top">${avatar()}<span class="eyebrow">${esc(P.name)} / DRAWING JOURNAL</span></div><h1>${esc(P.subtitle).replace(' ','<br>')}<span aria-hidden="true">.</span></h1><div class="hero-bottom"><p class="hero-description">${esc(P.description)}</p><a class="text-link" href="about.html">この記録について ↗</a></div>${P.heroImage?`<figure class="hero-image"><img src="${safe(P.heroImage)}" alt="${esc(P.heroAlt)}"></figure>`:''}</section><section id="entries" aria-labelledby="latest"><div class="section-top"><h2 id="latest">LATEST ENTRIES</h2><span>最近の制作記録</span></div>${pagination(paged)}<div class="feed">${posts.length?paged.items.map(entry).join(''):'<p class="empty">最初の記録を、ここから。</p>'}</div>${pagination(paged)}<div class="bottom-link"><a class="text-link" href="archive.html">すべての記録を見る ↗</a></div></section>`;
}else if(route==='archive'){
const type=types.includes(params.get('type'))?params.get('type'):'ALL';const month=params.get('month')||'';
const url=(t,m)=>'archive.html?'+new URLSearchParams({type:t,...(m?{month:m}:{})});
const dates=[...new Set(posts.map(p=>p.date.slice(0,7)))];const years=[...new Set(dates.map(d=>d.slice(0,4)))];
const filtered=posts.filter(p=>(type==='ALL'||p.type===type)&&(!month||p.date.startsWith(month)));
const paged = paginate(filtered);
const pager = pagination(paged, {type, ...(month ? {month} : {})});
let previous='';
content=heading('Archive.','練習も、途中も、考えたことも。日付をたどる制作記録。')+`<div class="archive-layout"><aside class="archive-side" aria-label="年月で絞り込み"><div class="month-links"><a href="${url(type,'')}" ${!month?'aria-current="true"':''}>すべての月</a></div>${years.map(y=>`<h2 class="year">${esc(y)}</h2><div class="month-links">${dates.filter(d=>d.startsWith(y)).map(d=>`<a href="${url(type,d)}" ${d===month?'aria-current="true"':''}>${months[Number(d.slice(5))-1]} <span>(${posts.filter(p=>p.date.startsWith(d)).length})</span></a>`).join('')}</div>`).join('')}</aside><section id="entries" class="archive-content" aria-label="投稿一覧"><nav class="filters" aria-label="投稿の種類">${types.map(t=>`<a href="${url(t,month)}" ${t===type?'aria-current="true"':''}>${t}</a>`).join('')}</nav><p class="result-info">${filtered.length} ENTRIES${month?' / '+esc(month.replace('-','.')):''}</p>${pager}${filtered.length?paged.items.map(p=>{const m=p.date.slice(0,7);const h=m!==previous?`<h2 class="month-title">${months[Number(m.slice(5))-1]} ${m.slice(0,4)}</h2>`:'';previous=m;return h+entry(p);}).join(''):'<div class="empty">この条件の記録はまだありません。</div>'}${pager}</section></div>`;
}else if(route==='works'){
const works=window.WORKS.map(w=>{if(!w.postId)return w;const p=posts.find(p=>p.id===w.postId);return p?{id:p.id,title:p.title,year:p.date.slice(0,4),images:p.images,description:p.body}:null;}).filter(w=>w&&w.images?.length);
window.visibleWorks=works;
content=heading('Works.','完成した絵を、一枚ずつ。')+(works.length?`<div class="works-grid">${works.map((w,i)=>`<button type="button" class="work-card" data-work="${i}" aria-label="${esc(w.title)}の詳細を見る"><img src="${safe(w.images[0].src)}" alt="${esc(w.images[0].alt||w.title)}" loading="lazy"><span class="work-caption"><strong>${esc(w.title)}</strong><span>${esc(w.year)}</span></span></button>`).join('')}</div>`:'<div class="empty"><h2>これから、ここに。</h2><p>完成した作品を、少しずつまとめていきます。</p><a class="text-link" href="archive.html?type=WORK">制作の記録を見る ↗</a></div>');
}else if(route==='about'){
content=`<div class="about-wrap">${avatar()}<h1 class="about-name">${esc(P.name)}</h1><section class="about-card"><p class="label">ABOUT</p><p class="intro">${esc(P.intro)}</p><div class="prose">${prose(P.about)}</div><h2>ACTIVITY</h2><div class="prose">${prose(P.activity)}</div><a class="text-link" href="links.html">ほかの活動場所 ↗</a></section></div>`;
}else if(route==='links'){
const icons={x:'<path d="M5 4h5l17 24h-5zM27 4 5 28"/>',instagram:'<rect x="4" y="4" width="24" height="24" rx="7"/><circle cx="16" cy="16" r="6"/><circle cx="24" cy="8.5" r=".8"/>',image:'<rect x="4" y="4" width="24" height="24" rx="2"/><circle cx="11" cy="11" r="2"/><path d="m5 25 8-9 5 5 4-5 6 7"/>'};
content=heading('Elsewhere.','絵を描きながら、こちらにも。')+`<div class="link-list">${P.links.map(l=>{const href=/^https?:\/\//i.test(l.url)?safe(l.url):'';return `<${href?'a':'div'} class="link-card" ${href?`href="${href}" target="_blank" rel="noopener noreferrer"`:''}><svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">${icons[l.icon]||icons.image}</svg><div><strong>${esc(l.label)}</strong><p>${esc(l.description)}</p></div><span class="link-end">${href?'↗':'準備中'}</span></${href?'a':'div'}>`;}).join('')}</div>`;
}else if(route==='post'){
const p=posts.find(p=>p.id===params.get('id'));
content=p?`<article class="post-detail"><a class="back" href="archive.html">← ARCHIVE</a><header class="page-head">${meta(p)}<h1>${esc(p.title)}</h1></header>${images(p.images)}<div class="prose">${prose(p.body)}</div><a class="back" href="archive.html?month=${p.date.slice(0,7)}">${p.date.slice(0,7).replace('-','年')}月の記録へ</a></article>`:heading('Not found.','この記録が見つかりませんでした。')+'<a class="text-link" href="archive.html">ARCHIVEへ戻る</a>';
if(p)document.title=p.title+' | '+P.name;
}
if(route!=='post')document.title=(nav.find(n=>n[0]===route)?.[2]||'Drawing Archive')+' | '+P.name;
root.innerHTML=header+`<main id="main">${content}</main><footer class="footer"><span>© ${new Date().getFullYear()} ${esc(P.name)}</span><span>DRAWING ARCHIVE / JOURNAL</span></footer></div><dialog aria-labelledby="dialog-title"><div class="dialog-head"><button type="button" class="close">閉じる ×</button></div><div class="dialog-body"></div></dialog>`;
const menu=document.querySelector('.menu-toggle'),navEl=document.querySelector('.nav');
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));navEl.classList.toggle('open',open);menu.textContent=open?'CLOSE −':'MENU ＋';});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu.getAttribute('aria-expanded')==='true'){menu.click();menu.focus();}});
const dialog=document.querySelector('dialog'),body=dialog.querySelector('.dialog-body');
let priorOverflow='';
function show(markup){body.innerHTML=markup;priorOverflow=document.body.style.overflow;document.body.style.overflow='hidden';dialog.showModal();}
dialog.querySelector('.close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
dialog.addEventListener('close',()=>document.body.style.overflow=priorOverflow);
root.addEventListener('click',e=>{const im=e.target.closest('[data-image]');if(im){show(`<h2 id="dialog-title">${esc(im.dataset.alt||'画像')}</h2><img src="${safe(im.dataset.image)}" alt="${esc(im.dataset.alt)}">`);return;}const card=e.target.closest('[data-work]');if(card){const w=window.visibleWorks[Number(card.dataset.work)];show(`${w.images.map(im=>`<img src="${safe(im.src)}" alt="${esc(im.alt||w.title)}">`).join('')}<p class="year-label">${esc(w.year)}</p><h2 id="dialog-title">${esc(w.title)}</h2><div class="prose">${prose(w.description)}</div>`);}});
})();
