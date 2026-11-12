// 人物事实依据见各项 sourceIds；研学问题与行动建议为本站教学设计。
const source = (id, title, org, date, url, desc, type = '人物史料') => ({id, title, org, date, url, desc, type});

export const HISTORY_SOURCES = [
  source('history-jiao-life','焦裕禄：心中装着百姓 一切为了人民','共产党员网','2022-08-15','https://www.12371.cn/2022/08/15/ARTI1660561367742574.shtml','核对焦裕禄入党、工业建设、赴兰考与逝世等生平节点。'),
  source('history-jiao-discipline','焦裕禄严守党纪的故事','学习时报 · 七一网','2024-05-29','https://www.12371.gov.cn/h5/article/1438679781297250304/h5/content_1438679781297250304.html','从服从组织安排、学习技术与廉洁奉公理解干部作风。'),
  source('history-jiao-museum','兰考焦裕禄纪念园简介','兰考县人民政府','场馆资料','https://www.lankao.gov.cn/kfslkxwz/c00356/pc/content/content_1976559538683678720.html','了解焦裕禄纪念园、纪念馆与焦桐林的研学线索。','纪念场馆'),
  source('history-lei-life','雷锋简介','共产党员网','2014-09-29','https://news.12371.cn/2014/09/29/ARTI1411980390611197.shtml','核对雷锋从地方工作到入伍、入党的成长经历。'),
  source('history-lei-service','雷锋：公而忘私 平凡伟大','七一网','2018-11-21','https://www.12371.gov.cn/web/article/1438303180084633600/web/content_1438303180084633600.html','从本职工作、运砖助学和抗洪抢险等具体行动学习雷锋精神。'),
  source('history-lei-party','雷锋特殊的入党经历','共产党员网','2023-03-03','https://www.12371.cn/2023/03/03/ARTI1677822224517368.shtml','了解雷锋向党组织靠拢的过程与理想信念。'),
  source('history-lei-museum','负起新时代弘扬雷锋精神的光荣使命','国家发展改革委','2021-05-24','https://www.ndrc.gov.cn/xwdt/ztzl/qgxclydxalhjpxl1/hslyfzdxal/202105/t20210524_1280638.html','抚顺市雷锋纪念馆的场馆位置与宣教实践。','纪念场馆'),
  source('history-yang-life','杨靖宇','中国国家图书馆','党史专题资料','https://memory.nlc.cn/topic/resource/203','依据东北抗联名录梳理杨靖宇的革命经历与职务。'),
  source('history-yang-archive','杨靖宇将军牺牲确切时间地点得以确认','新华社 · 黑龙江省人民政府','2025-08-28','https://www.hlj.gov.cn/hlj/c107856/202508/c00_31868817.shtml','依据新披露档案核对杨靖宇殉国时间与地点。'),
  source('history-yang-video','百年瞬间丨杨靖宇','共产党员网','2021-05-07','https://www.12371.cn/2021/05/07/VIDE1620343441680917.shtml','结合专家解读与历史影像学习东北抗联斗争。','影像资料'),
  source('history-zhao-life','赵一曼','共产党员网','2016-04-01','https://xuexi.12371.cn/2016/03/24/ARTI1458787934238233.shtml','核对赵一曼入党、赴东北、被俘与牺牲等生平。'),
  source('history-zhao-letter','赵一曼：一封迟到二十一年的家书','央视 · 共产党员网','2015-04-03','https://news.12371.cn/2015/04/03/VIDE1428021600972780.shtml','从家书与家属追忆理解抗日英雄的家国情怀。','红色家书'),
  source('history-zhao-museum','赵一曼纪念馆','中国共产党新闻网','场馆资料','https://cpc.people.com.cn/GB/64176/64180/2524610.html','宜宾翠屏山赵一曼纪念馆的历史与陈列线索。','纪念场馆'),
  source('history-liu-life','刘胡兰','共产党员网','2016-04-06','https://xuexi.12371.cn/2016/03/29/ARTI1459221445301969.shtml','从儿童团、妇女工作、支前工作理解刘胡兰的成长。'),
  source('history-liu-video','刘胡兰：生的伟大 死的光荣','新华社','2021-05-28','https://www.xinhuanet.com/2021-05/28/c_1127505583.htm','核对候补党员、牺牲与追认等重要节点。','影像资料'),
  source('history-liu-spirit','刘胡兰精神学习专题','共产党员网','专题资料','https://www.12371.cn/special/zgjs/lhljs/','生平、精神内涵与纪念场馆的综合研学入口。','党史专题'),
  source('history-zhang-profile','张桂梅：忠诚执着守初心 无私奉献担使命','共产党员网','2020-12-16','https://www.12371.cn/2020/12/16/ARTI1608087563818847.shtml','核对张桂梅出生、入党和扎根边疆教育等基本事实。'),
  source('history-zhang-story','校长妈妈张桂梅：燃烧自己 点亮梦想','新华社','2021-07-15','https://www.xinhuanet.com/politics/2021-07/15/c_1127659327.htm','了解免费女高创办、假期家访与毕业生接续奉献的故事。'),
  source('history-zhang-education','二十大故事｜张桂梅代表的新梦想','新华社 · 中央网信办','2022-10-20','https://www.cac.gov.cn/2022-10/20/c_1667893456997264.htm','从有学上到上好学，理解教育公平与乡村振兴的联系。'),
  source('history-huang-profile','第一书记黄文秀','共产党员网','2019-06-24','https://www.12371.cn/2019/06/24/ARTI1561344873803264.shtml','核对黄文秀求学返乡、驻村任职等经历。'),
  source('history-huang-people','七一勋章获得者黄文秀——我们要靠努力创造美好生活','人民日报 · 共产党员网','2022-05-05','https://www.12371.cn/2022/05/24/ARTI1653384655597467.shtml','学习遍访群众、发展产业、电商服务与驻村工作方法。'),
  source('history-huang-village','时代楷模 感动中国——黄文秀与百坭村','文化和旅游部','2021-09-29','https://zhuanti.mct.gov.cn/history_detail/763.html','百坭村脱贫实践、产业发展与文化建设的故事。','实践案例'),
  source('history-huang-xinhua','习近平对黄文秀同志先进事迹作出重要指示','新华社 · 中央网信办','2019-07-01','https://www.cac.gov.cn/2019-07/01/c_1124693491.htm','核对黄文秀于2019年6月17日凌晨因公殉职及相关事迹。'),
];

export const HISTORY_LANDMARKS = [
  {id:'jiao-memorial',name:'焦裕禄纪念园',address:'河南省开封市兰考县城原黄河故堤沙丘一带',description:'从纪念碑、生平陈列与治沙事迹，学习亲民爱民、科学求实的作风。点位为研学示意，参观安排以场馆公告为准。',lat:34.83,lng:114.81,region:'全国',province:'河南',city:'开封',district:'兰考县',people:['jiaoyulu'],source:'history-jiao-museum',sourceIds:['history-jiao-museum']},
  {id:'lei-memorial',name:'抚顺市雷锋纪念馆',address:'辽宁省抚顺市望花区雷锋路东段61号',description:'通过雷锋生平展和志愿服务主题陈列，理解立足本职、服务人民。点位为研学示意，参观安排以场馆公告为准。',lat:41.82,lng:123.80,region:'全国',province:'辽宁',city:'抚顺',district:'望花区',people:['leifeng'],source:'history-lei-museum',sourceIds:['history-lei-museum']},
  {id:'yang-martyr-site',name:'杨靖宇将军殉国地',address:'吉林省白山市靖宇县城西南一带',description:'结合档案与纪念设施认识东北抗联历史，学习坚定信念和抗战精神。坐标只标示所在区域，不用于精确导航。',lat:42.36,lng:126.76,region:'全国',province:'吉林',city:'白山',district:'靖宇县',people:['yangjingyu'],source:'history-yang-archive',sourceIds:['history-yang-archive','history-yang-life']},
  {id:'zhao-memorial',name:'赵一曼纪念馆',address:'四川省宜宾市翠屏区翠屏山翠屏书院',description:'从生平、抗日斗争与家书材料走近赵一曼。点位为研学示意，参观安排以场馆公告为准。',lat:28.77,lng:104.60,region:'全国',province:'四川',city:'宜宾',district:'翠屏区',people:['zhaoyiman'],source:'history-zhao-museum',sourceIds:['history-zhao-museum']},
  {id:'liu-memorial',name:'刘胡兰纪念馆',address:'山西省吕梁市文水县刘胡兰村（原云周西村）',description:'结合村庄历史与人物资料，学习刘胡兰的坚定信念与担当精神。点位为研学示意，参观安排以场馆公告为准。',lat:37.43,lng:112.14,region:'全国',province:'山西',city:'吕梁',district:'文水县',people:['liuhulan'],source:'history-liu-spirit',sourceIds:['history-liu-spirit','history-liu-video']},
  {id:'huaping-school',name:'丽江华坪女子高级中学',address:'云南省丽江市华坪县',description:'张桂梅推动创办的公办免费女子高中，是理解教育为民的重要实践地点。学校为正常教学场所，请通过官方报道开展线上研学，勿打扰教学。坐标仅示意华坪县城区。',lat:26.63,lng:101.27,region:'全国',province:'云南',city:'丽江',district:'华坪县',people:['zhangguimei'],source:'history-zhang-story',sourceIds:['history-zhang-story','history-zhang-education']},
  {id:'baini-village',name:'百坭村',address:'广西壮族自治区百色市乐业县新化镇百坭村',description:'黄文秀生前驻村工作地，可结合产业帮扶与乡村建设报道开展研学。点位仅示意新化镇一带，不用于精确导航。',lat:24.75,lng:106.47,region:'全国',province:'广西',city:'百色',district:'乐业县',people:['huangwenxiu'],source:'history-huang-village',sourceIds:['history-huang-village','history-huang-people']},
];

const profiles = [
  {
    id:'jiaoyulu',name:'焦裕禄',identity:'县委书记的榜样 · 党的好干部',birth:1922,death:1964,period:'建设年代',province:'河南',city:'开封',district:'兰考县',tags:['人民至上','调查研究','艰苦奋斗'],
    summary:'走进风口、沙丘和农家，把群众冷暖与科学求实贯穿工作始终。',sourceIds:['history-jiao-life','history-jiao-discipline','history-jiao-museum'],
    timeline:[{year:'1922',event:'出生于山东博山。'},{year:'1946',event:'加入中国共产党。'},{year:'1953',event:'参加洛阳矿山机器厂工业建设，在新的岗位学习技术、参与生产。'},{year:'1962',event:'12月到兰考工作，先后任县委第二书记、书记。'},{year:'1963',event:'带领干部群众调查和治理风沙、内涝、盐碱等灾害。'},{year:'1964',event:'5月14日因病逝世。'}],
    stories:[
      {title:'到风口和水流中寻找答案',content:'1962年末，焦裕禄来到遭受风沙、内涝、盐碱侵害的兰考。面对灾情，他把调查放在前面，带领干部深入田间，了解风沙从哪里来、水向哪里流，也向有经验的农民请教。调查得到的情况逐步成为治理办法的依据。这个故事的力量，在于把群众生活中的困难当成必须弄清楚的真问题：不能隔着材料作判断，也不能用热情代替事实。今天开展社会实践，同样需要先走近现场、听懂需求，再讨论解决方案。',sourceIds:['history-jiao-life']},
      {title:'换一个岗位，仍然从头学起',content:'在到兰考工作以前，焦裕禄曾投身洛阳矿山机器厂建设。从熟悉的农村工作转入工业战线，他面对新的设备、工艺和管理知识，选择重新学习，并与工友共同攻关。学习时报记述，他曾赴哈尔滨工业大学学习，在工厂需要时又服从安排返回岗位。这段经历让“敢于担当”有了具体内容：接受任务之后，既要有决心，也要补上本领。青年面对跨学科课题时，可以从查清基础概念、请教同伴和完成一次小规模验证开始。',sourceIds:['history-jiao-discipline']},
    ],
  },
  {
    id:'leifeng',name:'雷锋',identity:'全心全意为人民服务的共产主义战士',birth:1940,death:1962,period:'建设年代',province:'辽宁',city:'抚顺',district:'望花区',tags:['岗位奉献','志愿服务','勤学实干'],
    summary:'把理想追求落实到本职工作与日常助人之中，让平凡岗位见证奉献。',sourceIds:['history-lei-life','history-lei-service','history-lei-party','history-lei-museum'],
    timeline:[{year:'1940',event:'出生于湖南望城。'},{year:'1956',event:'高小毕业后参加工作，先后从事通讯员等工作。'},{year:'1958',event:'赴辽宁参加鞍钢建设，在工作中学习驾驶等技术。'},{year:'1960',event:'1月入伍，同年11月加入中国共产党。'},{year:'1962',event:'8月15日因公殉职。'},{year:'1963',event:'全国广泛开展学习雷锋活动。'}],
    stories:[
      {title:'从工作需要出发学本领',content:'从农场到工厂，再到部队，雷锋不断面对新的工作要求。他在不同岗位学习机械操作和驾驶技术，把学习与完成任务联系起来。共产党员网刊载的生平资料，也记录了他从地方工作到参军、入党的成长过程。学习这段经历，不只是记住一个荣誉称号，更要看见一名青年怎样在岗位上积累能力。对学生党员而言，认真维护实验设备、补齐数据处理知识、把复现实验写成清楚的文档，都可以成为立足岗位、服务集体的具体实践。',sourceIds:['history-lei-life','history-lei-party']},
      {title:'把需要帮助的人放在心上',content:'七一网刊载的雷锋事迹记述了两个具体场景：他在休息日参加学校工地运砖，也和战友投入驻地抗洪抢险。这些行动把为人民服务从抽象要求变成了身边可见的劳动。故事的重点不是把助人当成一次打卡，而是主动看见别人的需要，并用实际能力提供帮助。今天组织志愿服务，可以先确认服务对象的真实困难，再安排人员、工具和持续跟进；活动结束后询问问题是否解决，比只记录参与人数更能体现服务的质量。',sourceIds:['history-lei-service']},
    ],
  },
  {
    id:'yangjingyu',name:'杨靖宇',identity:'东北抗日联军的重要领导人 · 抗日民族英雄',birth:1905,death:1940,period:'革命岁月',province:'吉林',city:'白山',district:'靖宇县',tags:['抗战记忆','理想信念','家国担当'],
    summary:'在白山黑水间坚持抗日斗争，以坚贞信念守护民族尊严。',sourceIds:['history-yang-life','history-yang-archive','history-yang-video'],
    timeline:[{year:'1905',event:'出生于河南确山，原名马尚德。'},{year:'1927',event:'加入中国共产党，参加当地革命斗争。'},{year:'1929',event:'赴东北从事党的工作。'},{year:'1932—1934',event:'参与组织南满抗日武装，担任相关领导职务。'},{year:'1936',event:'任东北抗联第一军军长兼政委，后任第一路军总司令兼政委。'},{year:'1940',event:'2月23日在吉林濛江（今靖宇县）战斗中壮烈牺牲。'}],
    stories:[
      {title:'把抗日的队伍组织起来',content:'国家图书馆的东北抗联人物资料梳理了杨靖宇在东北的工作轨迹：从党的地方工作，到参与组织南满抗日武装，再到担任东北抗联第一路军领导职务。这里呈现的不只是个人的勇敢，还有联络群众、凝聚队伍、坚持共同目标的组织能力。阅读这些经历，可以把注意力放在抗战的集体力量上，理解艰苦斗争为什么需要信念，也需要纪律和团结。研学时可按时间、地点、组织三个维度整理材料，避免用一个传奇细节代替完整历史。',sourceIds:['history-yang-life']},
      {title:'让档案中的坐标再次清晰',content:'2025年，黑龙江省档案馆披露相关日伪档案，进一步确认杨靖宇于1940年2月23日在濛江县城西南一带壮烈牺牲。新的档案研究让英雄的最后战斗有了更扎实的时间与地点依据。对于今天的学习者，纪念也包含认真求证：尊重原始材料、核对不同叙述，能够使讲述更有力量。开展党史数字化实践时，可以为每个地点保留出处和精度说明，为每段文字记录资料版本，让技术帮助记忆得到准确、长久的保存。',sourceIds:['history-yang-archive']},
    ],
  },
  {
    id:'zhaoyiman',name:'赵一曼',identity:'抗日民族女英雄',birth:1905,death:1936,period:'革命岁月',province:'黑龙江',city:'哈尔滨',district:'尚志市',tags:['抗战记忆','红色家书','家国情怀'],
    summary:'从四川走向东北抗日前线，以坚定选择与深沉母爱写下家国情怀。',sourceIds:['history-zhao-life','history-zhao-letter','history-zhao-museum'],
    timeline:[{year:'1905',event:'出生于四川宜宾，原名李坤泰。'},{year:'1926',event:'加入中国共产党，随后进入军事政治学校学习。'},{year:'九一八事变后',event:'受党组织派遣赴东北，从事抗日工作。'},{year:'1935',event:'在抗日斗争中负伤被俘，始终坚贞不屈。'},{year:'1936',event:'8月2日在珠河牺牲，留下写给儿子的家书。'},{year:'1957',event:'其身份得到进一步核实，家书被家人知晓。'}],
    stories:[
      {title:'从组织群众到守护战友',content:'赵一曼在东北既从事群众工作，也参与组织抗日武装。1935年，部队遭到围困，她在掩护突围的过程中负伤，后来被俘。共产党员网的人物资料还记述了她在被监护期间坚持宣传抗日救国道理、争取帮助的经历。这些事实让英雄形象有了清晰的行动线索：她的坚定不仅体现在最后的选择，也体现在联系群众、保护同志的日常工作中。讲述时应保持庄重，以经过核实的经历体现信念，不添加未经证实的对话和情节。',sourceIds:['history-zhao-life']},
      {title:'家书里的母爱与家国',content:'1936年8月2日，赵一曼在牺牲前给儿子留下家书。央视的家书专题追述了这份文字如何保存在档案中，直到1957年，其家人才逐渐了解赵一曼与母亲身份之间的联系。这封信让读者看见，一位抗日英雄同时也是思念孩子的母亲，保卫国家的选择与对亲人的爱并不割裂。共读时可以把家书放回抗日战争背景，讨论个人、家庭与民族命运的联系；引用原文则应核对可靠版本，保留来源，让情感建立在真实史料之上。',sourceIds:['history-zhao-letter']},
    ],
  },
  {
    id:'liuhulan',name:'刘胡兰',identity:'为民族独立和人民解放献身的青年英烈',birth:1932,death:1947,period:'革命岁月',province:'山西',city:'吕梁',district:'文水县',tags:['青年担当','理想信念','革命记忆'],
    summary:'从村庄里的支前工作中成长，以坚贞不屈守护理想与信仰。',sourceIds:['history-liu-life','history-liu-video','history-liu-spirit'],
    timeline:[{year:'1932',event:'出生于山西文水云周西村。'},{year:'1942',event:'参加儿童团，为抗日工作站岗、放哨。'},{year:'1945',event:'参加妇女干部训练，逐步承担村里的工作。'},{year:'1946',event:'参加支前工作，6月被批准为中共候补党员。'},{year:'1947',event:'1月12日在云周西村英勇牺牲。'},{year:'1947年8月',event:'被追认为中国共产党正式党员。'}],
    stories:[
      {title:'从送公粮、做军鞋开始成长',content:'在云周西村，刘胡兰参加儿童团，后来又在妇女工作中承担任务。她参与送公粮、做军鞋、动员青年参军，并在1946年参加支前工作。这些具体劳动，使青年成长与人民解放事业连接起来。一个人的担当并不只在关键时刻才出现，也是在一次次认真的工作中积累起来。今天共读这段历史，可以关注普通村民、妇女与青年共同支援革命的力量，并联系集体生活，想一想自己是否把分内的事情做扎实，是否愿意补上团队需要的一环。',sourceIds:['history-liu-life']},
      {title:'在时代考验中坚定选择',content:'1946年6月，刘胡兰被批准为中共候补党员。形势严峻时，她继续在当地承担工作。1947年1月12日被捕后，她坚贞不屈，英勇牺牲；同年8月被追认为正式党员。新华社报道与共产党员网专题记录了这些节点。学习她的精神，需要把坚定信念同当时的历史环境联系起来，也要珍惜今天的和平生活。对于新时代青年，担当可以落实为认真求学、遵守规则、诚实守信和主动服务，而不是停留在对英雄年龄与口号的简单重复上。',sourceIds:['history-liu-video','history-liu-spirit']},
    ],
  },
  {
    id:'zhangguimei',name:'张桂梅',identity:'七一勋章获得者 · 丽江华坪女子高级中学创办者',birth:1957,death:null,period:'新时代',province:'云南',city:'丽江',district:'华坪县',tags:['教育为民','立德树人','乡村振兴'],
    summary:'扎根边疆教育，以免费女高和持续家访托举山区女孩的求学梦想。',sourceIds:['history-zhang-profile','history-zhang-story','history-zhang-education'],
    timeline:[{year:'1957',event:'出生于东北地区，后赴云南工作。'},{year:'1998',event:'4月加入中国共产党。'},{year:'2001',event:'担任华坪县儿童福利院院长。'},{year:'2008',event:'推动创办丽江华坪女子高级中学，9月首批学生入学。'},{year:'2021',event:'获颁七一勋章。'},{year:'2022',event:'在党的二十大期间交流教育公平、乡村教育等思考。'}],
    stories:[
      {title:'把一个办学梦想变成现实',content:'在云南华坪工作时，张桂梅看到一些山区女孩面临继续求学的困难，逐渐形成创办免费女子高中的想法。经过多方努力，在党和政府及社会各界支持下，华坪女子高级中学于2008年开学。新华社报道记述，首批100名学生走进了这所学校。梦想落地，靠的不只是动人的愿望，还包括持续沟通、组织资源和教师们的共同付出。研学时可以梳理办学过程中需要解决的实际问题，理解教育公平怎样由制度支持与长期行动共同推进。',sourceIds:['history-zhang-story','history-zhang-education']},
      {title:'走出校门，把关怀送到学生家中',content:'张桂梅长期坚持利用寒暑假家访。2021年新华社的报道中，老师和学生谈到她通过家访了解家庭困难、帮助学生安心学习的做法。报道还记录了一些毕业生走向乡村教师、基层医务工作者等岗位的选择。这里能够看到教育的接力：被托举的学生逐渐拥有帮助他人的能力。今天做教育志愿服务，也应把一次课程与长期支持联系起来，了解学生基础，尊重具体需求，留下可持续使用的学习材料，并认真听取服务对象的反馈。',sourceIds:['history-zhang-story']},
    ],
  },
  {
    id:'huangwenxiu',name:'黄文秀',identity:'七一勋章获得者 · 百坭村原驻村第一书记',birth:1989,death:2019,period:'新时代',province:'广西',city:'百色',district:'乐业县',tags:['青年担当','脱贫攻坚','乡村振兴'],
    summary:'研究生毕业后返乡驻村，在走访、产业帮扶和群众工作中书写青春担当。',sourceIds:['history-huang-profile','history-huang-people','history-huang-village','history-huang-xinhua'],
    timeline:[{year:'1989',event:'出生于广西百色。'},{year:'2011',event:'6月加入中国共产党。'},{year:'2016',event:'北京师范大学研究生毕业后返乡工作。'},{year:'2018',event:'3月到乐业县新化镇百坭村担任驻村第一书记。'},{year:'2019',event:'6月17日凌晨返回驻村途中遭遇山洪，因公殉职。'},{year:'2021',event:'被追授七一勋章。'}],
    stories:[
      {title:'先把群众的情况摸清楚',content:'来到百坭村时，黄文秀面对分散在不同山头的住户和陌生地形。人民日报报道记述，她用了近两个月遍访全村195户建档立卡贫困户，还跟着学习方言，努力听懂群众的困难。扎实的走访，使帮扶从概括的印象变成一家一户的具体情况。这个故事给社会实践的启发是，开始做方案以前，先确认需求来自谁、困难是什么、已有条件有哪些。开展信息采集还要尊重隐私，避免把个人经历随意公开，真正让调查服务于问题解决。',sourceIds:['history-huang-people']},
      {title:'把产业、道路与销路连起来',content:'百坭村发展产业，既面临种植技术问题，也面临交通与销售难题。黄文秀联系技术力量、推动产业路建设，并组织学习电商知识，建立电商服务站。文化和旅游部的村庄故事还介绍了她与村干部一起因户施策、持续跟进帮扶的做法。由此可见，一项技术只有放进实际生产生活，才能发现真正的使用条件。青年开展助农项目时，也可以把技术培训、维护能力和实际收益一起考虑，通过小规模试用与反馈不断完善方案。',sourceIds:['history-huang-village','history-huang-people']},
    ],
  },
];

export const HISTORY_PEOPLE = profiles.map(person => ({
  ...person,
  source:person.sourceIds[0],
  landmarks:HISTORY_LANDMARKS.filter(place=>place.people.includes(person.id)),
  media:person.sourceIds.map(id=>HISTORY_SOURCES.find(item=>item.id===id)).filter(Boolean).map(item=>({title:item.title,source:item.org,url:item.url})),
}));

const storyDrafts = [
  {
    id:'jiao-investigation',title:'风口、沙丘与一张治理图',tag:'调查研究',tags:['人民至上','实事求是'],period:'1962—1964年 · 河南兰考',province:'河南',city:'开封',district:'兰考县',person:'jiaoyulu',landmark:'jiao-memorial',minutes:6,sourceIds:['history-jiao-life','history-jiao-discipline','history-jiao-museum'],intro:'沿着焦裕禄的工作足迹，读懂调查研究怎样通向服务群众、解决难题。',
    sections:[
      {title:'走向新的岗位',paragraphs:['1946年1月，焦裕禄加入中国共产党。1953年，他参加洛阳矿山机器厂建设，从农村工作转入工业战线。面对陌生的设备和工艺，他学习业务、参加技术攻关。学习时报记述，1954年他曾赴哈尔滨工业大学学习；工厂需要提前投产时，又服从安排回厂工作。这段经历使我们看见，担当既是接受任务，也包括不断学习完成任务所需的本领。'],sourceIds:['history-jiao-discipline']},
      {title:'在兰考，从灾情入手',paragraphs:['1962年12月，焦裕禄到河南兰考工作，先后担任县委第二书记、书记。当时的兰考受到风沙、内涝、盐碱等灾害影响，群众的生产生活面临困难。共产党员网的人物资料记述，他到任后很快深入基层，在一年多的时间里走访了全县120多个大队。了解问题没有停留在汇报材料上，而是落到了村庄、田地和农户身边。'],sourceIds:['history-jiao-life']},
      {title:'让群众经验成为治理依据',paragraphs:['调查中，他到风沙现场查看风口，了解水流走向，也收集、整理群众同灾害斗争的经验。灾害的发生有自然条件，也有不同地块和村庄的具体差异，治理办法因此需要从实情中寻找。面对新的情况，既向群众学习，也组织干部共同研究，这种工作方式让治灾不是孤立的个人行动，而是干部与群众共同解决困难的过程。'],sourceIds:['history-jiao-life']},
      {title:'纪念园中留存的工作线索',paragraphs:['1964年5月14日，焦裕禄因病逝世。兰考焦裕禄纪念园建于原黄河故堤沙丘一带，园中的纪念碑、烈士墓、生平陈列与焦桐林，保存着人们对他的纪念。参观时可以围绕一条工作线索阅读：面对什么困难，怎样了解实际，又怎样组织行动。把展陈材料同人物生平联系起来，比只记住几个概括性的词语更能理解他的作风。'],sourceIds:['history-jiao-museum']},
      {title:'今天的行动',paragraphs:['在校园或社区选择一项实际困难，先做经同意的访谈，再画出问题图，区分事实、意见与猜测。给方案安排小规模验证，完整保留成功与失败的结果，并约定回访。这是本站的研学建议，不是历史人物原话，也不代表支部已经取得的成果。'],sourceIds:[]},
    ],
    questions:['为什么治理问题需要走到田间和群众身边？','焦裕禄从工业岗位到兰考工作的经历有哪些共同作风？','怎样证明一次服务活动解决了实际问题？'],
    outline:['以兰考“三害”提出治理难题。','讲述洛矿学习与服从组织安排的经历。','讲清走进现场、学习群众经验的方法。','结合纪念园展陈串联人物工作足迹。','以一项可执行、可复核的服务计划结束。'],
    researchTask:'选择一个校园公共服务问题，完成一次经同意的访谈，绘制问题图并提出一个可检验的小方案。',
  },
  {
    id:'lei-everyday-service',title:'把平凡岗位，做成奉献的坐标',tag:'岗位奉献',tags:['志愿服务','勤学实干'],period:'1950—1960年代 · 辽宁抚顺',province:'辽宁',city:'抚顺',district:'望花区',person:'leifeng',landmark:'lei-memorial',minutes:6,sourceIds:['history-lei-life','history-lei-service','history-lei-party','history-lei-museum'],intro:'从岗位学习到助人劳动，再到今天的志愿服务，雷锋精神有具体、可感的行动线索。',
    sections:[
      {title:'从地方建设走向部队',paragraphs:['雷锋1940年出生于湖南望城。1956年高小毕业后，他先后从事地方工作，后来参加农场、工业建设。1958年，他来到辽宁，学习机械操作等技术。1960年1月入伍，同年11月加入中国共产党。不同岗位带来不同要求，他的成长经历把个人理想同国家建设需要联系在一起，也留下了在劳动中学习本领的足迹。'],sourceIds:['history-lei-life']},
      {title:'三次申请，持续向党组织靠拢',paragraphs:['共产党员网记述，雷锋曾于1958年、1959年和1960年先后递交入党申请书。党组织在考察中了解他的成长经历、思想认识和实际表现，雷锋也把向党组织靠拢落实在本职工作中。理解这段经历，可以关注一个青年怎样在持续的行动中坚定理想，而不是把入党仅仅看成时间表上的一个节点。'],sourceIds:['history-lei-party']},
      {title:'休息日与抗洪一线的劳动',paragraphs:['七一网的事迹文章记述，1960年初夏的一个休息日，雷锋看到学校工地运砖需要人手，便加入劳动。同年8月，抚顺发生洪水，他随部队参加上寺水库的抗洪抢险。这些具体场景表明，服务人民既体现在平时愿意搭把手，也体现在集体需要时承担任务。助人的热情与岗位责任，在他的行动中相互连接。'],sourceIds:['history-lei-service']},
      {title:'从纪念走向持续服务',paragraphs:['雷锋1962年因公殉职后，学习雷锋活动逐渐在全国广泛开展。抚顺市雷锋纪念馆1965年开馆，位于他生前部队驻地附近。国家发展改革委发布的场馆案例显示，纪念馆不仅展示人物生平，也开展志愿服务和社会教育活动。历史陈列与当代行动由此相连，使学习榜样成为能够日常参与、不断接续的实践。'],sourceIds:['history-lei-museum']},
      {title:'今天的行动',paragraphs:['为同学或社区居民制作一份确实需要的数字服务教程，邀请初次使用者试用，记录哪里难懂、哪里无效，再根据反馈修改。约定后续维护与交接，使一时的热情转化为可靠帮助。这是本站的实践建议，须以真实需要和实际能力为前提。'],sourceIds:[]},
    ],
    questions:['为什么岗位学习与帮助他人都属于学习雷锋的重要内容？','雷锋的成长经历如何体现理想与行动相结合？','一项志愿服务怎样让后来者继续维护？'],
    outline:['从一个身边需要帮助的小场景开场。','介绍雷锋从地方到部队的成长线索。','讲述持续向党组织靠拢的实际表现。','用运砖助学或抗洪抢险的史料呈现具体行动。','展示小组的持续服务与交接计划。'],
    researchTask:'制作一份真实可用的学习或数字服务说明，邀请一名初次使用者试用，依据反馈修改并记录维护方式。',
  },
  {
    id:'yang-snow-and-archives',title:'白山黑水间，信念有坚实的来处',tag:'抗战记忆',tags:['理想信念','史料研读'],period:'1929—1940年 · 东北',province:'吉林',city:'白山',district:'靖宇县',person:'yangjingyu',landmark:'yang-martyr-site',minutes:6,sourceIds:['history-yang-life','history-yang-archive','history-yang-video'],intro:'从组织抗日队伍到档案中的最后战斗，读懂坚定信念，也学会认真保存历史。',
    sections:[
      {title:'从河南确山到东北',paragraphs:['杨靖宇原名马尚德，1905年出生于河南确山，1927年加入中国共产党。1929年，他赴东北从事党的工作，曾在抚顺等地开展活动并被捕入狱。九一八事变后，他出狱并继续投身抗日工作。国家图书馆的东北抗联专题将这些经历串联起来，使一位抗日英雄的成长道路有了清晰的时间与地域线索。'],sourceIds:['history-yang-life']},
      {title:'组织队伍，坚持抗日',paragraphs:['1930年代初，杨靖宇参与组织南满地区抗日武装。1934年，他担任东北人民革命军第一军军长兼政委；1936年部队改称东北抗日联军第一军，后来又成立第一路军，他担任总司令兼政委。在艰苦条件下开展抗日斗争，既依靠指战员的坚定信念，也离不开组织群众、团结队伍和持续行动的集体力量。'],sourceIds:['history-yang-life']},
      {title:'最后的战斗与新的档案证据',paragraphs:['1940年2月23日，杨靖宇在吉林濛江战斗中壮烈牺牲。2025年，黑龙江省档案馆公布相关日伪档案，进一步确认其殉国时间为当日16时30分，地点在县城西南约5千米的490高地附近。新华社的报道同时说明了档案名称和形成时间。新的证据使英雄最后战斗的时间地点更加清楚，也展现了历史研究不断核实、积累的过程。'],sourceIds:['history-yang-archive']},
      {title:'将人物放回集体抗战的背景',paragraphs:['共产党员网的《百年瞬间》通过历史讲述和研究者解读，回顾杨靖宇率部坚持抗日的经历。共读时，可以把人物生平与东北抗联历史并看：了解队伍活动的地域、所处环境与共同目标，再理解英雄的选择。这样能够避免只用一个传奇化细节概括全部历史，也能看见抗日战争中普通战士、群众与革命组织共同作出的贡献。'],sourceIds:['history-yang-video']},
      {title:'今天的行动',paragraphs:['为三个历史节点制作资料卡，分别写明事件时间、地点、来源和坐标精度；遇到不同说法，保留查证过程，不随意补写对白。以准确、可复核的数字资料传承记忆，是青年可以承担的一项具体工作。'],sourceIds:[]},
    ],
    questions:['为什么理解抗战英雄需要同时看到人民群众与集体斗争？','原始档案和后来报道在研学中各有什么作用？','数字化展示怎样避免把近似坐标误当精确史实？'],
    outline:['用东北抗联的时空背景引入。','梳理杨靖宇从地方革命到东北抗日工作的经历。','说明1940年殉国与后来档案核实的事实。','展示一条保留来源和精度的数字资料样例。','联系青年责任，提出资料整理任务。'],
    researchTask:'选取三个抗战历史节点，整理时间、地点、来源及待核实事项，制作一份可供他人复核的资料卡。',
  },
  {
    id:'zhao-letter-home-country',title:'一封家书里，家与国紧紧相连',tag:'家国情怀',tags:['红色家书','抗战记忆'],period:'1930年代 · 四川与东北',province:'黑龙江',city:'哈尔滨',district:'尚志市',person:'zhaoyiman',landmark:'zhao-memorial',minutes:6,sourceIds:['history-zhao-life','history-zhao-letter','history-zhao-museum'],intro:'走近赵一曼的抗日经历与写给儿子的家书，读见英雄的坚定，也读见深沉的人间情感。',
    sections:[
      {title:'从四川走向抗日前线',paragraphs:['赵一曼原名李坤泰，1905年出生于四川宜宾，1926年加入中国共产党。她后来进入军事政治学校和莫斯科中山大学学习，回国后在多地从事党的工作。九一八事变后，党组织派她到东北开展抗日斗争。将宜宾与东北两个地理坐标联系起来，可以更具体地理解一位青年在民族危亡之际的选择。'],sourceIds:['history-zhao-life']},
      {title:'组织群众，掩护部队突围',paragraphs:['在东北，赵一曼组织工人开展斗争，参与建立抗日武装。1935年，部队遭日伪军围困，她在掩护突围中负伤，后来被俘。被送入医院监护期间，她仍坚持宣传抗日救国的道理，争取看护和看守人员的帮助。1936年6月，她曾在他们帮助下离开医院，随后又被追敌抓获。她的坚定体现在这些具体行动之中。'],sourceIds:['history-zhao-life']},
      {title:'留给孩子的家书',paragraphs:['1936年8月2日，赵一曼牺牲前给儿子留下家书。这不是面向公众的演说，而是母亲在生命最后向孩子表达牵挂与期望的文字。央视的家书专题记述，信件保存在相关档案中，直到1957年，随着烈士身份进一步核实，家人才了解赵一曼与母亲之间的联系。一封迟到的信，把家庭记忆与民族抗战的历史连接起来。'],sourceIds:['history-zhao-letter']},
      {title:'在纪念馆重新认识一个人',paragraphs:['四川宜宾翠屏山的赵一曼纪念馆于1960年修建。中国共产党新闻网的场馆资料介绍，展览围绕成长、抗日斗争与牺牲等经历组织陈列。参观或线上研学，可以按生平、工作、家书三个线索阅读，既理解革命者的坚定，也尊重她作为母亲的真实情感。英雄并不是没有牵挂，而是在危难中承担了更广阔的责任。'],sourceIds:['history-zhao-museum']},
      {title:'今天的行动',paragraphs:['制作家书朗读卡时，确认写作时间、作者与可靠版本，把原文同自己的串联解说分开。改编微党课不编造人物对白，也不以渲染伤痛代替史实。珍惜和平、认真完成公共责任，是今天学习家国情怀的实际起点。'],sourceIds:[]},
    ],
    questions:['家书怎样使我们更具体地理解抗日英雄的选择？','微党课改编时，哪些内容必须保持史料依据？','和平年代如何把家国情怀落实到专业学习？'],
    outline:['以四川到东北的地图线索开场。','介绍赵一曼的成长与抗日工作。','交代家书形成及后来被家人知晓的过程。','选取经核对的短段落朗读，区分原文与解说。','联系现实责任，提出服务集体的具体行动。'],
    researchTask:'选择一封已公开的红色家书，制作包含作者、时间、来源与历史背景的朗读卡，并把原文与自己的解说分开。',
  },
  {
    id:'liu-youth-and-responsibility',title:'从村庄里的小事，读懂青春担当',tag:'青年担当',tags:['理想信念','革命记忆'],period:'1940年代 · 山西文水',province:'山西',city:'吕梁',district:'文水县',person:'liuhulan',landmark:'liu-memorial',minutes:6,sourceIds:['history-liu-life','history-liu-video','history-liu-spirit'],intro:'在儿童团、妇女工作与支前劳动中，读懂刘胡兰的成长与选择。',
    sections:[
      {title:'村庄里的儿童团',paragraphs:['刘胡兰1932年出生于山西文水云周西村。抗日战争期间，村庄里的群众在党组织领导下开展救亡活动。1942年，刘胡兰参加儿童团，和伙伴们站岗、放哨，承担适合当时条件的工作。她的成长与村庄生活、抗日民主政权和群众组织联系在一起，不能离开这一历史环境，只用一个抽象的英雄形象来理解。'],sourceIds:['history-liu-spirit']},
      {title:'从妇女工作到支前劳动',paragraphs:['共产党员网的人物资料记述，刘胡兰在村中承担妇女工作，参加送公粮、做军鞋等活动，也动员青年参军。1945年，她参加妇女干部训练；1946年2月，她参加东庄战斗的支前工作。这些具体任务体现了革命事业背后的群众力量，也说明责任感是在一次次承担工作、经受锻炼的过程中成长起来的。'],sourceIds:['history-liu-life']},
      {title:'在严峻环境中坚定选择',paragraphs:['1946年6月，刘胡兰被批准为中共候补党员。当地形势恶化后，她仍在村中承担工作。1947年1月12日，被敌人抓捕后，她坚贞不屈，英勇牺牲。新华社报道核对了牺牲、候补党员与追认等重要时间：1947年8月1日，她被追认为中国共产党正式党员。准确讲述这些节点，是理解人物选择的基础。'],sourceIds:['history-liu-video']},
      {title:'从纪念走向传承',paragraphs:['刘胡兰牺牲后，毛泽东为她题词。后来，纪念场馆、学习活动和文水县的英雄民兵班持续传承她的精神。新华社2021年的报道回顾了1964年成立刘胡兰英雄民兵班的历程，展示不同年代的青年怎样接续承担任务。传承不是让今天重现战争处境，而是把珍惜和平、服务人民和尽责担当落实到新的时代条件中。'],sourceIds:['history-liu-video','history-liu-spirit']},
      {title:'今天的行动',paragraphs:['在学习小组认领一项常被忽略却确实必要的集体工作，写清责任、期限、检查和交接方式。一周后如实复盘，把尚未完成的部分继续推进，不将计划写成成果，让担当体现在可靠的日常行动中。'],sourceIds:[]},
    ],
    questions:['儿童团和支前劳动如何帮助我们理解人物成长？','为什么讲述英雄必须说明历史背景并核对时间？','日常集体工作中，哪些小事最能检验责任感？'],
    outline:['从云周西村的生活与战争背景引入。','讲清儿童团、妇女工作和支前工作的具体内容。','准确梳理候补党员、牺牲与追认的时间。','介绍不同年代的精神传承。','以真实执行清单和复盘安排作为结尾。'],
    researchTask:'认领一项具体集体事务，记录承诺、执行、检查与交接四个环节，在一周后完成一次诚实复盘。',
  },
  {
    id:'zhang-education-light',title:'让山里的女孩，拥有更宽广的未来',tag:'教育为民',tags:['立德树人','乡村振兴'],period:'2008年起 · 云南华坪',province:'云南',city:'丽江',district:'华坪县',person:'zhangguimei',landmark:'huaping-school',minutes:6,sourceIds:['history-zhang-profile','history-zhang-story','history-zhang-education'],intro:'从免费女高到走进学生家庭的家访路，理解教育公平的温度与长期力量。',
    sections:[
      {title:'扎根教育，关注女孩的求学困难',paragraphs:['张桂梅1957年出生，后来赴云南工作，1998年加入中国共产党。2001年，她开始兼任华坪县儿童福利院院长。在当地教育工作中，她看到一些女孩继续求学面临家庭和经济困难，逐渐形成创办免费女子高中的想法。这个目标源于对具体处境的了解，也与让孩子拥有更多发展机会的愿望相连。'],sourceIds:['history-zhang-profile']},
      {title:'2008年，学校迎来首批学生',paragraphs:['2007年，作为党的十七大代表，张桂梅向记者讲述了办学愿望。在党和政府及社会各界支持下，华坪女子高级中学于2008年创办，9月迎来首批100名学生。新华社报道将办学过程同教师们的工作、学生家庭的需要联系起来。免费入学的实现，不只是一个人的坚持，也是制度支持、公共资源与社会关怀共同作用的结果。'],sourceIds:['history-zhang-story','history-zhang-education']},
      {title:'家访路连着每个学生家庭',paragraphs:['学校开办后，教学和生活中的困难仍需长期面对。张桂梅坚持利用寒暑假家访，了解学生家中的实际问题，帮助她们安心学习。2021年的新华社报道记录了她与教师团队的教学工作，也写到毕业生走向乡村教育、基层医疗等岗位的选择。教育的意义由此从一所学校延伸出去，被托举的学生逐渐拥有支持他人的能力。'],sourceIds:['history-zhang-story']},
      {title:'从读得到书，走向读好书',paragraphs:['2021年，张桂梅获颁七一勋章。2022年在党的二十大期间，她向记者谈到新的教育愿望：在能够读书的基础上，进一步追求更好的学习质量。这将个人办学故事同乡村教育、教育公平联系起来，也提醒学习者，解决一个阶段的问题后，还应继续关注学生的成长支持、学习条件与发展空间。'],sourceIds:['history-zhang-education']},
      {title:'今天的行动',paragraphs:['面向一个明确的学习群体设计短教程，写清基础要求、目标和练习。先试教，再根据反馈改进，安排资源维护与交接。技术应当帮助学习者减少困难，而不是为展示新工具增加负担；线上研学也须尊重学校正常教学秩序。'],sourceIds:[]},
    ],
    questions:['免费入学与高质量教育分别需要哪些支持？','家访为何是理解学生需要的重要环节？','技术志愿服务怎样尊重教育规律和使用者条件？'],
    outline:['用山区女孩继续求学的真实需要引入。','说明2008年办学与多方共同支持。','讲述家访、教学与教师团队的长期付出。','讨论从有学上到上好学的进一步要求。','展示经过试用反馈的学习材料与维护计划。'],
    researchTask:'面向一个明确学习群体设计短教程，写明学习目标、前置条件与练习，试教后根据反馈完善。',
  },
  {
    id:'huang-village-youth',title:'把青春，写进一户一户的需要里',tag:'乡村振兴',tags:['青年担当','调查研究'],period:'2018—2019年 · 广西百坭村',province:'广西',city:'百色',district:'乐业县',person:'huangwenxiu',landmark:'baini-village',minutes:6,sourceIds:['history-huang-profile','history-huang-people','history-huang-village','history-huang-xinhua'],intro:'从研究生毕业返乡到驻村走访，黄文秀的选择让青年担当有了可感的实践路径。',
    sections:[
      {title:'研究生毕业后回到家乡',paragraphs:['黄文秀1989年出生于广西百色，2011年加入中国共产党。2016年从北京师范大学研究生毕业后，她选择返乡，进入百色市委宣传部工作，后来到乡镇挂职。2018年3月，她到乐业县新化镇百坭村担任驻村第一书记。从校园走向基层，摆在面前的是道路、生产与生活交织的实际问题。'],sourceIds:['history-huang-profile']},
      {title:'翻过山头，逐户了解情况',paragraphs:['刚到百坭村，黄文秀面对陌生地形和分散在不同山头的住户。人民日报报道记述，她用近两个月遍访全村195户建档立卡贫困户，有的群众说方言，她就跟着学。弄清每家每户的具体困难，才能形成有针对性的帮扶。走访不是简单完成一个数量，而是建立理解、信任和共同解决问题的基础。'],sourceIds:['history-huang-people']},
      {title:'把技术、产业和销路联系起来',paragraphs:['村里发展砂糖橘等产业，面临种植技术、交通和销售方面的问题。黄文秀联系技术人员开展指导，推动产业道路改善，并组织学习电商知识、建立电商服务站。文化和旅游部的百坭村故事还记录了村干部与她共同研判、因户施策和跟踪帮扶的工作。这些做法说明，一项技术需要同真实生产条件和群众的使用能力结合，才能产生持续作用。'],sourceIds:['history-huang-village','history-huang-people']},
      {title:'青春留在基层，奋斗继续接力',paragraphs:['2019年6月17日凌晨，黄文秀在从百色返回驻村途中遭遇山洪，不幸因公殉职。新华社报道记述，她带领群众开展脱贫帮扶，以实际行动践行初心。2021年，她被追授七一勋章。她生前的驻村心得把自己的实践同长征精神联系起来，后来接续工作的干部群众则继续推动村庄发展，使这份担当在新的生活中延伸。'],sourceIds:['history-huang-xinhua','history-huang-people']},
      {title:'今天的行动',paragraphs:['从一个经过授权的乡村或社区需求起步，写清使用场景、限制与维护能力，先小规模试用，再听取反馈。实践须尊重个人隐私并遵守安全安排；如实记录过程与局限，让热情逐渐沉淀为能够接续的工作。'],sourceIds:[]},
    ],
    questions:['驻村工作为什么需要先逐户了解情况？','数字助农项目除了技术还需要哪些条件？','如何兼顾积极担当、尊重隐私与实践安全？'],
    outline:['介绍黄文秀研究生毕业返乡的选择。','讲述遍访群众与学习方言的具体工作。','以产业、道路和销路说明系统解决问题。','联系新时代长征，讨论青年专业能力的社会价值。','提出经过需求确认、能够接续维护的小规模实践。'],
    researchTask:'选择一项经过授权的乡村或社区服务需求，记录使用场景和限制，提出小规模试用方案，并约定反馈与交接方式。',
  },
];

export const HISTORY_STORIES = storyDrafts.map(story => ({
  ...story,
  theme:profiles.find(person=>person.id===story.person).period,
  source:story.sourceIds[0],
  paragraphs:story.sections.flatMap(section=>section.paragraphs),
}));
