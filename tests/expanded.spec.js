import {test,expect} from '@playwright/test';
import {readFile} from 'node:fs/promises';

test('全国人物可按地区和主题组合筛选，刷新保留筛选',async({page})=>{
  await page.goto('/#/people');await expect(page.locator('.person-card')).toHaveCount(25);
  await page.locator('.region-filter').getByRole('link',{name:'即墨',exact:true}).click();
  await expect(page.locator('.person-card')).toHaveCount(1);await expect(page.locator('.person-card h3')).toContainText('周浩然');
  await page.reload();await expect(page.locator('.person-card')).toHaveCount(1);
  await page.goto('/#/people?theme=科教报国&region=北京');await expect(page.locator('.person-card')).toHaveCount(4);
  await expect(page.locator('.person-card').first()).toContainText('钱学森');
  await page.locator('#explore-query').fill('不存在的测试人物');await page.getByRole('button',{name:'搜索',exact:true}).click();
  await expect(page.locator('.person-card')).toHaveCount(0);await expect(page.locator('.empty-state')).toContainText('没有匹配');
});

test('七篇长征故事以完整章节呈现并可导出全部正文',async({page})=>{
  for(const id of ['blanket','chen','luding','chishui-evidence','yihai-trust','red25-pioneer','red26-teamwork']){
    await page.goto('/#/story/'+id);await expect(page.locator('h1')).toBeVisible();
    expect(await page.locator('.article-section').count()).toBeGreaterThanOrEqual(6);
    const text=await page.locator('.article-section').allTextContents();expect(text.join('').length).toBeGreaterThan(1500);
    expect(await page.locator('.story-text>.source-line a').count()).toBeGreaterThanOrEqual(4);
    await expect(page.locator('.story-text > .original-reading')).toBeVisible();
    expect(await page.locator('.original-reading').evaluate(el=>el.compareDocumentPosition(document.querySelector('.article-section')) & Node.DOCUMENT_POSITION_FOLLOWING)).toBeTruthy();
    await expect(page.locator('.copyright-notice')).toContainText('如侵犯版权，请联系管理员进行删除');
    await expect(page.locator('.article-contents button')).toHaveCount(await page.locator('.article-section').count());
  }
  const pending=page.waitForEvent('download');await page.getByRole('button',{name:'导出完整研学稿'}).click();const d=await pending;
  const text=await readFile(await d.path(),'utf8');expect(text.length).toBeGreaterThan(1800);expect(text).toContain('## 史料与完整原文');
});

test('长征与即墨筛选均能找到正文而非空目录',async({page})=>{
  await page.goto('/#/study?tab=stories&theme=长征岁月');await expect(page.locator('.story-library-card')).toHaveCount(7);
  await page.goto('/#/study?tab=stories&region=即墨');await expect(page.locator('.story-library-card').first()).toContainText('周浩然');
  await page.locator('.story-library-card').first().click();await expect(page.locator('.article-section')).not.toHaveCount(0);
});

test('讲话栏目包含日期、场合、官方原文、导读和已读记忆',async({page})=>{
  await page.goto('/#/speeches');await expect(page.locator('.speech-card')).toHaveCount(7);
  await page.getByRole('link',{name:'科技创新',exact:true}).click();await expect(page.locator('.speech-card')).toHaveCount(2);
  await page.goto('/#/speech/speech-scientists');await expect(page.locator('h1')).toContainText('在科学家座谈会上的讲话');
  await expect(page.locator('.speech-detail>header')).toContainText('2020-09-11');
  await expect(page.getByRole('link',{name:'打开官方完整原文'})).toHaveAttribute('href','https://www.cac.gov.cn/2020-09/11/c_1601383688531304.htm');
  expect(await page.locator('.speech-original').evaluate(el=>el.compareDocumentPosition(document.querySelector('.speech-reading-notes')) & Node.DOCUMENT_POSITION_FOLLOWING)).toBeTruthy();
  await expect(page.locator('.speech-original .copyright-notice a')).toHaveAttribute('href','https://github.com/MyOnlySnow/zhengtu-xinhuo/issues/new?template=copyright.yml');
  await expect(page.locator('.speech-points li')).toHaveCount(3);
  await page.getByRole('button',{name:'标记已读',exact:true}).click();await page.reload();
  await expect(page.getByRole('button',{name:'✓ 已读',exact:true})).toBeVisible();
});

test('全国地标筛选、人物详情与故事来源相互关联',async({page})=>{
  await page.goto('/#/map');expect(await page.locator('.map-place').count()).toBeGreaterThan(30);
  await page.locator('.region-filter').getByRole('link',{name:'即墨',exact:true}).click();await expect(page.locator('.map-place')).toHaveCount(2);
  await page.goto('/#/person/zhangguimei?tab=landmarks');await page.locator('.landmark-card').first().click();
  await expect(page.locator('.place-detail h2')).toContainText('女子高级中学');
  await expect(page.locator('.place-detail')).toContainText('教学');
  await page.getByRole('link',{name:'走近张桂梅'}).click();await expect(page.locator('.person-title h1')).toHaveText('张桂梅');
});

test('典型工程案例包含难题、方法、成果、实践与来源',async({page})=>{
  await page.goto('/#/cases');await expect(page.locator('.case-card')).toHaveCount(9);
  await page.locator('.case-card').first().click();await expect(page.locator('.article-section')).toHaveCount(3);
  await expect(page.locator('.case-lessons')).toContainText('试着做一做');
  await expect(page.locator('.source-line a').first()).toHaveAttribute('href',/^https:\/\//);
  await page.getByRole('link',{name:'开始我的攻关计划'}).click();await expect(page.locator('#challenge-form')).toBeVisible();
});

test('新增页面在手机和GitHub子路径下保持可读并无脚本异常',async({page})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.setViewportSize({width:390,height:844});
  for(const path of ['#/people?region=北京','#/study?tab=stories&theme=长征岁月','#/speeches','#/speech/speech-scientists','#/cases','#/case/beidou-global','#/story/yihai-trust','#/map?region=即墨']){
    await page.goto('http://127.0.0.1:4174/zhengtu-xinhuo/'+path);await expect(page.locator('h1')).toBeVisible();
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),path).toBeTruthy();
    await expect.poll(()=>page.locator('img').evaluateAll(imgs=>imgs.every(i=>i.complete&&i.naturalWidth>0))).toBeTruthy();
  }
  expect(errors).toEqual([]);
});
