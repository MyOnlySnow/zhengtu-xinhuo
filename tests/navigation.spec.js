import {test,expect} from '@playwright/test';
import {STORIES,CASES,SPEECHES} from '../js/catalog.js';

test('主导航只有三个入口，学习与资源栏目归入下级菜单',async({page})=>{
  await page.goto('/');await expect(page.locator('h1')).toBeVisible();
  await expect(page.locator('#main-nav .nav-entry > a')).toHaveText(['首页','学思践悟','拓展资源']);
  await expect(page.locator('.header-action')).toHaveCount(0);
  await page.locator('#main-nav .nav-entry').getByRole('link',{name:'拓展资源',exact:true}).click();
  await expect(page).toHaveURL(/#\/trail$/);await expect(page.locator('.breadcrumb li')).toHaveText(['首页','长征沙盘']);
  await page.locator('#main-nav .nav-entry').getByRole('link',{name:'首页',exact:true}).click();
  await page.getByRole('button',{name:'展开学思践悟菜单'}).click();
  await expect(page.locator('#study-menu')).toBeVisible();
  for(const name of ['重要讲话','人物故事','故事共读与宣讲','典型案例','科研攻关计划','研学自测','我的研学'])await expect(page.locator('#study-menu').getByRole('link',{name,exact:true})).toBeVisible();
  await page.getByRole('button',{name:'展开拓展资源菜单'}).click();
  await expect(page.locator('#study-menu')).toBeHidden();await expect(page.locator('#resources-menu')).toBeVisible();
  await page.locator('#resources-menu').getByRole('link',{name:'全部拓展资源',exact:true}).click();
  await expect(page.locator('h1')).toHaveText('拓展资源');
  await expect(page.locator('[data-nav="resources"]')).toHaveClass(/active/);
  await expect(page.locator('#resources-menu')).toBeHidden();
});

test('首页和沙盘删除重复数字体验栏目，不提供GitHub跳转卡片',async({page})=>{
  await page.goto('/');
  await expect(page.locator('h1')).toBeVisible();
  await expect(page.locator('.digital-hub')).toHaveCount(0);
  await expect(page.locator('.march-resource-card')).toHaveCount(0);
  await expect(page.locator('main')).not.toContainText('循着地图，走进历史现场');
  await expect(page.locator('main a[href*="github.com"]')).toHaveCount(0);
  for(const route of ['#/','#/resources','#/trail','#/trail?mode=footprints','#/trail?mode=light','#/sources']){
    await page.goto('/'+route);await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('a[href*="redwisdom"],a[href*="Red-Army-Street"]')).toHaveCount(0);
    await expect(page.locator('main')).not.toContainText('哈达铺红军街');
    await expect(page.locator('main')).not.toContainText('长征战役立体推演');
    if(route.startsWith('#/trail')){
      await expect(page.locator('main')).not.toContainText('数字研学拓展');
      await expect(page.locator('.march-resource-card')).toHaveCount(0);
      await expect(page.locator('main a[href*="github.com"]')).toHaveCount(0);
      await expect(page.locator('.trail-frame')).toBeVisible();
    }
  }
  await page.goto('/#/resources');
  expect(await page.locator('.march-resource-card a').evaluateAll(links=>links.every(a=>a.getAttribute('href').startsWith('#/')))).toBeTruthy();
});

test('平板菜单支持键盘关闭与重新导航，手机入口不溢出',async({page})=>{
  for(const width of [320,390,768,1024]) {
    await page.setViewportSize({width,height:900});
    await page.goto('/');
    const toggle=page.getByRole('button',{name:'展开导航'});
    await expect(toggle).toBeVisible();
    await toggle.click();
    await expect(page.locator('#main-nav')).toBeVisible();
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBeTruthy();
    await page.keyboard.press('Escape');
    await expect(toggle).toBeFocused();
    await expect(toggle).toHaveAttribute('aria-expanded','false');
    await expect(page.locator('#main-nav')).toBeHidden();
    await toggle.click();
    await page.getByRole('button',{name:'展开学思践悟菜单'}).click();
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBeTruthy();
    const box=await page.locator('#study-menu').boundingBox();expect(box.x).toBeGreaterThanOrEqual(0);expect(box.x+box.width).toBeLessThanOrEqual(width);
    await page.locator('#main-nav').getByRole('link',{name:'人物故事',exact:true}).click();
    await expect(page.locator('h1')).toHaveText('与榜样同行');
    await expect(toggle).toHaveAttribute('aria-expanded','false');
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBeTruthy();
  }
});

test('各栏目与详情页的路径导航、当前主栏目及返回链接一致',async({page})=>{
  const story=STORIES.find(s=>s.id==='blanket'),c=CASES.find(c=>c.id==='beidou-global'),speech=SPEECHES.find(s=>s.id==='speech-scientists');
  const routes=[
    ['study',['首页','学思践悟'],'学思践悟'],
    ['study?tab=stories',['首页','学思践悟','故事共读与宣讲'],'学思践悟'],
    ['study?tab=practice',['首页','学思践悟','科研攻关计划'],'学思践悟'],
    ['study?tab=quiz',['首页','学思践悟','研学自测'],'学思践悟'],
    ['people',['首页','学思践悟','人物故事'],'学思践悟'],
    ['person/dengenming?tab=media',['首页','学思践悟','人物故事','邓恩铭'],'学思践悟'],
    ['story/blanket',['首页','学思践悟','故事共读与宣讲',story.title],'学思践悟'],
    ['speeches',['首页','学思践悟','重要讲话'],'学思践悟'],
    ['speech/speech-scientists',['首页','学思践悟','重要讲话',speech.title],'学思践悟'],
    ['cases',['首页','学思践悟','典型案例'],'学思践悟'],
    ['case/beidou-global',['首页','学思践悟','典型案例',c.title],'学思践悟'],
    ['notebook',['首页','学思践悟','我的研学'],'学思践悟'],
    ['trail',['首页','长征沙盘'],'拓展资源'],
    ['trail?mode=footprints',['首页','长征沙盘','长征足迹年表'],'拓展资源'],
    ['trail?mode=light',['首页','长征沙盘','轻量长征路线图'],'拓展资源'],
    ['resources',['首页','拓展资源'],'拓展资源'],
    ['sources',['首页','拓展资源','内容与项目来源'],'拓展资源'],
    ['map',['首页','拓展资源','研学地图'],'拓展资源'],
    ['map?place=luding',['首页','拓展资源','研学地图','泸定桥'],'拓展资源'],
  ];
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  for(const [path,labels,group] of routes){
    await page.goto('/#/'+path);await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('main > .breadcrumb')).toHaveCount(1);
    await expect(page.locator('.breadcrumb li'),path).toHaveText(labels);
    await expect(page.locator('.breadcrumb [aria-current="page"]')).toHaveText(labels.at(-1));
    await expect(page.locator('#main-nav .nav-entry > a[aria-current="page"]')).toHaveText(group);
    await expect(page.locator('.breadcrumb a').first()).toHaveAttribute('href','#/');
    await expect.poll(()=>page.evaluate(()=>scrollY),path).toBe(0);
  }
  await page.setViewportSize({width:320,height:800});
  await page.goto('/#/speech/speech-scientists');await expect(page.locator('.breadcrumb li')).toHaveCount(4);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBeTruthy();
  await page.locator('.breadcrumb a').nth(2).click();await expect(page).toHaveURL(/#\/speeches$/);
  await page.locator('.breadcrumb a').first().click();await expect(page.locator('h1')).toContainText('循着信仰的足迹');
  await expect(page.locator('.breadcrumb')).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('桌面下级导航支持键盘进入、Escape和点击空白关闭',async({page})=>{
  await page.goto('/');await expect(page.locator('h1')).toBeVisible();
  const toggle=page.getByRole('button',{name:'展开学思践悟菜单'});
  await toggle.focus();await page.keyboard.press('ArrowDown');
  await expect(page.locator('#study-menu a').first()).toBeFocused();
  await page.keyboard.press('Escape');await expect(toggle).toBeFocused();
  await expect(page.locator('#study-menu')).toBeHidden();
  await toggle.click();await page.locator('.hero h1').click();
  await expect(toggle).toHaveAttribute('aria-expanded','false');
  await page.getByRole('button',{name:'展开拓展资源菜单'}).click();
  await page.locator('#resources-menu').getByRole('link',{name:'研学地图',exact:true}).click();
  await expect(page.locator('[data-nav="resources"]')).toHaveClass(/active/);
  await page.goto('/#/case/beidou-global');await expect(page.locator('.case-detail h1')).toBeVisible();
  await expect(page.locator('[data-nav="study"]')).toHaveClass(/active/);
  await toggle.click();await expect(page.locator('#study-menu a[aria-current="page"] .nav-link-title')).toHaveText('典型案例');
});

test('支部内容在首页完整展示，旧关于页定位到首页支部区域',async({page})=>{
  await page.goto('/');await expect(page.locator('#branch')).toContainText('山东大学计算机科学与技术学院学硕第三党支部');
  await expect(page.locator('#branch')).toContainText('支部活动与作品');
  await expect(page.locator('#branch')).toContainText('以学铸魂');
  await page.goto('/#/about');await expect(page).toHaveURL(/#\/\?section=branch$/);
  await expect(page.locator('#branch-title')).toBeFocused();
  await expect(page.locator('#branch-title')).toBeInViewport();
  await expect(page.locator('h1')).toContainText('循着信仰的足迹');
  await expect(page.locator('[data-nav="home"]')).toHaveClass(/active/);
});
