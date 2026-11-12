import { SOURCES as BASE_SOURCES, STORIES as BASE_STORIES, EXTRA_PEOPLE, MARCH_LANDMARKS, EVENTS, QUIZ } from './data.js';
import { SPEECHES, SPEECH_SOURCES } from './speeches.js';
import { HISTORY_PEOPLE, HISTORY_STORIES, HISTORY_SOURCES, HISTORY_LANDMARKS } from './history-expansion.js';
import { SCIENCE_PEOPLE, SCIENCE_STORIES, SCIENCE_CASES, SCIENCE_SOURCES, SCIENCE_LANDMARKS } from './science-expansion.js';
import { MARCH_PEOPLE, MARCH_STORIES, MARCH_SOURCES, MARCH_PLACES } from './march-expansion.js';
import { CLASSIC_STORIES, CLASSIC_SOURCES } from './march-classics.js';
import { SDU_STORIES, SDU_SOURCES, SDU_WANG } from './sdu-history.js';
import { SCIENCE_PORTRAITS } from './science-portraits.js';
import { PORTRAITS } from './portrait-assets.js';
import { QINGDAO_OVERRIDES, QINGDAO_SOURCES, QINGDAO_STORIES } from './qingdao-reviewed.js';

const CHEN_PROFILE={
  timeline:[{year:'1905',event:'出生于湖南长沙一个农民家庭。'},{year:'1925',event:'加入中国共产党。'},{year:'1927',event:'参加秋收起义，随后投身井冈山及赣南、闽西革命斗争。'},{year:'1934年3月',event:'任红五军团第三十四师师长。'},{year:'1934年10月',event:'随中央红军长征，率部承担全军后卫任务。'},{year:'1934年11—12月',event:'在湘江战役及突围中率部掩护主力，后负伤被俘、壮烈牺牲。'}],
  sourceIds:['classic-chen-person','classic-chen-hunan','classic-chen-archive','classic-chen-commemoration'],
  stories:[
    {title:'后卫部队承担的共同责任',content:'中央红军开始长征后，陈树湘率红三十四师担负后卫任务，掩护中央机关与主力。后卫部队经常需要同追兵作战，为前方队伍争取时间。湘江战役中，这种分工意味着在不利处境下继续承担阻击责任。读这段历史时，不应只看到一个英雄称号，还应把部队任务、与主力的位置关系以及广大指战员的付出放进完整叙述，理解个人担当和集体行动之间的联系。',sourceIds:['classic-chen-person','classic-chen-hunan']},
    {title:'从旧报纸中寻找历史的细节',content:'湖南省档案馆保存的旧报纸复制件，为后来者研究陈树湘的经历提供了材料。2019年湖南日报报道梳理了1934年12月多则有关其被俘与牺牲的新闻，同时走访故居和后人。旧报道形成于敌对宣传环境，称谓与描述需要在具体语境中分析，并同其他人物史料相互对照。这样的寻访提醒读者：纪念先烈也包含认真核对姓名、时间、地点和资料性质，让记忆得到有依据的传承。',sourceIds:['classic-chen-archive','classic-chen-commemoration']},
  ],
};

const unique = rows => [...new Map(rows.map(r=>[r.id,r])).values()];
export const SOURCES=unique([...BASE_SOURCES,...SPEECH_SOURCES,...HISTORY_SOURCES,...SCIENCE_SOURCES,...MARCH_SOURCES,...CLASSIC_SOURCES,...SDU_SOURCES,...QINGDAO_SOURCES]);
export const PEOPLE=unique([...EXTRA_PEOPLE.map(p=>p.id==='wangganchang'?{...p,...SDU_WANG}:p.id==='chenshuxiang'?{...p,...CHEN_PROFILE}:p),...MARCH_PEOPLE,...HISTORY_PEOPLE,...SCIENCE_PEOPLE]);
export const STORIES=unique([...BASE_STORIES,...CLASSIC_STORIES,...SDU_STORIES,...MARCH_STORIES,...HISTORY_STORIES,...SCIENCE_STORIES,...QINGDAO_STORIES]);
export const CASES=SCIENCE_CASES;
export const LANDMARKS=unique([
  ...MARCH_LANDMARKS,...MARCH_PLACES,
  ...HISTORY_LANDMARKS.map(l=>({...l,theme:HISTORY_PEOPLE.find(p=>(l.people||[]).includes(p.id))?.period||'革命岁月'})),
  ...SCIENCE_LANDMARKS.map(l=>({...l,theme:'科教报国'})),
]);
export { EVENTS, QUIZ, SPEECHES };

const BASE_GEO={
  chenshuxiang:{province:'湖南',city:'永州',district:'道县',tags:['长征精神','忠诚担当'],theme:'长征岁月'},
  wangganchang:{province:'山东',city:'青岛',district:'市南',tags:['科学家精神','山大校史'],theme:'科教报国'},
  dengenming:{province:'山东',city:'青岛',district:'市北',tags:['革命先驱','工人运动'],theme:'革命岁月'},
  liweinong:{province:'山东',city:'青岛',district:'市南',tags:['革命先驱','忠诚担当'],theme:'革命岁月'},
  zhouhaoran:{province:'山东',city:'青岛',district:'即墨',tags:['抗日救亡','青春担当'],theme:'革命岁月'},
  xuzhenchao:{province:'山东',city:'青岛',district:'黄岛',tags:['工匠精神','技术创新'],theme:'建设年代'},
  zhangliangang:{province:'山东',city:'青岛',district:'黄岛',tags:['科学家精神','港口创新'],theme:'新时代'},
  gaoweiyu:{province:'山东',city:'青岛',district:'莱西',tags:['乡村振兴','服务人民'],theme:'新时代'},
};
export function normalizePerson(p) {
  p={...p,...QINGDAO_OVERRIDES[p.id]};
  const portrait=SCIENCE_PORTRAITS[p.id]||PORTRAITS[p.id];
  const storedCredit=typeof p.photoCredit==='object'?p.photoCredit:null;
  return {landmarks:[],media:[],stories:[],timeline:[],tags:[],...p,...BASE_GEO[p.id],...(storedCredit?{photoCredit:storedCredit.credit||storedCredit.author||storedCredit.attribution||'官方人物资料图片',photoSource:storedCredit.sourceUrl||storedCredit.sourcePage||storedCredit.url}:{}),...(portrait?{photo:portrait.photo,photoCredit:portrait.credit,photoSource:portrait.sourceUrl,objectPosition:portrait.objectPosition}:{}),sourceIds:p.sourceIds||[p.source].filter(Boolean),theme:BASE_GEO[p.id]?.theme||p.theme||p.period};
}
export function normalizeStory(s) {
  const defaultGeo={blanket:['湖南','郴州','汝城'],chen:['湖南','永州','道县'],luding:['四川','甘孜','泸定'],wang:['山东','青岛','市南']};
  const geo=defaultGeo[s.id]||[];
  return {province:geo[0]||'',city:geo[1]||'',district:geo[2]||'',tags:[s.tag],...s,theme:['blanket','chen','luding'].includes(s.id)?'长征岁月':s.id==='wang'?'科教报国':s.theme||s.category||(s.period?.includes('1935')||s.period?.includes('1934')?'长征岁月':'人物故事'),sourceIds:s.sourceIds||[s.source].filter(Boolean)};
}
export function normalizeLandmark(l) {
  const isQingdao=l.region==='青岛';
  const originalPlaces={yudu:['江西','赣州','于都'],shazhou:['湖南','郴州','汝城'],zunyi:['贵州','遵义','红花岗'],luding:['四川','甘孜','泸定'],huining:['甘肃','白银','会宁']};
  const place=originalPlaces[l.id]||[];
  return {theme:isQingdao?'地方记忆':'长征岁月',province:isQingdao?'山东':place[0]||'',city:isQingdao?'青岛':place[1]||'',district:isQingdao?(l.address?.includes('即墨')?'即墨':l.address?.match(/(市北|市南|黄岛|莱西|崂山|李沧)/)?.[1]||''):place[2]||'',...l,sourceIds:l.sourceIds||[l.source].filter(Boolean)};
}

export const TOPICS=[
 {id:'march',title:'重走长征路',label:'长征岁月',intro:'从于都出发到三大主力会师，读懂一场伟大远征的历史脉络。',symbol:'征',route:'#/study?tab=stories&theme=长征岁月',className:'march'},
 {id:'heroes',title:'山河铭记的名字',label:'革命岁月',intro:'沿着革命先驱与抗战英雄的足迹，走近有姓名、有选择的人。',symbol:'铭',route:'#/people?theme=革命岁月',className:'heroes'},
 {id:'science',title:'把理想写进祖国大地',label:'科教报国',intro:'走进科学家的实验室与重大工程现场，理解求真、协作与坚持。',symbol:'创',route:'#/cases',className:'science'},
 {id:'service',title:'平凡岗位的精神坐标',label:'新时代',intro:'从教育、乡村与基层一线的具体行动中，看见奉献与担当。',symbol:'行',route:'#/people?theme=新时代',className:'service'},
];

export const LEARNING_PATHS=[
 {id:'march',title:'读懂长征',time:'约60分钟',description:'先理清路线，再精读事件，最后完成一次有史料依据的交流。',steps:[{label:'学习90周年大会讲话',href:'#/speech/speech'},{label:'在沙盘中认识四路红军',href:'#/trail'},{label:'阅读长征详细故事',href:'#/study?tab=stories&theme=长征岁月'},{label:'写下历史与现实的联系',href:'#/notebook'}]},
 {id:'science',title:'理解科学报国',time:'约50分钟',description:'从讲话、人物和工程案例出发，形成一个可验证的科研问题。',steps:[{label:'学习科学家座谈会讲话',href:'#/speech/speech-scientists'},{label:'走近科学家群像',href:'#/people?theme=科教报国'},{label:'拆解典型科研案例',href:'#/cases'},{label:'制定自己的攻关计划',href:'#/study?tab=practice'}]},
 {id:'hometown',title:'行走身边的红色记忆',time:'自主安排',description:'全国资源按地区查找，结合实地研学继续深入。',steps:[{label:'在全国人物中选择地区',href:'#/people'},{label:'在地图中关联具体地标',href:'#/map'},{label:'筛选青岛即墨人物故事',href:'#/study?tab=stories&region=即墨'},{label:'整理一份微党课提纲',href:'#/study?tab=stories'}]},
];
