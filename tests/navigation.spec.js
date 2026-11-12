import {test,expect} from '@playwright/test';

test('首页直接展示年表、战役与三维街区入口',async({page})=>{
  await page.goto('/');
  const hub=page.locator('.digital-hub');
  await expect(hub.locator('.march-resource-card')).toHaveCount(3);
  await expect(hub.getByRole('link',{name:'前往战役推演'})).toHaveAttribute('href','https://redwisdom.vercel.app/campaign.html');
  await expect(hub.getByRole('link',{name:'走进哈达铺街区'})).toHaveAttribute('target','_blank');
  await hub.getByRole('link',{name:'打开足迹年表'}).click();
  await expect(page).toHaveURL(/mode=footprints/);
  await expect(page.locator('.march-tabs .active')).toHaveText('长征足迹年表');
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
    await page.locator('#main-nav').getByRole('link',{name:'人物故事',exact:true}).click();
    await expect(page.locator('h1')).toHaveText('与榜样同行');
    await expect(toggle).toHaveAttribute('aria-expanded','false');
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBeTruthy();
  }
});
