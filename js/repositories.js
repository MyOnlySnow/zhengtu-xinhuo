export const REPOSITORIES=[
 {name:'nova-fable / wanli-trail',url:'https://github.com/nova-fable/wanli-trail',role:'本站已整合',description:'四路红军路线、纪录片式播放与自由探索。作为本网站长征交互沙盘保留本地源码与归属。'},
 {name:'Leaflet / Leaflet',url:'https://github.com/Leaflet/Leaflet',role:'本站已使用 · BSD-2-Clause',description:'交互地图基础库，支撑全国地标、列表定位、图层切换与人物关联。'},
 {name:'apache / echarts',url:'https://github.com/apache/echarts',role:'可视化研究 · Apache-2.0',description:'研究时间轴、图表与交互式数据叙事的实现方式。本次扩充不额外引入运行依赖。'},
 {name:'sansan0 / mao-map',url:'https://github.com/sansan0/mao-map',role:'新增本地整合 · GPL-3.0',description:'毛主席足迹地图：地图、年表、关键词搜索与史料出处联动。默认进入1934—1936年长征时期；保留上游署名、完整网页源码和许可证。'},
 {name:'youxuels / long-march-map',url:'https://github.com/youxuels/long-march-map',role:'本站已整合 · 轻量路线图',description:'复用单页地图与播放界面，替换为本站9个已核对节点和四路红军航点。页面、地图组件和数据均在本站部署；上游README声明MIT，保留源码及适配说明。'},
 {name:'Qyjay / AI-Long-March-Back-End',url:'https://github.com/Qyjay/AI-Long-March-Back-End',role:'后端方案研究',description:'FastAPI 路线与节点接口、进度保存和检索增强问答。需要服务器和模型服务；当前静态网站不加载此后端。'},
];

export const MARCH_RESOURCES=[
 {title:'四路红军长征沙盘',label:'本站体验 · 路线与时间轴',description:'沿四路红军路线跟随历史进程，或自由探索关键节点与行军轨迹。',href:'#/trail',repo:'https://github.com/nova-fable/wanli-trail',action:'进入长征沙盘',art:'march-campaign',kind:'沙盘',note:'路线为关键航点连线示意；地图底图需联网。'},
 {title:'毛主席足迹地图',label:'已整合 · 年表与地图',description:'默认查看长征时期的16条足迹，搜索地点、切换事件、阅读资料出处；也可展开其他时期。',href:'#/trail?mode=footprints',repo:'https://github.com/sansan0/mao-map',action:'打开足迹年表',note:'社区年表提供阅读线索，具体史实可对照本站权威资料。'},
 {title:'轻量长征路线图',label:'本站体验 · 节点与播放',description:'浏览于都出发到三大主力会师的9个关键节点，对照四路红军示意路线，逐步播放或自由切换。',href:'#/trail?mode=light',repo:'https://github.com/youxuels/long-march-map',action:'打开轻量路线图',art:'march-footprints',kind:'路线',note:'本地部署，采用本站节点与航点资料；保留来源与适配说明，可在无外部底图时浏览节点和路线。'},
];
