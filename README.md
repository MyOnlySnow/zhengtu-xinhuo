# 征途·薪火

山东大学计算机科学与技术学院学硕第三党支部 · 长征精神数字研学网站。

围绕庆祝建党105周年、纪念红军长征胜利90周年，将“学一段长征历史、讲一个红色故事、攻一个科研难题”贯通为完整研学体验。

- 网站：https://myonlysnow.github.io/zhengtu-xinhuo/
- public 仓库：https://github.com/MyOnlySnow/zhengtu-xinhuo

网站通过 GitHub Pages 发布，访客可以直接浏览，无需 GitHub 账号。

## 本地运行

使用 Node.js 22 或更新版本（本机已有 `/home/sdux17/.nvm/versions/node/v22.23.2/bin`）。

```bash
export PATH=/home/sdux17/.nvm/versions/node/v22.23.2/bin:$PATH
npm ci
npm run build
npm run dev
```

打开 http://127.0.0.1:4173 。需要通过 HTTP 服务打开，不能直接双击 HTML。构建完成后，`dist/` 是可独立部署的静态站点，不依赖本地 `vendor/` 或 `node_modules/`。

若端口被占用：`PORT=4174 npm run dev`。修改门户源文件后，重新 `npm run build` 并刷新页面。

## 页面与功能

- 首页：活动主题、三条研学路径、四路红军路线预览、代表人物与故事。
- 长征沙盘：完整整合指定的 wanli-trail；纪录片式播放、自由探索、时间轴、四路红军、事件讲解、人物志与精神印记。可独立窗口打开。
- 红色人物：六位参考站青岛人物，加陈树湘、王淦昌；搜索、时期筛选、生平、故事、地标、资料四个栏目。
- 研学地标：长征沿线与青岛两组；地图与列表联动，人物卡片深链接定位，关联故事和出行地图入口。离线加载省界、青岛区界与中文区名，街道底图可自行开启。
- 学思践悟：官方学习原文、已读标记、四篇红色故事、微党课提纲与草稿导出、科研攻关记录与阶段更新、四题研学自测。
- 我的研学：无需注册或登录；学习体会、攻关计划和宣讲草稿通过 localStorage 保存在访问者当前浏览器，记录不会上传到 GitHub；可导出 Markdown 备份；删除后可撤销。不同设备或浏览器之间不自动同步。
- 关于支部：支部主题与建设思路；真实活动资料待配置，不使用参考支部的照片和成果。
- 内容来源：官方史料、参考仓库、图片许可和地图归属。

## 补充本支部的资料

修改 `js/config.js`。支部名称集中配置为“山东大学计算机科学与技术学院学硕第三党支部”。原始用户文档保持不变。

```js
activities: [
  {
    title: '实际活动标题',
    date: '实际日期',
    image: 'assets/images/branch/actual-photo.jpg',
    description: '经支部核实的活动描述'
  }
],
works: [
  { title: '实际微党课作品', description: '经核实的作品信息', url: 'https://实际作品链接' }
],
contact: '支部联系方式（可选）'
```

照片放到 `assets/images/branch/`。配置不填时，页面明确显示待整理资料，不产生虚构成果。个人本机记录不会自动变成全站共享的支部成果。

## 验证

```bash
npx playwright install chromium
npm test
```

测试包括上游的15项引擎/布局测试与门户真实浏览器测试。浏览器测试覆盖人物到地图的深链接、故事草稿、学习记录持久化、笔记导出、攻关阶段、移动端导航、离线门户，以及 GitHub Pages 子路径。查看 `docs/验收说明.md` 了解本次实际验收结果。

## GitHub Pages 部署

`.github/workflows/pages.yml` 在 `main` 分支收到提交时，自动安装依赖、验证长征沙盘、构建并发布 `dist/`。工作流也支持手动运行。

后续修改、构建与验证通过后，在本项目目录提交并推送：

```bash
git status --short
git add .
git commit -m "feat(site): 更新数字研学网站"
git push origin main
gh run list --workflow pages.yml --limit 3
```

Pages 项目路径为 `/zhengtu-xinhuo/`；门户、资源与沙盘均使用相对路径。部署结果以 GitHub Actions 的最终状态为准。无需将 `dist/` 或 `node_modules/` 提交到仓库。

## 目录

```text
index.html               门户入口
css/style.css            门户样式与响应式布局
js/config.js             本支部信息、真实活动与作品
js/data.js               官方资料、长征节点、故事与自测
js/qingdao.json          参考站六位人物与地标
js/app.js                门户路由、渲染、地图与本机记录
assets/                  本地图片、边界与 Leaflet
vendor/wanli-trail/      指定长征沙盘完整源码
scripts/                 静态构建与本地服务
tests/                   门户浏览器测试
docs/                    资料研究与验收说明
dist/                    构建生成，不提交
```

源码、资料、图片的第三方归属见 [THIRD_PARTY.md](THIRD_PARTY.md)。长征路线为近似航点示意；沙盘底图和外部资料入口需联网。门户文字、人物图片、路线预览、地标省界与本机记录可在服务器运行时离线使用。
