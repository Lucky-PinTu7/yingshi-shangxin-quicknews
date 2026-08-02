/* ============================================================
   影视上新快讯 - Cloudflare Pages Function API
   路径：/api/data
   返回全部影视资讯数据（JSON）
   ============================================================ */

function posterUrl(prompt) {
  return 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=' + encodeURIComponent(prompt) + '&image_size=landscape_16_9';
}

const DATA = {
  categories: {
    all:         { label: '全部',   color: '#1a2332', deep: '#0c1118', accent: '#7d8da6' },
    movie:       { label: '电影',   color: '#2b1f12', deep: '#150d06', accent: '#c79a4a' },
    tv:          { label: '电视剧', color: '#3a2f1e', deep: '#1d160c', accent: '#d0a866' },
    variety:     { label: '综艺',   color: '#3d2428', deep: '#1f1114', accent: '#d86278' },
    anime:       { label: '动漫',   color: '#1e2a40', deep: '#0e1521', accent: '#6f93d4' },
    documentary: { label: '纪录片', color: '#1f2e26', deep: '#0f1813', accent: '#5fa572' }
  },
  typeToKey: {
    '电影': 'movie', '电视剧': 'tv', '综艺': 'variety', '动漫': 'anime', '纪录片': 'documentary'
  },
  today: '2026-07-27',
  carousel: [
    { title: '逆光航行', type: '电影', typeKey: 'movie', date: '10月1日 国庆档', desc: '航海题材冒险巨制，实景拍摄呈现大洋深处的风暴与人性抉择，巨浪与雷暴场面震撼。', posterPrompt: 'cinematic film still, lone wooden sailing ship battling massive stormy ocean waves, dramatic golden light breaking through dark thunderclouds, epic maritime adventure, teal and gold color palette, no text, no faces, atmospheric wide shot' },
    { title: '破晓时分', type: '电视剧', typeKey: 'tv', date: '8月10日 七夕开播', desc: '古装权谋剧，朝堂博弈与边关战事双线并行，服化道历时两年考据还原。', posterPrompt: 'cinematic film still, ancient Chinese imperial palace at dawn, golden sunrise over grand traditional architecture, mist and clouds, historical political drama, warm amber and deep red palette, no text, no faces, atmospheric wide shot' },
    { title: '星海少年', type: '动漫', typeKey: 'anime', date: '8月15日 暑期档', desc: '少年星际冒险原创动画，主角与机械伙伴穿越星云寻找家园，画风清新热血。', posterPrompt: 'anime style cinematic still, young person silhouette standing on cliff edge looking up at colorful nebula and stars, distant spaceship, vibrant blue purple pink cosmic colors, space adventure, no text, no faces, wide shot' },
    { title: '深海之下', type: '纪录片', typeKey: 'documentary', date: '9月1日 上映', desc: '海洋科考纪录片，跟随科考船记录万米深渊生物样本采集全过程，罕见深海影像首次曝光。', posterPrompt: 'documentary cinematic still, deep ocean underwater scene, bioluminescent jellyfish and sea creatures, dark abyss with light rays from above, mysterious deep sea exploration, dark blue and teal palette, no text, no faces, wide shot' },
    { title: '声音的旅行', type: '综艺', typeKey: 'variety', date: '本周日首播', desc: '音乐旅行真人秀，嘉宾沿古丝绸之路采风创作，用当地乐器即兴完成原创歌曲。', posterPrompt: 'cinematic still, silhouettes of people playing music on desert sand dunes at golden sunset, acoustic guitar and instruments, warm orange and purple gradient sky, travel music show, no text, no faces, wide shot' }
  ],
  timeline: [
    { date: '2026-07-24', label: '7月24日', weekday: '周五', items: [
      { time: '10:00', type: '电影',   title: '《逆光航行》定档国庆，发布首张概念海报', summary: '航海题材冒险片正式锁定国庆档期，主创团队透露将以实景拍摄呈现大洋深处的风暴与人性的抉择，概念海报以一艘孤船驶向雷云震撼释出。', source: '光影快讯', sourceUrl: 'https://ent.sina.com.cn/f/2026-07-24/igx-abc123.shtml' },
      { time: '14:30', type: '电视剧', title: '都市轻喜剧《烟火邻里》官宣主演阵容', summary: '聚焦社区邻里日常的轻喜剧公布主演名单，讲述一条老街上六户人家在搬迁风波中互相扶持的温暖故事，预计秋季开机。', source: '剧集风向标', sourceUrl: 'https://ent.qq.com/a/20260724/012.htm' },
      { time: '20:00', type: '综艺',   title: '《周末新势力》第二季回归，赛制全新升级', summary: '音乐竞演综艺第二季官宣回归，本季引入原创赛道与跨界合作舞台，导师阵容将在下周直播揭晓，首期定档八月初。', source: '综艺观察室', sourceUrl: 'https://ent.163.com/26/0724/var-456.shtml' }
    ]},
    { date: '2026-07-25', label: '7月25日', weekday: '周六', items: [
      { time: '09:30', type: '动漫',   title: '原创动画《星海少年》定档八月暑期档', summary: '少年星际冒险题材原创动画公布定档信息，讲述主角与机械伙伴穿越星云寻找家园的故事，画风清新热血，主题曲已同步上线。', source: '二次元前线', sourceUrl: 'https://acg.163.com/26/0725/star-789.html' },
      { time: '12:00', type: '纪录片', title: '《荒野中国》第二季开播，聚焦高原生灵', summary: '自然纪录片第二季正式开播，镜头深入海拔四千米以上的高原腹地，记录雪豹、藏羚羊等珍稀物种的四季生存图景。', source: '纪实视界', sourceUrl: 'https://doc.sohu.com/2026/n0725/wild-321.shtml' },
      { time: '16:00', type: '电影',   title: '《长安旧事》释出定档预告，古装悬疑引期待', summary: '古装悬疑片发布定档预告，以一桩旧城悬案串联市井群像，导演表示将用长镜头还原盛唐街市的烟火气，影片将于中秋上映。', source: '银幕先知', sourceUrl: 'https://www.1905.com/news/2026/0725/1654321.shtml' },
      { time: '21:00', type: '电视剧', title: '《春日迟迟》官宣杀青，发布幕后特辑', summary: '年代情感剧正式杀青并发布幕后特辑，主演团队历经四个月辗转三地取景，讲述两代人在改革开放浪潮中的命运纠葛。', source: '剧透社', sourceUrl: 'https://ent.sina.com.cn/t/2026-07-25/spring-654.shtml' }
    ]},
    { date: '2026-07-26', label: '7月26日', weekday: '周日', items: [
      { time: '11:00', type: '综艺',   title: '《声音的旅行》定档，音乐旅行真人秀上线', summary: '全新音乐旅行真人秀官宣定档，嘉宾将沿古丝绸之路采风创作，用当地乐器即兴完成一首原创歌曲，首期将于本周末上线。', source: '综艺观察室', sourceUrl: 'https://ent.qq.com/a/20260726/008.htm' },
      { time: '15:30', type: '动漫',   title: '《机械之心》剧场版确认引进，定档九月', summary: '人气机甲动画剧场版确认引进国内院线，故事承接TV版结局，讲述主角团在战后废墟中重启机械文明的冒险，定档九月中旬。', source: '二次元前线', sourceUrl: 'https://acg.163.com/26/0726/mech-012.html' },
      { time: '19:00', type: '纪录片', title: '《匠心》系列上新，首期聚焦榫卯技艺', summary: '人文纪录片《匠心》系列上新，首集走进江南古镇，以微观镜头记录老匠人不用一钉一铆建造木构桥梁的全过程。', source: '纪实视界', sourceUrl: 'https://doc.sohu.com/2026/n0726/craft-548.shtml' },
      { time: '22:00', type: '电影',   title: '《深海迷途》点映口碑释出，悬疑反转获好评', summary: '深海密闭空间悬疑片开启超前点映，首批观众反馈叙事节奏紧凑、结尾反转惊喜，影片将于下周五正式公映。', source: '银幕先知', sourceUrl: 'https://www.1905.com/news/2026/0726/1654987.shtml' }
    ]},
    { date: '2026-07-27', label: '7月27日', weekday: '周一', isToday: true, items: [
      { time: '08:30', type: '电视剧', title: '古装权谋剧《破晓时分》定档七夕开播', summary: '古装权谋剧官宣定档七夕黄金档开播，以朝堂博弈与边关战事双线并行，制作方表示服化道历时两年考据还原，定档海报今日同步释出。', source: '剧集风向标', sourceUrl: 'https://ent.sina.com.cn/t/2026-07-27/dawn-001.shtml' },
      { time: '10:00', type: '电影',   title: '《逆光航行》发布定档预告与角色海报', summary: '航海冒险片同步释出定档预告及六张角色海报，预告中巨浪与雷暴场面震撼，主演阵容正式揭晓，影片锁定国庆档上映。', source: '光影快讯', sourceUrl: 'https://ent.sina.com.cn/f/2026-07-27/igx-def456.shtml' },
      { time: '13:00', type: '动漫',   title: '《云端物语》定档十月，治愈系原创动画来袭', summary: '治愈系原创动画《云端物语》官宣定档十月，讲述云端邮差为天空之城居民送递心声道歉信的奇遇，首支预告温暖释出。', source: '二次元前线', sourceUrl: 'https://acg.163.com/26/0727/cloud-334.html' },
      { time: '15:30', type: '综艺',   title: '《城市探索家》第三季回归，首站定档西安', summary: '户外探索综艺第三季官宣回归，本季以丝路沿线古城为线索，首站定档西安，嘉宾将通过任务挑战解锁城市文化密码。', source: '综艺观察室', sourceUrl: 'https://ent.qq.com/a/20260727/015.htm' },
      { time: '18:00', type: '纪录片', title: '《深海之下》定档九月，科考纪实震撼来袭', summary: '海洋科考纪录片定档九月上映，跟随科考船记录万米深渊生物样本采集全过程，预告中罕见深海生物影像首次曝光。', source: '纪实视界', sourceUrl: 'https://doc.sohu.com/2026/n0727/deep-771.shtml' },
      { time: '21:00', type: '电视剧', title: '《烟火邻里》释出定妆照，群像阵容曝光', summary: '社区轻喜剧发布全员定妆照，十二位角色的市井造型同步曝光，导演表示每集将以一个邻里小事为切口展开笑中带泪的故事。', source: '剧透社', sourceUrl: 'https://ent.sina.com.cn/t/2026-07-27/hood-902.shtml' }
    ]},
    { date: '2026-07-28', label: '7月28日', weekday: '周二', items: [
      { time: '10:30', type: '电影',   title: '《长安旧事》开启预售，中秋档预售破纪录', summary: '古装悬疑片正式开启全国预售，上映首日预售票房打破中秋档同类型纪录，发行方宣布将增加IMAX版本排片。', source: '银幕先知', sourceUrl: 'https://www.1905.com/news/2026/0728/1655112.shtml' },
      { time: '14:00', type: '动漫',   title: '《星海少年》公布主题曲与片头影像', summary: '原创动画公布由人气歌手献唱的主题曲，并释出片头影像，星际冒险的宏大世界观与热血画风引发粉丝期待。', source: '二次元前线', sourceUrl: 'https://acg.163.com/26/0728/star-115.html' },
      { time: '20:00', type: '综艺',   title: '《周末新势力》官宣导师阵容，首期定档', summary: '音乐竞演综艺正式官宣四位导师阵容，涵盖流行、摇滚、说唱与民谣领域，首期节目定档本周日晚间黄金档播出。', source: '综艺观察室', sourceUrl: 'https://ent.163.com/26/0728/var-789.shtml' }
    ]},
    { date: '2026-07-29', label: '7月29日', weekday: '周三', items: [
      { time: '09:00', type: '纪录片', title: '《匠心》第二期预告，聚焦古法造纸', summary: '人文纪录片《匠心》公布第二期预告，本期将走进皖南古村，记录传承人从青檀皮到宣纸的古法造纸七十二道工序。', source: '纪实视界', sourceUrl: 'https://doc.sohu.com/2026/n0729/craft-660.shtml' },
      { time: '11:30', type: '电视剧', title: '《破晓时分》发布定档特辑，幕后考据揭秘', summary: '古装权谋剧释出定档幕后特辑，展示服饰纹样、兵器形制的考据过程，编剧透露权谋线将有三次重大反转。', source: '剧集风向标', sourceUrl: 'https://ent.sina.com.cn/t/2026-07-29/dawn-114.shtml' },
      { time: '16:00', type: '电影',   title: '《深海迷途》公映首日，密室悬疑引热议', summary: '深海密闭空间悬疑片今日正式公映，密闭叙事与声效设计获观众好评，社交平台关于结局反转的讨论持续升温。', source: '光影快讯', sourceUrl: 'https://ent.sina.com.cn/f/2026-07-29/igx-ghi789.shtml' },
      { time: '22:30', type: '动漫',   title: '《机械之心》剧场版释出中文定档预告', summary: '机甲动画剧场版发布中文定档预告，宏大的机甲对战与友情羁绊主题引发期待，影片将于九月全国公映。', source: '二次元前线', sourceUrl: 'https://acg.163.com/26/0729/mech-220.html' }
    ]},
    { date: '2026-07-30', label: '7月30日', weekday: '周四', items: [
      { time: '10:00', type: '综艺',   title: '《声音的旅行》首期定档，丝路采风启程', summary: '音乐旅行真人秀首期正式定档本周日，嘉宾从敦煌出发沿丝路西行，首期将呈现沙漠星空下的即兴创作舞台。', source: '综艺观察室', sourceUrl: 'https://ent.qq.com/a/20260730/021.htm' },
      { time: '15:00', type: '电影',   title: '《逆光航行》公布 IMAX 版本预售计划', summary: '航海冒险片公布IMAX及CINITY版本预售计划，导演表示风暴长镜头在大银幕沉浸感最佳，预售将于下周一开启。', source: '银幕先知', sourceUrl: 'https://www.1905.com/news/2026/0730/1655233.shtml' },
      { time: '19:30', type: '纪录片', title: '《深海之下》幕后特辑，科考设备首次揭秘', summary: '海洋科考纪录片发布幕后特辑，首次展示万米级深潜器与采样机械臂的工作原理，揭秘深海影像的拍摄难点。', source: '纪实视界', sourceUrl: 'https://doc.sohu.com/2026/n0730/deep-883.shtml' },
      { time: '21:30', type: '电视剧', title: '《春日迟迟》定档十月，发布定档海报', summary: '年代情感剧官宣定档十月播出，并发布定档海报，海报以两代人背影与年代街景交织，传递岁月变迁的厚重感。', source: '剧透社', sourceUrl: 'https://ent.sina.com.cn/t/2026-07-30/spring-733.shtml' }
    ]}
  ]
};

/* 预计算海报 URL */
DATA.carousel = DATA.carousel.map(function (item) {
  item.poster = posterUrl(item.posterPrompt);
  return item;
});

// 动态更新日期：以当前日期为今天，重新生成 7 天日期范围
function getNow(request) {
  var dateHeader = request.headers.get('date');
  if (dateHeader) {
    var d = new Date(dateHeader);
    if (!isNaN(d.getTime())) return d;
  }
  return new Date();
}
export async function onRequestGet(context) {
  var request = context.request;
  function dateStr(d) { return d.toISOString().split('T')[0]; }
  var wk = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  var now = getNow(request);
  var todayStr = dateStr(now);
  var newDates = [];
  for (var i = -3; i <= 3; i++) {
    var d = new Date(now);
    d.setUTCDate(d.getUTCDate() + i);
    newDates.push({
      date: dateStr(d),
      label: (d.getUTCMonth() + 1) + '月' + d.getUTCDate() + '日',
      weekday: wk[d.getUTCDay()],
      isToday: i === 0
    });
  }
  DATA.today = todayStr;
  DATA.timeline = DATA.timeline.map(function (day, idx) {
    var nd = newDates[idx] || newDates[0];
    return {
      date: nd.date,
      label: nd.label,
      weekday: nd.weekday,
      isToday: nd.isToday,
      items: day.items
    };
  });
  return new Response(JSON.stringify(DATA, null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
