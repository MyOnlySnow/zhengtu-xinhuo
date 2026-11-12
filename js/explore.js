export const REGION_SHORTCUTS=['全国','山东','青岛','即墨','湖南','四川','贵州','北京','云南','广西','河南','黑龙江'];
export function isInRegion(item,region) {
  if(!region||region==='全国'||region==='全部')return true;
  const locations=[item.province,item.city,item.district,...(item.regions||[])].filter(Boolean);
  return locations.some(r=>r===region||r.replace(/(省|市|区)$/,'')===region);
}
export function matchesContent(item,{region='',theme='',q=''}={}) {
  const topic=item.theme||item.period;
  const text=[item.name,item.title,item.identity,item.intro,item.summary,item.province,item.city,item.district,...(item.tags||[])].filter(Boolean).join(' ').toLowerCase();
  return isInRegion(item,region)&&(!theme||theme==='全部'||topic===theme||(item.tags||[]).includes(theme))&&text.includes(q.trim().toLowerCase());
}
export function storySections(story) {
  if(story.sections?.length)return story.sections;
  return [{title:'故事正文',paragraphs:story.paragraphs||[]}];
}
export function storyLength(story) {
  return storySections(story).reduce((n,s)=>n+s.paragraphs.join('').length,0);
}
