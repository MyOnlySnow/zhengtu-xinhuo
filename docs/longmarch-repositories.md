# 长征相关仓库检索与接入记录

检索日期：2026-11-12。通过 GitHub 仓库搜索、仓库 API、README、源代码与在线页面交叉检查。搜索词包括“长征”“红军”“long-march”、长征地图与哈达铺。公开可读不等于具有完整开放许可证；以下注明实际核查结果。

| 仓库 | 功能 | 许可核对 | 本站处理 |
| --- | --- | --- | --- |
| [sansan0/mao-map](https://github.com/sansan0/mao-map) | 生平足迹、年表、搜索、地图联动、出处阅读 | LICENSE 为 GPL-3.0 | 本地独立网页整合；固定 fd624f1492282fe6cf101922b64448c325de938c；保存网页源码、数据与许可 |
| [youxuels/long-march-map](https://github.com/youxuels/long-march-map) | 14个节点，路线播放，三路红军 | README 声明 MIT；没有独立 LICENSE 文件 | 代码参考入口；历史统计、部分引语和日期尚需核对，未复制 |
| [kirinzhang/redwisdom](https://github.com/kirinzhang/redwisdom) | 长征全图、六个战役沙盘、地形与时间轴 | 未见明确开放许可证 | 战役页面外链；未复制代码、地形和文本 |
| [Leizhidong-creator/Red-Army-Street](https://github.com/Leizhidong-creator/Red-Army-Street) | 哈达铺五处旧址，手绘地图与GLB模型 | 未见明确开放许可证 | 在线街区外链；未复制模型、图片、校徽和源码 |
| [Qyjay/AI-Long-March-Back-End](https://github.com/Qyjay/AI-Long-March-Back-End) | FastAPI路线节点、保存进度、RAG问答 | 未见明确开放许可证 | 架构研究，当前静态部署未接入后端或模型服务 |
| [maxmiku/WebDesignCompetition2021](https://github.com/maxmiku/WebDesignCompetition2021) | 长征背景策略小游戏 | Apache-2.0 | 记录为后续交互参考；抽象规则不适合作为史实推演，本次不加载 |
| [XiaoHan-612/changzheng](https://github.com/XiaoHan-612/changzheng) | 长征营地场景、模型裁决与审计日志 | 未见明确开放许可证 | 需要模型服务与服务端，不适合直接放入当前GitHub Pages |
| [kukuqi0/long-march-interactive-map](https://github.com/kukuqi0/long-march-interactive-map) | 长征专题地图原型 | API未识别许可证 | 候选，不复制 |
| [pmxw2006/LongMarch](https://github.com/pmxw2006/LongMarch) | 数字学习平台、图文、时间轴、人物 | API未识别许可证 | 候选，不复制 |
| [chenxu9141/longzheng-luxian](https://github.com/chenxu9141/longzheng-luxian) | 长征路线讲解 | API未识别许可证 | 候选，不复制 |
| [jinpinghbdl-sketch/longmarch-book](https://github.com/jinpinghbdl-sketch/longmarch-book) | 长征绘本 | API未识别许可证 | 候选，图片权属未核查，不复制 |
| [Sara-HY/LongMarch](https://github.com/Sara-HY/LongMarch) | 中国地图与动态路线 | API未识别许可证 | 候选，不复制 |
| [yhm0619/history](https://github.com/yhm0619/history) | 长征故事 | API未识别许可证 | 候选，不作为已核实的史料来源 |

## 足迹地图的发布适配

原始Web部分保存在 `vendor/mao-map`，不携入其Git历史，不改变本仓库贡献者归属。该独立应用及对它的修改继续遵循GPL-3.0，门户其他内容的授权范围不受此目录说明替代。

构建脚本 `scripts/build-footprints.mjs` 将源码复制到 `dist/footprints` 后应用公开可查的修改：

- 支持 `period=march&view=browse`，默认进入长征时期并定位首条事件，不改变用户原有时期偏好。
- 保留109条生平事件，其中16条落在1934—1936年。社区事件不是逐日年谱，不将全部记录标为已核实史实；原有“来源待核查”状态保留。
- 将出发改为1934年10月的月份口径；夹金山改为1935年6月中旬的部队整体口径，避免混淆某位领导人与先头部队的日期。
- 1935年10月19日明确为中央红军主力到达陕北、结束自身长征；三大主力会师为1936年10月。
- 中英文同时修正。原始数据仍在源码目录，发布目录附 `ADAPTATIONS.md`，可复核改动。

史实核对：[中央党史和文献研究院长征专题大事记](https://www.dswxyjy.org.cn/GB/427277/462086/index.html)、[党史百年·天天读1月19日](https://www.dswxyjy.org.cn/GB/434461/434462/434836/index.html)、[多视角下看长征](https://www.12371.cn/2021/10/19/ARTI1634643519286309.shtml)。

## 贡献者核对

GitHub提交作者与提交者均为 `MyOnlySnow`，邮箱为该账号的GitHub noreply邮箱。2026-11-12再次检查：`/contributors`与`/stats/contributors`均仅返回`MyOnlySnow`，仓库公开主页不含旧用户名。远端仅有main分支，本地旧作者备份分支已删除。无需删库重建。第三方源码的原作者仍在许可证和来源中署名，这与本仓库GitHub提交归属是不同信息。
