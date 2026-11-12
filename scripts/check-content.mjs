import assert from 'node:assert/strict';
import {readFile,access} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {SOURCES,PEOPLE,STORIES,CASES,LANDMARKS,SPEECHES,QUIZ,normalizePerson,normalizeStory,normalizeLandmark} from '../js/catalog.js';
import {matchesContent,storySections,storyLength} from '../js/explore.js';
import {caseLength} from '../js/case-details.js';
import {QUIZ_TOPICS,QUIZ_TYPES} from '../js/quiz.js';

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
for(const c of CASES){
  references(c);
  assert.ok(c.sections?.length>=6,`案例缺少完整章节 ${c.id}`);
  assert.ok(caseLength(c)>=1500,`案例详文不足1500字 ${c.id}`);
  assert.ok(c.timeline?.length>=5&&c.timeline.every(t=>t.year&&t.event),`案例时间线不完整 ${c.id}`);
  assert.ok(c.sourceIds.length>=4,`案例多源依据不足 ${c.id}`);
  for(const sec of c.sections){
    assert.ok(sec.title&&sec.paragraphs.length>=2,`案例章节不完整 ${c.id}/${sec.title}`);
    references({...sec,id:`${c.id}/${sec.title}`});
    assert.ok(sec.sourceIds.every(id=>c.sourceIds.includes(id)),`章节来源未列入案例总来源 ${c.id}`);
  }
  assert.ok(c.lessons.length>=3&&c.practice.length>=3);
  for(const id of c.personIds||[])assert.ok(personIds.has(id));
}
for(const s of SPEECHES){assert.ok(s.date&&s.occasion&&s.org&&s.url&&s.points.length===3&&s.questions.length>=2);assert.ok(sourceIds.has(s.id));for(const id of s.relatedStories||[])assert.ok(ids(stories).has(id));}
unique(QUIZ,'自测题');unique(QUIZ.map(q=>({id:q.q})),'自测题干');
assert.equal(QUIZ.length,60);
for(const topic of QUIZ_TOPICS)assert.ok(QUIZ.filter(q=>q.topic===topic).length>=8,`主题题目不足 ${topic}`);
for(const type of Object.keys(QUIZ_TYPES))assert.ok(QUIZ.some(q=>q.type===type),`缺少自测题型 ${type}`);
for(const q of QUIZ){
  references(q);
  assert.ok(QUIZ_TOPICS.includes(q.topic)&&QUIZ_TYPES[q.type],`自测题分类不正确 ${q.id}`);
  assert.ok(q.q.length>=12&&q.explain.length>=45,`题干或解析不完整 ${q.id}`);
  assert.equal(new Set(q.options).size,q.options.length,`选项重复 ${q.id}`);
  assert.equal(q.options.length,q.type==='boolean'?2:4,`选项不完整 ${q.id}`);
  assert.ok(q.answers.length>0&&q.answers.every(a=>Number.isInteger(a)&&a>=0&&a<q.options.length),`答案无效 ${q.id}`);
  assert.equal(new Set(q.answers).size,q.answers.length,`答案重复 ${q.id}`);
  assert.ok(q.type==='multiple'?q.answers.length>1&&q.answers.length<q.options.length:q.answers.length===1,`题型与答案不符 ${q.id}`);
  assert.ok(q.reading?.label&&q.reading.href.startsWith('#/'),`缺少延伸阅读 ${q.id}`);
  const [route,id]=q.reading.href.slice(2).split('?')[0].split('/');
  const targets={story:ids(stories),case:ids(CASES),speech:ids(SPEECHES),person:personIds};
  assert.ok(targets[route]?targets[route].has(id):['trail','sources','study','speeches','cases'].includes(route),`自测阅读路径不存在 ${q.id}`);
}
for(const c of CASES)assert.ok(QUIZ.some(q=>q.reading.href==='#/case/'+c.id),`案例未关联自测 ${c.id}`);
assert.equal(people.filter(p=>matchesContent(p,{region:'即墨'})).length,1);
assert.ok(stories.some(s=>matchesContent(s,{region:'即墨'})),'即墨故事筛选为空');
assert.equal(stories.filter(s=>matchesContent(s,{theme:'长征岁月'})).length,7);
console.log(`内容检查通过：${people.length} 位人物、${stories.length} 篇分节故事（7篇长征详文）、${CASES.length} 个案例、${landmarks.length} 处地标、${SPEECHES.length} 篇讲话、${QUIZ.length} 道自测题、${SOURCES.length} 条来源。`);
