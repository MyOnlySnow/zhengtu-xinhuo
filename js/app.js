import { SITE } from './config.js';
import { REPOSITORIES, MARCH_RESOURCES } from './repositories.js';
import { SOURCES, EVENTS, STORIES as STORY_DATA, PEOPLE, LANDMARKS, CASES, SPEECHES, QUIZ, TOPICS, LEARNING_PATHS, normalizePerson, normalizeStory, normalizeLandmark } from './catalog.js';
import { REGION_SHORTCUTS, matchesContent, storySections, storyLength } from './explore.js';
import { caseLength } from './case-details.js';
import { QUIZ_TOPICS, QUIZ_TYPES, drawQuiz, questionResult, gradeQuiz } from './quiz.js';
const STORIES=STORY_DATA.map(normalizeStory);

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
const sourceLine = (ids, prominent=false) => {
  const list=(Array.isArray(ids)?ids:[ids]).filter(Boolean).map(id=>SOURCES.find(s=>s.id===id)).filter(Boolean);
  return list.length?`<div class="source-line ${prominent?'original-reading':''}"><strong>资料来源与完整原文</strong>${prominent?'<p class="original-reading-intro">点击资料标题，在原发布页面完整阅读。下方的本站研学整理可作为共读参考。</p>':''}${list.map(s=>`<p>${external(s.url, esc(s.title))}<small>${esc(s.org)} · ${esc(s.date)}</small></p>`).join('')}</div>`:'';
};
const copyrightNotice = () => `<div class="copyright-notice"><p>如侵犯版权，请联系管理员进行删除。</p><p>${external(SITE.copyrightContactUrl,'联系管理员 · 版权反馈','text-link')}<small>通过 GitHub 提交反馈，需登录 GitHub。请注明涉及的页面、材料与权利归属。</small></p></div>`;
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
  return `<a class="person-card" href="#/person/${p.id}"><div class="person-photo ${p.photo?'':'archive-photo'}">${p.photo?`<img src="${imgPath(p.photo)}" alt="${esc(p.name)}" style="object-position:${esc(p.objectPosition||'center 24%')}" loading="lazy">`:`<span class="archive-full-name" aria-hidden="true">${esc(p.name)}</span><small>${esc(p.theme||p.period)} · 人物档案</small>`}<span class="photo-period">${esc(p.province||p.period)}${p.city?' · '+esc(p.city):''}</span></div><div class="person-card-body"><span class="person-years">${p.birth}—${p.death||'至今'}</span><h3>${esc(p.name)} ${arrow}</h3><p>${esc(p.identity)}</p><span class="person-description">${esc(p.summary||p.stories?.[0]?.title||'走近时代人物，理解信仰与选择。')}</span><div class="card-tags">${(p.tags||[]).slice(0,2).map(t=>`<span>${esc(t)}</span>`).join('')}</div></div></a>`;
}
function filterPanel({path,query,items,label='内容',hidden={}}) {
  const region=query.get('region')||'全国';
  const theme=query.get('theme')||'全部';
  const topics=[...new Set(items.map(x=>x.theme||x.period).filter(Boolean))];
  const regions=[...new Set([...REGION_SHORTCUTS,...items.map(x=>x.province).filter(Boolean)])];
  const url=(key,value)=>{const p=new URLSearchParams(query);Object.entries(hidden).forEach(([k,v])=>p.set(k,v));p.delete('place');p.set(key,value);return `#/${path}?${p}`;};
  return `<div class="explore-filters"><form data-explore="${path}" class="explore-search">${Object.entries(hidden).map(([k,v])=>`<input type="hidden" name="${k}" value="${esc(v)}">`).join('')}<input type="hidden" name="region" value="${esc(region)}"><input type="hidden" name="theme" value="${esc(theme)}"><label class="sr-only" for="explore-query">搜索${label}</label><input id="explore-query" name="q" value="${esc(query.get('q')||'')}" placeholder="搜索姓名、故事、主题或地区"><button class="button red small">搜索</button></form><div class="filter-row"><span>主题</span><div>${['全部',...topics].map(t=>link(url('theme',t),esc(t),theme===t?'selected':'')).join('')}</div></div><div class="filter-row region-filter"><span>地区</span><div>${regions.map(r=>link(url('region',r),esc(r),region===r?'selected':'')).join('')}</div></div><p class="filter-description">地区按主要事迹发生地或研学地标筛选，包含青岛与即墨；可组合关键词和主题。</p></div>`;
}
function contentCard(s,i=0) {
  const subject=people.find(p=>p.id===s.person);
  const image=s.image||subject?.photo;
  const symbols={'长征岁月':'远征','革命岁月':'铭记','建设年代':'奉献','科教报国':'求真','新时代':'担当'};
  return `<a href="#/story/${s.id}" class="story-library-card"><div class="story-cover tone-${i%5}">${image?`<img src="${imgPath(image)}" alt="${esc(s.image?s.imageAlt||s.title:subject.name)}" style="object-position:${esc(subject?.objectPosition||'center 24%')}" loading="lazy">`:`<span>${symbols[s.theme]||s.tag||'薪火'}</span>`}<small>${esc(s.theme||s.tag)} / ${esc(s.province||'全国')}</small><b>${storyLength(s)>1400?'深度阅读':'故事共读'}</b></div><div class="story-library-body"><span class="person-years">${esc(s.period)}</span><h3>${esc(s.title)} ${arrow}</h3><p>${esc(s.intro)}</p><small>${Math.max(s.minutes||0,Math.ceil(storyLength(s)/280))} 分钟 · ${storyLength(s)} 字 · 含史料原文与宣讲提纲</small></div></a>`;
}
function homeTopics() {
  return `<section class="container home-collections"><div class="catalog-intro"><div><span class="eyebrow">四个专题 · 一脉薪火</span><h2>把一段历史，读成一份力量</h2></div><p><strong>${people.length}</strong> 位人物 <i>/</i> <strong>${STORIES.length}</strong> 篇故事 <i>/</i> <strong>${CASES.length}</strong> 个案例</p></div><div class="topic-grid">${TOPICS.map(t=>`<a href="${t.route}" class="topic-card topic-${t.className}"><span class="topic-symbol" aria-hidden="true">${t.symbol}</span><div><small>${t.label}</small><h3>${t.title}</h3><p>${t.intro}</p><span class="topic-enter">进入专题 →</span></div></a>`).join('')}</div></section>`;
}
function homePage() {
  return `<section class="hero"><div class="hero-photo" role="img" aria-label="今天的泸定桥，2012年摄，山海风摄影"></div><div class="hero-lines" aria-hidden="true"></div><div class="container hero-inner"><div class="hero-copy"><div class="hero-kicker"><span></span> 庆祝建党105周年 · 纪念长征胜利90周年</div><h1>循着信仰的足迹<br>走好<span>我们的长征</span></h1><p>从万水千山的历史回响，到青春报国的时代答卷。<br>精读长征史料，走近时代榜样，让每一次学习走向真实行动。</p><div class="hero-actions">${link('#/trail','重走长征路 <span aria-hidden="true">→</span>','button light')}${link('#/study','开启主题研学 ↗','hero-secondary')}</div><div class="hero-branch">${esc(SITE.branch)}</div></div><div class="hero-caption"><span>坐标 · 泸定桥</span><strong>万水千山，只等闲。</strong><small>历史坐标 · 1935 / 实景影像 · 2012</small></div></div><div class="hero-bottom container"><span>红色铸魂 / 数智传薪</span><span>向下探索 ↓</span></div></section>
  <div class="anniversary-strip"><div class="container"><span><b>1921 — 2026</b> 初心如磐</span><i>★</i><span>学一段历史 · 讲一个故事 · 攻一个难题</span><i>★</i><span><b>1936 — 2026</b> 征途如虹</span></div></div>
  <section class="container section digital-hub"><div class="section-heading"><div><div class="eyebrow">数字研学馆 · 换个视角看历史</div><h2>循着地图，走进历史现场</h2></div>${link('#/trail?mode=resources','探索全部体验 <span aria-hidden="true">↗</span>','text-link')}</div><p class="section-intro">看一段行军路线，推演一次关键抉择，走进一条保存记忆的街巷。</p>${marchResourceCards(true)}</section>
  ${homeTopics()}
  <section class="route-section"><div class="container route-layout"><div class="route-preview">${routeMap()}<div class="army-legend">${ARMY_NAMES.map((n,i)=>`<span><i style="background:${ARMY_COLORS[i]}"></i>${n}</span>`).join('')}</div></div><div class="route-copy"><div class="eyebrow">一张地图 · 万里征途</div><h2>让历史的足迹<br>在眼前徐徐展开</h2><p>从于都出发，到三大主力会师。沿着四路红军的行军轨迹，走近一次次抉择、一场场战斗与一份份坚守。</p><div class="route-features"><span>四路红军路线</span><span>历史事件讲解</span><span>时间轴自由探索</span><span>纪录片式播放</span></div>${link('#/trail','进入长征沙盘 <span aria-hidden="true">→</span>','button red')}<small class="route-footnote">基于 wanli-trail 交互沙盘 · 关键地点近似坐标</small></div></div></section>
  <section class="container section"><div class="section-heading"><div><div class="eyebrow">循着榜样 · 读懂初心</div><h2>时代不同，信仰一脉相承</h2></div>${link('#/people','走近红色人物 →','text-link')}</div><div class="people-grid home-people">${['xuhaidong','jiaoyulu','zhangguimei','qianxuesen'].map(id=>personCard(people.find(p=>p.id===id))).join('')}</div></section>
  <section class="container featured-reading expanded-featured"><div class="reading-mark" aria-hidden="true">学</div><div><div class="eyebrow">总书记重要讲话 · 读原文，悟原理</div><h2>把精神的力量，读进心里</h2><p>长征精神 · 科技创新 · 青年成长 · 党史学习</p><span>${SPEECHES.length} 篇权威讲话 / 标明时间、场合与官方出处</span></div>${link('#/speeches','进入重要讲话栏目 →','button outline')}</section>
  <section class="container section story-section"><div class="section-heading"><div><div class="eyebrow">见人见事 · 见精神</div><h2>让红色故事，抵达心间</h2></div>${link('#/study?tab=stories','阅读全部故事 →','text-link')}</div><div class="home-stories">${STORIES.filter(s=>['chishui-evidence','yihai-trust','red25-pioneer'].includes(s.id)).map((s,i)=>`<a class="story-teaser" href="#/story/${s.id}"><span class="story-number">0${i+1}</span><div><span class="tag">${s.tag}</span><h3>${s.title}</h3><p>${s.intro}</p><small>${s.minutes} 分钟共读 · 含宣讲提纲</small></div>${arrow}</a>`).join('')}</div></section>
  <section class="container section home-case-section"><div class="section-heading"><div><div class="eyebrow">从历史的精神 · 到今天的创造</div><h2>一项成果背后，是怎样的探索</h2></div>${link('#/cases','全部典型案例 →','text-link')}</div><div class="cases-grid">${CASES.slice(0,3).map(caseCard).join('')}</div></section><section class="container section home-path-section">${learningOverview()}</section><section class="practice-banner"><div class="container"><div><div class="eyebrow">今天，我们这样接过火炬</div><h2>科研路上，也有我们的“长征”</h2><p>记下一个真问题，形成一份攻关计划，留下每一次实事求是的探索。</p></div>${link('#/study?tab=practice','写下我的攻关计划 →','button light')}</div></section>`;
}
function marchResourceCards(home=false) {
  const resources=home?MARCH_RESOURCES.slice(0,3):MARCH_RESOURCES;
  const artwork=['march-footprints','march-campaign','hadapu-street','march-footprints'];
  return `<div class="march-resource-grid ${home?'home-resource-grid':''}">${resources.map((r,i)=>`<article class="march-resource-card resource-${i}"><a class="resource-art" href="${esc(r.href)}" ${r.href.startsWith('https:')?'target="_blank" rel="noopener noreferrer"':''} aria-label="进入${esc(r.title)}"><img src="assets/illustrations/${artwork[i]}.svg" alt="" loading="lazy"><span class="resource-art-index">${String(i+1).padStart(2,'0')} / ${['足迹','战役','旧址','路线'][i]}</span><span class="resource-art-arrow" aria-hidden="true">↗</span></a><div class="resource-card-content"><span class="tag">${esc(r.label)}</span><h3>${esc(r.title)}</h3><p>${esc(r.description)}</p><div class="march-resource-actions">${r.href.startsWith('#/')?link(r.href,esc(r.action)+' →','button red small'):external(r.href,esc(r.action),'button red small')}${home?'':external(r.repo,'源码与说明','text-link')}</div>${home?'':`<small>${esc(r.note)}</small>`}</div></article>`).join('')}</div>`;
}
function trailPage(query) {
  const mode=['overview','footprints','resources'].includes(query.get('mode'))?query.get('mode'):'overview';
  const footprints=mode==='footprints';
  const frame=footprints?'footprints/index.html?period=march&view=browse&lang=zh-CN':'trail/index.html';
  const title=footprints?'毛主席足迹地图与长征时期年表':'四路红军长征交互沙盘';
  const tabs=[['overview','四路红军全景'],['footprints','长征足迹年表'],['resources','更多数字研学']];
  return `${breadcrumb('长征沙盘')}<section class="container trail-heading"><div><div class="eyebrow">山河为卷 · 足迹为证</div><h1>重走长征路</h1></div>${mode!=='resources'?`<div><a class="button outline small" href="${frame}" target="_blank" rel="noopener">独立窗口打开 ↗</a></div>`:''}</section><div class="container"><nav class="detail-tabs march-tabs" aria-label="长征研学体验">${tabs.map(([key,label])=>`<a href="#/trail?mode=${key}" class="${mode===key?'active':''}" ${mode===key?'aria-current="page"':''}>${label}</a>`).join('')}</nav>${mode==='resources'?`<div class="march-intro"><h2>从路线、战役到一条历史街巷</h2><p>选择一个角度继续探索，再回到史料与故事中核对。原站体验将在新标签页打开。</p></div>${marchResourceCards()}`:`<p class="trail-intro">${footprints?'已定位1934—1936年的长征时期。点击左侧年表同步地图和事件，搜索地点与关键词，展开“资料出处”继续阅读。手机可用“年表”按钮打开列表。':'选择“开始演示”跟随历史进程，或用“自由探索”查看全部路线。手机可左右滑动沙盘顶部工具栏；点击“红军部队”可折叠图例。'}</p><iframe class="trail-frame ${footprints?'footprints-frame':''}" src="${frame}" title="${title}" allow="fullscreen" allowfullscreen></iframe><p class="map-disclaimer">${footprints?`足迹地图整合自 ${external('https://github.com/sansan0/mao-map','sansan0 / mao-map')}（GPL-3.0）。年表由社区整理，保留“来源待核查”等状态；本站校正了中央红军到达陕北等节点的日期口径。地图为近似航点，底图需联网。${link('footprints/ADAPTATIONS.md','版本与适配说明 →')}`:`沙盘整合自 ${external('https://github.com/nova-fable/wanli-trail','nova-fable / wanli-trail')}。路线连接近似考证航点，用于历史研学；底图需联网加载。${link('#/map','浏览研学地标 →')}`}</p>`}</div>${mode!=='resources'?`<section class="container section"><div class="section-heading small-heading"><div><div class="eyebrow">换一个角度，继续走近历史</div><h2>数字研学拓展</h2></div>${link('#/trail?mode=resources','查看全部体验 →','text-link')}</div>${marchResourceCards()}</section>`:''}<section class="container section"><div class="eyebrow">把历史串成一条线</div><h2>九个节点，读懂长征的关键进程</h2><div class="event-grid">${EVENTS.map((e,i)=>`<article><span>${String(i+1).padStart(2,'0')}</span><small>${e.date}</small><h3>${e.name}</h3><p>${e.desc}</p><b>${e.spirit}</b></article>`).join('')}</div>${sourceLine('history')}<div class="march-reading"><h3>沿着地图，读完整故事</h3><p>路线帮助建立方向感，详文讲述历史背景与完整经过。</p>${STORIES.filter(s=>s.theme==='长征岁月').map(s=>link(`#/story/${s.id}`,esc(s.title)+' →','text-link')).join('')}</div></section>`;
}
function peoplePage(query) {
  const q=new URLSearchParams(query);if(q.get('period')&&!q.get('theme'))q.set('theme',q.get('period'));
  const filtered=people.filter(p=>matchesContent(p,Object.fromEntries(q)));
  return `${pageHead('从长征岁月 · 到新时代','与榜样同行','把目光从身边延伸到祖国大地。沿着革命先驱、科学家与时代楷模的足迹，读懂信仰、求真与担当。')}<section class="container content-section">${filterPanel({path:'people',query:q,items:people,label:'人物姓名或身份'})}<div class="results-bar"><p>找到 <strong>${filtered.length}</strong> 位人物 <span>/ 共 ${people.length} 份档案</span></p>${link('#/people','清除筛选','text-link')}</div><div class="people-grid">${filtered.map(personCard).join('')}</div>${!filtered.length?'<div class="empty-state">没有匹配的档案。可清除筛选或更换地区、主题。</div>':''}</section>`;
}
function personPage(id, query) {
  const p=people.find(p=>p.id===id); if(!p)return notFound();
  const tab=['life','stories','landmarks','media'].includes(query.get('tab'))?query.get('tab'):'life';
  const tabs=[['life','生平足迹'],['stories','红色故事'],['landmarks','红色印记'],['media','影像与资料']];
  const related=STORIES.filter(s=>s.person===p.id);
  let body='';
  if(tab==='life') body=`<div class="person-life"><aside class="archive-block"><div class="eyebrow">人物档案</div><h3>${esc(p.name)}</h3><dl><dt>生卒年</dt><dd>${p.birth}—${p.death||'至今'}</dd><dt>身份</dt><dd>${esc(p.identity)}</dd><dt>事迹地区</dt><dd>${esc([p.province,p.city,p.district].filter(Boolean).join(' · '))}</dd>${p.info?`<dt>籍贯</dt><dd>${esc(p.info.jiguan)}</dd>`:''}</dl></aside><div class="vertical-timeline">${p.timeline.map(t=>`<article><b>${esc(t.year)}</b><p>${esc(t.event)}</p></article>`).join('')}</div></div>${related.length?`<div class="related-reading"><div class="eyebrow">沿着人物继续读</div>${related.map(st=>link(`#/story/${st.id}`,`${esc(st.title)} →`,'text-link')).join('')}</div>`:''}`;
  if(tab==='stories')body=`<div class="story-accordion">${p.stories.map((s,i)=>`<details ${i===0?'open':''}><summary>${esc(s.title)}<span aria-hidden="true">＋</span></summary>${String(s.content).split('\n').filter(Boolean).map(t=>`<p>${esc(t)}</p>`).join('')}${s.sourceIds?sourceLine(s.sourceIds):''}</details>`).join('')}</div>${related.map(st=>link(`#/story/${st.id}`,`阅读全文：${esc(st.title)} →`,'button red')).join('')}`;
  if(tab==='landmarks')body=p.landmarks.length?`<div class="landmark-cards">${p.landmarks.map(l=>`<a href="#/map?place=${l.id}" class="landmark-card">${l.image?`<img src="${imgPath(l.image)}" alt="${esc(l.name)}" loading="lazy">`:`<div class="landmark-symbol" aria-hidden="true">${esc(l.province||'印记')}</div>`}<div><h3>${esc(l.name)}</h3><p>${esc(l.address)}</p><span class="text-link">在地图中查看 →</span></div></a>`).join('')}</div>`:`<div class="empty-state">在全国红色与科教地标中继续研学。${link('#/map','打开研学地图 →','text-link')}</div>`;
  if(tab==='media')body=`<p class="muted">通过官方报道、人物史料和纪念馆入口继续学习。</p><div class="resource-list">${(p.media||[]).map(m=>`<article><div><h3>${esc(m.title)}</h3><p>${esc(m.source)}</p></div>${external(m.url,'前往学习','text-link')}</article>`).join('')}${p.sourceIds.map(id=>SOURCES.find(s=>s.id===id)).filter(Boolean).map(s=>`<article><div><h3>${esc(s.title)}</h3><p>${esc(s.org)} · ${esc(s.date)}</p></div>${external(s.url,'完整原文','text-link')}</article>`).join('')}</div>`;
  return `${breadcrumb(p.name,'#/people','人物故事')}<section class="container person-hero"><div class="detail-photo ${p.photo?'':'archive-photo'}">${p.photo?`<img src="${imgPath(p.photo)}" alt="${esc(p.name)}" style="object-position:${esc(p.objectPosition||'center 24%')}">`:`<span class="archive-full-name">${esc(p.name)}</span><small>人物档案</small>`}</div><div><span class="tag">${esc(p.theme||p.period)}</span><div class="person-title"><h1>${esc(p.name)}</h1><span>${p.birth}—${p.death||'至今'}</span></div><h2>${esc(p.identity)}</h2><p>${esc(p.summary||p.quote||'在时代的足迹中，读懂初心与信仰。')}</p><div class="card-tags">${[p.province,p.city,p.district,...(p.tags||[])].filter(Boolean).map(t=>`<span>${esc(t)}</span>`).join('')}</div></div></section><section class="container content-section"><nav class="detail-tabs" aria-label="人物详情">${tabs.map(([k,n])=>link(`#/person/${id}?tab=${k}`,n,tab===k?'active':'')).join('')}</nav><div class="detail-body">${body}</div>${p.photoCredit?`<div class="photo-credit">人物照片：${esc(p.photoCredit)} ${external(p.photoSource,'查看发布来源')}</div>`:''}${p.sourceIds.length?sourceLine(p.sourceIds):`<div class="source-line">人物与地标资料整理自 ${external('https://github.com/rikki7777/qd-revolutionary-spirits','红韵青岛·数智传薪参考网站')}；可由“影像与资料”继续查阅原始来源。</div>`}</section>`;
}
function mapState(query) {
  const params=new URLSearchParams(query);
  const chosen=landmarks.find(l=>l.id===params.get('place'));
  if(chosen){params.set('region',chosen.city==='青岛'?'青岛':chosen.province||'全国');params.delete('theme');params.delete('q');}
  return {params,chosen,visible:landmarks.filter(l=>matchesContent(l,Object.fromEntries(params)))};
}
function mapPage(query) {
  const {params,chosen,visible}=mapState(query);
  return `${pageHead('从地方记忆 · 到全国坐标','把故事，放回它发生的地方','在全国地图上关联人物、事件与纪念地。选择地区与主题，循着有出处的历史走近一个地方。')}<section class="container content-section">${filterPanel({path:'map',query:params,items:landmarks,label:'地标'})}<div class="landmark-map-layout"><div class="map-area"><div id="landmark-map" role="region" aria-label="全国红色与科教地标地图"></div><span class="map-region-label">${esc(params.get('region')||'全国')} · 研学地标</span></div><aside class="map-list" aria-label="地标列表"><div class="map-list-heading">${visible.length} 处研学地标 <small>点击定位并阅读</small></div>${visible.map((l,i)=>`<button class="map-place ${l.id===chosen?.id?'selected':''}" data-place="${l.id}"><span>${String(i+1).padStart(2,'0')}</span><div><strong>${esc(l.name)}</strong><small>${esc(l.address)}</small></div><span aria-hidden="true">↗</span></button>`).join('')}${!visible.length?'<div class="empty-state">没有匹配的地标。</div>':''}</aside></div><div id="place-detail">${chosen?landmarkDetail(chosen):'<div class="map-hint">选择地图标记或列表中的地点，展开故事与人物档案。</div>'}</div><p class="map-disclaimer">点位用于历史研学示意。实地参访前请核对场馆最新开放与预约安排；工作地、科研基地不等于面向公众开放的景点。出行导航可通过地标中的地图入口查看。</p></section>`;
}
function landmarkDetail(l) {
  const related=people.filter(p=>p.landmarks.some(a=>a.id===l.id)||(l.personIds||[]).includes(p.id));
  const stories=STORIES.filter(s=>s.landmark===l.id);
  return `<article class="place-detail">${l.image?`<img src="${imgPath(l.image)}" alt="${esc(l.name)}">`:''}<div><span class="eyebrow">${esc([l.province,l.city,l.district].filter(Boolean).join(' · '))} / ${esc(l.theme||l.region||'红色印记')}</span><h2>${esc(l.name)}</h2><p class="place-address">${esc(l.address)}</p><p>${esc(l.description)}</p>${l.visitNote?`<p>${esc(l.visitNote)}</p>`:''}<div class="place-actions">${external(`https://www.amap.com/search?query=${encodeURIComponent(l.name+' '+l.address)}`,'查看出行地图','button outline small')}${stories.map(st=>link(`#/story/${st.id}`,`${esc(st.title)} →`,'text-link')).join('')}${related.map(p=>link(`#/person/${p.id}`,`走近${esc(p.name)} →`,'text-link')).join('')}</div>${sourceLine(l.sourceIds)}</div></article>`;
}
function initMap(query) {
  if(!window.L) { $('#landmark-map').innerHTML='<p class="empty-state">地图暂不可用，仍可使用地标列表。</p>'; return; }
  const {params,chosen,visible}=mapState(query);
  const region=params.get('region')||'全国';
  const map=activeMap=L.map('landmark-map',{scrollWheelZoom:false,minZoom:3,maxZoom:17});
  map.attributionControl.addAttribution('省界：DataV.GeoAtlas | 研学点位为示意');
  const boundary=['青岛','即墨'].includes(region)&&qingdaoGeometry?qingdaoGeometry:provinces;
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
    map.setView([l.lat,l.lng],['青岛','即墨'].includes(region)?11:6,{animate:false});
    markers.forEach(m=>m.closeTooltip());markers.get(id)?.openTooltip();
    $('#place-detail').innerHTML=landmarkDetail(l);
    document.querySelectorAll('[data-place]').forEach(b=>{const selected=b.dataset.place===id;b.classList.toggle('selected',selected);b.setAttribute('aria-pressed',String(selected));});
    const selectedButton=main.querySelector(`[data-place="${id}"]`);
    if(selectedButton) { const list=$('.map-list');const rowTop=selectedButton.getBoundingClientRect().top-list.getBoundingClientRect().top+list.scrollTop;list.scrollTop=Math.max(0,rowTop-65); }
    const current=new URLSearchParams(params);current.set('place',id);history.replaceState(null,'',`#/map?${current}`);
  }
  main.querySelectorAll('[data-place]').forEach(b=>b.addEventListener('click',()=>select(b.dataset.place)));
  if(visible.length)map.fitBounds(L.latLngBounds(visible.map(l=>[l.lat,l.lng])),{padding:[42,42],maxZoom:['青岛','即墨'].includes(region)?12:5});
  else map.setView([34,106],4);
  if(chosen&&markers.has(chosen.id))select(chosen.id);
}
const studyTabs = tab => `<nav class="detail-tabs study-tabs" aria-label="研学栏目">${[['learn','学 · 理论与历史'],['stories','讲 · 故事与宣讲'],['practice','做 · 科研与实践'],['quiz','悟 · 研学自测']].map(([k,n])=>link(`#/study?tab=${k}`,n,k===tab?'active':'')).join('')}</nav>`;
function studyPage(query) {
  const tab=query.get('tab')||'learn';let body='';
  if(tab==='learn') {
    const kind=query.get('kind')||'精选';
    const selectIds=new Set(['speech','speech-longmarch80','speech-scientists','speech-tech2024','speech-pku2018','speech-youth2022','speech-centenary2021','history','video','wang']);
    const list=SOURCES.filter(s=>kind==='全部'||(kind==='精选'?selectIds.has(s.id):s.type===kind));
    body=`<div class="study-intro"><div><span class="eyebrow">读原文 · 理脉络 · 谈体会</span><h2>权威资料，按学习目标选择</h2><p>精选适合集体共读的讲话与党史入口。人物和故事的详细史料也可按类型查阅。</p></div><div class="study-progress"><strong>${SOURCES.filter(s=>state.read.includes(s.id)).length}<small> / ${SOURCES.length}</small></strong><span>本机标记已读</span></div></div><div class="filter-tabs source-type-tabs">${['精选','重要讲话','党史专题','人物史料','全部'].map(t=>link(`#/study?tab=learn&kind=${encodeURIComponent(t)}`,t,t===kind?'active':'')).join('')}</div><div class="resource-list">${list.map((s,i)=>`<article><span class="resource-number">${String(i+1).padStart(2,'0')}</span><div class="resource-content"><span class="tag">${esc(s.type)}</span><h3>${esc(s.title)}</h3><p>${esc(s.desc)}</p><small>${esc(s.org)} · ${esc(s.date)}</small></div><div class="resource-actions">${external(s.url,'前往学习','text-link')}<button class="read-toggle ${state.read.includes(s.id)?'is-read':''}" data-read="${s.id}" aria-pressed="${state.read.includes(s.id)}">${state.read.includes(s.id)?'✓ 已读':'标记已读'}</button></div></article>`).join('')}</div><div class="soft-callout"><h3>带着问题学</h3><p>长征中的独立自主、实事求是，如何体现到我们的研究设计与实验验证中？</p>${link('#/notebook','记录我的学习体会 →','text-link')}</div>`;
  }
  else if(tab==='stories') {
    const filtered=STORIES.filter(st=>matchesContent(st,Object.fromEntries(query)));
    body=`<div class="study-intro"><div><span class="eyebrow">有背景 · 有过程 · 有出处</span><h2>从一个故事，走进一段完整历史</h2><p>长征故事分章节展开；人物故事与科学报国案例按地区、主题关联。每篇提供原发布页全文入口与宣讲提纲。</p></div></div>${filterPanel({path:'study',query,items:STORIES,label:'故事',hidden:{tab:'stories'}})}<div class="results-bar"><p><strong>${filtered.length}</strong> 篇可读故事 <span>/ 共 ${STORIES.length} 篇</span></p>${link('#/study?tab=stories','清除筛选','text-link')}</div><div class="stories-grid expanded-stories">${filtered.map(contentCard).join('')}</div>${filtered.length?'':'<div class="empty-state">没有匹配的故事。试试其他主题或地区。</div>'}`;
  }
  else if(tab==='practice')body=practicePanel();
  else if(tab==='quiz')body=quizPanel();
  else return notFound();
  return `${pageHead('学一段历史 · 讲一个故事 · 攻一个难题','在学思践悟中，接续精神的火种','将理论学习、主题宣讲与实践转化贯通起来，让学习留下思考，让行动留下足迹。')}<section class="container content-section">${studyTabs(tab)}${tab==='learn'?learningOverview():''}${body}</section>`;
}
let quizSession=null;
function createQuizSession(topic='全部',count=10,questions=null) {
  return {topic,count,questions:questions||drawQuiz({topic,count}),responses:{},submitted:false,review:!!questions};
}
function quizAnswer(q) {
  return q.answers.map(i=>`${String.fromCharCode(65+i)}. ${q.options[i]}`).join('；');
}
function quizQuestion(q,i) {
  const selected=quizSession.responses[q.id]||[];
  const status=quizSession.submitted?questionResult(q,selected):'';
  return `<fieldset data-question="${q.id}" class="${status?`quiz-${status}`:''}"><legend><span>${String(i+1).padStart(2,'0')}</span>${esc(q.q)}</legend><div class="quiz-question-meta"><span class="tag">${esc(q.topic)}</span><span>${QUIZ_TYPES[q.type]}${q.type==='multiple'?' · 全部选对才得分':''}</span></div>${q.options.map((o,j)=>`<label class="${status&&q.answers.includes(j)?'is-answer':''} ${status&&selected.includes(j)&&!q.answers.includes(j)?'is-mistake':''}"><input type="${q.type==='multiple'?'checkbox':'radio'}" name="quiz-${q.id}" value="${j}" ${selected.includes(j)?'checked':''}><span class="quiz-option-letter">${String.fromCharCode(65+j)}.</span><span>${esc(o)}</span></label>`).join('')}<div class="quiz-feedback" id="quiz-feedback-${q.id}">${status?`<strong>${status==='correct'?'✓ 理解正确':status==='unanswered'?'○ 尚未作答':'再想一想'}</strong><p class="quiz-answer">正确答案：${esc(quizAnswer(q))}</p><p>${esc(q.explain)}</p><div class="quiz-reading">${link(q.reading.href,esc(q.reading.label)+' →','text-link')}${q.sourceIds.map(id=>external(source(id).url,esc(source(id).title),'quiz-evidence')).join('')}</div>`:''}</div></fieldset>`;
}
function quizSummary() {
  if(!quizSession.submitted)return '';
  const {questions,responses}=quizSession;
  const score=gradeQuiz(questions,responses);
  const retry=score.wrong+score.unanswered;
  return `<h3>本次答对 ${score.correct} / ${questions.length} 题</h3><p>答对 ${score.correct} 题 · 答错 ${score.wrong} 题 · 未答 ${score.unanswered} 题。${retry?'可回看逐题解析，或单独重练需要巩固的题目。':'本轮全部答对，可以换一组继续巩固。'}</p><div class="quiz-breakdown">${QUIZ_TOPICS.filter(topic=>questions.some(q=>q.topic===topic)).map(topic=>{const group=questions.filter(q=>q.topic===topic);const result=gradeQuiz(group,responses);return `<span>${topic}<b>${result.correct} / ${group.length}</b></span>`;}).join('')}</div><div class="quiz-result-actions">${retry?`<button type="button" class="button red" data-quiz-retry>重练错题与未答题（${retry}）</button>`:''}<button type="button" class="button outline" data-quiz-new>换一组题</button>${link('#/notebook','写下我的研学体会 →','text-link')}</div>`;
}
function quizPanel() {
  if(!quizSession)quizSession=createQuizSession();
  const {questions,topic,count,review}=quizSession;
  const answered=questions.filter(q=>quizSession.responses[q.id]?.length).length;
  return `<section class="quiz-workspace" aria-label="研学自测"><div class="study-intro"><div><span class="eyebrow">${QUIZ.length} 道题 · 五个主题 · 三种题型</span><h2>回望来时路，想想脚下路</h2><p>从历史记忆到科研实践，测一测，也回到资料中找依据。自测仅用于个人研学。</p></div></div><div class="quiz-controls"><div class="quiz-topics" role="group" aria-label="选择自测主题">${['全部',...QUIZ_TOPICS].map(t=>`<button type="button" data-quiz-topic="${t}" aria-pressed="${topic===t}" class="${topic===t?'active':''}">${t==='全部'?'综合练习':t}<small>${QUIZ.filter(q=>t==='全部'||q.topic===t).length} 题</small></button>`).join('')}</div><div class="quiz-round-controls"><label for="quiz-count">每轮题量 <select id="quiz-count">${[[10,'10 题'],[20,'20 题'],['all','本主题全部']].map(([value,label])=>`<option value="${value}" ${String(count)===String(value)?'selected':''}>${label}</option>`).join('')}</select></label><button type="button" class="button outline small" data-quiz-new>换一组题</button><p>切换主题或题量将开始新一轮；不足所选题量时展示全部题目。</p></div></div><div class="quiz-round-heading"><div><h3>${review?'错题与未答题重练':topic==='全部'?'综合随机练习':topic+'专项练习'}</h3><p>${review?'重新作答后再核对理解。':topic==='全部'?'按主题均衡抽题，每轮覆盖不同知识。':'从本主题题库中抽取，适合结合专题深入巩固。'}</p></div><span>${questions.length} 题</span></div><div class="quiz-progress"><div><span id="quiz-progress-label" role="status">已作答 ${answered} / ${questions.length} 题</span><small>单选与判断选一项；多选须全部选对。</small></div><progress id="quiz-progress" value="${answered}" max="${questions.length}" aria-labelledby="quiz-progress-label"></progress></div><form id="quiz-form" class="quiz-form">${questions.map(quizQuestion).join('')}<div class="quiz-submit"><button class="button red">查看研学反馈 →</button><p>可以先提交已答题；未答题单独统计。</p></div><div id="quiz-result" role="status" tabindex="-1">${quizSummary()}</div></form></section>`;
}
function startQuiz({topic=quizSession?.topic||'全部',count=quizSession?.count||10,questions=null}={}) {
  quizSession=createQuizSession(topic,count,questions);
  render({keepScroll:true});
  $('.quiz-workspace')?.scrollIntoView({behavior:'smooth',block:'start'});
}
function updateQuizResponses(form) {
  const data=new FormData(form);
  quizSession.responses=Object.fromEntries(quizSession.questions.map(q=>[q.id,data.getAll(`quiz-${q.id}`).map(Number)]));
}
function updateQuizProgress() {
  const answered=quizSession.questions.filter(q=>quizSession.responses[q.id]?.length).length;
  $('#quiz-progress').value=answered;
  $('#quiz-progress-label').textContent=`已作答 ${answered} / ${quizSession.questions.length} 题`;
}
function practicePanel() {
  return `<div class="study-intro"><div><span class="eyebrow">把论文写在祖国大地上</span><h2>为一个真问题，走一段自己的长征</h2><p>选择一个具体瓶颈，写下可验证的目标与下一步行动。这里的记录保存在当前浏览器中。</p></div></div><div class="practice-case-callout"><div><span class="eyebrow">先看别人怎样攻关</span><h3>从真实工程中学习解决问题的方法</h3><p>案例中的难题、验证过程和协作方式，可帮助我们形成自己的研究计划。</p></div>${link('#/cases','浏览典型案例 →','button outline')}</div><div class="practice-layout"><aside class="practice-guidance"><h3>一份攻关计划的四个支点</h3><ol><li><strong>真问题</strong><p>明确国家、行业或师生实际需要。</p></li><li><strong>硬骨头</strong><p>描述技术瓶颈、已知限制与失败原因。</p></li><li><strong>实证据</strong><p>设计可复核的实验，完整保留原始数据。</p></li><li><strong>共前行</strong><p>明确下一步分工、验证方法与阶段目标。</p></li></ol></aside><form id="challenge-form" class="editor-form"><label>攻关题目<input name="title" required maxlength="100" placeholder="例如：降低某模型在边缘设备上的推理延迟"></label><label>真实需求与当前瓶颈<textarea name="problem" required rows="4" maxlength="4000" placeholder="问题服务于谁？已有方案卡在什么地方？"></textarea></label><label>下一步行动与验证方式<textarea name="plan" required rows="4" maxlength="4000" placeholder="写下可执行的实验、评价指标与协作安排。"></textarea></label><label>当前阶段<select name="status"><option>问题梳理</option><option>方案验证</option><option>持续攻关</option><option>阶段完成</option></select></label><p class="form-note">请只填写适合保存在本机的内容。实际支部成果由支部核实后展示。</p><button class="button red">保存我的攻关计划 →</button></form></div><div class="section-heading small-heading"><h2>我的攻关记录</h2><button class="text-button" data-export="all">导出研学档案 ↓</button></div><div class="challenge-list">${state.challenges.length?state.challenges.map(challengeCard).join(''):'<div class="empty-state">还没有攻关记录。从一个明确的问题开始。</div>'}</div>`;
}
function challengeCard(c) { return `<article class="saved-card"><span class="tag">${esc(c.status)}</span><h3>${esc(c.title)}</h3><small>${esc(c.date)}</small><h4>问题与瓶颈</h4><p class="preserve-lines">${esc(c.problem)}</p><h4>行动与验证</h4><p class="preserve-lines">${esc(c.plan)}</p><div class="saved-actions"><label>更新阶段 <select data-status="${esc(c.id)}">${['问题梳理','方案验证','持续攻关','阶段完成'].map(s=>`<option ${s===c.status?'selected':''}>${s}</option>`).join('')}</select></label><button class="text-button muted" data-delete="challenge:${esc(c.id)}">删除此记录</button></div></article>`; }
function storyPage(id) {
  const s=STORIES.find(s=>s.id===id);if(!s)return notFound();
  const draft=state.drafts[s.id] || '';
  const sections=storySections(s);
  const minutes=Math.max(s.minutes||0,Math.ceil(storyLength(s)/280));
  return `${breadcrumb(s.title,'#/study?tab=stories','故事共读')}<article class="container story-detail"><header><div class="article-kicker"><span class="tag">${esc(s.theme||s.tag)}</span><span>${esc([s.province,s.city,s.district].filter(Boolean).join(' · '))}</span></div><h1>${esc(s.title)}</h1><p>${esc(s.period)} <span> / </span> 约 ${minutes} 分钟 · ${storyLength(s)} 字 · ${s.sourceIds.length} 份史料</p></header><div class="story-detail-layout"><div class="story-text">${sourceLine(s.sourceIds,true)}${s.image?`<figure><img src="${imgPath(s.image)}" alt="${esc(s.imageAlt||s.title)}"><figcaption>${esc(s.imageCredit||'今天的泸定桥（2012年摄）· 山海风 / CC BY-SA 3.0')}</figcaption></figure>`:''}<div class="eyebrow story-reading-label">本站研学整理</div><p class="story-lead">${esc(s.intro)}</p><div class="article-note">以下内容为本站依据所列史料编写的研学文章。原发布页完整文字请从上方资料入口阅读，人物原话仅在明确标注出处时引用。</div>${sections.map((sec,i)=>`<section class="article-section" id="story-section-${i}"><div class="chapter-label">${String(i+1).padStart(2,'0')} / ${sec.kind==='reflection'?'研学思考':'故事与史实'}</div><h2>${esc(sec.title)}</h2>${sec.paragraphs.map(p=>`<p>${esc(p)}</p>`).join('')}</section>`).join('')}${copyrightNotice()}<div class="discussion"><h2>一起想一想</h2>${s.questions.map((q,i)=>`<p><b>${String(i+1).padStart(2,'0')}</b>${esc(q)}</p>`).join('')}</div>${s.researchTask?`<div class="soft-callout"><h3>把理解变成行动</h3><p>${esc(s.researchTask)}</p>${link('#/study?tab=practice','形成一份行动计划 →','text-link')}</div>`:''}<div class="related-reading">${s.landmark?link(`#/map?place=${s.landmark}`,'在地图中寻找故事发生地 →','text-link'):''}${s.person?link(`#/person/${s.person}`,'查看关联人物档案 →','text-link'):''}</div></div><aside class="lecture-panel"><div class="article-contents"><span class="eyebrow">本篇目录</span><nav aria-label="文章目录">${sections.map((sec,i)=>`<button data-section="story-section-${i}"><span>${String(i+1).padStart(2,'0')}</span>${esc(sec.title)}</button>`).join('')}</nav></div><span class="eyebrow">从共读走向宣讲</span><h2>我的微党课</h2><p>将史实、体会与身边的行动连接起来。</p><ol>${s.outline.map(p=>`<li>${esc(p)}</li>`).join('')}</ol><label for="lecture-draft">补充我的讲述与实践联系</label><textarea id="lecture-draft" data-draft="${s.id}" rows="7" maxlength="12000" placeholder="写下你的开场、分工、讲述设计或实践联系……">${esc(draft)}</textarea><small id="draft-status">${draft?'已恢复本机草稿':'输入后自动保存在本机'}</small><button class="button red" data-outline="${s.id}">导出宣讲提纲 ↓</button><button class="text-button article-export" data-story-export="${s.id}">导出完整研学稿 ↓</button></aside></div></article>`;
}
function speechCard(sp) {
  return `<article class="speech-card"><div class="speech-date"><b>${sp.date.slice(0,4)}</b><span>${sp.date.slice(5).replace('-',' / ')}</span></div><div><span class="tag">${esc(sp.category)}</span><h2>${link(`#/speech/${sp.id}`,esc(sp.title))}</h2><p>${esc(sp.summary)}</p><small>${esc(sp.occasion)} · ${esc(sp.org)}</small><div class="speech-actions">${external(sp.url,'官方完整原文','button red small')}${link(`#/speech/${sp.id}`,'进入导读与研学 →','text-link')}</div></div></article>`;
}
function speechesPage(query) {
  const category=query.get('category')||'全部';
  const filtered=SPEECHES.filter(s=>category==='全部'||s.category===category);
  return `${pageHead('读原著 · 学原文 · 悟原理','总书记重要讲话','围绕长征精神、科技创新、青年成长与党史学习，联系历史、专业与实践开展学习。')}<section class="container content-section"><div class="speech-feature"><span class="eyebrow">习近平 · 纪念长征胜利90周年大会</span><blockquote>长征的历史从未远去，<br>长征的路在不断延伸。</blockquote><p>2026年10月22日</p>${external(SPEECHES[0].url,'阅读官方完整原文','button light')}${link('#/speech/speech','学习讲话导读 →','text-link')}</div><nav class="filter-tabs" aria-label="讲话主题筛选">${['全部',...new Set(SPEECHES.map(s=>s.category))].map(c=>link(`#/speeches?category=${encodeURIComponent(c)}`,esc(c),c===category?'active':'')).join('')}</nav><div class="speech-list">${filtered.map(speechCard).join('')}</div><div class="article-note">讲话日期与转载日期分别标明；本站导读和研学提问为学习辅助，讲话完整内容请阅读所列官方原文。</div></section>`;
}
function speechPage(id) {
  const sp=SPEECHES.find(s=>s.id===id);if(!sp)return notFound();
  const related=STORIES.filter(s=>(sp.relatedStories||[]).includes(s.id)||((sp.category==='科技创新')&&s.theme==='科教报国')).slice(0,3);
  return `${breadcrumb('原文与导读','#/speeches','重要讲话')}<article class="container speech-detail"><header><span class="tag">${esc(sp.category)}</span><h1>习近平：${esc(sp.title)}</h1><p>${esc(sp.date)} · ${esc(sp.occasion)}</p><small>原文来源：${esc(sp.org)}</small></header><section class="original-panel speech-original" aria-label="讲话完整原文入口"><span class="eyebrow">原原本本学</span><h2>完整原文</h2><p>在权威发布页面阅读讲话全文，保留原始段落和完整上下文。</p><small>${esc(sp.org)} · 讲话时间：${esc(sp.date)}</small><div class="speech-original-actions">${external(sp.url,'打开官方完整原文','button red')}<button class="read-toggle ${state.read.includes(sp.id)?'is-read':''}" data-read="${sp.id}" aria-pressed="${state.read.includes(sp.id)}">${state.read.includes(sp.id)?'✓ 已读':'标记已读'}</button>${link('#/notebook','记录我的学习体会 →','text-link')}</div>${copyrightNotice()}</section>${sp.quote?`<blockquote class="speech-quote"><p>${esc(sp.quote)}</p><cite>——习近平，${esc(sp.date)}</cite></blockquote>`:''}<div class="speech-read-layout speech-reading-notes"><div><span class="eyebrow">学习导读 · 本站整理</span><h2>带着问题，回到原文</h2><p class="speech-summary">${esc(sp.summary)}</p><ol class="speech-points">${sp.points.map((p,i)=>`<li><span>0${i+1}</span><p>${esc(p)}</p></li>`).join('')}</ol><div class="discussion"><h2>联系实际想一想</h2>${sp.questions.map((q,i)=>`<p><b>0${i+1}</b>${esc(q)}</p>`).join('')}</div></div></div>${related.length?`<div class="section-heading small-heading"><div><div class="eyebrow">把理论学习与具体故事连接起来</div><h2>延伸阅读</h2></div></div><div class="stories-grid expanded-stories">${related.map(contentCard).join('')}</div>`:''}</article>`;
}
function caseCard(c,i=0) {
  return `<a href="#/case/${c.id}" class="case-card"><div class="case-card-top"><span class="case-index">${String(i+1).padStart(2,'0')}</span><span class="tag">${esc(c.field)}</span></div><h3>${esc(c.title)} ${arrow}</h3><p>${esc(c.summary)}</p><small>${esc(c.year)} · ${c.sections.length} 章 · ${caseLength(c)} 字 · 约 ${Math.ceil(caseLength(c)/280)} 分钟</small></a>`;
}
function casesPage(query) {
  const field=query.get('field')||'全部';const filtered=CASES.filter(c=>field==='全部'||c.field===field);
  return `${pageHead('真实难题 · 扎实求证 · 协同攻关','把精神的力量，写进创新的过程','从重大工程和科研突破中，学习如何提出问题、验证方案和组织协作。案例均为公开资料整理，不作为本支部成果。')}<section class="container content-section"><div class="case-intro"><span>需求从哪里来</span><b>→</b><span>难题如何拆解</span><b>→</b><span>证据怎样形成</span><b>→</b><span>成果如何服务人民</span></div><nav class="filter-tabs" aria-label="案例领域">${['全部',...new Set(CASES.map(c=>c.field))].map(f=>link(`#/cases?field=${encodeURIComponent(f)}`,esc(f),f===field?'active':'')).join('')}</nav><div class="cases-grid">${filtered.map(caseCard).join('')}</div><div class="soft-callout"><h3>从案例学习，走向自己的研究</h3><p>选择一个与你专业相关的案例，写清需求、瓶颈、验证方式和阶段目标。</p>${link('#/study?tab=practice','写一份攻关计划 →','text-link')}</div></section>`;
}
function casePage(id) {
  const c=CASES.find(c=>c.id===id);if(!c)return notFound();
  return `${breadcrumb('典型案例','#/cases','案例库')}<article class="container case-detail"><header><span class="tag">${esc(c.field)}</span><h1>${esc(c.title)}</h1><p>${esc(c.summary)}</p><small>公开案例 / ${esc([c.province,c.city].filter(Boolean).join(' · '))} / ${esc(c.year)} · ${c.sections.length} 章 · ${caseLength(c)} 字 · 约 ${Math.ceil(caseLength(c)/280)} 分钟</small></header><div class="case-content-layout"><div class="case-body">${sourceLine(c.sourceIds,true)}<div class="article-note">本站依据所列资料编写的案例详文，按背景、攻关过程、成果与局限展开。各章附对应出处，实践分析由本站整理；原发布页全文可从上方入口阅读。</div><div class="article-contents case-contents"><span class="eyebrow">本篇目录</span><nav aria-label="案例目录">${c.sections.map((sec,i)=>`<button data-section="case-section-${i}"><span>${String(i+1).padStart(2,'0')}</span>${esc(sec.title)}</button>`).join('')}</nav></div><section class="case-timeline" aria-labelledby="case-timeline-title"><div class="eyebrow">关键节点</div><h2 id="case-timeline-title">从起点到阶段成果</h2><ol>${c.timeline.map(t=>`<li><time>${esc(t.year)}</time><p>${esc(t.event)}</p></li>`).join('')}</ol></section>${c.sections.map((sec,i)=>`<section class="article-section" id="case-section-${i}"><div class="chapter-label">${String(i+1).padStart(2,'0')} / ${i===c.sections.length-1?'研学分析':'背景与攻关'}</div><h2>${esc(sec.title)}</h2>${sec.paragraphs.map(t=>`<p>${esc(t)}</p>`).join('')}<div class="case-section-sources"><span>本节依据</span>${sec.sourceIds.map(id=>external(source(id).url,esc(source(id).title))).join('')}</div></section>`).join('')}${copyrightNotice()}<button class="button outline" data-case-export="${c.id}">导出完整案例 ↓</button></div><aside class="case-lessons"><span class="eyebrow">方法启示 · 本站研学整理</span><h2>怎样迁移到我们的实践</h2><ul>${c.lessons.map(t=>`<li>${esc(t)}</li>`).join('')}</ul><h3>试着做一做</h3><ol>${c.practice.map(t=>`<li>${esc(t)}</li>`).join('')}</ol>${link('#/study?tab=practice','开始我的攻关计划 →','button red')}<button class="text-button article-export" data-case-export="${c.id}">导出完整案例 ↓</button></aside></div>${c.personIds?.length?`<div class="related-reading"><h3>走近关联人物</h3>${c.personIds.map(id=>people.find(p=>p.id===id)).filter(Boolean).map(p=>link(`#/person/${p.id}`,`${esc(p.name)} →`,'text-link')).join('')}</div>`:''}</article>`;
}
function exportCase(id) {
  const c=CASES.find(c=>c.id===id);if(!c)return;
  const citation=id=>{const s=source(id);return `[${s.title}](${s.url}) · ${s.org} · ${s.date}`;};
  download(`${c.title}-完整案例.md`,[`# ${c.title}`,`${c.field} / ${c.year}`,c.summary,'本站依据所列资料编写的案例详文；研学分析由本站整理，原发布页全文见来源链接。','## 关键时间线',...c.timeline.map(t=>`- ${t.year}：${t.event}`),...c.sections.flatMap((s,i)=>[`## ${String(i+1).padStart(2,'0')} ${s.title}`,...s.paragraphs,`本节依据：\n${s.sourceIds.map(citation).join('\n\n')}`]),'## 方法启示',...c.lessons.map(t=>`- ${t}`),'## 试着做一做',...c.practice.map((t,i)=>`${i+1}. ${t}`),'## 资料来源与完整原文',...c.sourceIds.map(citation),'如侵犯版权，请联系管理员进行删除。',`[联系管理员 · 版权反馈](${SITE.copyrightContactUrl})`].join('\n\n'));
}
function learningOverview() {
  return `<div class="learning-paths"><div class="section-heading"><div><div class="eyebrow">有顺序，也有自由探索</div><h2>三条研学路径，从理解走向行动</h2></div>${link('#/speeches','总书记重要讲话 →','text-link')}</div><div class="paths-grid">${LEARNING_PATHS.map((p,i)=>`<article><div class="path-number">0${i+1}<small>${p.time}</small></div><h3>${p.title}</h3><p>${p.description}</p><ol>${p.steps.map(st=>`<li>${link(st.href,st.label+' →')}</li>`).join('')}</ol></article>`).join('')}</div></div>`;
}
function notebookPage() {
  return `${pageHead('每一次思考 · 都是一次抵达','我的研学手记','保存学习体会、整理攻关计划，把这段研学路上的所思所悟带走。')}<section class="container content-section"><div class="storage-notice">${storageAvailable?'记录仅保存在当前浏览器，不会上传。更换设备或清理浏览器数据前，请先导出备份。':'浏览器存储暂不可用。记录只在当前页面会话保留，请及时导出。'}<button class="text-button" data-export="all">导出全部记录 ↓</button></div><div class="notebook-layout"><form id="note-form" class="editor-form"><h2>记下今天的思考</h2><label>标题<input name="title" required maxlength="100" placeholder="今天最触动我的一个细节"></label><label>学习体会<textarea name="content" required rows="8" maxlength="12000" placeholder="我学到了什么？这与我的学习、科研和服务实践有什么联系？"></textarea></label><label>关联主题<select name="topic"><option>长征历史</option><option>红色故事</option><option>科研报国</option><option>支部实践</option></select></label><button class="button red">保存研学手记 →</button></form><div><h2 class="saved-heading">已保存的手记 <small>${state.notes.length} 篇</small></h2><div class="notes-list">${state.notes.length?state.notes.map(n=>`<article class="saved-card"><span class="tag">${esc(n.topic)}</span><h3>${esc(n.title)}</h3><small>${esc(n.date)}</small><p class="preserve-lines">${esc(n.content)}</p><button class="text-button muted" data-delete="note:${esc(n.id)}">删除此手记</button></article>`).join(''):'<div class="empty-state">第一篇手记，留给今天的新发现。</div>'}</div></div></div>${state.challenges.length?`<div class="section-heading small-heading"><h2>我的科研攻关</h2>${link('#/study?tab=practice','继续记录 →','text-link')}</div><div class="challenge-list">${state.challenges.map(challengeCard).join('')}</div>`:''}</section>`;
}
function aboutPage() {
  return `${pageHead('学在支部 · 做在支部','让信仰之火，在青春中接续','以数字技术连接历史与当下，以实际行动回答青年党员的时代课题。')}<section class="container content-section"><div class="about-intro"><div class="about-seal" aria-hidden="true">学<br>做</div><div><div class="eyebrow">我们的支部</div><h2>${esc(SITE.branch)}</h2><p>本网站围绕“${esc(SITE.theme)}”主题，面向支部主题党日与自主研学，将长征路线、红色人物、学习资料和实践记录连接起来。</p><p>庆祝中国共产党成立105周年，纪念红军长征胜利90周年。通过“学一段长征历史、讲一个红色故事、攻一个科研难题”，探索学思践悟、知行合一的学习方式。</p></div></div><div class="about-values">${[['以学铸魂','读原文、学党史，在历史中坚定理想信念。'],['以讲传薪','讲好有史料依据的故事，让红色文化可感可知。'],['以做践行','坚持实事求是，在科研攻关和服务实践中担当。']].map(([t,p])=>`<article><h3>${t}</h3><p>${p}</p></article>`).join('')}</div><div class="section-heading small-heading"><h2>支部活动与作品</h2><span class="muted">记录真实发生的学习与行动</span></div>${SITE.activities.length?`<div class="activity-grid">${SITE.activities.map(a=>`<article>${a.image?`<img src="${esc(a.image)}" alt="${esc(a.title)}" loading="lazy">`:''}<h3>${esc(a.title)}</h3><small>${esc(a.date)}</small><p>${esc(a.description)}</p></article>`).join('')}</div>`:'<div class="empty-state activity-empty"><span aria-hidden="true">▧</span><h3>让真实的行动，成为最好的记录</h3><p>支部活动照片、宣讲作品与阶段成果将在整理核实后展示。</p><p>现在可以先记录个人学习体会与科研攻关计划。</p>'+link('#/notebook','写下我的研学体会 →','text-link')+'</div>'}${SITE.works.length?`<div class="resource-list">${SITE.works.map(w=>`<article><div><h3>${esc(w.title)}</h3><p>${esc(w.description)}</p></div>${external(w.url,'查看作品','text-link')}</article>`).join('')}</div>`:''}<div class="about-credit"><h3>关于这个数字研学空间</h3><p>网站参考“红韵青岛·数智传薪”的人物与地标结构，整合 wanli-trail 长征沙盘，并按本支部主题组织学习与实践内容。</p>${link('#/sources','查看资料与项目来源 →','text-link')}${SITE.contact?`<p>联系：${esc(SITE.contact)}</p>`:''}</div></section>`;
}
function sourcesPage() {
  return `${pageHead('有所本 · 有所据','内容与项目来源','史实以官方文献为依据。参考代码、图片和地图数据在此标明来源。')}<section class="container content-section"><h2>学习资料与史实依据</h2><p class="muted">共 ${SOURCES.length} 条来源。每篇故事在正文前逐项列出对应的原发布页；教学分析与实践建议由本站整理。</p>${copyrightNotice()}<div class="source-groups">${[...new Set(SOURCES.map(s=>s.type))].map(type=>`<details><summary>${esc(type)}<span>${SOURCES.filter(s=>s.type===type).length} 条</span></summary><div class="resource-list">${SOURCES.filter(s=>s.type===type).map(s=>`<article><div><h3>${esc(s.title)}</h3><p>${esc(s.org)} · ${esc(s.date)}</p></div>${external(s.url,'完整原文','text-link')}</article>`).join('')}</div></details>`).join('')}</div><h2 class="small-heading">参考网站与长征沙盘</h2><div class="source-project"><h3>红韵青岛·数智传薪</h3><p>人物与地标结构、六位青岛人物资料及相关图片参考用户提供的介绍文档与原网站。原支部活动照片、二维码与活动成果未用于本支部展示。</p>${external('https://rikki7777.github.io/qd-revolutionary-spirits/index.html','参考网站')}${external('https://github.com/rikki7777/qd-revolutionary-spirits','代码仓库')}</div><div class="source-project"><h3>wanli-trail · 红军长征沙盘</h3><p>作者：nova-fable。以本地静态构建方式整合四路红军路线、时间轴与事件讲解。上游版本 df333333b57fde628e7709311810144ff4caebf0，源代码保存在 vendor/wanli-trail。沙盘史实数据与坐标的说明见上游文档。</p>${external('https://github.com/nova-fable/wanli-trail','代码与文档')}</div><h2 class="small-heading">可视化与数字研学项目研究</h2><div class="repo-grid">${REPOSITORIES.map(r=>`<article><span class="tag">${esc(r.role)}</span><h3>${external(r.url,esc(r.name))}</h3><p>${esc(r.description)}</p></article>`).join('')}</div><h2 class="small-heading">人物与纪念地照片</h2><p class="muted">新增人物图来自官方人物资料页面，逐张核对身份，保留发布出处与图片归属。</p><div class="photo-source-list">${people.filter(p=>p.photoCredit).map(p=>`<p><strong>${esc(p.name)}</strong><span>${esc(p.photoCredit)}</span>${external(p.photoSource,'发布来源','text-link')}</p>`).join('')}<p><strong>彝海当代实景</strong><span>共产党员网 · 央视新闻，非1935年历史照片。</span>${external('https://www.12371.cn/2021/04/16/VIDE1618529701955641.shtml','发布来源','text-link')}</p></div><h2 class="small-heading">图片与地图</h2><div class="source-project"><h3>泸定桥照片</h3><p>摄影：山海风，2012年8月6日。来自 Wikimedia Commons，许可为 CC BY-SA 3.0。本站进行了尺寸压缩、页面裁切与色彩叠加；图片及其改编遵循原许可。首页展示的是当代实景。</p>${external('https://commons.wikimedia.org/wiki/File:%E6%B3%B8%E5%AE%9A%E6%A1%A5_-_panoramio_(2).jpg','图片原始页面')}${external('https://creativecommons.org/licenses/by-sa/3.0/','CC BY-SA 3.0')}</div><div class="source-project"><h3>地图与组件</h3><p>省级边界：DataV.GeoAtlas。交互地图：Leaflet（BSD-2-Clause）。可选在线街道底图：OpenStreetMap 贡献者（ODbL）。长征路线为关键航点近似连线，用于历史研学示意。</p>${external('https://datav.aliyun.com/portal/school/atlas/area_selector','DataV.GeoAtlas')}${external('https://leafletjs.com/','Leaflet')}${external('https://www.openstreetmap.org/copyright','OpenStreetMap')}</div></section>`;
}
function notFound(){return `${pageHead('继续探索','这条路径还没有足迹','可以从首页重新开始，或沿着长征沙盘继续前行。')}<div class="container content-section">${link('#/','返回首页','button red')}</div>`;}

function exportAll() {
  const records=[`# ${SITE.name} · 我的研学档案`,`支部：${SITE.branch}`,`导出时间：${new Date().toLocaleString('zh-CN')}`,'## 学习记录',...SOURCES.filter(s=>state.read.includes(s.id)).map(s=>`- 已读：${s.title}\n  ${s.url}`),'## 研学手记',...state.notes.map(n=>`### ${n.title}\n${n.date} · ${n.topic}\n\n${n.content}`),'## 科研攻关',...state.challenges.map(c=>`### ${c.title}\n${c.date} · ${c.status}\n\n问题与瓶颈：\n${c.problem}\n\n行动与验证：\n${c.plan}`),'## 微党课创作',...Object.entries(state.drafts).filter(([,d])=>d).map(([id,d])=>`### ${STORIES.find(s=>s.id===id)?.title||id}\n${d}`)];
  download('征途薪火-我的研学档案.md',records.join('\n\n'));
}
function render({keepScroll=false}={}) {
  activeMap?.remove();activeMap=null;
  const raw=location.hash.replace(/^#\/?/,'');const [path,search]=raw.split('?');const query=new URLSearchParams(search||'');const [page='',id]=path.split('/');
  const known={ '':homePage,speeches:()=>speechesPage(query),speech:()=>speechPage(id),cases:()=>casesPage(query),case:()=>casePage(id),trail:()=>trailPage(query),people:()=>peoplePage(query),person:()=>personPage(id,query),map:()=>mapPage(query),study:()=>studyPage(query),story:()=>storyPage(id),notebook:notebookPage,about:aboutPage,sources:sourcesPage };
  main.innerHTML=(known[page]||notFound)();
  const navKey=page==='person'?'people':page==='story'?'study':page==='speech'?'speeches':page==='case'?'cases':page||'home';
  document.querySelectorAll('[data-nav]').forEach(a=>{const selected=a.dataset.nav===navKey;a.classList.toggle('active',selected);if(selected)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
  document.title=`${({'':'首页',speeches:'重要讲话',speech:SPEECHES.find(s=>s.id===id)?.title,cases:'典型案例',case:CASES.find(c=>c.id===id)?.title,trail:'长征沙盘',people:'红色人物',person:people.find(p=>p.id===id)?.name,map:'研学地标',study:'学思践悟',story:STORIES.find(s=>s.id===id)?.title,notebook:'我的研学',about:'关于支部',sources:'内容来源'})[page]||'页面未找到'}｜${SITE.name}`;
  $('#main-nav').classList.remove('open');$('.menu-toggle').setAttribute('aria-expanded','false');
  document.body.classList.toggle('trail-page',page==='trail');
  document.body.dataset.page=page||'home';
  if(page==='map')initMap(query);
  if(!keepScroll) { window.scrollTo(0,0); main.focus({preventScroll:true}); }
}
main.addEventListener('click',e=>{
  const quizTopic=e.target.closest('[data-quiz-topic]');if(quizTopic)startQuiz({topic:quizTopic.dataset.quizTopic});
  if(e.target.closest('[data-quiz-new]'))startQuiz();
  if(e.target.closest('[data-quiz-retry]')&&quizSession?.submitted){const questions=quizSession.questions.filter(q=>questionResult(q,quizSession.responses[q.id])!=='correct');if(questions.length)startQuiz({questions});}
  const section=e.target.closest('[data-section]');if(section)document.getElementById(section.dataset.section)?.scrollIntoView({behavior:'smooth',block:'start'});
  const caseExport=e.target.closest('[data-case-export]');if(caseExport)exportCase(caseExport.dataset.caseExport);
  const storyExport=e.target.closest('[data-story-export]');if(storyExport){const s=STORIES.find(x=>x.id===storyExport.dataset.storyExport);download(`${s.title}-完整研学稿.md`,[`# ${s.title}`,s.period,s.intro,...storySections(s).flatMap(sec=>[`## ${sec.title}`,...sec.paragraphs]),'## 讨论问题',...s.questions,'## 史料与完整原文',...s.sourceIds.map(id=>source(id)).map(x=>`${x.title}\n${x.org}\n${x.url}`)].join('\n\n'));}
  const read=e.target.closest('[data-read]');if(read){const id=read.dataset.read;state.read=state.read.includes(id)?state.read.filter(x=>x!==id):[...state.read,id];save();render({keepScroll:true});}
  const exp=e.target.closest('[data-export]');if(exp)exportAll();
  const outline=e.target.closest('[data-outline]');if(outline){const s=STORIES.find(s=>s.id===outline.dataset.outline);download(`${s.title}-微党课提纲.md`,[`# ${s.title} · 微党课创作提纲`,`适用：${SITE.branch}`,'## 讲述提纲',...s.outline.map((x,i)=>`${i+1}. ${x}`),'## 我的补充',state.drafts[s.id]||'（尚未填写）','## 核对史料',...s.sourceIds.map(id=>source(id)).flatMap(x=>[x.title,x.url]),'提示：这是创作提纲，正式讲述前请核对史实。'].join('\n\n'));}
  const del=e.target.closest('[data-delete]');if(del){const [kind,id]=del.dataset.delete.split(':');const key=kind==='note'?'notes':'challenges';const item=state[key].find(x=>x.id===id);state[key]=state[key].filter(x=>x.id!==id);save();render({keepScroll:true});toast('已删除记录');lastDeleted={key,item};const undo=document.createElement('button');undo.textContent='撤销';undo.onclick=()=>{if(!lastDeleted?.item)return;state[lastDeleted.key].unshift(lastDeleted.item);lastDeleted=null;save();render({keepScroll:true});toast('已恢复记录');};$('#toast').append(undo);}
});
let lastDeleted=null;
main.addEventListener('input',e=>{if(e.target.matches('[data-draft]')){state.drafts[e.target.dataset.draft]=e.target.value;const ok=save();$('#draft-status').textContent=ok?'草稿已保存在本机':'草稿未能保存，请导出备份';}});
main.addEventListener('change',e=>{
  if(e.target.id==='quiz-count'){startQuiz({count:e.target.value});return;}
  if(e.target.closest('#quiz-form')&&e.target.matches('input')){
    updateQuizResponses(e.target.form);
    if(quizSession.submitted){
      quizSession.submitted=false;$('#quiz-result').replaceChildren();
      document.querySelectorAll('.quiz-feedback').forEach(el=>el.replaceChildren());
      document.querySelectorAll('.quiz-form .is-answer,.quiz-form .is-mistake').forEach(el=>el.classList.remove('is-answer','is-mistake'));
      document.querySelectorAll('.quiz-form fieldset').forEach(el=>el.classList.remove('quiz-correct','quiz-wrong','quiz-unanswered'));
    }
    updateQuizProgress();
  }
  if(e.target.matches('[data-status]')){const c=state.challenges.find(c=>c.id===e.target.dataset.status);if(c){c.status=e.target.value;save();render({keepScroll:true});toast('阶段已更新');}}
});
main.addEventListener('submit',e=>{
  e.preventDefault();const form=e.target;const data=new FormData(form);
  if(form.dataset.explore){const params=new URLSearchParams();for(const [k,v] of data)if(String(v).trim())params.set(k,String(v).trim());location.hash=`/${form.dataset.explore}?${params}`;return;}
  if(form.id==='people-search')location.hash=`/people?q=${encodeURIComponent(data.get('q').trim())}`;
  if(form.id==='map-search')location.hash=`/map?region=${encodeURIComponent(data.get('region'))}&q=${encodeURIComponent(data.get('q').trim())}`;
  const recordMeta=()=>({id:globalThis.crypto?.randomUUID?.()||`${Date.now()}-${Math.random().toString(36).slice(2)}`,date:new Date().toLocaleDateString('zh-CN')});
  if(form.id==='note-form') { if(!data.get('title').trim()||!data.get('content').trim()){toast('请填写标题和学习体会');return;}state.notes.unshift({...recordMeta(),title:data.get('title').trim(),content:data.get('content').trim(),topic:data.get('topic')});const ok=save();render({keepScroll:true});toast(ok?'手记已保存在本机':'手记保留在当前会话，请导出备份');}
  if(form.id==='challenge-form'){if(['title','problem','plan'].some(k=>!data.get(k).trim())){toast('请完整填写题目、瓶颈与行动计划');return;}state.challenges.unshift({...recordMeta(),title:data.get('title').trim(),problem:data.get('problem').trim(),plan:data.get('plan').trim(),status:data.get('status')});const ok=save();render({keepScroll:true});toast(ok?'攻关计划已保存在本机':'计划保留在当前会话，请导出备份');}
  if(form.id==='quiz-form'){
    updateQuizResponses(form);quizSession.submitted=true;render({keepScroll:true});
    $('#quiz-result').focus({preventScroll:true});$('#quiz-result').scrollIntoView({behavior:'smooth',block:'center'});
  }
});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&$('#main-nav').classList.contains('open')){$('#main-nav').classList.remove('open');$('.menu-toggle').setAttribute('aria-expanded','false');$('.menu-toggle').focus();}});
$('.menu-toggle').addEventListener('click',()=>{const open=$('#main-nav').classList.toggle('open');$('.menu-toggle').setAttribute('aria-expanded',String(open));});
document.querySelectorAll('[data-branch]').forEach(el=>el.textContent=SITE.branch);
async function boot() {
  try {
    const [qd,r,g,districts]=await Promise.all([fetch('js/qingdao.json').then(r=>{if(!r.ok)throw Error('人物数据加载失败');return r.json();}),fetch('js/routes.json').then(r=>r.ok?r.json():{}),fetch('assets/china-provinces.json').then(r=>r.ok?r.json():null).catch(()=>null),fetch('assets/qingdao-districts.json').then(r=>r.ok?r.json():null).catch(()=>null)]);
    people=[...PEOPLE,...qd].map(normalizePerson);routes=r;provinces=g;qingdaoGeometry=districts;
    landmarks=[...LANDMARKS,...qd.flatMap(p=>p.landmarks.map(l=>({...l,lat:l.coordinates.lat,lng:l.coordinates.lng,region:'青岛'})))].map(normalizeLandmark);
    landmarks=landmarks.filter((l,i,arr)=>arr.findIndex(x=>x.id===l.id)===i);
    people=people.map(p=>({...p,landmarks:(p.landmarks||[]).map(l=>typeof l==='string'?landmarks.find(x=>x.id===l):l).filter(Boolean)}));
    window.addEventListener('hashchange',()=>render());render();
  } catch(error) { main.innerHTML=`<section class="container content-section"><h1>研学资料暂未加载</h1><p>请通过本地 HTTP 服务打开网站，并确认已完成构建。</p><p>${esc(error.message)}</p><button class="button red" onclick="location.reload()">重新加载</button></section>`; }
}
boot();
