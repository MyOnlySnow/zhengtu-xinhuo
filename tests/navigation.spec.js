import {test,expect} from '@playwright/test';

test('主导航只有三个入口，学习与资源栏目归入下级菜单',async({page})=>{
  await page.goto('/');await expect(page.locator('h1')).toBeVisible();
  await expect(page.locator('#main-nav .nav-entry > a')).toHaveText(['首页','学思践悟','拓展资源']);
  await expect(page.locator('.header-action')).toHaveCount(0);
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
    await page.locator('#main-nav').getByRole('link',{name:'人物故事',exact:true}).click();
    await expect(page.locator('h1')).toHaveText('与榜样同行');
    await expect(toggle).toHaveAttribute('aria-expanded','false');
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBeTruthy();
  }
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
  await toggle.click();await expect(page.locator('#study-menu a[aria-current="page"]')).toHaveText('典型案例');
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
