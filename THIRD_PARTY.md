# 第三方内容与归属

## wanli-trail

- 作者：nova-fable
- 仓库：https://github.com/nova-fable/wanli-trail
- 固定上游提交：df333333b57fde628e7709311810144ff4caebf0
- 源代码：`vendor/wanli-trail/`，保留 README、AGENTS、历史文档与原测试。
- 用途：按用户指定整合为 `dist/trail/`，首页路线预览从同一份上游航点数据生成。
- 不修改上游的史实数据、播放引擎和视觉样式。
- 上游当前没有 LICENSE 文件；本站未对这部分代码另行授予许可证。
- Vue、Leaflet、Vite、MapLibre、Three.js 等依赖遵循各自许可证；详见其 npm 包中的 LICENSE。

## 红韵青岛·数智传薪

- 仓库：https://github.com/rikki7777/qd-revolutionary-spirits
- 参考网站：https://rikki7777.github.io/qd-revolutionary-spirits/index.html
- 用途：依据用户提供文档，参考人物/地标联动结构，提取六位人物资料到 `js/qingdao.json`，相关图片位于 `assets/images/characters/`、`assets/images/landmarks/`。
- 不复制原支部的活动照片、成果、二维码、联系人及贡献者身份作为本支部资料。
- 上游当前没有 LICENSE 文件；本站未对这部分资料或图片另行授予许可证，人物原始媒体来源保留在数据中。

## 泸定桥照片

- 作者：山海风，拍摄于 2012-08-06。
- 原图：https://commons.wikimedia.org/wiki/File:%E6%B3%B8%E5%AE%9A%E6%A1%A5_-_panoramio_(2).jpg
- 许可：CC BY-SA 3.0，https://creativecommons.org/licenses/by-sa/3.0/
- 本地文件：`assets/images/luding.webp`。
- 改动：缩放、压缩、网页中的裁切与色彩叠加。图片及其改编继续适用 CC BY-SA 3.0。

## 地图

- 省级边界来自 DataV.GeoAtlas：https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json
- 青岛市行政区边界（人物/地标近似参考位置）来自 DataV.GeoAtlas：https://geo.datav.aliyun.com/areas_v3/bound/370200_full.json
- 数据说明：https://datav.aliyun.com/portal/school/atlas/area_selector
- Leaflet 1.9.4，BSD-2-Clause：https://github.com/Leaflet/Leaflet/blob/v1.9.4/LICENSE
- 可选在线底图：© OpenStreetMap contributors，ODbL，https://www.openstreetmap.org/copyright
- 长征沙盘的底图另遵循上游各服务的条款；界面保留归属信息。

## 学习资料

门户所用官方资料及链接由 `js/catalog.js` 汇总各专题模块的来源，并在网站“内容来源”中展示。网站以有章节的原创整理稿、学习问题和创作提纲组织内容，完整已发表文章通过官方外链阅读。

新增资料的逐项核对记录：

- `docs/march-classics-research.md`、`docs/march-research.md`：详细长征故事、红军人物和长征地标。
- `docs/history-research.md`、`docs/qingdao-review.md`：全国人物与青岛、即墨人物史料。
- `docs/science-research.md`：科研人物、重大工程案例与研学场馆。
- `docs/portrait-credits.md`、`docs/science-photo-credits.md`：人物照片的原始发布页面与归属。

人物照片的权利归原权利人，本站未将其作为开放许可图片再授权。新增图均为原始资料页面发布的真实人物照片；彝海图片是明确标注的当代实景，不是1935年现场照片。每张图在人物详情或来源页提供发布出处。

## 可视化与数字研学项目研究

- [sansan0/mao-map](https://github.com/sansan0/mao-map)：本次新增本地独立整合，固定提交 `fd624f1492282fe6cf101922b64448c325de938c`。网页完整源码与静态资源保存在 `vendor/mao-map/`，GPL-3.0许可证保留为 `vendor/mao-map/LICENSE`；构建适配脚本 `scripts/build-footprints.mjs` 也遵循GPL-3.0。发布到 `dist/footprints/`，保留原作者、依赖署名与来源状态，附修改说明。数据调整与源码获取方式见 `docs/longmarch-repositories.md`。原项目图片与音频的权利归各自权利人，不另行授权。
- [youxuels/long-march-map](https://github.com/youxuels/long-march-map)：README声明MIT，未提供独立LICENSE文件；仅供代码研究，未复制源码与历史数据。
- [kirinzhang/redwisdom](https://github.com/kirinzhang/redwisdom)：未见明确开放许可证，仅链接原站长征战役推演，不复制源码、地形或文章。
- [Qyjay/AI-Long-March-Back-End](https://github.com/Qyjay/AI-Long-March-Back-End)：后端方案参考，未复制源码、配置或数据，未接入模型接口。

- [apache/echarts](https://github.com/apache/echarts)：Apache-2.0，研究时间轴与交互数据叙事，本次未引入新运行依赖。
- [Leaflet/Leaflet](https://github.com/Leaflet/Leaflet)：BSD-2-Clause，本网站已使用的地图组件。
- [Leizhidong-creator/Red-Army-Street](https://github.com/Leizhidong-creator/Red-Army-Street)：哈达铺红军街数字研学项目，用于比较地点叙事和场景导览，未复制其代码。GitHub 未识别出该仓库的开放许可证。
