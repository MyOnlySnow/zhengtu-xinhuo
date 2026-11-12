import {cp,mkdir,readFile,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {EVENTS,SOURCES} from '../js/data.js';

const upstream='f64998f0347dd1d8538937c61c2e7f37550ced71';
const escape=text=>text.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const readings={xiangjiang:'chen',chishui:'chishui-evidence',luding:'luding',jiajin:'red26-teamwork'};

// Keep the upstream single-page interface. The published edition uses the
// portal's reviewed chronology and the same waypoint data as its main sandbox.
export async function buildLightMarch(root,dist,routes){
  const out=path.join(dist,'light-march');await mkdir(out,{recursive:true});
  const raw=await readFile(path.join(root,'vendor/long-march-map/index.html'),'utf8');
  const events=EVENTS.map(e=>({
    ...e,type:['xiangjiang','chishui','luding'].includes(e.id)?'battle':['zunyi','huining'].includes(e.id)?'meeting':'event',
    tag:e.spirit,province:e.place,
    desc:`${escape(e.desc)}<p class="event-note">${e.id==='wuqi'?'此处为1935年中央红军到达陕北，三大主力会师在1936年10月。':'坐标和航点为研学示意，不能视作精确行军轨迹。'}</p><p class="event-links"><a href="${SOURCES.find(s=>s.id==='history').url}" target="_blank" rel="noopener noreferrer">党史专题与史料出处 ↗</a>${readings[e.id]?`<a href="../#/story/${readings[e.id]}" target="_top">阅读站内完整故事 →</a>`:''}</p>`,
  }));
  let html=raw;
  const replace=(from,to)=>{if(!html.includes(from))throw Error('轻量地图适配锚点改变：'+from.slice(0,60));html=html.replace(from,to);};
  replace('https://unpkg.com/leaflet@1.9.4/dist/leaflet.css','../assets/vendor/leaflet/leaflet.css');
  replace('https://unpkg.com/leaflet@1.9.4/dist/leaflet.js','../assets/vendor/leaflet/leaflet.js');
  replace('<title>红军长征路线图 — 1934-1936</title>','<title>轻量长征路线图 · 征途薪火</title>');
  replace('<h1>红军长征路线图</h1>','<h1>轻量长征路线图</h1>');
  replace('1934年10月 — 1936年10月 · 真实地理标注','1934—1936 · 九个节点 · 四路红军示意');
  const statsStart=html.indexOf('      <div class="stat-row">');
  const statsEnd=html.indexOf('    <div class="sidebar-body">',statsStart);
  if(statsStart<0||statsEnd<0)throw Error('轻量地图统计区锚点改变');
  html=html.slice(0,statsStart)+`      <div class="stat-row"><div class="stat-item"><span class="stat-val">9</span><span class="stat-label">关键节点</span></div><div class="stat-item"><span class="stat-val">4</span><span class="stat-label">红军路线</span></div></div><p class="local-credit">本站资料整理 · <a href="ADAPTATIONS.md" target="_blank" rel="noopener">适配与来源</a><br>© youxuels · <a href="UPSTREAM-README.md" target="_blank" rel="noopener">上游MIT声明</a></p></div>\n`+html.slice(statsEnd);
  const dataStart=html.indexOf('const events = [');
  const dataEnd=html.indexOf('let map;',dataStart);
  if(dataStart<0||dataEnd<0)throw Error('轻量地图数据锚点改变');
  html=html.slice(0,dataStart)+`const events=${JSON.stringify(events)};\nconst centralRoute=${JSON.stringify(routes.first.map(p=>[p.lat,p.lng]))};\nconst secondRoute=${JSON.stringify(routes.second.map(p=>[p.lat,p.lng]))};\nconst fourthRoute=${JSON.stringify(routes.fourth.map(p=>[p.lat,p.lng]))};\nconst n25Route=${JSON.stringify(routes.n25.map(p=>[p.lat,p.lng]))};\n`+html.slice(dataEnd);
  const mapStart=html.indexOf('const PI = Math.PI;');
  const mapEnd=html.indexOf('function animateRoute()',mapStart);
  if(mapStart<0||mapEnd<0)throw Error('轻量地图初始化锚点改变');
  html=html.slice(0,mapStart)+`
const centralRouteGCJ=centralRoute;
events.forEach(e=>{e.latGCJ=e.lat;e.lngGCJ=e.lng;});
function initMap(){
  map=L.map('map',{center:[31,106],zoom:5,zoomControl:true,attributionControl:true});
  const outline=L.layerGroup().addTo(map);
  fetch('../assets/china-provinces.json').then(r=>{if(!r.ok)throw Error('地图轮廓加载失败');return r.json();}).then(data=>L.geoJSON(data,{style:{color:'#c6baa7',weight:1,fillColor:'#eae4d8',fillOpacity:.45},interactive:false}).addTo(outline)).catch(()=>{document.getElementById('mapStatus').textContent='地图轮廓未加载，仍可查看路线和节点。';});
  const streets=L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',maxZoom:18});
  L.control.layers({'本地轮廓':outline,'在线街道':streets},null,{position:'topright'}).addTo(map);
  map.on('baselayerchange',e=>{document.getElementById('mapStatus').textContent=e.name==='本地轮廓'?'本地轮廓与节点无需外部底图。':'在线街道底图需联网。';});
  map.attributionControl.addAttribution('边界：DataV.GeoAtlas');
  for(const [points,color] of [[centralRoute,'#a72c35'],[secondRoute,'#bd823c'],[fourthRoute,'#527e88'],[n25Route,'#72774a']])L.polyline(points,{color,weight:3,opacity:.5}).addTo(map);
  routePolyline=L.polyline([],{color:'#b91c1c',weight:4,opacity:.9}).addTo(map);
  for(const e of events){
    const icon=L.divIcon({className:'',html:'<div class="marker-icon '+e.type+'" id="marker-'+e.id+'" style="width:14px;height:14px"></div>',iconSize:[14,14],iconAnchor:[7,7]});
    const marker=L.marker([e.lat,e.lng],{icon,title:e.name,alt:e.name}).addTo(map).on('click',()=>selectEvent(e.id));
    marker.bindPopup('<div class="popup-title">'+e.name+'</div><div class="popup-date">'+e.date+'</div>',{closeButton:false});
    leafletMarkers[e.id]=marker;
  }
  const fitAll=()=>map.fitBounds(events.map(e=>[e.lat,e.lng]),{padding:[28,28]});
  map.on('resize',fitAll);fitAll();
  animateRoute();selectEvent(events[0].id,false);
}
`+html.slice(mapEnd);
  replace('  if (currentEvent === id) {\n    closeDetail();\n    return;\n  }\n','');
  replace('function selectEvent(id) {','function selectEvent(id,pan=true) {');
  replace('  map.flyTo([e.latGCJ, e.lngGCJ], 9, { duration: 1.0 });','  if(pan)map.flyTo([e.latGCJ, e.lngGCJ], 7, { duration: .6 });');
  replace("    <div class=\"timeline-item ${e.type}\" data-id=\"${e.id}\" onclick=\"selectEvent('${e.id}')\">", "    <button type=\"button\" class=\"timeline-item ${e.type}\" data-id=\"${e.id}\" onclick=\"selectEvent('${e.id}')\">");
  replace("    </div>\n  `).join('');\n}", "    </button>\n  `).join('');\n}");
  replace("    el.classList.toggle('active', el.dataset.id === id);", "    el.classList.toggle('active', el.dataset.id === id);el.setAttribute('aria-pressed',String(el.dataset.id === id));");
  replace("  if (e.key === 'Escape') closeDetail();", "  if(e.target.closest('input,select,textarea,a,button'))return;\n  if (e.key === 'Escape') closeDetail();");
  replace('id="playBtn" onclick="togglePlay()"','id="playBtn" aria-label="播放或暂停路线" aria-pressed="false" onclick="togglePlay()"');
  replace("  isPlaying = true;", "  isPlaying = true;document.getElementById('playBtn').setAttribute('aria-pressed','true');");
  replace("  isPlaying = false;", "  isPlaying = false;document.getElementById('playBtn').setAttribute('aria-pressed','false');");
  replace("renderTimeline();\ninitMap();", "window.addEventListener('pagehide',stopPlay);\nrenderTimeline();\ninitMap();");
  replace('    <div class="play-controls">','    <p id="mapStatus" role="status">本地轮廓与节点无需外部底图。</p>\n    <div class="play-controls">');
  replace('</style>',`
.timeline-item { width:100%;border:0;background:transparent;text-align:left;font:inherit;color:inherit; }
.timeline-item:focus-visible { outline:2px solid #a72c35;outline-offset:-3px; }
.local-credit {font-size:11px;color:#706b60;line-height:1.8;margin-top:12px;}
.local-credit a,.event-links a {color:#8e302e;text-decoration:underline;text-underline-offset:3px;}
.event-note {margin-top:12px;color:#746858;font-size:12px;}
.event-links {display:grid;gap:10px;margin-top:16px;}
#mapStatus {position:absolute;right:12px;bottom:80px;z-index:500;max-width:calc(100% - 24px);background:#fffdf5e8;padding:5px 10px;border-radius:4px;color:#6b6256;font-size:11px;pointer-events:none;}
.legend {max-width:210px;top:90px;}
@media(max-width:900px){.app{grid-template-rows:42vh minmax(0,1fr);}.sidebar-header{padding:15px 20px 12px;}.sidebar-header h1{font-size:21px;}.stat-row,.local-credit{display:none!important;}.timeline-container{max-height:42%;min-height:90px;}.timeline-item{padding:10px 18px;}.detail-content{padding:18px 20px;}.play-controls{padding:6px 14px;gap:8px;}.sidebar-body{min-height:0;}.timeline-title{font-size:13px;}}
@media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important;}}
</style>`);
  // The original legend named three armies; the published routes use all four.
  replace('        <span>红四方面军</span>\n      </div>','        <span>红四方面军</span>\n      </div><div class="legend-item"><div style="width:20px;height:3px;background:#72774a;flex-shrink:0"></div><span>红二十五军</span></div>');
  await writeFile(path.join(out,'index.html'),html);
  await cp(path.join(root,'vendor/long-march-map/README.md'),path.join(out,'UPSTREAM-README.md'));
  await writeFile(path.join(out,'ADAPTATIONS.md'),`# 轻量长征路线图 · 本站适配\n\n上游：youxuels/long-march-map，固定版本 ${upstream}。原README声明MIT，未提供独立LICENSE；原始网页与README保存在vendor/long-march-map，保留原作者归属。\n\n修改日期：2026-11-12。本站复用界面、时间线和播放交互；替换原14节点、全部引语、统计与原示意路线为js/data.js的9个节点和wanli-trail四路航点。吴起为1935年中央红军到达陕北；三大主力会师为1936年10月。\n\nLeaflet由本站提供；默认使用本地DataV省界轮廓，不请求外部瓦片；可选择OpenStreetMap街道底图，保留归属。节点链接回本站故事或官方专题。\n\n源码：https://github.com/MyOnlySnow/zhengtu-xinhuo/tree/main/vendor/long-march-map\n适配：https://github.com/MyOnlySnow/zhengtu-xinhuo/blob/main/scripts/build-light-march.mjs\n\n节点依据：https://www.dswxyjy.org.cn/GB/427277/462086/index.html\n`);
}
