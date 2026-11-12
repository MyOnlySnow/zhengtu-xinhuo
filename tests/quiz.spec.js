import { test, expect } from '@playwright/test';
import { QUIZ, QUIZ_TOPICS } from '../js/quiz.js';

const fields=page=>page.locator('#quiz-form fieldset');
const question=(page,id)=>page.locator(`[data-question="${id}"]`);
const choose=(page,q,index)=>question(page,q.id).getByLabel(q.options[index],{exact:false}).check();
async function openQuiz(page){
  await page.goto('/#/study?tab=quiz');
  await expect(fields(page)).toHaveCount(10);
}
async function chooseTopic(page,topic){
  await page.locator(`[data-quiz-topic="${topic}"]`).click();
  await expect(page.locator(`[data-quiz-topic="${topic}"]`)).toHaveAttribute('aria-pressed','true');
}
async function answerAll(page){
  const ids=await fields(page).evaluateAll(els=>els.map(el=>el.dataset.question));
  for(const id of ids){
    const q=QUIZ.find(q=>q.id===id);
    for(const index of q.answers)await choose(page,q,index);
  }
}

test('六十题可按五主题练习、切换题量，包含单选、多选和判断',async({page})=>{
  await openQuiz(page);
  await expect(page.locator('.quiz-workspace .eyebrow').first()).toContainText('60 道题');
  for(const topic of QUIZ_TOPICS)await expect(page.locator('.quiz-question-meta .tag').filter({hasText:topic})).toHaveCount(2);
  await page.getByLabel('每轮题量').selectOption('20');
  await expect(fields(page)).toHaveCount(20);
  for(const topic of QUIZ_TOPICS)await expect(page.locator('.quiz-question-meta .tag').filter({hasText:topic})).toHaveCount(4);
  for(const topic of QUIZ_TOPICS){
    await chooseTopic(page,topic);
    await expect(fields(page)).toHaveCount(QUIZ.filter(q=>q.topic===topic).length);
    await expect(page.locator('.quiz-question-meta .tag')).toHaveText(QUIZ.filter(q=>q.topic===topic).map(()=>topic));
  }
  await chooseTopic(page,'全部');
  await page.getByLabel('每轮题量').selectOption('all');
  await expect(fields(page)).toHaveCount(60);
  expect(new Set(await fields(page).evaluateAll(els=>els.map(el=>el.dataset.question))).size).toBe(60);
  await expect(page.locator('.quiz-question-meta').filter({hasText:'单选题'})).toHaveCount(40);
  await expect(page.locator('.quiz-question-meta').filter({hasText:'多选题'})).toHaveCount(13);
  await expect(page.locator('.quiz-question-meta').filter({hasText:'判断题'})).toHaveCount(7);
});

test('多选漏选、错误和未答分别计分，解析有出处且可只重练待巩固题',async({page})=>{
  await openQuiz(page);await chooseTopic(page,'研学方法');
  const correct=QUIZ.find(q=>q.id==='method-sources');
  const multiple=QUIZ.find(q=>q.id==='method-evidence');
  const boolean=QUIZ.find(q=>q.id==='method-prototype');
  await choose(page,correct,correct.answers[0]);
  await choose(page,multiple,multiple.answers[0]);
  await choose(page,boolean,1-boolean.answers[0]);
  await expect(page.locator('#quiz-progress-label')).toHaveText('已作答 3 / 8 题');
  await page.getByRole('button',{name:'查看研学反馈'}).click();
  await expect(page.locator('#quiz-result')).toContainText('本次答对 1 / 8 题');
  await expect(page.locator('#quiz-result')).toContainText('答错 2 题 · 未答 5 题');
  await expect(page.locator('.quiz-feedback strong').filter({hasText:'尚未作答'})).toHaveCount(5);
  await expect(question(page,multiple.id).locator('.quiz-feedback')).toContainText(multiple.explain);
  await expect(question(page,multiple.id).locator('.quiz-reading a').first()).toHaveAttribute('href',multiple.reading.href);
  await expect(question(page,multiple.id).locator('.quiz-evidence').first()).toHaveAttribute('target','_blank');
  await expect(page.locator('#quiz-result')).toBeFocused();
  await page.getByRole('button',{name:'重练错题与未答题（7）'}).click();
  await expect(fields(page)).toHaveCount(7);
  await expect(question(page,correct.id)).toHaveCount(0);
  await expect(page.locator('#quiz-form input:checked')).toHaveCount(0);
  await expect(page.locator('.quiz-round-heading h3')).toHaveText('错题与未答题重练');
  await answerAll(page);
  await page.getByRole('button',{name:'查看研学反馈'}).click();
  await expect(page.locator('#quiz-result')).toContainText('本次答对 7 / 7 题');
  await expect(page.locator('[data-quiz-retry]')).toHaveCount(0);
  await page.locator('#quiz-result [data-quiz-new]').click();
  await expect(fields(page)).toHaveCount(8);
  await expect(page.locator('#quiz-progress-label')).toHaveText('已作答 0 / 8 题');
  await expect(page.locator('#quiz-result')).toBeEmpty();
});

test('多选进度按题统计，离开栏目可继续作答，改答案会清除旧评分',async({page})=>{
  await openQuiz(page);await chooseTopic(page,'研学方法');
  const q=QUIZ.find(q=>q.id==='method-evidence');
  await choose(page,q,q.answers[0]);await choose(page,q,q.answers[1]);
  await expect(page.locator('#quiz-progress')).toHaveAttribute('value','1');
  await page.getByRole('link',{name:'讲 · 故事与宣讲',exact:true}).click();
  await expect(page.locator('#quiz-form')).toHaveCount(0);
  await page.getByRole('link',{name:'悟 · 研学自测',exact:true}).click();
  await expect(question(page,q.id).locator('input:checked')).toHaveCount(2);
  await choose(page,q,q.answers[2]);
  await page.getByRole('button',{name:'查看研学反馈'}).click();
  await expect(page.locator('#quiz-result')).toContainText('本次答对 1 / 8 题');
  await question(page,q.id).getByLabel(q.options[q.answers[0]],{exact:false}).uncheck();
  await expect(page.locator('#quiz-result')).toBeEmpty();
  await expect(page.locator('.quiz-feedback')).toHaveText(Array(8).fill(''));
  await expect(page.locator('#quiz-form .is-answer')).toHaveCount(0);
  await page.getByRole('button',{name:'查看研学反馈'}).click();
  await expect(page.locator('#quiz-result')).toContainText('本次答对 0 / 8 题');
  await expect(page.locator('#quiz-result')).toContainText('答错 1 题 · 未答 7 题');
});

test('答题控件可用键盘操作，单选与多选遵循原生分组',async({page})=>{
  await openQuiz(page);await chooseTopic(page,'研学方法');
  const radio=question(page,'method-sources').locator('input[type="radio"]');
  await radio.first().focus();await page.keyboard.press('Space');
  await expect(radio.first()).toBeChecked();
  await page.keyboard.press('ArrowRight');await expect(radio.nth(1)).toBeChecked();
  await expect(question(page,'method-sources').locator('input:checked')).toHaveCount(1);
  const checkbox=question(page,'method-evidence').locator('input[type="checkbox"]');
  await checkbox.first().focus();await page.keyboard.press('Space');
  await page.keyboard.press('Tab');await page.keyboard.press('Space');
  await expect(checkbox.nth(1)).toBeChecked();
  await expect(question(page,'method-evidence').locator('input:checked')).toHaveCount(2);
  await expect(page.locator('#quiz-progress-label')).toHaveText('已作答 2 / 8 题');
});

test('答题前后在手机、平板和桌面均无横向溢出',async({page})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await openQuiz(page);await chooseTopic(page,'科研工程');
  await page.getByLabel('每轮题量').selectOption('all');
  for(const width of [320,390,768,1440]){
    await page.setViewportSize({width,height:1000});
    await expect(fields(page)).toHaveCount(16);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`宽度 ${width}`).toBeTruthy();
  }
  await page.getByRole('button',{name:'查看研学反馈'}).click();
  await expect(page.locator('#quiz-result')).toContainText('答错 0 题 · 未答 16 题');
  for(const width of [320,390,768,1440]){
    await page.setViewportSize({width,height:1000});
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`反馈宽度 ${width}`).toBeTruthy();
  }
  expect(errors).toEqual([]);
});

test('部署子路径与外网不可用时题库、判分和延伸阅读仍可使用',async({page})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/*',route=>route.request().url().startsWith('http://127.0.0.1:4174')?route.continue():route.abort());
  await page.goto('http://127.0.0.1:4174/zhengtu-xinhuo/#/study?tab=quiz');
  await expect(fields(page)).toHaveCount(10);
  await answerAll(page);await page.getByRole('button',{name:'查看研学反馈'}).click();
  await expect(page.locator('#quiz-result')).toContainText('本次答对 10 / 10 题');
  const reading=page.locator('.quiz-reading a').first();
  const href=await reading.getAttribute('href');await reading.click();
  await expect(page).toHaveURL('http://127.0.0.1:4174/zhengtu-xinhuo/'+href);
  await expect(page.locator('h1')).toBeVisible();
  expect(errors).toEqual([]);
});
