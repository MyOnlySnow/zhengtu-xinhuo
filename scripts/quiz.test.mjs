import test from 'node:test';
import assert from 'node:assert/strict';
import { QUIZ, QUIZ_TOPICS, drawQuiz, questionResult, gradeQuiz } from '../js/quiz.js';

test('单选和判断：未答不能被算成首项，错误选择不计分',()=>{
  for(const type of ['single','boolean']){
    const q=QUIZ.find(q=>q.type===type&&q.answers[0]===0);
    assert.equal(questionResult(q),'unanswered');
    assert.equal(questionResult(q,[]),'unanswered');
    assert.equal(questionResult(q,[String(q.answers[0])]),'correct');
    assert.equal(questionResult(q,[(q.answers[0]+1)%q.options.length]),'wrong');
  }
});

test('多选必须全部选对，顺序和重复值不影响判分',()=>{
  const q=QUIZ.find(q=>q.type==='multiple');
  const extra=q.options.findIndex((_,i)=>!q.answers.includes(i));
  assert.equal(questionResult(q,[...q.answers].reverse()),'correct');
  assert.equal(questionResult(q,[...q.answers,q.answers[0]]),'correct');
  assert.equal(questionResult(q,q.answers.slice(1)),'wrong');
  assert.equal(questionResult(q,[...q.answers,extra]),'wrong');
  assert.equal(questionResult(q,[]),'unanswered');
});

test('评分逐题保留状态，正确、错误、未答合计等于本轮题量',()=>{
  const questions=QUIZ.slice(0,3);
  const [correct,wrong,unanswered]=questions;
  const result=gradeQuiz(questions,{
    [correct.id]:correct.answers,
    [wrong.id]:[wrong.options.findIndex((_,i)=>!wrong.answers.includes(i))],
  });
  assert.deepEqual(result,{
    results:[{id:correct.id,status:'correct'},{id:wrong.id,status:'wrong'},{id:unanswered.id,status:'unanswered'}],
    correct:1,wrong:1,unanswered:1,
  });
});

test('综合抽题均衡覆盖主题、不重复，也不改变原始题库',()=>{
  const original=structuredClone(QUIZ);
  for(const random of [()=>0,()=>0.5,()=>0.999]){
    for(const count of [10,20]){
      const drawn=drawQuiz({count,random});
      assert.equal(drawn.length,count);
      assert.equal(new Set(drawn.map(q=>q.id)).size,count);
      for(const topic of QUIZ_TOPICS)assert.equal(drawn.filter(q=>q.topic===topic).length,count/5);
    }
    assert.deepEqual(new Set(drawQuiz({count:'all',random}).map(q=>q.id)),new Set(QUIZ.map(q=>q.id)));
    for(const topic of QUIZ_TOPICS){
      const pool=QUIZ.filter(q=>q.topic===topic);
      const drawn=drawQuiz({topic,count:20,random});
      assert.equal(drawn.length,pool.length);
      assert.ok(drawn.every(q=>q.topic===topic));
      assert.equal(new Set(drawn.map(q=>q.id)).size,pool.length);
      assert.equal(drawQuiz({topic,count:10,random}).length,Math.min(10,pool.length));
    }
  }
  assert.deepEqual(QUIZ,original);
});
