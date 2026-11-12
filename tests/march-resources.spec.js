import {test,expect} from '@playwright/test';

test('长征体验切换保留地址，并在本地加载足迹年表和地图',async({page,request})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('/#/trail');
  await expect(page.locator('.trail-frame')).toHaveAttribute('src','trail/index.html');
  await page.getByRole('link',{name:'长征足迹年表',exact:true}).click();
  await expect(page).toHaveURL(/mode=footprints/);
  await expect(page.locator('.trail-frame')).toHaveAttribute('src','footprints/index.html?period=march&view=browse&lang=zh-CN');
  const frame=page.frameLocator('.trail-frame');
  await expect(frame.locator('.journey-item')).toHaveCount(16);
  await expect(frame.locator('#period-select')).toHaveValue('march');
  await expect(frame.locator('.journey-item').first()).toContainText('1934-10');
  await frame.locator('#journey-search').fill('泸定桥');
  await expect(frame.locator('.journey-item')).toHaveCount(1);
  await frame.locator('.journey-item').click();
  await expect(frame.locator('#current-event-card')).toContainText('飞夺泸定桥');
  await expect(frame.locator('.leaflet-container')).toBeVisible();
  await page.reload();await expect(frame.locator('#period-select')).toHaveValue('march');
  for(const resource of ['/footprints/LICENSE','/footprints/ADAPTATIONS.md','/footprints/libs/lucide/LICENSE']) {
    expect((await request.get(resource)).ok(),resource).toBeTruthy();
  }
  for(const name of ['mao_trajectory_events.json','mao_trajectory_events_en.json']) {
    const data=await (await request.get('/footprints/data/'+name)).json();
    const arrival=data.events.find(event=>event.date==='1935-10-19');
    expect(arrival.event).toContain('1936');
    expect(arrival.verification).toContain('https://www.dswxyjy.org.cn/');
  }
  expect(errors).toEqual([]);
});

test('拓展资源仅提供本站数字体验，旧资源地址兼容且长征详文保持可读',async({page})=>{
  await page.goto('/#/trail?mode=resources');
  await expect(page).toHaveURL(/#\/resources$/);
  await expect(page.locator('.march-resource-card')).toHaveCount(3);
  await expect(page.locator('iframe')).toHaveCount(0);
  expect(await page.locator('.march-resource-actions .button').evaluateAll(links=>links.every(a=>a.getAttribute('href').startsWith('#/')&&!a.target))).toBeTruthy();
  await page.getByRole('link',{name:'进入长征沙盘',exact:false}).click();
  await expect(page.locator('.march-reading>a')).toHaveCount(7);
  await page.locator('.march-reading>a').first().click();
  await expect(page.locator('.article-section')).toHaveCount(7);
});

test('手机与GitHub子路径可加载足迹地图和数字研学入口',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  for(const mode of ['footprints','light','resources']) {
    await page.goto('http://127.0.0.1:4174/zhengtu-xinhuo/#/trail?mode='+mode);
    await expect(page.locator('h1')).toHaveText(mode==='resources'?'拓展资源':'重走长征路');
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBeTruthy();
    if(mode==='footprints') {
      const frame=page.frameLocator('.trail-frame');
      await expect(frame.locator('.journey-item')).toHaveCount(16);
      expect(await frame.locator('html').evaluate(el=>el.scrollWidth<=innerWidth+1)).toBeTruthy();
    }
  }
});

test('轻量路线图本地部署：九节点、四路航点、资料来源与播放可用',async({page,request})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/*',route=>route.request().url().startsWith('http://127.0.0.1:4173')?route.continue():route.abort());
  await page.goto('/#/trail?mode=light');
  await expect(page.locator('.trail-frame')).toHaveAttribute('src','light-march/index.html');
  const frame=page.frameLocator('.trail-frame');
  await expect(frame.locator('.timeline-item')).toHaveCount(9);
  await expect(frame.locator('.leaflet-container')).toBeVisible();
  await expect(frame.locator('.detail-title')).toHaveText('于都出发');
  await expect(frame.locator('.legend')).toContainText('红二十五军');
  await frame.locator('[data-id="wuqi"]').click();
  await expect(frame.locator('.detail-desc')).toContainText('三大主力会师在1936年10月');
  await frame.locator('[data-id="luding"]').click();
  await expect(frame.getByRole('link',{name:'阅读站内完整故事'})).toHaveAttribute('href','../#/story/luding');
  await frame.locator('#playBtn').click();await expect(frame.locator('#playBtn')).toHaveAttribute('aria-pressed','true');
  await frame.locator('#playBtn').click();await expect(frame.locator('#playBtn')).toHaveAttribute('aria-pressed','false');
  await frame.locator('[data-id="xiangjiang"]').focus();await page.keyboard.press('Enter');
  await expect(frame.locator('.detail-title')).toHaveText('血战湘江');
  await expect(frame.getByRole('link',{name:'党史专题与史料出处'})).toHaveAttribute('target','_blank');
  for(const file of ['ADAPTATIONS.md','UPSTREAM-README.md'])expect((await request.get('/light-march/'+file)).ok()).toBeTruthy();
  expect(errors).toEqual([]);
});

test('轻量路线图在手机到桌面及项目子路径中均可读',async({page})=>{
  for(const width of [320,390,768,1440]){
    await page.setViewportSize({width,height:900});
    await page.goto('http://127.0.0.1:4174/zhengtu-xinhuo/#/trail?mode=light');
    const frame=page.frameLocator('.trail-frame');await expect(frame.locator('.timeline-item')).toHaveCount(9);
    expect(await frame.locator('html').evaluate(el=>el.scrollWidth<=innerWidth+1)).toBeTruthy();
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBeTruthy();
    await frame.locator('[data-id="huining"]').click();await expect(frame.locator('.detail-title')).toHaveText('三大主力会师');
  }
});
