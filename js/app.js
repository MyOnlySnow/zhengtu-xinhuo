import { SITE } from './config.js';
import { SOURCES, EVENTS, STORIES, EXTRA_PEOPLE, MARCH_LANDMARKS, QUIZ } from './data.js';

const main = document.querySelector('main');
const $ = (s, el = document) => el.querySelector(s);
const esc = (v = '') => String(v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const safeUrl = value => /^https?:\/\//.test(value || '') ? esc(value) : '#/sources';
const source = id => SOURCES.find(s => s.id === id) || SOURCES[1];
const arrow = '<span aria-hidden="true">↗</span>';
const link = (href, label, cls = '') => `<a class="${cls}" href="${esc(href)}">${label}</a>`;
const external = (url, label, cls = '') => `<a class="${cls}" href="${safeUrl(url)}" target="_blank" rel="noopener noreferrer">${label} ${arrow}<span class="sr-only">（在新标签页打开）</span></a>`;
const STORAGE = 'zhengtu-xinhuo-v1';
let storageAvailable = true;
let state = {read:[], notes:[], challenges:[], drafts:{}};
try {
  const saved = JSON.parse(localStorage.getItem(STORAGE));
  if (saved && typeof saved === 'object') {
    for (const key of ['read','notes','challenges']) if (Array.isArray(saved[key])) state[key] = saved[key];
    if (saved.drafts && typeof saved.drafts === 'object' && !Array.isArray(saved.drafts)) state.drafts = saved.drafts;
  }
} catch { storageAvailable = false; }
function save() {
  try { localStorage.setItem(STORAGE, JSON.stringify(state)); return true; }
  catch { storageAvailable = false; toast('浏览器未允许保存，请导出记录备份。'); return false; }
}
function toast(text) {
  const el = $('#toast'); el.textContent = text; el.classList.add('visible');
  clearTimeout(toast.timer); toast.timer = setTimeout(() => el.classList.remove('visible'), 3200);
}
function download(name, text) {
  const url = URL.createObjectURL(new Blob([text], {type:'text/markdown;charset=utf-8'}));
  const a = document.createElement('a'); a.href = url; a.download = name; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
let people = [], landmarks = [], routes = {}, provinces = null, qingdaoGeometry = null, activeMap = null;
const ARMY_NAMES = ['红一方面军','红二方面军','红四方面军','红二十五军'];
const ARMY_KEYS = ['first','second','fourth','n25'];
const ARMY_COLORS = ['#a72c35','#bd823c','#527e88','#72774a'];
const imgPath = p => p ? (p.startsWith('assets/') ? p : `assets/${p}`) : '';
const sourceLine = id => { const s=source(id); return `<div class="source-line">资料来源：${external(s.url, esc(s.org))}</div>`; };
const pageHead = (eyebrow, title, desc) => `<section class="page-heading container"><div class="eyebrow">${eyebrow}</div><h1>${title}</h1><p>${desc}</p></section>`;
const breadcrumb = (text, parent='#/', parentLabel='首页') => `<div class="container breadcrumb">${link(parent,parentLabel)}<span>/</span>${esc(text)}</div>`;

function routeMap() {
  const project = (lng, lat) => [((lng - 98) / 22 * 760).toFixed(1), ((39 - lat) / 16 * 500).toFixed(1)];
  const ringPath = ring => ring.map((p,i) => `${i?'L':'M'}${project(p[0],p[1]).join(',')}`).join(' ')+'Z';
  let shapes = '';
  for (const f of provinces?.features || []) {
    const polys=f.geometry.type === 'MultiPolygon' ? f.geometry.coordinates : [f.geometry.coordinates];
    shapes += `<path d="${polys.map(p=>p.map(ringPath).join(' ')).join(' ')}"/>`;
  }
  const lines=ARMY_KEYS.map((key,i)=>`<polyline points="${(routes[key]||[]).map(p=>project(p.lng,p.lat).join(',')).join(' ')}" fill="none" stroke="${ARMY_COLORS[i]}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>`).join('');
  const points=[EVENTS[0],EVENTS[2],EVENTS[4],EVENTS[7],EVENTS[8]].map(e=>{const [x,y]=project(e.lng,e.lat);return `<g transform="translate(${x},${y})"><circle r="5" fill="#a72c35" stroke="#f6f1e7" stroke-width="2"/><text x="10" y="-9">${e.id==='huining'?'会宁':e.name.replace('会议','').replace('出发','').replace('飞夺','').replace('落脚陕北','吴起镇')}</text></g>`;}).join('');
  return `<svg class="route-map" viewBox="0 0 760 500" role="img" aria-label="四路红军长征路线概览，点击下方入口可进入交互沙盘"><defs><pattern id="mapgrid" width="38" height="38" patternUnits="userSpaceOnUse"><path d="M38 0H0V38" fill="none" stroke="#a89573" stroke-opacity=".12"/></pattern><clipPath id="mapclip"><rect width="760" height="500"/></clipPath></defs><rect width="760" height="500" fill="#eee8da"/><rect width="760" height="500" fill="url(#mapgrid)"/><g clip-path="url(#mapclip)"><g fill="#f6f2e9" stroke="#cfbfaa" stroke-width=".7">${shapes}</g>${lines}${points}</g><text x="28" y="38" class="map-label">长征路线 · 1934—1936</text><text x="28" y="473" class="map-note">路线为关键航点连线示意</text><text x="715" y="45" class="map-label">N ↑</text></svg>`;
}
function personCard(p) {
  return `<a class="person-card" href="#/person/${p.id}"><div class="person-photo ${p.photo?'':'archive-photo'}">${p.photo?`<img src="${imgPath(p.photo)}" alt="${esc(p.name)}" loading="lazy">`:`<span aria-hidden="true">${esc(p.name.slice(-2))}</span><small>人物档案</small>`}<span class="photo-period">${esc(p.period)}</span></div><div class="person-card-body"><span class="person-years">${p.birth}—${p.death||'至今'}</span><h3>${esc(p.name)} ${arrow}</h3><p>${esc(p.identity)}</p></div></a>`;
}
function homePage() {
  return `<section class="hero"><div class="hero-photo" role="img" aria-label="今天的泸定桥，2012年摄，山海风摄影"></div><div class="hero-lines" aria-hidden="true"></div><div class="container hero-inner"><div class="hero-copy"><div class="hero-kicker"><span></span> 庆祝建党105周年 · 纪念长征胜利90周年</div><h1>循着信仰的足迹<br>走好<span>我们的长征</span></h1><p>从万水千山的历史回响，到青春报国的时代答卷。<br>以数字技术重走长征路，在学思践悟中传承精神的火种。</p><div class="hero-actions">${link('#/trail','重走长征路 <span aria-hidden="true">→</span>','button light')}${link('#/study','开启主题研学 ↗','hero-secondary')}</div><div class="hero-branch">${esc(SITE.branch)}</div></div><div class="hero-caption"><span>坐标 · 泸定桥</span><strong>万水千山，只等闲。</strong><small>1935 · 四川泸定</small></div></div><div class="hero-bottom container"><span>红色铸魂 / 数智传薪</span><span>向下探索 ↓</span></div></section>
  <div class="anniversary-strip"><div class="container"><span><b>1921 — 2026</b> 初心如磐</span><i>★</i><span>学一段历史 · 讲一个故事 · 攻一个难题</span><i>★</i><span><b>1936 — 2026</b> 征途如虹</span></div></div>
  <section class="container section learning-section"><div class="section-heading"><div><div class="eyebrow">以学铸魂 · 以行践知</div><h2>把精神的力量，化为前行的力量</h2></div><p>一条贯通理论、宣讲与实践的研学之路。</p></div><div class="learning-grid">${[
    ['01','学一段长征历史','沿着路线读懂历史，在重要讲话与红色经典中，理解信仰何以坚定。','#/study','原文学习 / 路线研学','book'],
    ['02','讲一个红色故事','从半条被子到山大校史，让一堂有温度的微党课，走进更多青年心里。','#/study?tab=stories','故事共读 / 微党课创作','flag'],
    ['03','攻一个科研难题','把实事求是写进实验，把团结协作融入攻关，让青春回应国家所需。','#/study?tab=practice','科研攻关 / 实践记录','spark'],
  ].map(([n,title,desc,href,tag,icon])=>`<a class="learning-card" href="${href}"><div class="learning-top"><span>${n}</span><span class="line-icon ${icon}" aria-hidden="true">${icon==='book'?'▤':icon==='flag'?'⚑':'✧'}</span></div><h3>${title}</h3><p>${desc}</p><div class="learning-bottom"><small>${tag}</small>${arrow}</div></a>`).join('')}</div></section>
  <section class="route-section"><div class="container route-layout"><div class="route-preview">${routeMap()}<div class="army-legend">${ARMY_NAMES.map((n,i)=>`<span><i style="background:${ARMY_COLORS[i]}"></i>${n}</span>`).join('')}</div></div><div class="route-copy"><div class="eyebrow">一张地图 · 万里征途</div><h2>让历史的足迹<br>在眼前徐徐展开</h2><p>从于都出发，到三大主力会师。沿着四路红军的行军轨迹，走近一次次抉择、一场场战斗与一份份坚守。</p><div class="route-features"><span>四路红军路线</span><span>历史事件讲解</span><span>时间轴自由探索</span><span>纪录片式播放</span></div>${link('#/trail','进入长征沙盘 <span aria-hidden="true">→</span>','button red')}<small class="route-footnote">基于 wanli-trail 交互沙盘 · 关键地点近似坐标</small></div></div></section>
  <section class="container section"><div class="section-heading"><div><div class="eyebrow">循着榜样 · 读懂初心</div><h2>时代不同，信仰一脉相承</h2></div>${link('#/people','走近红色人物 →','text-link')}</div><div class="people-grid home-people">${['chenshuxiang','dengenming','xuzhenchao','wangganchang'].map(id=>personCard(people.find(p=>p.id===id))).join('')}</div></section>
  <section class="container featured-reading"><div class="reading-mark" aria-hidden="true">学</div><div><div class="eyebrow">原原本本学 · 联系实际悟</div><h2>读原文，向历史深处汲取力量</h2><p>习近平在纪念中国工农红军长征胜利90周年大会上的讲话</p><span>新华社 · 2026年10月22日</span></div>${external(source('speech').url,'阅读讲话原文','button outline')}</section>
  <section class="container section story-section"><div class="section-heading"><div><div class="eyebrow">见人见事 · 见精神</div><h2>让红色故事，抵达心间</h2></div>${link('#/study?tab=stories','阅读全部故事 →','text-link')}</div><div class="home-stories">${STORIES.slice(0,3).map((s,i)=>`<a class="story-teaser" href="#/story/${s.id}"><span class="story-number">0${i+1}</span><div><span class="tag">${s.tag}</span><h3>${s.title}</h3><p>${s.intro}</p><small>${s.minutes} 分钟共读 · 含宣讲提纲</small></div>${arrow}</a>`).join('')}</div></section>
  <section class="practice-banner"><div class="container"><div><div class="eyebrow">今天，我们这样接过火炬</div><h2>科研路上，也有我们的“长征”</h2><p>记下一个真问题，形成一份攻关计划，留下每一次实事求是的探索。</p></div>${link('#/study?tab=practice','写下我的攻关计划 →','button light')}</div></section>`;
}
function trailPage() {
  return `${breadcrumb('长征沙盘')}<section class="container trail-heading"><div><div class="eyebrow">山河为卷 · 足迹为证</div><h1>重走长征路</h1></div><div><a class="button outline small" href="trail/index.html" target="_blank" rel="noopener">独立窗口打开 ↗</a></div></section><div class="container"><p class="trail-intro">选择“开始演示”跟随历史进程，或用“自由探索”查看全部路线。手机可左右滑动沙盘顶部工具栏；点击“红军部队”可折叠图例。</p><iframe class="trail-frame" src="trail/index.html" title="四路红军长征交互沙盘" allow="fullscreen" allowfullscreen></iframe><p class="map-disclaimer">沙盘整合自 ${external('https://github.com/nova-fable/wanli-trail','nova-fable / wanli-trail')}。路线连接近似考证航点，用于历史研学；底图需联网加载。${link('#/map','浏览研学地标 →')}</p></div><section class="container section"><div class="eyebrow">把历史串成一条线</div><h2>九个节点，读懂长征的关键进程</h2><div class="event-grid">${EVENTS.map((e,i)=>`<article><span>${String(i+1).padStart(2,'0')}</span><small>${e.date}</small><h3>${e.name}</h3><p>${e.desc}</p><b>${e.spirit}</b></article>`).join('')}</div>${sourceLine('history')}</section>`;
}
function peoplePage(query) {
  const filter=query.get('period')||'全部'; const search=query.get('q')||'';
  const periods=['全部',...new Set(people.map(p=>p.period))];
  const filtered=people.filter(p=>(filter==='全部'||p.period===filter)&&`${p.name}${p.identity}`.includes(search));
  return `${pageHead('人物有生平 · 精神有回响','与榜样同行','从革命先驱到时代楷模，从长征岁月到科学报国，走近一代代人的信仰与选择。')}<section class="container content-section"><form class="search-form" id="people-search"><label class="sr-only" for="people-query">搜索人物姓名或身份</label><input id="people-query" name="q" value="${esc(search)}" placeholder="搜索人物姓名或身份"><button class="button red small">搜索</button></form><div class="filter-tabs" aria-label="人物时期">${periods.map(p=>link(`#/people?period=${encodeURIComponent(p)}&q=${encodeURIComponent(search)}`,esc(p),p===filter?'active':'')).join('')}</div><p class="result-count">共 ${filtered.length} 位人物</p><div class="people-grid">${filtered.map(personCard).join('')}</div>${!filtered.length?'<div class="empty-state">暂未找到相关人物，请尝试其他关键词。</div>':''}</section>`;
}
function personPage(id, query) {
  const p=people.find(p=>p.id===id); if(!p)return notFound();
  const tab=['life','stories','landmarks','media'].includes(query.get('tab'))?query.get('tab'):'life';
  const tabs=[['life','生平足迹'],['stories','红色故事'],['landmarks','红色印记'],['media','影像与资料']];
  let body='';
  if(tab==='life') body=`<div class="person-life"><aside class="archive-block"><div class="eyebrow">人物档案</div><h3>${esc(p.name)}</h3><dl><dt>生卒年</dt><dd>${p.birth}—${p.death||'至今'}</dd><dt>身份</dt><dd>${esc(p.identity)}</dd>${p.info?`<dt>籍贯</dt><dd>${esc(p.info.jiguan)}</dd>`:''}</dl></aside><div class="vertical-timeline">${p.timeline.map(t=>`<article><b>${esc(t.year)}</b><p>${esc(t.event)}</p></article>`).join('')}</div></div>`;
  if(tab==='stories')body=`<div class="story-accordion">${p.stories.map((s,i)=>`<details ${i===0?'open':''}><summary>${esc(s.title)}<span aria-hidden="true">＋</span></summary><p>${esc(s.content)}</p></details>`).join('')}</div>${STORIES.filter(s=>s.person===p.id).map(s=>link(`#/story/${s.id}`,'进入共读与微党课创作 →','button red')).join('')}`;
  if(tab==='landmarks')body=p.landmarks.length?`<div class="landmark-cards">${p.landmarks.map(l=>`<a href="#/map?place=${l.id}" class="landmark-card">${l.image?`<img src="${imgPath(l.image)}" alt="${esc(l.name)}" loading="lazy">`:''}<div><h3>${esc(l.name)}</h3><p>${esc(l.address)}</p><span class="text-link">在地图中查看 →</span></div></a>`).join('')}</div>`:`<div class="empty-state">在长征沿线与青岛红色地标中继续研学。${link('#/map','打开研学地图 →','text-link')}</div>`;
  if(tab==='media')body=`<p class="muted">通过官方或原始资料入口继续学习，影像在来源网站观看。</p><div class="resource-list">${(p.media||[]).map(m=>`<article><div><h3>${esc(m.title)}</h3><p>${esc(m.source)}</p></div>${external(m.url,'前往学习','text-link')}</article>`).join('')}${p.source?`<article><div><h3>${esc(source(p.source).title)}</h3><p>${esc(source(p.source).org)}</p></div>${external(source(p.source).url,'阅读原文','text-link')}</article>`:''}</div>`;
  return `${breadcrumb(p.name,'#/people','红色人物')}<section class="container person-hero"><div class="detail-photo ${p.photo?'':'archive-photo'}">${p.photo?`<img src="${imgPath(p.photo)}" alt="${esc(p.name)}">`:`<span>${esc(p.name.slice(-2))}</span><small>人物档案</small>`}</div><div><span class="tag">${esc(p.period)}</span><div class="person-title"><h1>${esc(p.name)}</h1><span>${p.birth}—${p.death||'至今'}</span></div><h2>${esc(p.identity)}</h2><p>${esc(p.summary||p.quote||'在时代的足迹中，读懂初心与信仰。')}</p></div></section><section class="container content-section"><nav class="detail-tabs" aria-label="人物详情">${tabs.map(([k,n])=>link(`#/person/${id}?tab=${k}`,n,tab===k?'active':'')).join('')}</nav><div class="detail-body">${body}</div>${p.source?sourceLine(p.source):`<div class="source-line">人物与地标资料整理自 ${external('https://github.com/rikki7777/qd-revolutionary-spirits','红韵青岛·数智传薪参考网站')}；可由“影像与资料”继续查阅原始来源。</div>`}</section>`;
}
function mapPage(query) {
  const chosen=landmarks.find(l=>l.id===query.get('place'));
  const region=chosen?.region || (query.get('region')==='青岛'?'青岛':'长征沿线');
  const search=query.get('q')||'';
  const visible=landmarks.filter(l=>l.region===region&&`${l.name}${l.address}`.includes(search));
  return `${pageHead('山河有记忆 · 行走有方向','把故事，放回它发生的地方','循着历史地标走近红色记忆。在出发前读懂故事，在实地研学中深化理解。')}<section class="container content-section"><div class="map-toolbar"><div class="filter-tabs">${['长征沿线','青岛'].map(r=>link(`#/map?region=${encodeURIComponent(r)}`,r,region===r?'active':'')).join('')}</div><form id="map-search" class="search-form"><input type="hidden" name="region" value="${region}"><label class="sr-only" for="map-query">搜索地标</label><input id="map-query" name="q" value="${esc(search)}" placeholder="搜索地标名称或地址"><button class="button red small">搜索</button></form></div><div class="landmark-map-layout"><div class="map-area"><div id="landmark-map" role="region" aria-label="${region}红色地标地图"></div><span class="map-region-label">${region} · 研学地标</span></div><aside class="map-list" aria-label="地标列表"><div class="map-list-heading">${visible.length} 处红色印记 <small>点击定位并阅读</small></div>${visible.map((l,i)=>`<button class="map-place ${l.id===chosen?.id?'selected':''}" data-place="${l.id}"><span>${String(i+1).padStart(2,'0')}</span><div><strong>${esc(l.name)}</strong><small>${esc(l.address)}</small></div><span aria-hidden="true">↗</span></button>`).join('')}${!visible.length?'<div class="empty-state">没有匹配的地标。</div>':''}</aside></div><div id="place-detail">${chosen?landmarkDetail(chosen):'<div class="map-hint">选择一个地标，阅读它的故事，或查看关联人物。</div>'}</div><p class="map-disclaimer">地图点位为研学示意。开放时间和预约安排请以场馆最新公告为准。坐标底图可离线显示，精确街道与出行导航可通过地标中的地图入口查看。</p></section>`;
}
function landmarkDetail(l) {
  const related=people.filter(p=>p.landmarks.some(a=>a.id===l.id));
  const story=STORIES.find(s=>s.landmark===l.id);
  return `<article class="place-detail">${l.image?`<img src="${imgPath(l.image)}" alt="${esc(l.name)}">`:''}<div><span class="eyebrow">${l.region} / 红色印记</span><h2>${esc(l.name)}</h2><p class="place-address">${esc(l.address)}</p><p>${esc(l.description)}</p><div class="place-actions">${external(`https://www.amap.com/search?query=${encodeURIComponent(l.name+' '+l.address)}`,'查看出行地图','button outline small')}${story?link(`#/story/${story.id}`,'阅读关联故事 →','text-link'):''}${related.map(p=>link(`#/person/${p.id}`,`走近${esc(p.name)} →`,'text-link')).join('')}</div></div></article>`;
}
function initMap(query) {
  if(!window.L) { $('#landmark-map').innerHTML='<p class="empty-state">地图暂不可用，仍可使用右侧地标列表。</p>'; return; }
  const chosen=landmarks.find(l=>l.id===query.get('place'));
  const region=chosen?.region || (query.get('region')==='青岛'?'青岛':'长征沿线');
  const visible=landmarks.filter(l=>l.region===region&&`${l.name}${l.address}`.includes(query.get('q')||''));
  const map=activeMap=L.map('landmark-map',{scrollWheelZoom:false,minZoom:4,maxZoom:17});
  map.attributionControl.addAttribution('省界：DataV.GeoAtlas | 研学点位为示意');
  const boundary=region==='青岛'&&qingdaoGeometry?qingdaoGeometry:provinces;
  if(boundary) {
    L.geoJSON(boundary,{style:{color:'#c9b99d',weight:1,fillColor:'#f4efe4',fillOpacity:1},interactive:false}).addTo(map);
    boundary.features.forEach(f=>{
      const point=f.properties.centroid||f.properties.center;
      if(point)L.marker([point[1],point[0]],{interactive:false,icon:L.divIcon({className:'map-area-name',html:esc(f.properties.name),iconSize:[90,20],iconAnchor:[45,10]})}).addTo(map);
    });
  }
  const tiles=L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>'});
  L.control.layers({}, {'在线街道底图（需联网）':tiles},{collapsed:false}).addTo(map);
  const markers=new Map();
  visible.forEach((l,i)=>{const marker=L.marker([l.lat,l.lng],{title:l.name,icon:L.divIcon({className:'landmark-pin',html:`<span><b>${i+1}</b></span>`,iconSize:[30,36],iconAnchor:[15,36],tooltipAnchor:[0,-38]})}).addTo(map);marker.bindTooltip(esc(l.name),{direction:'top'});marker.on('click',()=>select(l.id));markers.set(l.id,marker);});
  function select(id) {
    const l=visible.find(p=>p.id===id);if(!l)return;
    map.setView([l.lat,l.lng],region==='青岛'?11:6,{animate:false});
    markers.forEach(m=>m.closeTooltip());markers.get(id)?.openTooltip();
    $('#place-detail').innerHTML=landmarkDetail(l);
    document.querySelectorAll('[data-place]').forEach(b=>b.classList.toggle('selected',b.dataset.place===id));
    const selectedButton=main.querySelector(`[data-place="${id}"]`);
    if(selectedButton) {
      const list=$('.map-list');
      const rowTop=selectedButton.getBoundingClientRect().top-list.getBoundingClientRect().top+list.scrollTop;
      list.scrollTop=Math.max(0,rowTop-65);
    }
    const current=new URLSearchParams(location.hash.split('?')[1]||'');current.set('place',id);
    history.replaceState(null,'',`#/map?${current}`);
  }
  main.querySelectorAll('[data-place]').forEach(b=>b.addEventListener('click',()=>select(b.dataset.place)));
  if(visible.length)map.fitBounds(L.latLngBounds(visible.map(l=>[l.lat,l.lng])),{padding:[42,42],maxZoom:region==='青岛'?12:5});
  else map.setView(region==='青岛'?[36.15,120.4]:[31.5,108],region==='青岛'?10:5);
  if(chosen&&markers.has(chosen.id))select(chosen.id);
}
const studyTabs = tab => `<nav class="detail-tabs study-tabs" aria-label="研学栏目">${[['learn','学 · 理论与历史'],['stories','讲 · 故事与宣讲'],['practice','做 · 科研与实践'],['quiz','悟 · 研学自测']].map(([k,n])=>link(`#/study?tab=${k}`,n,k===tab?'active':'')).join('')}</nav>`;
function studyPage(query) {
  const tab=query.get('tab')||'learn';let body='';
  if(tab==='learn')body=`<div class="study-intro"><div><span class="eyebrow">建议学习顺序</span><h2>读原文，理脉络，谈体会</h2><p>先学习重要讲话，再沿着长征路线梳理历史，最后结合本职科研开展讨论。</p></div><div class="study-progress"><strong>${SOURCES.filter(s=>state.read.includes(s.id)).length}<small> / ${SOURCES.length}</small></strong><span>本机标记已读</span></div></div><div class="resource-list">${SOURCES.map((s,i)=>`<article><span class="resource-number">${String(i+1).padStart(2,'0')}</span><div class="resource-content"><span class="tag">${s.type}</span><h3>${s.title}</h3><p>${s.desc}</p><small>${s.org} · ${s.date}</small></div><div class="resource-actions">${external(s.url,'前往学习','text-link')}<button class="read-toggle ${state.read.includes(s.id)?'is-read':''}" data-read="${s.id}" aria-pressed="${state.read.includes(s.id)}">${state.read.includes(s.id)?'✓ 已读':'标记已读'}</button></div></article>`).join('')}</div><div class="soft-callout"><h3>带着问题学</h3><p>长征中的独立自主、实事求是，如何体现到我们的研究设计与实验验证中？</p>${link('#/notebook','记录我的学习体会 →','text-link')}</div>`;
  else if(tab==='stories')body=`<div class="study-intro"><div><span class="eyebrow">一堂可讲、可演、便于传播的微党课</span><h2>从一个细节，讲清一种精神</h2><p>阅读故事，核对来源，用自己的语言连接历史与当下。</p></div></div><div class="stories-grid">${STORIES.map((s,i)=>`<a href="#/story/${s.id}" class="story-library-card"><div class="story-cover cover-${i}">${s.image?`<img src="${s.image}" alt="今天的泸定桥" loading="lazy">`:`<span>${['初心','信仰','','报国'][i]}</span>`}<small>${s.tag}</small></div><div class="story-library-body"><span class="person-years">${s.period}</span><h3>${s.title} ${arrow}</h3><p>${s.intro}</p><small>${s.minutes} 分钟共读 · 可导出宣讲提纲</small></div></a>`).join('')}</div>`;
  else if(tab==='practice')body=practicePanel();
  else if(tab==='quiz')body=`<div class="study-intro"><div><span class="eyebrow">四个问题 · 检验理解</span><h2>回望来时路，想想脚下路</h2><p>自测仅用于个人研学，不计入支部活动或考核成绩。</p></div></div><form id="quiz-form" class="quiz-form">${QUIZ.map((q,i)=>`<fieldset><legend><span>0${i+1}</span>${q.q}</legend>${q.options.map((o,j)=>`<label><input type="radio" name="q${i}" value="${j}" required> ${o}</label>`).join('')}<div class="quiz-feedback" id="feedback-${i}"></div></fieldset>`).join('')}<button class="button red">查看研学反馈 →</button><div id="quiz-result" role="status"></div></form>`;
  else return notFound();
  return `${pageHead('学一段历史 · 讲一个故事 · 攻一个难题','在学思践悟中，接续精神的火种','将理论学习、主题宣讲与实践转化贯通起来，让学习留下思考，让行动留下足迹。')}<section class="container content-section">${studyTabs(tab)}${body}</section>`;
}
function practicePanel() {
  return `<div class="study-intro"><div><span class="eyebrow">把论文写在祖国大地上</span><h2>为一个真问题，走一段自己的长征</h2><p>选择一个具体瓶颈，写下可验证的目标与下一步行动。这里的记录保存在当前浏览器中。</p></div></div><div class="practice-layout"><aside class="practice-guidance"><h3>一份攻关计划的四个支点</h3><ol><li><strong>真问题</strong><p>明确国家、行业或师生实际需要。</p></li><li><strong>硬骨头</strong><p>描述技术瓶颈、已知限制与失败原因。</p></li><li><strong>实证据</strong><p>设计可复核的实验，完整保留原始数据。</p></li><li><strong>共前行</strong><p>明确下一步分工、验证方法与阶段目标。</p></li></ol></aside><form id="challenge-form" class="editor-form"><label>攻关题目<input name="title" required maxlength="100" placeholder="例如：降低某模型在边缘设备上的推理延迟"></label><label>真实需求与当前瓶颈<textarea name="problem" required rows="4" maxlength="4000" placeholder="问题服务于谁？已有方案卡在什么地方？"></textarea></label><label>下一步行动与验证方式<textarea name="plan" required rows="4" maxlength="4000" placeholder="写下可执行的实验、评价指标与协作安排。"></textarea></label><label>当前阶段<select name="status"><option>问题梳理</option><option>方案验证</option><option>持续攻关</option><option>阶段完成</option></select></label><p class="form-note">请只填写适合保存在本机的内容。实际支部成果由支部核实后展示。</p><button class="button red">保存我的攻关计划 →</button></form></div><div class="section-heading small-heading"><h2>我的攻关记录</h2><button class="text-button" data-export="all">导出研学档案 ↓</button></div><div class="challenge-list">${state.challenges.length?state.challenges.map(challengeCard).join(''):'<div class="empty-state">还没有攻关记录。从一个明确的问题开始。</div>'}</div>`;
}
function challengeCard(c) { return `<article class="saved-card"><span class="tag">${esc(c.status)}</span><h3>${esc(c.title)}</h3><small>${esc(c.date)}</small><h4>问题与瓶颈</h4><p class="preserve-lines">${esc(c.problem)}</p><h4>行动与验证</h4><p class="preserve-lines">${esc(c.plan)}</p><div class="saved-actions"><label>更新阶段 <select data-status="${esc(c.id)}">${['问题梳理','方案验证','持续攻关','阶段完成'].map(s=>`<option ${s===c.status?'selected':''}>${s}</option>`).join('')}</select></label><button class="text-button muted" data-delete="challenge:${esc(c.id)}">删除此记录</button></div></article>`; }
function storyPage(id) {
  const s=STORIES.find(s=>s.id===id);if(!s)return notFound();
  const draft=state.drafts[s.id] || '';
  return `${breadcrumb(s.title,'#/study?tab=stories','红色故事')}<article class="container story-detail"><header><span class="tag">${s.tag}</span><h1>${s.title}</h1><p>${s.period} <span> / </span> 约 ${s.minutes} 分钟共读</p></header><div class="story-detail-layout"><div class="story-text">${s.image?`<figure><img src="${s.image}" alt="2012年拍摄的泸定桥"><figcaption>今天的泸定桥（2012年摄）· 山海风 / CC BY-SA 3.0</figcaption></figure>`:''}<p class="story-lead">${s.intro}</p>${s.paragraphs.map(p=>`<p>${p}</p>`).join('')}${sourceLine(s.source)}<div class="discussion"><h2>一起想一想</h2>${s.questions.map((q,i)=>`<p><b>0${i+1}</b>${q}</p>`).join('')}</div>${s.landmark?link(`#/map?place=${s.landmark}`,'在地图中寻找故事发生地 →','text-link'):''}${s.person?link(`#/person/${s.person}`,'查看关联人物档案 →','text-link'):''}</div><aside class="lecture-panel"><span class="eyebrow">从共读走向宣讲</span><h2>我的微党课</h2><p>以下为创作提纲，讲述前请对照来源核对史实。</p><ol>${s.outline.map(p=>`<li>${p}</li>`).join('')}</ol><label for="lecture-draft">补充我的讲述与实践联系</label><textarea id="lecture-draft" data-draft="${s.id}" rows="7" maxlength="12000" placeholder="写下你的开场、分工、表演设计或身边的实践故事……">${esc(draft)}</textarea><small id="draft-status">${draft?'已恢复本机草稿':'输入后自动保存在本机'}</small><button class="button red" data-outline="${s.id}">导出宣讲提纲 ↓</button></aside></div></article>`;
}
function notebookPage() {
  return `${pageHead('每一次思考 · 都是一次抵达','我的研学手记','保存学习体会、整理攻关计划，把这段研学路上的所思所悟带走。')}<section class="container content-section"><div class="storage-notice">${storageAvailable?'记录仅保存在当前浏览器，不会上传。更换设备或清理浏览器数据前，请先导出备份。':'浏览器存储暂不可用。记录只在当前页面会话保留，请及时导出。'}<button class="text-button" data-export="all">导出全部记录 ↓</button></div><div class="notebook-layout"><form id="note-form" class="editor-form"><h2>记下今天的思考</h2><label>标题<input name="title" required maxlength="100" placeholder="今天最触动我的一个细节"></label><label>学习体会<textarea name="content" required rows="8" maxlength="12000" placeholder="我学到了什么？这与我的学习、科研和服务实践有什么联系？"></textarea></label><label>关联主题<select name="topic"><option>长征历史</option><option>红色故事</option><option>科研报国</option><option>支部实践</option></select></label><button class="button red">保存研学手记 →</button></form><div><h2 class="saved-heading">已保存的手记 <small>${state.notes.length} 篇</small></h2><div class="notes-list">${state.notes.length?state.notes.map(n=>`<article class="saved-card"><span class="tag">${esc(n.topic)}</span><h3>${esc(n.title)}</h3><small>${esc(n.date)}</small><p class="preserve-lines">${esc(n.content)}</p><button class="text-button muted" data-delete="note:${esc(n.id)}">删除此手记</button></article>`).join(''):'<div class="empty-state">第一篇手记，留给今天的新发现。</div>'}</div></div></div>${state.challenges.length?`<div class="section-heading small-heading"><h2>我的科研攻关</h2>${link('#/study?tab=practice','继续记录 →','text-link')}</div><div class="challenge-list">${state.challenges.map(challengeCard).join('')}</div>`:''}</section>`;
}
function aboutPage() {
  return `${pageHead('学在支部 · 做在支部','让信仰之火，在青春中接续','以数字技术连接历史与当下，以实际行动回答青年党员的时代课题。')}<section class="container content-section"><div class="about-intro"><div class="about-seal" aria-hidden="true">学<br>做</div><div><div class="eyebrow">我们的支部</div><h2>${esc(SITE.branch)}</h2><p>本网站围绕“${esc(SITE.theme)}”主题，面向支部主题党日与自主研学，将长征路线、红色人物、学习资料和实践记录连接起来。</p><p>庆祝中国共产党成立105周年，纪念红军长征胜利90周年。通过“学一段长征历史、讲一个红色故事、攻一个科研难题”，探索学思践悟、知行合一的学习方式。</p></div></div><div class="about-values">${[['以学铸魂','读原文、学党史，在历史中坚定理想信念。'],['以讲传薪','讲好有史料依据的故事，让红色文化可感可知。'],['以做践行','坚持实事求是，在科研攻关和服务实践中担当。']].map(([t,p])=>`<article><h3>${t}</h3><p>${p}</p></article>`).join('')}</div><div class="section-heading small-heading"><h2>支部活动与作品</h2><span class="muted">记录真实发生的学习与行动</span></div>${SITE.activities.length?`<div class="activity-grid">${SITE.activities.map(a=>`<article>${a.image?`<img src="${esc(a.image)}" alt="${esc(a.title)}" loading="lazy">`:''}<h3>${esc(a.title)}</h3><small>${esc(a.date)}</small><p>${esc(a.description)}</p></article>`).join('')}</div>`:'<div class="empty-state activity-empty"><span aria-hidden="true">▧</span><h3>让真实的行动，成为最好的记录</h3><p>支部活动照片、宣讲作品与阶段成果将在整理核实后展示。</p><p>现在可以先记录个人学习体会与科研攻关计划。</p>'+link('#/notebook','写下我的研学体会 →','text-link')+'</div>'}${SITE.works.length?`<div class="resource-list">${SITE.works.map(w=>`<article><div><h3>${esc(w.title)}</h3><p>${esc(w.description)}</p></div>${external(w.url,'查看作品','text-link')}</article>`).join('')}</div>`:''}<div class="about-credit"><h3>关于这个数字研学空间</h3><p>网站参考“红韵青岛·数智传薪”的人物与地标结构，整合 wanli-trail 长征沙盘，并按本支部主题组织学习与实践内容。</p>${link('#/sources','查看资料与项目来源 →','text-link')}${SITE.contact?`<p>联系：${esc(SITE.contact)}</p>`:''}</div></section>`;
}
function sourcesPage() {
  return `${pageHead('有所本 · 有所据','内容与项目来源','史实以官方文献为依据。参考代码、图片和地图数据在此标明来源。')}<section class="container content-section"><h2>学习资料与史实依据</h2><div class="resource-list">${SOURCES.map(s=>`<article><div><h3>${s.title}</h3><p>${s.org} · ${s.date}</p></div>${external(s.url,'查看原文','text-link')}</article>`).join('')}</div><h2 class="small-heading">参考网站与长征沙盘</h2><div class="source-project"><h3>红韵青岛·数智传薪</h3><p>人物与地标结构、六位青岛人物资料及相关图片参考用户提供的介绍文档与原网站。原支部活动照片、二维码与活动成果未用于本支部展示。</p>${external('https://rikki7777.github.io/qd-revolutionary-spirits/index.html','参考网站')}${external('https://github.com/rikki7777/qd-revolutionary-spirits','代码仓库')}</div><div class="source-project"><h3>wanli-trail · 红军长征沙盘</h3><p>作者：nova-fable。以本地静态构建方式整合四路红军路线、时间轴与事件讲解。上游版本 df333333b57fde628e7709311810144ff4caebf0，源代码保存在 vendor/wanli-trail。沙盘史实数据与坐标的说明见上游文档。</p>${external('https://github.com/nova-fable/wanli-trail','代码与文档')}</div><h2 class="small-heading">图片与地图</h2><div class="source-project"><h3>泸定桥照片</h3><p>摄影：山海风，2012年8月6日。来自 Wikimedia Commons，许可为 CC BY-SA 3.0。本站进行了尺寸压缩、页面裁切与色彩叠加；图片及其改编遵循原许可。首页展示的是当代实景。</p>${external('https://commons.wikimedia.org/wiki/File:%E6%B3%B8%E5%AE%9A%E6%A1%A5_-_panoramio_(2).jpg','图片原始页面')}${external('https://creativecommons.org/licenses/by-sa/3.0/','CC BY-SA 3.0')}</div><div class="source-project"><h3>地图与组件</h3><p>省级边界：DataV.GeoAtlas。交互地图：Leaflet（BSD-2-Clause）。可选在线街道底图：OpenStreetMap 贡献者（ODbL）。长征路线为关键航点近似连线，用于历史研学示意。</p>${external('https://datav.aliyun.com/portal/school/atlas/area_selector','DataV.GeoAtlas')}${external('https://leafletjs.com/','Leaflet')}${external('https://www.openstreetmap.org/copyright','OpenStreetMap')}</div></section>`;
}
function notFound(){return `${pageHead('继续探索','这条路径还没有足迹','可以从首页重新开始，或沿着长征沙盘继续前行。')}<div class="container content-section">${link('#/','返回首页','button red')}</div>`;}

function exportAll() {
  const records=[`# ${SITE.name} · 我的研学档案`,`支部：${SITE.branch}`,`导出时间：${new Date().toLocaleString('zh-CN')}`,'## 学习记录',...SOURCES.filter(s=>state.read.includes(s.id)).map(s=>`- 已读：${s.title}\n  ${s.url}`),'## 研学手记',...state.notes.map(n=>`### ${n.title}\n${n.date} · ${n.topic}\n\n${n.content}`),'## 科研攻关',...state.challenges.map(c=>`### ${c.title}\n${c.date} · ${c.status}\n\n问题与瓶颈：\n${c.problem}\n\n行动与验证：\n${c.plan}`),'## 微党课创作',...Object.entries(state.drafts).filter(([,d])=>d).map(([id,d])=>`### ${STORIES.find(s=>s.id===id)?.title||id}\n${d}`)];
  download('征途薪火-我的研学档案.md',records.join('\n\n'));
}
function render({keepScroll=false}={}) {
  activeMap?.remove();activeMap=null;
  const raw=location.hash.replace(/^#\/?/,'');const [path,search]=raw.split('?');const query=new URLSearchParams(search||'');const [page='',id]=path.split('/');
  const known={ '':homePage,trail:trailPage,people:()=>peoplePage(query),person:()=>personPage(id,query),map:()=>mapPage(query),study:()=>studyPage(query),story:()=>storyPage(id),notebook:notebookPage,about:aboutPage,sources:sourcesPage };
  main.innerHTML=(known[page]||notFound)();
  const navKey=page==='person'?'people':page==='story'?'study':page||'home';
  document.querySelectorAll('[data-nav]').forEach(a=>{const selected=a.dataset.nav===navKey;a.classList.toggle('active',selected);if(selected)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
  document.title=`${({'':'首页',trail:'长征沙盘',people:'红色人物',person:people.find(p=>p.id===id)?.name,map:'研学地标',study:'学思践悟',story:STORIES.find(s=>s.id===id)?.title,notebook:'我的研学',about:'关于支部',sources:'内容来源'})[page]||'页面未找到'}｜${SITE.name}`;
  $('#main-nav').classList.remove('open');$('.menu-toggle').setAttribute('aria-expanded','false');
  document.body.classList.toggle('trail-page',page==='trail');
  if(page==='map')initMap(query);
  if(!keepScroll) { window.scrollTo(0,0); main.focus({preventScroll:true}); }
}
main.addEventListener('click',e=>{
  const read=e.target.closest('[data-read]');if(read){const id=read.dataset.read;state.read=state.read.includes(id)?state.read.filter(x=>x!==id):[...state.read,id];save();render({keepScroll:true});}
  const exp=e.target.closest('[data-export]');if(exp)exportAll();
  const outline=e.target.closest('[data-outline]');if(outline){const s=STORIES.find(s=>s.id===outline.dataset.outline);download(`${s.title}-微党课提纲.md`,[`# ${s.title} · 微党课创作提纲`,`适用：${SITE.branch}`,'## 讲述提纲',...s.outline.map((x,i)=>`${i+1}. ${x}`),'## 我的补充',state.drafts[s.id]||'（尚未填写）','## 核对史料',source(s.source).title,source(s.source).url,'提示：这是创作提纲，正式讲述前请核对史实。'].join('\n\n'));}
  const del=e.target.closest('[data-delete]');if(del){const [kind,id]=del.dataset.delete.split(':');const key=kind==='note'?'notes':'challenges';const item=state[key].find(x=>x.id===id);state[key]=state[key].filter(x=>x.id!==id);save();render({keepScroll:true});toast('已删除记录');lastDeleted={key,item};const undo=document.createElement('button');undo.textContent='撤销';undo.onclick=()=>{if(!lastDeleted?.item)return;state[lastDeleted.key].unshift(lastDeleted.item);lastDeleted=null;save();render({keepScroll:true});toast('已恢复记录');};$('#toast').append(undo);}
});
let lastDeleted=null;
main.addEventListener('input',e=>{if(e.target.matches('[data-draft]')){state.drafts[e.target.dataset.draft]=e.target.value;const ok=save();$('#draft-status').textContent=ok?'草稿已保存在本机':'草稿未能保存，请导出备份';}});
main.addEventListener('change',e=>{if(e.target.matches('[data-status]')){const c=state.challenges.find(c=>c.id===e.target.dataset.status);if(c){c.status=e.target.value;save();render({keepScroll:true});toast('阶段已更新');}}});
main.addEventListener('submit',e=>{
  e.preventDefault();const form=e.target;const data=new FormData(form);
  if(form.id==='people-search')location.hash=`/people?q=${encodeURIComponent(data.get('q').trim())}`;
  if(form.id==='map-search')location.hash=`/map?region=${encodeURIComponent(data.get('region'))}&q=${encodeURIComponent(data.get('q').trim())}`;
  const recordMeta=()=>({id:globalThis.crypto?.randomUUID?.()||`${Date.now()}-${Math.random().toString(36).slice(2)}`,date:new Date().toLocaleDateString('zh-CN')});
  if(form.id==='note-form') { if(!data.get('title').trim()||!data.get('content').trim()){toast('请填写标题和学习体会');return;}state.notes.unshift({...recordMeta(),title:data.get('title').trim(),content:data.get('content').trim(),topic:data.get('topic')});const ok=save();render({keepScroll:true});toast(ok?'手记已保存在本机':'手记保留在当前会话，请导出备份');}
  if(form.id==='challenge-form'){if(['title','problem','plan'].some(k=>!data.get(k).trim())){toast('请完整填写题目、瓶颈与行动计划');return;}state.challenges.unshift({...recordMeta(),title:data.get('title').trim(),problem:data.get('problem').trim(),plan:data.get('plan').trim(),status:data.get('status')});const ok=save();render({keepScroll:true});toast(ok?'攻关计划已保存在本机':'计划保留在当前会话，请导出备份');}
  if(form.id==='quiz-form'){let correct=0;QUIZ.forEach((q,i)=>{const ok=Number(data.get(`q${i}`))===q.answer;if(ok)correct++;$(`#feedback-${i}`).innerHTML=`<strong>${ok?'✓ 理解正确':'再想一想'}</strong><p>${q.explain}</p>`;});$('#quiz-result').innerHTML=`<h3>本次答对 ${correct} / ${QUIZ.length} 题</h3><p>把新的理解写进手记，让知识与行动相连。</p>${link('#/notebook','写一篇研学手记 →','text-link')}`;}
});
$('.menu-toggle').addEventListener('click',()=>{const open=$('#main-nav').classList.toggle('open');$('.menu-toggle').setAttribute('aria-expanded',String(open));});
document.querySelectorAll('[data-branch]').forEach(el=>el.textContent=SITE.branch);
async function boot() {
  try {
    const [qd,r,g,districts]=await Promise.all([fetch('js/qingdao.json').then(r=>{if(!r.ok)throw Error('人物数据加载失败');return r.json();}),fetch('js/routes.json').then(r=>r.ok?r.json():{}),fetch('assets/china-provinces.json').then(r=>r.ok?r.json():null).catch(()=>null),fetch('assets/qingdao-districts.json').then(r=>r.ok?r.json():null).catch(()=>null)]);
    people=[...EXTRA_PEOPLE,...qd];routes=r;provinces=g;qingdaoGeometry=districts;
    landmarks=[...MARCH_LANDMARKS,...qd.flatMap(p=>p.landmarks.map(l=>({...l,lat:l.coordinates.lat,lng:l.coordinates.lng,region:'青岛'})))];
    landmarks=landmarks.filter((l,i,arr)=>arr.findIndex(x=>x.id===l.id)===i);
    window.addEventListener('hashchange',()=>render());render();
  } catch(error) { main.innerHTML=`<section class="container content-section"><h1>研学资料暂未加载</h1><p>请通过本地 HTTP 服务打开网站，并确认已完成构建。</p><p>${esc(error.message)}</p><button class="button red" onclick="location.reload()">重新加载</button></section>`; }
}
boot();
