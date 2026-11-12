# 征途·薪火

山东大学计算机科学与技术学院学硕第三党支部 · 红色历史、长征故事与科研实践研学网站。

围绕庆祝建党105周年、纪念红军长征胜利90周年，将“学一段长征历史、讲一个红色故事、攻一个科研难题”贯通为完整研学体验。

- 网站：https://myonlysnow.github.io/zhengtu-xinhuo/
- public 仓库：https://github.com/MyOnlySnow/zhengtu-xinhuo

网站通过 GitHub Pages 发布，访客可以直接浏览，无需 GitHub 账号。

长征沙盘新增“长征足迹年表”和“更多数字研学”入口：本地整合GPL-3.0的 `sansan0/mao-map`，默认定位1934—1936年；提供长征战役立体推演、哈达铺三维街区与轻量路线图仓库的延伸入口。检索结果、许可与史实修订见 [仓库检索记录](docs/longmarch-repositories.md)。

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

- 首页：活动主题、数字研学馆、三条研学路径、四路红军路线预览、代表人物与故事。足迹年表、战役推演、哈达铺三维街区可直接从首页进入。
- 重要讲话：7篇关于长征精神、科技创新、青年成长与党史学习的重要讲话，注明时间、场合和权威出处，附本站导读、研学问题及官方全文入口。
- 人物故事：25位全国人物及青岛地方人物，按主要事迹地区和主题筛选；生平、故事、地标和原始资料互相关联，新增12位人物使用注明出处的实际照片。
- 长征详文：7篇分节深度专题，每篇1500字以上，记述历史背景、行军过程、关键转折与协作，附多个权威史料入口、目录、讨论问题和微党课提纲。
- 研学地标：长征沿线、全国革命纪念地、人物工作地与科研教育地标。地图和筛选列表联动，人物与故事可以深链定位。坐标用于研学示意，场馆开放信息以当地公告为准。
- 典型案例：9个科研和重大工程案例，分解现实需求、问题、方法、结果及可迁移的研学建议；不冒充本支部成果。
- 学思践悟：按目标组织官方原文与三条学习路径，记录已读状态，创作并导出含完整章节和来源的研学稿，撰写科研攻关计划及自测。
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

`npm test` 依次执行内容来源、地区/主题筛选、人物/地标/文章关联、长征专题篇幅与章节检查，上游15项沙盘测试及真实浏览器测试。浏览器检查覆盖分地区筛选、讲话和已读、故事目录及完整导出、地图定位、案例、笔记、移动布局及 GitHub Pages 子路径。

本轮前端样式、响应式检查和桌面/手机截图见 [前端优化记录](docs/frontend-refinement.md)。

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

## 来源与复核

每个专题均有自己的一手资料索引。逐人出处、地区口径、历史争议处理和肖像归属记录见 `docs/*-research.md`、`docs/qingdao-review.md` 和 `docs/*photo-credits.md`。研学正文为多源事实的原创组织与教学设计，没有整篇复制已发表文章；在站内打开相应来源即可阅读完整原文。人物故事不是人物逐字引言，研学建议与历史叙述分开标注。

## 目录

```text
index.html               门户入口
css/style.css            门户样式与响应式布局
css/refined.css          统一排版、数字研学卡片与手机/平板样式
js/config.js             本支部信息、真实活动与作品
js/data.js               长征路线节点、原始故事和基础自测
js/*-expansion.js        全国人物、长征与科研典型内容
js/catalog.js            内容索引与地区/主题元数据
js/app.js                门户路由、过滤器、地图和章节渲染
assets/                  本地图片、边界与 Leaflet
vendor/wanli-trail/      指定长征沙盘完整源码
scripts/                 静态构建与本地服务
tests/                   门户浏览器测试
docs/                    逐篇资料核对、肖像归属与验收说明
dist/                    构建生成，不提交
```

源码、资料、图片的第三方归属见 [THIRD_PARTY.md](THIRD_PARTY.md)。长征路线为近似航点示意；沙盘底图和外部资料入口需联网。门户文字、人物图片、路线预览、地标省界与本机记录可在服务器运行时离线使用。
