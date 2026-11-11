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

门户所用官方资料及链接集中维护于 `js/data.js` 的 SOURCES，并在网站“内容来源”中展示。网站以概述、学习问题和创作提纲组织内容，不镜像官方讲话全文。
