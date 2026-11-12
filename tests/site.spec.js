import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';

test('首页、所有主要页面与来源可访问，图片完整，支部名称正确',async({page})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('/');await expect(page.getByRole('heading',{level:1})).toContainText('循着信仰的足迹');
  await expect(page.locator('body')).toContainText('学硕第三党支部');
  await expect(page.locator('body')).not.toContainText('专硕第二');
  await page.screenshot({path:'docs/screenshots/home-desktop.png',fullPage:true});
  for(const hash of ['#/people','#/study','#/study?tab=stories','#/study?tab=practice','#/study?tab=quiz','#/about','#/sources','#/notebook']){
    await page.goto('/'+hash);await expect(page.locator('h1')).toBeVisible();
    await expect.poll(()=>page.locator('img').evaluateAll(images=>images.every(i=>i.complete&&i.naturalWidth>0))).toBeTruthy();
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBeTruthy();
  }
  expect(errors).toEqual([]);
});

test('人物筛选、四个详情栏目、地标深链接与双向关联',async({page})=>{
  await page.goto('/#/people');
  await page.getByLabel('搜索人物姓名或身份').fill('邓恩铭');await page.getByRole('button',{name:'搜索',exact:true}).click();
  await expect(page.locator('.person-card')).toHaveCount(1);await page.locator('.person-card').click();
  await expect(page.locator('.person-title h1')).toHaveText('邓恩铭');
  await page.getByRole('link',{name:'红色故事',exact:true}).click();await expect(page.locator('details')).not.toHaveCount(0);
  await page.getByRole('link',{name:'影像与资料',exact:true}).click();await expect(page.locator('.resource-list a').first()).toHaveAttribute('target','_blank');
  await page.getByRole('link',{name:'红色印记',exact:true}).click();await page.locator('.landmark-card').first().click();
  await expect(page.locator('.place-detail h2')).toContainText('中共青岛党史纪念馆');
  await expect(page.locator('.leaflet-marker-icon')).not.toHaveCount(0);
  await expect(page.locator('.landmark-pin[title="中共青岛党史纪念馆"]')).toBeInViewport();
  await expect(page.locator('.map-area-name').first()).toBeAttached();
  await page.getByRole('link',{name:'走近邓恩铭'}).click();await expect(page.locator('.person-title h1')).toHaveText('邓恩铭');
});

test('学习标记与手记持久化、导出防止内容被当作 HTML、删除后撤销',async({page})=>{
  await page.goto('/#/study');await page.locator('[data-read="speech"]').click();await page.reload();
  await expect(page.locator('[data-read="speech"]')).toHaveText('✓ 已读');
  await page.goto('/#/notebook');
  await page.getByLabel('标题',{exact:true}).fill('我的长征学习 <script>');
  await page.getByLabel('学习体会',{exact:true}).fill('实事求是，保留失败的实验记录。<b>不应被渲染</b>');
  await page.getByRole('button',{name:'保存研学手记'}).click();await page.reload();
  await expect(page.locator('.notes-list')).toContainText('我的长征学习 <script>');
  await expect(page.locator('.notes-list b')).toHaveCount(0);
  const downloadEvent=page.waitForEvent('download');await page.getByRole('button',{name:'导出全部记录'}).click();const file=await downloadEvent;
  expect(await readFile(await file.path(),'utf8')).toContain('实事求是，保留失败的实验记录。');
  await page.getByRole('button',{name:'删除此手记'}).click();await expect(page.locator('.notes-list')).not.toContainText('我的长征学习');
  await page.getByRole('button',{name:'撤销',exact:true}).click();await expect(page.locator('.notes-list')).toContainText('我的长征学习');
});

test('故事草稿自动保存，提纲导出含创作与官方来源',async({page})=>{
  await page.goto('/#/story/blanket');await page.getByLabel('补充我的讲述与实践联系').fill('让专业能力服务同学的实际需要。');await page.reload();
  await expect(page.getByLabel('补充我的讲述与实践联系')).toHaveValue('让专业能力服务同学的实际需要。');
  const pending=page.waitForEvent('download');await page.getByRole('button',{name:'导出宣讲提纲'}).click();const file=await pending;
  const text=await readFile(await file.path(),'utf8');expect(text).toContain('让专业能力服务同学的实际需要。');expect(text).toContain('https://www.12371.cn/');expect(text).toContain('https://www.xinhuanet.com/');
});

test('科研攻关计划保存、阶段更新与刷新恢复',async({page})=>{
  await page.goto('/#/study?tab=practice');
  await page.getByLabel('攻关题目').fill('模型推理延迟优化');await page.getByLabel('真实需求与当前瓶颈').fill('边缘设备算力有限，当前端到端延迟高。');
  await page.getByLabel('下一步行动与验证方式').fill('对比量化前后精度和 P95 延迟，保留所有实验数据。');
  await page.getByRole('button',{name:'保存我的攻关计划'}).click();
  await expect(page.locator('.challenge-list')).toContainText('模型推理延迟优化');
  await page.getByLabel('更新阶段').selectOption('方案验证');await page.reload();
  await expect(page.getByLabel('更新阶段')).toHaveValue('方案验证');
});

test('研学自测反馈反映实际答案',async({page})=>{
  await page.goto('/#/study?tab=quiz');
  for(const [i,value] of [0,2,0,1].entries())await page.locator(`input[name="q${i}"][value="${value}"]`).check();
  await page.getByRole('button',{name:'查看研学反馈'}).click();await expect(page.locator('#quiz-result')).toContainText('本次答对 4 / 4 题');
  await page.locator('input[name="q0"][value="1"]').check();await page.getByRole('button',{name:'查看研学反馈'}).click();await expect(page.locator('#quiz-result')).toContainText('本次答对 3 / 4 题');
});

test('长征沙盘开场与两种模式可用，时间轴可操作',async({page})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  // 网络底图不是此集成检查的前置条件，阻止外网请求可证明本地资源完整。
  await page.route('**/*',route=>route.request().url().startsWith('http://127.0.0.1:4173')?route.continue():route.abort());
  await page.goto('/#/trail');const frame=page.frameLocator('iframe');
  await frame.getByRole('button',{name:'自由探索',exact:true}).click();
  await expect(frame.locator('.leaflet-container').first()).toBeVisible();
  const slider=frame.getByRole('slider');await expect(slider).toBeVisible();
  const before=await slider.getAttribute('aria-valuenow');await slider.focus();await page.keyboard.press('ArrowLeft');
  await expect(slider).not.toHaveAttribute('aria-valuenow',before);
  await page.screenshot({path:'docs/screenshots/trail-desktop.png',fullPage:true});
  await page.goto('/trail/index.html');await page.getByRole('button',{name:'开始演示',exact:false}).click();
  await expect(page.locator('.leaflet-container').first()).toBeVisible();await expect(page.locator('.timeline-dock')).toBeVisible();
  expect(errors).toEqual([]);
});

test('手机导航、人物、地图、故事与表单均无横向溢出',async({page})=>{
  await page.setViewportSize({width:390,height:844});await page.goto('/');
  await expect(page.locator('h1')).toBeVisible();await page.screenshot({path:'docs/screenshots/home-mobile.png',fullPage:true});
  await page.getByRole('button',{name:'展开导航'}).click();await page.locator('#main-nav').getByRole('link',{name:'人物故事',exact:true}).click();
  await expect(page.locator('h1')).toHaveText('与榜样同行');
  for(const path of ['#/people','#/person/dengenming','#/map?place=luding','#/story/blanket','#/study?tab=practice','#/notebook','#/about']){
    await page.goto('/'+path);await expect(page.locator('h1')).toBeVisible();
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),path).toBeTruthy();
  }
});

test('GitHub 项目子路径和断网时门户内容均可用',async({page})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/*',route=>route.request().url().startsWith('http://127.0.0.1:4174')?route.continue():route.abort());
  await page.goto('http://127.0.0.1:4174/zhengtu-xinhuo/');await expect(page.locator('h1')).toContainText('循着信仰的足迹');
  await page.goto('http://127.0.0.1:4174/zhengtu-xinhuo/#/map?place=luding');await expect(page.locator('.place-detail h2')).toHaveText('泸定桥');
  await page.goto('http://127.0.0.1:4174/zhengtu-xinhuo/#/trail');await expect(page.frameLocator('iframe').getByRole('button',{name:'自由探索',exact:true})).toBeVisible();
  expect(errors).toEqual([]);
});

test('禁止浏览器持久存储时保留会话记录并明确提示导出',async({page})=>{
  await page.addInitScript(()=>Object.defineProperty(window,'localStorage',{get(){throw new DOMException('Storage unavailable','SecurityError');}}));
  await page.goto('/#/notebook');await expect(page.locator('.storage-notice')).toContainText('浏览器存储暂不可用');
  await page.getByLabel('标题',{exact:true}).fill('临时会话记录');await page.getByLabel('学习体会',{exact:true}).fill('及时导出备份。');
  await page.getByRole('button',{name:'保存研学手记'}).click();await expect(page.locator('.notes-list')).toContainText('临时会话记录');
  await expect(page.getByRole('status')).toContainText('当前会话');
  const pending=page.waitForEvent('download');await page.getByRole('button',{name:'导出全部记录'}).click();
  const file=await pending;expect(await readFile(await file.path(),'utf8')).toContain('临时会话记录');
});
