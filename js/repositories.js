export const REPOSITORIES=[
 {name:'nova-fable / wanli-trail',url:'https://github.com/nova-fable/wanli-trail',role:'本站已整合',description:'四路红军路线、纪录片式播放与自由探索。作为本网站长征交互沙盘保留本地源码与归属。'},
 {name:'Leaflet / Leaflet',url:'https://github.com/Leaflet/Leaflet',role:'本站已使用 · BSD-2-Clause',description:'交互地图基础库，支撑全国地标、列表定位、图层切换与人物关联。'},
 {name:'apache / echarts',url:'https://github.com/apache/echarts',role:'可视化研究 · Apache-2.0',description:'研究时间轴、图表与交互式数据叙事的实现方式。本次扩充不额外引入运行依赖。'},
 {name:'sansan0 / mao-map',url:'https://github.com/sansan0/mao-map',role:'新增本地整合 · GPL-3.0',description:'毛主席足迹地图：地图、年表、关键词搜索与史料出处联动。默认进入1934—1936年长征时期；保留上游署名、完整网页源码和许可证。'},
 {name:'youxuels / long-march-map',url:'https://github.com/youxuels/long-march-map',role:'轻量路线图 · README 声明 MIT',description:'单页实现14个主要节点、路线播放和地图切换。作为实现参考；上游统计与引语需进一步核对，本站未复制数据与代码。'},
 {name:'kirinzhang / redwisdom',url:'https://github.com/kirinzhang/redwisdom',role:'战役推演 · 在线延伸体验',description:'长征全图与湘江、四渡赤水等六场战役的立体推演。可前往原站体验；未明确开放许可证，本站不复制其源码和史料。'},
 {name:'Leizhidong-creator / Red-Army-Street',url:'https://github.com/Leizhidong-creator/Red-Army-Street',role:'哈达铺三维街区 · 在线延伸体验',description:'从手绘地图进入五处旧址并观察三维建筑模型。可前往原站体验；未明确开放许可证，本站不复制其代码、模型和图片。'},
 {name:'Qyjay / AI-Long-March-Back-End',url:'https://github.com/Qyjay/AI-Long-March-Back-End',role:'后端方案研究',description:'FastAPI 路线与节点接口、进度保存和检索增强问答。需要服务器和模型服务；当前静态网站不加载此后端。'},
];

export const MARCH_RESOURCES=[
 {title:'毛主席足迹地图',label:'已整合 · 年表与地图',description:'默认查看长征时期的16条足迹，搜索地点、切换事件、阅读资料出处；也可展开其他时期。',href:'#/trail?mode=footprints',repo:'https://github.com/sansan0/mao-map',action:'打开足迹年表',note:'社区年表提供阅读线索，具体史实可对照本站权威资料。'},
 {title:'长征战役立体推演',label:'原站体验 · 战役与地形',description:'在长征全图中进入湘江战役、四渡赤水、金沙江、大渡河与泸定桥、腊子口等战役场景。',href:'https://redwisdom.vercel.app/campaign.html',repo:'https://github.com/kirinzhang/redwisdom',action:'前往战役推演',note:'社区历史可视化，推演中的路线和兵力为模型表达，需与史料对照。'},
 {title:'哈达铺红军街',label:'原站体验 · 三维旧址',description:'在手绘地图中探索红军门、同善社、邮政代办所、关帝庙、张家大院，旋转和观察旧址模型。',href:'https://leizhidong-creator.github.io/Red-Army-Street/',repo:'https://github.com/Leizhidong-creator/Red-Army-Street',action:'走进哈达铺街区',note:'模型用于辅助理解空间，建筑沿革与故事请继续核对原始资料。'},
 {title:'轻量长征路线图',label:'代码参考 · 14个节点',description:'适合研究单页地图、节点讲解与自动播放。仓库包含可独立打开的网页和运行说明。',href:'https://github.com/youxuels/long-march-map',repo:'https://github.com/youxuels/long-march-map',action:'查看项目与运行说明',note:'README 声明 MIT；本站尚未采用其中的历史数据与统计。'},
];
