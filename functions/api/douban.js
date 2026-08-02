/* ============================================================
   影视上新快讯 - 豆瓣真实数据 API
   路径：/api/douban
   数据来源：豆瓣电影（非官方接口，免费，无需 Key）
   覆盖品类：电影、电视剧、综艺、动漫（全中文）
   ============================================================ */

var DATES = ['2026-07-24', '2026-07-25', '2026-07-26', '2026-07-27', '2026-07-28', '2026-07-29', '2026-07-30'];
var WEEKDAYS = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
var TODAY = '2026-07-27';

// 带浏览器 UA 请求豆瓣
function fetchDouban(url) {
  return fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Referer': 'https://movie.douban.com/',
      'Accept': 'application/json'
    }
  }).then(function (r) { return r.json(); });
}

function formatDateLabel(dateStr) {
  var d = new Date(dateStr + 'T00:00:00');
  return (d.getMonth() + 1) + '月' + d.getDate() + '日';
}

function formatWeekday(dateStr) {
  var d = new Date(dateStr + 'T00:00:00');
  return WEEKDAYS[d.getDay()];
}

// 构建摘要
function buildSummary(detail, item) {
  var parts = [];
  if (detail) {
    if (detail.directors && detail.directors.length) parts.push('导演: ' + detail.directors.slice(0, 2).join(' '));
    if (detail.actors && detail.actors.length) parts.push('主演: ' + detail.actors.slice(0, 3).join(' '));
    if (detail.types && detail.types.length) parts.push('类型: ' + detail.types.join('/'));
    if (detail.duration) parts.push(detail.duration);
    if (detail.region) parts.push(detail.region);
  }
  if (item.rate && item.rate !== '') parts.unshift('豆瓣评分 ' + item.rate);
  if (item.episodes_info) parts.push(item.episodes_info);
  return parts.join(' / ') || '暂无简介';
}

export async function onRequestGet() {
  try {
    // 并行获取各品类数据
    var endpoints = {
      movieUpcoming: 'https://movie.douban.com/j/search_subjects?type=movie&tag=即将上映&page_limit=8&page_start=0',
      movieHot: 'https://movie.douban.com/j/search_subjects?type=movie&tag=热门&page_limit=8&page_start=0',
      tvHot: 'https://movie.douban.com/j/search_subjects?type=tv&tag=热门&page_limit=8&page_start=0',
      tvLatest: 'https://movie.douban.com/j/search_subjects?type=tv&tag=最新&page_limit=8&page_start=0',
      variety: 'https://movie.douban.com/j/search_subjects?type=tv&tag=综艺&page_limit=8&page_start=0',
      anime: 'https://movie.douban.com/j/search_subjects?type=tv&tag=动漫&page_limit=8&page_start=0'
    };

    var keys = Object.keys(endpoints);
    var results = await Promise.all(
      keys.map(function (k) {
        return fetchDouban(endpoints[k])
          .then(function (data) { return { key: k, subjects: (data && data.subjects) || [] }; })
          .catch(function () { return { key: k, subjects: [] }; });
      })
    );

    var dataMap = {};
    results.forEach(function (r) { dataMap[r.key] = r.subjects; });

    // 构建轮播图（5项：2电影 + 2电视剧 + 1综艺/动漫）
    var carouselRaw = []
      .concat(dataMap.movieUpcoming.slice(0, 2))
      .concat(dataMap.tvHot.slice(0, 2))
      .concat(dataMap.variety.slice(0, 1));

    // 获取轮播图详情
    var carouselDetails = await Promise.all(
      carouselRaw.map(function (item) {
        return fetchDouban('https://movie.douban.com/j/subject_abstract?subject_id=' + item.id)
          .then(function (data) { return (data && data.subject) || null; })
          .catch(function () { return null; });
      })
    );

    // 获取时间轴详情（选取部分项目获取详情）
    var timelineRaw = []
      .concat(dataMap.movieUpcoming.map(function (s) { s._cat = '电影'; s._catKey = 'movie'; s._tag = '即将上映'; return s; }))
      .concat(dataMap.movieHot.map(function (s) { s._cat = '电影'; s._catKey = 'movie'; s._tag = '热映中'; return s; }))
      .concat(dataMap.tvHot.map(function (s) { s._cat = '电视剧'; s._catKey = 'tv'; s._tag = '热门'; return s; }))
      .concat(dataMap.tvLatest.map(function (s) { s._cat = '电视剧'; s._catKey = 'tv'; s._tag = '最新'; return s; }))
      .concat(dataMap.variety.map(function (s) { s._cat = '综艺'; s._catKey = 'variety'; s._tag = '综艺'; return s; }))
      .concat(dataMap.anime.map(function (s) { s._cat = '动漫'; s._catKey = 'anime'; s._tag = '动漫'; return s; }));

    // 为时间轴项目获取详情（限制数量避免过慢）
    var detailIds = timelineRaw.slice(0, 20).map(function (s) { return s.id; });
    var timelineDetails = await Promise.all(
      detailIds.map(function (id) {
        return fetchDouban('https://movie.douban.com/j/subject_abstract?subject_id=' + id)
          .then(function (data) { return (data && data.subject) || null; })
          .catch(function () { return null; });
      })
    );
    var detailMap = {};
    timelineDetails.forEach(function (d, i) {
      if (d) detailMap[detailIds[i]] = d;
    });

    // 构建轮播图数据
    var carousel = carouselRaw.map(function (item, i) {
      var detail = carouselDetails[i];
      var title = item.title;
      if (detail && detail.release_year) title = title + ' (' + detail.release_year + ')';
      return {
        title: title,
        type: item._cat || '电影',
        typeKey: item._catKey || 'movie',
        date: item._tag || '即将上映',
        desc: buildSummary(detail, item),
        poster: item.cover ? 'https://images.weserv.nl/?url=' + item.cover.replace(/^https?:\/\//, '') : ''
      };
    });

    // 分配时间轴：is_new 放今天，其余均匀分散
    var newItems = timelineRaw.filter(function (s) { return s.is_new; });
    var otherItems = timelineRaw.filter(function (s) { return !s.is_new; });
    var times = ['09:00', '12:00', '15:00', '18:00', '21:00'];

    var timeline = DATES.map(function (date, dayIdx) {
      var dayItems = [];
      if (date === TODAY) {
        newItems.forEach(function (item, i) {
          var detail = detailMap[item.id];
          dayItems.push({
            time: times[i % times.length],
            type: item._cat,
            title: buildTimelineTitle(item),
            summary: buildSummary(detail, item),
            source: '豆瓣电影',
            sourceUrl: item.url
          });
        });
      }
      // 每天补充 2-3 个其他项目
      var startIdx = dayIdx * 3;
      for (var j = 0; j < 3 && startIdx + j < otherItems.length; j++) {
        var item = otherItems[startIdx + j];
        var detail = detailMap[item.id];
        dayItems.push({
          time: times[(j + 2) % times.length],
          type: item._cat,
          title: buildTimelineTitle(item),
          summary: buildSummary(detail, item),
          source: '豆瓣电影',
          sourceUrl: item.url
        });
      }
      dayItems.sort(function (a, b) { return a.time.localeCompare(b.time); });
      return {
        date: date,
        label: formatDateLabel(date),
        weekday: formatWeekday(date),
        isToday: date === TODAY,
        items: dayItems
      };
    });

    return new Response(JSON.stringify({ carousel: carousel, timeline: timeline }, null, 2), {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=1800'
      }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message, carousel: [], timeline: [] }, null, 2), {
      status: 500,
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    });
  }
}

function buildTimelineTitle(item) {
  var title = item.title;
  if (item._cat === '电影') {
    if (item._tag === '即将上映') return '《' + title + '》即将上映';
    return '《' + title + '》热映中';
  }
  if (item.episodes_info) return '《' + title + '》' + item.episodes_info;
  if (item.is_new) return '《' + title + '》新剧开播';
  return '《' + title + '》热播中';
}
