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

test('数字研学入口说明本地与原站体验，长征详文保持可读',async({page})=>{
  await page.goto('/#/trail?mode=resources');
  await expect(page.locator('.march-resource-card')).toHaveCount(4);
  await expect(page.locator('iframe')).toHaveCount(0);
  const battle=page.getByRole('link',{name:'前往战役推演'});
  await expect(battle).toHaveAttribute('target','_blank');
  await expect(battle).toHaveAttribute('href','https://redwisdom.vercel.app/campaign.html');
  await expect(page.getByRole('link',{name:'走进哈达铺街区'})).toHaveAttribute('href','https://leizhidong-creator.github.io/Red-Army-Street/');
  await expect(page.locator('.march-reading>a')).toHaveCount(7);
  await page.locator('.march-reading>a').first().click();
  await expect(page.locator('.article-section')).toHaveCount(7);
});

test('手机与GitHub子路径可加载足迹地图和数字研学入口',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  for(const mode of ['footprints','resources']) {
    await page.goto('http://127.0.0.1:4174/zhengtu-xinhuo/#/trail?mode='+mode);
    await expect(page.locator('h1')).toHaveText('重走长征路');
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBeTruthy();
    if(mode==='footprints') {
      const frame=page.frameLocator('.trail-frame');
      await expect(frame.locator('.journey-item')).toHaveCount(16);
      expect(await frame.locator('html').evaluate(el=>el.scrollWidth<=innerWidth+1)).toBeTruthy();
    }
  }
});
