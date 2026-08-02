/* ============================================================
   影视上新快讯 - TVmaze 真实数据 API
   路径：/api/tvmaze
   数据来源：TVmaze API（免费，无需 Key）
   覆盖品类：电视剧、动漫（TVmaze 主要是电视节目）
   ============================================================ */

// 日期范围（与时间轴一致）
var DATES = ['2026-07-24', '2026-07-25', '2026-07-26', '2026-07-27', '2026-07-28', '2026-07-29', '2026-07-30'];
var WEEKDAYS = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

// TVmaze 类型 -> 我们的品类
function mapType(showType, genres) {
  var g = (genres || []).join(',');
  if (showType === 'Animation' || g.indexOf('Anime') >= 0) return '动漫';
  if (showType === 'Reality' || showType === 'Variety') return '综艺';
  if (showType === 'Documentary') return '纪录片';
  return '电视剧';
}

// 去除 HTML 标签
function stripHtml(html) {
  if (!html) return '';
  return html.replace(/<[^>]+>/g, '').trim();
}

// 格式化日期标签
function formatDateLabel(dateStr) {
  var d = new Date(dateStr + 'T00:00:00');
  return (d.getMonth() + 1) + '月' + d.getDate() + '日';
}

function formatWeekday(dateStr) {
  var d = new Date(dateStr + 'T00:00:00');
  return WEEKDAYS[d.getDay()];
}

// 获取频道中文名
function channelName(webChannel) {
  if (!webChannel || !webChannel.name) return 'TVmaze';
  var name = webChannel.name;
  var map = {
    'Tencent QQ': '腾讯视频',
    'Mango TV': '芒果TV',
    'iQiyi': '爱奇艺',
    'Youku': '优酷',
    'Bilibili': '哔哩哔哩',
    'YouTube': 'YouTube'
  };
  return map[name] || name;
}

export async function onRequestGet() {
  try {
    // 并行获取 7 天数据
    var responses = await Promise.all(
      DATES.map(function (date) {
        return fetch('https://api.tvmaze.com/schedule?country=CN&date=' + date)
          .then(function (r) { return r.json(); })
          .then(function (episodes) { return { date: date, episodes: episodes || [] }; })
          .catch(function () { return { date: date, episodes: [] }; });
      })
    );

    var today = '2026-07-27';
    var timeline = responses.map(function (dayData) {
      // 按剧集分组（同一部剧当天多集合并为一条）
      var showMap = {};
      dayData.episodes.forEach(function (ep) {
        var show = ep.show;
        if (!show) return;
        var key = show.id;
        if (!showMap[key]) {
          showMap[key] = { show: show, episodes: [] };
        }
        showMap[key].episodes.push(ep);
      });

      var items = Object.values(showMap).map(function (entry) {
        var show = entry.show;
        var eps = entry.episodes;
        var type = mapType(show.type, show.genres);

        // 判断是否首播
        var isFirst = eps.some(function (ep) { return ep.season === 1 && ep.number === 1; });
        // 取最早播出时间
        var airtime = eps[0].airtime || '';
        // 集数信息
        var epInfo = eps.map(function (ep) { return 'S' + ep.season + 'E' + ep.number; }).join('、');

        var title;
        if (isFirst) {
          title = show.name + ' 首播';
        } else if (eps.length > 1) {
          title = show.name + ' 更新' + eps.length + '集';
        } else {
          title = show.name + ' 第' + eps[0].number + '集更新';
        }

        var summary = stripHtml(show.summary);
        if (!summary) {
          summary = show.name + ' ' + channelName(show.webChannel) + (show.genres && show.genres.length ? ' ' + show.genres.join('/') : '');
        }

        return {
          time: airtime ? airtime : '时间待定',
          type: type,
          title: title,
          summary: summary,
          source: channelName(show.webChannel),
          sourceUrl: show.url || ''
        };
      });

      // 按时间排序
      items.sort(function (a, b) { return a.time.localeCompare(b.time); });

      return {
        date: dayData.date,
        label: formatDateLabel(dayData.date),
        weekday: formatWeekday(dayData.date),
        isToday: dayData.date === today,
        items: items
      };
    });

    return new Response(JSON.stringify({ timeline: timeline }, null, 2), {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=1800'
      }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message, timeline: [] }, null, 2), {
      status: 500,
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    });
  }
}
