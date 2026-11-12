// SPDX-License-Identifier: GPL-3.0-only
// Packaging adaptations for sansan0/mao-map (GPL-3.0).
import {cp,readFile,writeFile} from 'node:fs/promises';
import path from 'node:path';

export async function buildFootprints(root,dist) {
  const output=path.join(dist,'footprints');
  await cp(path.join(root,'vendor/mao-map'),output,{recursive:true});
  const journey=path.join(output,'assets/js/journey.js');
  let text=await readFile(journey,'utf8');
  text=text.replace("let viewMode = preference('view-mode', ['playback', 'browse'], 'playback');", "let viewMode = new URLSearchParams(location.search).get('view') === 'browse' ? 'browse' : preference('view-mode', ['playback', 'browse'], 'playback');");
  text=text.replace("let selectedPeriod = preference('period', ['all', ...periods.map(period => period.id)], 'all');", "let selectedPeriod = new URLSearchParams(location.search).get('period') === 'march' ? 'march' : preference('period', ['all', ...periods.map(period => period.id)], 'all');");
  const scrollAnchor="    item.scrollIntoView({ block: 'nearest', behavior: 'auto' });";
  if(!text.includes(scrollAnchor))throw Error('足迹地图列表定位接口已改变，请复核适配');
  text=text.replace(scrollAnchor,`    const list = $('journey-list');
    const itemTop = item.getBoundingClientRect().top - list.getBoundingClientRect().top + list.scrollTop;
    if (itemTop < list.scrollTop) list.scrollTop = itemTop;
    else if (itemTop + item.offsetHeight > list.scrollTop + list.clientHeight) {
      list.scrollTop = itemTop + item.offsetHeight - list.clientHeight;
    }`);
  await writeFile(journey,text);
  const app=path.join(output,'assets/js/app.js');
  text=await readFile(app,'utf8');
  const initial="showEventAtIndex(0, false, true);";
  if(!text.includes(initial))throw Error('足迹地图上游初始化接口已改变，请复核适配');
  text=text.replace(initial,"showEventAtIndex(new URLSearchParams(location.search).get('period') === 'march' ? Math.max(0, trajectoryData.events.findIndex(event => Number.parseInt(event.date, 10) >= 1934)) : 0, false, true);");
  await writeFile(app,text);
  // Keep the original community datasets in vendor/. Apply these documented
  // corrections only to the published edition, in both available languages.
  const reference='https://www.dswxyjy.org.cn/GB/427277/462086/index.html';
  for(const [file,isEnglish] of [['mao_trajectory_events.json',false],['mao_trajectory_events_en.json',true]]) {
    const target=path.join(output,'data',file);
    const data=JSON.parse(await readFile(target,'utf8'));
    for(const event of data.events) {
      if(event.date==='1934-10-10') {
        event.date='1934-10';
        event.event=isEnglish?'The Central Red Army begins its Long March in mid-October.':'1934年10月中旬，中央红军主力开始长征';
        event.verification=`${isEnglish?'Chronology, Institute of Party History and Literature:':'依据：中央党史和文献研究院长征专题大事记。'} ${reference}`;
      }
      if(event.date==='1935-10-19') {
        event.event=isEnglish?'The Central Red Army reaches Wuqi and completes its Long March. The three main Red Army forces meet in October 1936.':'中央红军主力到达陕北吴起镇，胜利结束自身长征；三大主力会师在1936年10月';
        event.verification=`${isEnglish?'Distinguish the Central Red Army’s arrival from the 1936 reunions:':'注意区分中央红军主力到达陕北与1936年三大主力会师。依据：'} ${reference}`;
      }
      if(event.date==='1935-06-17') {
        event.date='1935-06';
        event.event=isEnglish?'In mid-June, the Central Red Army crosses Jiajin Mountain and joins the Fourth Front Army in the Maogong area.':'6月中旬，中央红军翻越夹金山，与红四方面军在四川懋功地区会师';
        event.verification=`${isEnglish?'Month-level chronology; individual units crossed on different days:':'按官方大事记采用月份口径，各部队翻越日期不同。依据：'} ${reference}`;
      }
    }
    await writeFile(target,JSON.stringify(data,null,2)+'\n');
  }
  await writeFile(path.join(output,'ADAPTATIONS.md'),`# 征途·薪火集成说明\n\n上游：sansan0/mao-map，固定版本 fd624f1492282fe6cf101922b64448c325de938c，GPL-3.0。\n\n网页源码与适配脚本：https://github.com/MyOnlySnow/zhengtu-xinhuo/tree/main/vendor/mao-map
适配脚本：https://github.com/MyOnlySnow/zhengtu-xinhuo/blob/main/scripts/build-footprints.mjs。\n\n修改日期：2026-11-13。支持 period=march 与 view=browse 深链接，默认定位到长征时期。发布数据区分1935年中央红军到达陕北与1936年三大主力会师；出发和夹金山采用官方月份口径，中英文同步。列表定位只滚动自身，避免内嵌时带动网站外层页面。原始社区数据保存在源码目录。\n\n年表其余记录由上游社区整理，来源待核查状态仍原样显示，不能代替本站官方史料。地图为近似航点示意。\n`);
}
