import {test,expect} from '@playwright/test';

async function positionAt(page,control) {
  await control.evaluate(el=>window.scrollTo({top:scrollY+el.getBoundingClientRect().top-160,behavior:'instant'}));
  return control.evaluate(el=>el.getBoundingClientRect().top);
}

async function expectPosition(control,top) {
  await expect.poll(()=>control.evaluate(el=>el.getBoundingClientRect().top)).toBeCloseTo(top,0);
}

for(const width of [1440,390]){
  test(`${width}px：故事、人物与地标的组合筛选、搜索、清除和历史保留位置`,async({page})=>{
    await page.setViewportSize({width,height:700});
    const errors=[];page.on('pageerror',e=>errors.push(e.message));
    const views=[
      {path:'study?tab=stories',topic:'长征岁月',region:'四川',term:'泸定',cards:'.story-library-card',title:'一座桥，一条向前的路'},
      {path:'people',topic:'革命岁月',region:'即墨',term:'周浩然',cards:'.person-card',title:'周浩然'},
      {path:'map',topic:null,region:'即墨',term:'周浩然',cards:'.map-place',title:'周浩然'},
    ];
    for(const view of views){
      await page.goto('http://127.0.0.1:4174/zhengtu-xinhuo/#/'+view.path);
      const filters=page.locator('.explore-filters');
      await expect(filters).toBeVisible();
      const initialCount=await page.locator(view.cards).count();
      const theme=filters.locator('.filter-row:not(.region-filter)');
      if(view.topic){
        await positionAt(page,theme);
        const selected=theme.getByRole('link',{name:view.topic,exact:true});
        const top=await theme.evaluate(el=>el.getBoundingClientRect().top);
        await selected.click();await expect(selected).toHaveClass(/selected/);
        await expect(selected).toBeFocused();await expectPosition(theme,top);
        await selected.click();await expectPosition(theme,top);
      }
      const regions=filters.locator('.region-filter');
      await positionAt(page,regions);
      const top=await regions.evaluate(el=>el.getBoundingClientRect().top);
      const region=regions.getByRole('link',{name:view.region,exact:true});
      await region.focus();await page.keyboard.press('Enter');
      await expect(region).toHaveClass(/selected/);await expect(region).toBeFocused();
      await expectPosition(regions,top);
      await expect(page.locator(view.cards).first()).toContainText(view.title);

      const input=filters.locator('input[name="q"]');
      await positionAt(page,input);await input.fill(view.term);
      const inputTop=await input.evaluate(el=>el.getBoundingClientRect().top);
      await input.press('Enter');await expect(input).toBeFocused();
      await expectPosition(input,inputTop);
      await expect(page.locator(view.cards)).toHaveCount(1);
      await input.fill('没有这条记录');await input.press('Enter');
      await expect(page.locator(view.cards)).toHaveCount(0);
      await expectPosition(input,inputTop);
      await expect(input).toBeFocused();
      await page.goBack();await expect(input).toHaveValue(view.term);
      await expect(page.locator(view.cards)).toHaveCount(1);await expectPosition(input,inputTop);
      await page.goForward();await expect(input).toHaveValue('没有这条记录');
      await expect(page.locator(view.cards)).toHaveCount(0);await expectPosition(input,inputTop);

      const clear=page.getByRole('link',{name:'清除筛选',exact:true});
      if(await clear.count()){
        await positionAt(page,clear);
        const clearTop=await clear.evaluate(el=>el.getBoundingClientRect().top);
        await clear.click();await expect(page.locator(view.cards)).toHaveCount(initialCount);
        await expectPosition(clear,clearTop);await expect(clear).toBeFocused();
        await expect(input).toHaveValue('');
      }else{
        await input.fill('');await input.press('Enter');
        await expect(page.locator(view.cards)).not.toHaveCount(0);
        await positionAt(page,regions);
        const allRegions=regions.getByRole('link',{name:'全国',exact:true});
        const regionTop=await regions.evaluate(el=>el.getBoundingClientRect().top);
        await allRegions.click();await expect(allRegions).toHaveClass(/selected/);
        await expectPosition(regions,regionTop);
      }
      expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBeTruthy();
    }
    expect(errors).toEqual([]);
  });

  test(`${width}px：讲话、案例和人物详情切换保留筛选与标签位置`,async({page})=>{
    await page.setViewportSize({width,height:700});
    for(const view of [
      {path:'speeches',control:'讲话主题筛选',name:'科技创新',cards:'.speech-card',count:2},
      {path:'cases',control:'案例领域',name:null,cards:'.case-card'},
      {path:'person/dengenming',control:'人物详情',name:'影像与资料',cards:'.detail-body .resource-list'},
    ]){
      await page.goto('/#/'+view.path);
      const filters=page.getByRole('navigation',{name:view.control});
      const target=view.name?filters.getByRole('link',{name:view.name,exact:true}):filters.getByRole('link').nth(1);
      const first=filters.getByRole('link').first();
      const top=await positionAt(page,filters);
      await target.click();await expect(target).toHaveClass(/active/);
      await expect(target).toBeFocused();await expectPosition(filters,top);
      if(view.count)await expect(page.locator(view.cards)).toHaveCount(view.count);
      else await expect(page.locator(view.cards)).not.toHaveCount(0);
      await first.click();await expect(first).toHaveClass(/active/);await expectPosition(filters,top);
      await page.goBack();await expect(target).toHaveClass(/active/);await expectPosition(filters,top);
      await page.reload();await expect(target).toHaveClass(/active/);
    }
  });
}

test('长征体验切换保留标签位置，地址、路径导航与独立窗口入口同步',async({page})=>{
  for(const width of [1440,390]){
    await page.setViewportSize({width,height:700});await page.goto('/#/trail');
    const tabs=page.getByRole('navigation',{name:'长征研学体验'});
    const top=await positionAt(page,tabs);
    for(const [name,src,breadcrumb] of [
      ['长征足迹年表','footprints/index.html?period=march&view=browse&lang=zh-CN','长征足迹年表'],
      ['轻量路线图','light-march/index.html','轻量长征路线图'],
    ]){
      const tab=tabs.getByRole('link',{name,exact:true});await tab.click();
      await expect(tab).toHaveAttribute('aria-current','page');await expect(tab).toBeFocused();
      await expectPosition(tabs,top);
      await expect(page.locator('.trail-frame')).toHaveAttribute('src',src);
      await expect(page.locator('.trail-heading a')).toHaveAttribute('href',new RegExp(src.split('?')[0].replaceAll('.','\\.')));
      await expect(page.locator('.breadcrumb li').last()).toHaveText(breadcrumb);
    }
    await page.goBack();await expect(tabs.getByRole('link',{name:'长征足迹年表',exact:true})).toHaveClass(/active/);
    await expectPosition(tabs,top);
    const frame=page.frameLocator('.trail-frame');
    await positionAt(page,page.locator('.trail-frame'));
    if(width===390)await frame.locator('#journey-toggle').click();
    const outerScroll=await page.evaluate(()=>scrollY);
    await frame.locator('#journey-search').fill('泸定桥');
    await expect(frame.locator('.journey-item')).toHaveCount(1);
    await frame.locator('.journey-item').click();
    await expect(frame.locator('#current-event-card')).toContainText('飞夺泸定桥');
    expect(await page.evaluate(()=>scrollY)).toBe(outerScroll);
  }
});

test('筛选后打开详情、切换研学栏目及主导航正常从页首开始',async({page})=>{
  await page.goto('/#/study?tab=stories');
  await page.locator('.filter-row').first().getByRole('link',{name:'长征岁月',exact:true}).click();
  await page.locator('.story-library-card').first().click();
  await expect(page.locator('.story-detail')).toBeVisible();
  await expect.poll(()=>page.evaluate(()=>scrollY)).toBe(0);
  await page.goto('/#/study');
  await page.getByRole('navigation',{name:'学习资料分类'}).getByRole('link',{name:'重要讲话'}).click();
  await page.getByRole('navigation',{name:'研学栏目'}).getByRole('link',{name:'讲 · 故事与宣讲'}).click();
  await expect(page.locator('.explore-filters')).toBeVisible();
  await expect.poll(()=>page.evaluate(()=>scrollY)).toBe(0);
  await page.goto('/#/speeches');
  await page.getByRole('navigation',{name:'讲话主题筛选'}).getByRole('link',{name:'科技创新'}).click();
  await page.getByRole('button',{name:'展开学思践悟菜单'}).click();
  await page.locator('#study-menu').getByRole('link',{name:'重要讲话',exact:true}).click();
  await expect(page.locator('.speech-card')).toHaveCount(7);
  await expect.poll(()=>page.evaluate(()=>scrollY)).toBe(0);
});
