/* ============================================================
   影视上新快讯 - 数据层
   剪影场景（SVG 生成）+ JSON 数据加载
   模拟数据（纪录片）+ 真实豆瓣数据（电影/电视剧/综艺/动漫）
   ============================================================ */

/* ---------- 原创剪影路径（无真实明星与影视 IP 角色） ---------- */
var PERSON_PATH = 'M60,14 C70,14 76,22 76,31 C76,39 71,44 65,46 L67,57 C81,60 89,70 89,84 L85,132 L77,132 L74,202 L67,202 L64,137 L56,137 L53,202 L46,202 L43,132 L35,132 L31,84 C31,70 39,60 53,57 L55,46 C49,44 44,39 44,31 C44,22 50,14 60,14 Z';

function standingPerson(x, scale, opacity) {
  return '<g transform="translate(' + x + ',0) scale(' + scale + ')" opacity="' + opacity + '"><path d="' + PERSON_PATH + '" fill="#000"/></g>';
}

/* ---------- 6 套剪影场景（SVG 字符串，代码生成） ---------- */
var SCENES = {
  all: '<svg class="bg-svg" viewBox="0 0 1440 320" preserveAspectRatio="xMidYMax slice" aria-hidden="true"><defs><radialGradient id="haloAll" cx="50%" cy="30%" r="60%"><stop offset="0%" stop-color="#2a3a52" stop-opacity="0.5"/><stop offset="100%" stop-color="#0c1118" stop-opacity="0"/></radialGradient></defs><rect width="1440" height="320" fill="url(#haloAll)"/><g opacity="0.55" fill="#000"><rect x="180" y="150" width="70" height="34" rx="6"/><rect x="150" y="160" width="36" height="16" rx="4"/><path d="M200,184 L160,290 L172,290 L210,188 Z"/><path d="M220,188 L258,290 L270,290 L232,184 Z"/><path d="M214,184 L218,290 L228,290 L226,184 Z"/></g><g opacity="0.5" fill="#000" transform="translate(1180,120)"><rect x="0" y="20" width="90" height="60" rx="4"/><path d="M0,20 L90,20 L90,6 L0,18 Z"/><line x1="14" y1="6" x2="14" y2="22" stroke="#0c1118" stroke-width="3"/><line x1="34" y1="3" x2="34" y2="22" stroke="#0c1118" stroke-width="3"/><line x1="54" y1="1" x2="54" y2="22" stroke="#0c1118" stroke-width="3"/><line x1="74" y1="3" x2="74" y2="22" stroke="#0c1118" stroke-width="3"/></g>' + standingPerson(90, 0.95, 0.5) + standingPerson(470, 1.05, 0.55) + standingPerson(720, 1.0, 0.5) + standingPerson(1000, 1.1, 0.55) + standingPerson(1300, 0.95, 0.5) + '</svg>',
  movie: '<svg class="bg-svg" viewBox="0 0 1440 320" preserveAspectRatio="xMidYMax slice" aria-hidden="true"><defs><linearGradient id="spot" x1="0" y1="0" x2="0.5" y2="1"><stop offset="0%" stop-color="#e8c878" stop-opacity="0.32"/><stop offset="55%" stop-color="#6b4a1c" stop-opacity="0.12"/><stop offset="100%" stop-color="#150d06" stop-opacity="0"/></linearGradient><radialGradient id="haloMovie" cx="62%" cy="0%" r="70%"><stop offset="0%" stop-color="#5a3f1a" stop-opacity="0.45"/><stop offset="100%" stop-color="#150d06" stop-opacity="0"/></radialGradient></defs><rect width="1440" height="320" fill="url(#haloMovie)"/><path d="M820,0 L1280,0 L1040,320 L940,320 Z" fill="url(#spot)"/><g transform="translate(960,70)" opacity="0.62" fill="#000"><ellipse cx="80" cy="34" rx="30" ry="34"/><path d="M30,70 Q80,52 130,70 L150,120 Q150,140 130,150 L150,250 L115,250 L100,160 L60,160 L45,250 L10,250 L30,150 Q10,140 10,120 Z"/><path d="M12,118 Q-6,150 6,168 L26,158 Z"/><path d="M148,118 Q166,150 154,168 L134,158 Z"/></g>' + standingPerson(180, 1.0, 0.4) + standingPerson(360, 0.92, 0.35) + standingPerson(1240, 1.05, 0.4) + '</svg>',
  tv: '<svg class="bg-svg" viewBox="0 0 1440 320" preserveAspectRatio="xMidYMax slice" aria-hidden="true"><defs><radialGradient id="tvGlow" cx="30%" cy="60%" r="35%"><stop offset="0%" stop-color="#e8b85a" stop-opacity="0.4"/><stop offset="100%" stop-color="#1d160c" stop-opacity="0"/></radialGradient><radialGradient id="haloTv" cx="50%" cy="35%" r="65%"><stop offset="0%" stop-color="#4a3a22" stop-opacity="0.4"/><stop offset="100%" stop-color="#1d160c" stop-opacity="0"/></radialGradient></defs><rect width="1440" height="320" fill="url(#haloTv)"/><rect width="1440" height="320" fill="url(#tvGlow)"/><g opacity="0.6" fill="#000" transform="translate(120,120)"><rect x="0" y="40" width="220" height="14" rx="3"/><rect x="20" y="0" width="180" height="40" rx="5"/><rect x="30" y="7" width="160" height="26" rx="3" fill="#1d160c"/><rect x="34" y="11" width="152" height="18" rx="2" fill="#3a2f1e" opacity="0.6"/></g><g opacity="0.6" fill="#000" transform="translate(820,150)"><path d="M0,60 L0,150 L40,150 L40,90 L260,90 L260,150 L300,150 L300,60 Q300,40 280,40 L20,40 Q0,40 0,60 Z"/><ellipse cx="120" cy="20" rx="22" ry="26"/><path d="M96,42 Q120,30 144,42 L150,95 L90,95 Z"/><path d="M96,95 L86,150 L112,150 L116,95 Z"/><path d="M128,95 L132,150 L158,150 L148,95 Z"/></g>' + standingPerson(560, 0.9, 0.4) + standingPerson(1180, 0.95, 0.4) + '</svg>',
  variety: '<svg class="bg-svg" viewBox="0 0 1440 320" preserveAspectRatio="xMidYMax slice" aria-hidden="true"><defs><linearGradient id="beam1" x1="0" y1="0" x2="0.2" y2="1"><stop offset="0%" stop-color="#e88a9a" stop-opacity="0.3"/><stop offset="100%" stop-color="#3d2428" stop-opacity="0"/></linearGradient><linearGradient id="beam2" x1="1" y1="0" x2="0.8" y2="1"><stop offset="0%" stop-color="#e8a86a" stop-opacity="0.28"/><stop offset="100%" stop-color="#3d2428" stop-opacity="0"/></linearGradient></defs><path d="M560,0 L640,0 L720,320 L600,320 Z" fill="url(#beam1)"/><path d="M880,0 L800,0 L720,320 L840,320 Z" fill="url(#beam2)"/><rect x="0" y="270" width="1440" height="50" fill="#000" opacity="0.35"/><g opacity="0.6" fill="#000" transform="translate(700,150)"><ellipse cx="0" cy="0" rx="12" ry="16"/><rect x="-3" y="14" width="6" height="110"/><ellipse cx="0" cy="128" rx="34" ry="10"/></g>' + standingPerson(560, 0.95, 0.55) + standingPerson(720, 1.0, 0.6) + standingPerson(900, 1.05, 0.55) + standingPerson(1120, 0.9, 0.5) + '</svg>',
  anime: '<svg class="bg-svg" viewBox="0 0 1440 320" preserveAspectRatio="xMidYMax slice" aria-hidden="true"><defs><radialGradient id="haloAnime" cx="50%" cy="25%" r="60%"><stop offset="0%" stop-color="#3a5688" stop-opacity="0.45"/><stop offset="100%" stop-color="#0e1521" stop-opacity="0"/></radialGradient></defs><rect width="1440" height="320" fill="url(#haloAnime)"/><g transform="translate(640,30)" opacity="0.6" fill="#000"><path d="M70,2 L92,0 L96,30 L112,8 L116,40 L130,22 L126,52 L84,40 Q70,34 56,40 L14,52 L18,22 L34,40 L30,8 L46,30 L50,0 Z"/><ellipse cx="70" cy="56" rx="26" ry="30"/><path d="M48,86 Q70,74 92,86 L100,130 Q96,160 80,180 L60,180 Q44,160 40,130 Z"/><path d="M40,120 Q10,150 0,210 L20,250 Q40,210 56,170 Z"/><path d="M100,120 Q130,150 140,210 L120,250 Q100,210 84,170 Z"/><path d="M56,180 L48,260 L66,260 L68,180 Z"/><path d="M72,180 L74,260 L92,260 L84,180 Z"/></g>' + standingPerson(240, 0.85, 0.35) + standingPerson(1080, 0.9, 0.4) + '</svg>',
  documentary: '<svg class="bg-svg" viewBox="0 0 1440 320" preserveAspectRatio="xMidYMax slice" aria-hidden="true"><defs><radialGradient id="haloDoc" cx="40%" cy="30%" r="60%"><stop offset="0%" stop-color="#34503f" stop-opacity="0.4"/><stop offset="100%" stop-color="#0f1813" stop-opacity="0"/></radialGradient></defs><rect width="1440" height="320" fill="url(#haloDoc)"/><g transform="translate(600,80)" opacity="0.6" fill="#000"><ellipse cx="60" cy="20" rx="42" ry="12"/><ellipse cx="60" cy="14" rx="26" ry="20"/><ellipse cx="60" cy="40" rx="22" ry="24"/><rect x="78" y="46" width="56" height="34" rx="5"/><circle cx="124" cy="63" r="12" fill="#0f1813"/><circle cx="124" cy="63" r="6" fill="#2a3a30"/><rect x="100" y="40" width="20" height="10" rx="3"/><path d="M34,64 Q60,52 86,64 L92,120 Q60,134 28,120 Z"/><path d="M28,120 L8,180 L28,196 L48,130 Z"/><path d="M92,120 L112,180 L92,196 L72,130 Z"/></g>' + standingPerson(160, 1.0, 0.4) + standingPerson(340, 0.92, 0.35) + standingPerson(1000, 1.05, 0.45) + standingPerson(1200, 0.95, 0.4) + '</svg>'
};

/* ---------- 海报图片 URL 生成工具 ---------- */
function posterUrl(prompt) {
  return 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=' + encodeURIComponent(prompt) + '&image_size=landscape_16_9';
}

/* ---------- 合并模拟数据与真实豆瓣数据 ---------- */
var MOCK_KEEP_TYPES = ['纪录片']; // 豆瓣不覆盖的品类保留模拟数据

function mergeTimeline(mockTimeline, realTimeline) {
  if (!realTimeline || !realTimeline.length) return mockTimeline;
  var realMap = {};
  realTimeline.forEach(function (day) { realMap[day.date] = day.items; });
  return mockTimeline.map(function (day) {
    var realItems = realMap[day.date] || [];
    var keptMock = day.items.filter(function (item) {
      return MOCK_KEEP_TYPES.indexOf(item.type) >= 0;
    });
    var merged = keptMock.concat(realItems);
    merged.sort(function (a, b) { return (a.time || '').localeCompare(b.time || ''); });
    return Object.assign({}, day, { items: merged });
  });
}

/* ---------- 加载数据：模拟 API + 真实豆瓣 API ---------- */
var API_URL = '/api/data';
var DOUBAN_URL = '/api/douban';

function applyData(raw) {
  CATEGORIES = raw.categories;
  TYPE_TO_KEY = raw.typeToKey;
  TODAY = raw.today;
  CAROUSEL_DATA = raw.carousel;
  TIMELINE_DATA = raw.timeline;
  if (typeof window.appInit === 'function') window.appInit();
}

function loadLocalFallback() {
  fetch('js/data.json')
    .then(function (res) { return res.json(); })
    .then(function (raw) {
      raw.carousel = raw.carousel.map(function (item) {
        item.poster = posterUrl(item.posterPrompt);
        return item;
      });
      applyData(raw);
    })
    .catch(function (err2) {
      console.error('本地 JSON 也加载失败:', err2);
    });
}

// 并行请求模拟数据和真实豆瓣数据（带时间戳确保日期正确）
var _t = Date.now();
Promise.all([
  fetch(API_URL + '?t=' + _t).then(function (r) { return r.json(); }),
  fetch(DOUBAN_URL + '?t=' + _t).then(function (r) { return r.json(); }).catch(function () { return null; })
])
  .then(function (results) {
    var mockData = results[0];
    var doubanData = results[1];
    if (doubanData) {
      if (doubanData.carousel && doubanData.carousel.length) {
        console.log('豆瓣轮播图数据加载成功');
        mockData.carousel = doubanData.carousel;
      }
      if (doubanData.timeline && doubanData.timeline.length) {
        console.log('豆瓣时间轴数据加载成功，合并中...');
        mockData.timeline = mergeTimeline(mockData.timeline, doubanData.timeline);
      }
    } else {
      console.log('豆瓣数据未加载，仅使用模拟数据');
    }
    applyData(mockData);
  })
  .catch(function (err) {
    console.warn('API 加载失败，回退到本地 JSON:', err);
    loadLocalFallback();
  });
