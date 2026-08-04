/* 公开收藏 API（无需登录，前端调用） */
var CORS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};

function json(data, status) {
  return new Response(JSON.stringify(data), { status: status || 200, headers: CORS });
}

export async function onRequestOptions() {
  return new Response(null, { headers: CORS });
}

/* POST /api/favorites - 添加收藏 */
export async function onRequestPost(context) {
  var db = context.env.DB;
  if (!db) return json({ error: '数据库未绑定' }, 500);
  try {
    var body = await context.request.json();
    await db.prepare('INSERT INTO favorites (fav_id, title, type, time, summary, source, sourceUrl) VALUES (?, ?, ?, ?, ?, ?, ?)')
      .bind(body.fav_id || '', body.title || '', body.type || '', body.time || '', body.summary || '', body.source || '', body.sourceUrl || '').run();
    return json({ success: true });
  } catch (e) {
    return json({ error: e.message }, 500);
  }
}

/* DELETE /api/favorites?fav_id=X - 按收藏ID删除 */
export async function onRequestDelete(context) {
  var db = context.env.DB;
  if (!db) return json({ error: '数据库未绑定' }, 500);
  try {
    var url = new URL(context.request.url);
    var favId = url.searchParams.get('fav_id');
    var id = url.searchParams.get('id');
    if (favId) {
      await db.prepare('DELETE FROM favorites WHERE fav_id=?').bind(favId).run();
    } else if (id) {
      await db.prepare('DELETE FROM favorites WHERE id=?').bind(id).run();
    }
    return json({ success: true });
  } catch (e) {
    return json({ error: e.message }, 500);
  }
}
