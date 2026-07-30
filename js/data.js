/* ============================================================
   影视上新快讯 - 数据层
   品类配置 / 剪影场景 / 轮播数据 / 时间轴数据
   全部为虚构内容，不接入真实 API
   ============================================================ */

/* ---------- 品类配置 ---------- */
var CATEGORIES = {
  all:         { label: '全部',   color: '#1a2332', deep: '#0c1118', accent: '#7d8da6' },
  movie:       { label: '电影',   color: '#2b1f12', deep: '#150d06', accent: '#c79a4a' },
  tv:          { label: '电视剧', color: '#3a2f1e', deep: '#1d160c', accent: '#d0a866' },
  variety:     { label: '综艺',   color: '#3d2428', deep: '#1f1114', accent: '#d86278' },
  anime:       { label: '动漫',   color: '#1e2a40', deep: '#0e1521', accent: '#6f93d4' },
  documentary: { label: '纪录片', color: '#1f2e26', deep: '#0f1813', accent: '#5fa572' }
};

var TYPE_TO_KEY = { '电影': 'movie', '电视剧': 'tv', '综艺': 'variety', '动漫': 'anime', '纪录片': 'documentary' };

/* ---------- 原创剪影路径（无真实明星与影视 IP 角色） ---------- */
var PERSON_PATH = 'M60,14 C70,14 76,22 76,31 C76,39 71,44 65,46 L67,57 C81,60 89,70 89,84 L85,132 L77,132 L74,202 L67,202 L64,137 L56,137 L53,202 L46,202 L43,132 L35,132 L31,84 C31,70 39,60 53,57 L55,46 C49,44 44,39 44,31 C44,22 50,14 60,14 Z';

function standingPerson(x, scale, opacity) {
  return '<g transform="translate(' + x + ',0) scale(' + scale + ')" opacity="' + opacity + '"><path d="' + PERSON_PATH + '" fill="#000"/></g>';
}

var SCENES = {
  all: '<svg class="bg-svg" viewBox="0 0 1440 320" preserveAspectRatio="xMidYMax slice" aria-hidden="true"><defs><radialGradient id="haloAll" cx="50%" cy="30%" r="60%"><stop offset="0%" stop-color="#2a3a52" stop-opacity="0.5"/><stop offset="100%" stop-color="#0c1118" stop-opacity="0"/></radialGradient></defs><rect width="1440" height="320" fill="url(#haloAll)"/><g opacity="0.55" fill="#000"><rect x="180" y="150" width="70" height="34" rx="6"/><rect x="150" y="160" width="36" height="16" rx="4"/><path d="M200,184 L160,290 L172,290 L210,188 Z"/><path d="M220,188 L258,290 L270,290 L232,184 Z"/><path d="M214,184 L218,290 L228,290 L226,184 Z"/></g><g opacity="0.5" fill="#000" transform="translate(1180,120)"><rect x="0" y="20" width="90" height="60" rx="4"/><path d="M0,20 L90,20 L90,6 L0,18 Z"/><line x1="14" y1="6" x2="14" y2="22" stroke="#0c1118" stroke-width="3"/><line x1="34" y1="3" x2="34" y2="22" stroke="#0c1118" stroke-width="3"/><line x1="54" y1="1" x2="54" y2="22" stroke="#0c1118" stroke-width="3"/><line x1="74" y1="3" x2="74" y2="22" stroke="#0c1118" stroke-width="3"/></g>' + standingPerson(90, 0.95, 0.5) + standingPerson(470, 1.05, 0.55) + standingPerson(720, 1.0, 0.5) + standingPerson(1000, 1.1, 0.55) + standingPerson(1300, 0.95, 0.5) + '</svg>',
  movie: '<svg class="bg-svg" viewBox="0 0 1440 320" preserveAspectRatio="xMidYMax slice" aria-hidden="true"><defs><linearGradient id="spot" x1="0" y1="0" x2="0.5" y2="1"><stop offset="0%" stop-color="#e8c878" stop-opacity="0.32"/><stop offset="55%" stop-color="#6b4a1c" stop-opacity="0.12"/><stop offset="100%" stop-color="#150d06" stop-opacity="0"/></linearGradient><radialGradient id="haloMovie" cx="62%" cy="0%" r="70%"><stop offset="0%" stop-color="#5a3f1a" stop-opacity="0.45"/><stop offset="100%" stop-color="#150d06" stop-opacity="0"/></radialGradient></defs><rect width="1440" height="320" fill="url(#haloMovie)"/><path d="M820,0 L1280,0 L1040,320 L940,320 Z" fill="url(#spot)"/><g transform="translate(960,70)" opacity="0.62" fill="#000"><ellipse cx="80" cy="34" rx="30" ry="34"/><path d="M30,70 Q80,52 130,70 L150,120 Q150,140 130,150 L150,250 L115,250 L100,160 L60,160 L45,250 L10,250 L30,150 Q10,140 10,120 Z"/><path d="M12,118 Q-6,150 6,168 L26,158 Z"/><path d="M148,118 Q166,150 154,168 L134,158 Z"/></g>' + standingPerson(180, 1.0, 0.4) + standingPerson(360, 0.92, 0.35) + standingPerson(1240, 1.05, 0.4) + '</svg>',
  tv: '<svg class="bg-svg" viewBox="0 0 1440 320" preserveAspectRatio="xMidYMax slice" aria-hidden="true"><defs><radialGradient id="tvGlow" cx="30%" cy="60%" r="35%"><stop offset="0%" stop-color="#e8b85a" stop-opacity="0.4"/><stop offset="100%" stop-color="#1d160c" stop-opacity="0"/></radialGradient><radialGradient id="haloTv" cx="50%" cy="35%" r="65%"><stop offset="0%" stop-color="#4a3a22" stop-opacity="0.4"/><stop offset="100%" stop-color="#1d160c" stop-opacity="0"/></radialGradient></defs><rect width="1440" height="320" fill="url(#haloTv)"/><rect width="1440" height="320" fill="url(#tvGlow)"/><g opacity="0.6" fill="#000" transform="translate(120,120)"><rect x="0" y="40" width="220" height="14" rx="3"/><rect x="20" y="0" width="180" height="40" rx="5"/><rect x="30" y="7" width="160" height="26" rx="3" fill="#1d160c"/><rect x="34" y="11" width="152" height="18" rx="2" fill="#3a2f1e" opacity="0.6"/></g><g opacity="0.6" fill="#000" transform="translate(820,150)"><path d="M0,60 L0,150 L40,150 L40,90 L260,90 L260,150 L300,150 L300,60 Q300,40 280,40 L20,40 Q0,40 0,60 Z"/><ellipse cx="120" cy="20" rx="22" ry="26"/><path d="M96,42 Q120,30 144,42 L150,95 L90,95 Z"/><path d="M96,95 L86,150 L112,150 L116,95 Z"/><path d="M128,95 L132,150 L158,150 L148,95 Z"/></g>' + standingPerson(560, 0.9, 0.4) + standingPerson(1180, 0.95, 0.4) + '</svg>',
  variety: '<svg class="bg-svg" viewBox="0 0 1440 320" preserveAspectRatio="xMidYMax slice" aria-hidden="true"><defs><linearGradient id="beam1" x1="0" y1="0" x2="0.2" y2="1"><stop offset="0%" stop-color="#e88a9a" stop-opacity="0.3"/><stop offset="100%" stop-color="#3d2428" stop-opacity="0"/></linearGradient><linearGradient id="beam2" x1="1" y1="0" x2="0.8" y2="1"><stop offset="0%" stop-color="#e8a86a" stop-opacity="0.28"/><stop offset="100%" stop-color="#3d2428" stop-opacity="0"/></linearGradient></defs><path d="M560,0 L640,0 L720,320 L600,320 Z" fill="url(#beam1)"/><path d="M880,0 L800,0 L720,320 L840,320 Z" fill="url(#beam2)"/><rect x="0" y="270" width="1440" height="50" fill="#000" opacity="0.35"/><g opacity="0.6" fill="#000" transform="translate(700,150)"><ellipse cx="0" cy="0" rx="12" ry="16"/><rect x="-3" y="14" width="6" height="110"/><ellipse cx="0" cy="128" rx="34" ry="10"/></g>' + standingPerson(560, 0.95, 0.55) + standingPerson(720, 1.0, 0.6) + standingPerson(900, 1.05, 0.55) + standingPerson(1120, 0.9, 0.5) + '</svg>',
  anime: '<svg class="bg-svg" viewBox="0 0 1440 320" preserveAspectRatio="xMidYMax slice" aria-hidden="true"><defs><radialGradient id="haloAnime" cx="50%" cy="25%" r="60%"><stop offset="0%" stop-color="#3a5688" stop-opacity="0.45"/><stop offset="100%" stop-color="#0e1521" stop-opacity="0"/></radialGradient></defs><rect width="1440" height="320" fill="url(#haloAnime)"/><g transform="translate(640,30)" opacity="0.6" fill="#000"><path d="M70,2 L92,0 L96,30 L112,8 L116,40 L130,22 L126,52 L84,40 Q70,34 56,40 L14,52 L18,22 L34,40 L30,8 L46,30 L50,0 Z"/><ellipse cx="70" cy="56" rx="26" ry="30"/><path d="M48,86 Q70,74 92,86 L100,130 Q96,160 80,180 L60,180 Q44,160 40,130 Z"/><path d="M40,120 Q10,150 0,210 L20,250 Q40,210 56,170 Z"/><path d="M100,120 Q130,150 140,210 L120,250 Q100,210 84,170 Z"/><path d="M56,180 L48,260 L66,260 L68,180 Z"/><path d="M72,180 L74,260 L92,260 L84,180 Z"/></g>' + standingPerson(240, 0.85, 0.35) + standingPerson(1080, 0.9, 0.4) + '</svg>',
  documentary: '<svg class="bg-svg" viewBox="0 0 1440 320" preserveAspectRatio="xMidYMax slice" aria-hidden="true"><defs><radialGradient id="haloDoc" cx="40%" cy="30%" r="60%"><stop offset="0%" stop-color="#34503f" stop-opacity="0.4"/><stop offset="100%" stop-color="#0f1813" stop-opacity="0"/></radialGradient></defs><rect width="1440" height="320" fill="url(#haloDoc)"/><g transform="translate(600,80)" opacity="0.6" fill="#000"><ellipse cx="60" cy="20" rx="42" ry="12"/><ellipse cx="60" cy="14" rx="26" ry="20"/><ellipse cx="60" cy="40" rx="22" ry="24"/><rect x="78" y="46" width="56" height="34" rx="5"/><circle cx="124" cy="63" r="12" fill="#0f1813"/><circle cx="124" cy="63" r="6" fill="#2a3a30"/><rect x="100" y="40" width="20" height="10" rx="3"/><path d="M34,64 Q60,52 86,64 L92,120 Q60,134 28,120 Z"/><path d="M28,120 L8,180 L28,196 L48,130 Z"/><path d="M92,120 L112,180 L92,196 L72,130 Z"/></g>' + standingPerson(160, 1.0, 0.4) + standingPerson(340, 0.92, 0.35) + standingPerson(1000, 1.05, 0.45) + standingPerson(1200, 0.95, 0.4) + '</svg>'
};

/* ---------- 轮播图数据：热播预热（虚构内容，AI 生成海报） ---------- */
function posterUrl(prompt) {
  return 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=' + encodeURIComponent(prompt) + '&image_size=landscape_16_9';
}

var CAROUSEL_DATA = [
  { title: '逆光航行', type: '电影', typeKey: 'movie', date: '10月1日 国庆档', desc: '航海题材冒险巨制，实景拍摄呈现大洋深处的风暴与人性抉择，巨浪与雷暴场面震撼。', poster: posterUrl('cinematic film still, lone wooden sailing ship battling massive stormy ocean waves, dramatic golden light breaking through dark thunderclouds, epic maritime adventure, teal and gold color palette, no text, no faces, atmospheric wide shot') },
  { title: '破晓时分', type: '电视剧', typeKey: 'tv', date: '8月10日 七夕开播', desc: '古装权谋剧，朝堂博弈与边关战事双线并行，服化道历时两年考据还原。', poster: posterUrl('cinematic film still, ancient Chinese imperial palace at dawn, golden sunrise over grand traditional architecture, mist and clouds, historical political drama, warm amber and deep red palette, no text, no faces, atmospheric wide shot') },
  { title: '星海少年', type: '动漫', typeKey: 'anime', date: '8月15日 暑期档', desc: '少年星际冒险原创动画，主角与机械伙伴穿越星云寻找家园，画风清新热血。', poster: posterUrl('anime style cinematic still, young person silhouette standing on cliff edge looking up at colorful nebula and stars, distant spaceship, vibrant blue purple pink cosmic colors, space adventure, no text, no faces, wide shot') },
  { title: '深海之下', type: '纪录片', typeKey: 'documentary', date: '9月1日 上映', desc: '海洋科考纪录片，跟随科考船记录万米深渊生物样本采集全过程，罕见深海影像首次曝光。', poster: posterUrl('documentary cinematic still, deep ocean underwater scene, bioluminescent jellyfish and sea creatures, dark abyss with light rays from above, mysterious deep sea exploration, dark blue and teal palette, no text, no faces, wide shot') },
  { title: '声音的旅行', type: '综艺', typeKey: 'variety', date: '本周日首播', desc: '音乐旅行真人秀，嘉宾沿古丝绸之路采风创作，用当地乐器即兴完成原创歌曲。', poster: posterUrl('cinematic still, silhouettes of people playing music on desert sand dunes at golden sunset, acoustic guitar and instruments, warm orange and purple gradient sky, travel music show, no text, no faces, wide shot') }
];

/* ---------- 时间轴模拟数据 ---------- */
var TODAY = '2026-07-27';

var TIMELINE_DATA = [
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
];
