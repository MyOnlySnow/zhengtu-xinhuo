import assert from 'node:assert/strict';
import {readFile,access} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {SOURCES,PEOPLE,STORIES,CASES,LANDMARKS,SPEECHES,normalizePerson,normalizeStory,normalizeLandmark} from '../js/catalog.js';
import {matchesContent,storySections,storyLength} from '../js/explore.js';

const root=fileURLToPath(new URL('../',import.meta.url));
const qd=JSON.parse(await readFile(path.join(root,'js/qingdao.json'),'utf8'));
const people=[...PEOPLE,...qd].map(normalizePerson);
const stories=STORIES.map(normalizeStory);
const landmarks=[...LANDMARKS,...qd.flatMap(p=>p.landmarks.map(l=>({...l,lat:l.coordinates.lat,lng:l.coordinates.lng,region:'青岛'})))].map(normalizeLandmark);
const ids=rows=>new Set(rows.map(x=>x.id));
const sourceIds=ids(SOURCES),personIds=ids(people),placeIds=ids(landmarks);
function unique(rows,name){assert.equal(ids(rows).size,rows.length,`${name} 存在重复ID`);}
function references(item){
  const refs=item.sourceIds||[item.source].filter(Boolean);
  assert.ok(refs.length,`${item.id||item.title} 缺少来源`);
  refs.forEach(id=>assert.ok(sourceIds.has(id),`${item.id} 引用了不存在的来源 ${id}`));
}
unique(SOURCES,'来源');unique(people,'人物');unique(stories,'故事');unique(landmarks,'地标');unique(CASES,'案例');
assert.equal(people.length,25);assert.ok(stories.length>=23);assert.equal(CASES.length,9);assert.equal(SPEECHES.length,7);
for(const source of SOURCES){assert.ok(source.title&&source.org&&source.date,`来源元数据不完整 ${source.id}`);assert.match(source.url,/^https:\/\//,`来源链接不正确 ${source.id}`);}
for(const p of people){
  references(p);assert.ok(p.timeline.length>=5,`人物时间轴不足 ${p.id}`);assert.ok(p.stories.length>=2,`人物故事不足 ${p.id}`);
  assert.ok(p.province&&p.city,`缺少人物事迹地区 ${p.id}`);
  assert.ok(p.birth>1800&&p.birth<2026,`出生年 ${p.id}`);
  for(const l of p.landmarks||[])assert.ok(placeIds.has(typeof l==='string'?l:l.id),`人物地标关联 ${p.id}`);
  if(p.photo)await access(path.join(root,p.photo.startsWith('assets/')?p.photo:`assets/${p.photo}`));
}
for(const story of stories){
  references(story);assert.ok(storyLength(story)>=500,`故事正文过短 ${story.id}`);
  assert.ok(storySections(story).length>=5,`故事缺少分节 ${story.id}`);
  assert.ok(story.questions?.length>=2&&story.outline?.length>=4,`缺少研学或讲稿 ${story.id}`);
  if(story.theme==='长征岁月'){
    assert.ok(storyLength(story)>=1500,`长征故事未达到详尽要求 ${story.id}`);
    assert.ok(storySections(story).length>=6,`长征专题章节不足 ${story.id}`);
    assert.ok(story.sourceIds.length>=4,`长征专题来源不足 ${story.id}`);
  }
  if(story.person)assert.ok(personIds.has(story.person),`故事人物关联 ${story.id}`);
  if(story.landmark)assert.ok(placeIds.has(story.landmark),`故事地标关联 ${story.id}`);
  if(story.image)await access(path.join(root,story.image));
}
for(const place of landmarks){
  assert.ok(Number.isFinite(place.lat)&&Number.isFinite(place.lng)&&place.lat>=18&&place.lat<=54&&place.lng>=73&&place.lng<=135,`地标坐标范围 ${place.id}`);
  assert.ok(place.province&&place.city,`缺少地标地区 ${place.id}`);
}
for(const c of CASES){references(c);for(const k of ['problem','method','result'])assert.ok(c[k]?.length>25,`案例信息不足 ${c.id}/${k}`);assert.ok(c.lessons.length>=3&&c.practice.length>=3);for(const id of c.personIds||[])assert.ok(personIds.has(id));}
for(const s of SPEECHES){assert.ok(s.date&&s.occasion&&s.org&&s.url&&s.points.length===3&&s.questions.length>=2);assert.ok(sourceIds.has(s.id));for(const id of s.relatedStories||[])assert.ok(ids(stories).has(id));}
assert.equal(people.filter(p=>matchesContent(p,{region:'即墨'})).length,1);
assert.ok(stories.some(s=>matchesContent(s,{region:'即墨'})),'即墨故事筛选为空');
assert.equal(stories.filter(s=>matchesContent(s,{theme:'长征岁月'})).length,7);
console.log(`内容检查通过：${people.length} 位人物、${stories.length} 篇分节故事（7篇长征详文）、${CASES.length} 个案例、${landmarks.length} 处地标、${SPEECHES.length} 篇讲话、${SOURCES.length} 条来源。`);
