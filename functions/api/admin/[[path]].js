/* ============================================================
   影视上新快讯 - 后端管理 API
   路由：/api/admin/*
   数据库：Cloudflare D1
   ============================================================ */

var CORS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

function json(data, status) {
  return new Response(JSON.stringify(data, null, 2), {
    status: status || 200,
    headers: CORS
  });
}

/* ---------- 简易 Token ---------- */
function createToken(username) {
  var data = { u: username, e: Date.now() + 86400000 };
  return btoa(JSON.stringify(data));
}
function verifyToken(authHeader) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) return false;
  try {
    var data = JSON.parse(atob(authHeader.slice(7)));
    return data.e > Date.now();
  } catch (e) { return false; }
}

/* ---------- 路由处理 ---------- */
export async function onRequestOptions() {
  return new Response(null, { headers: CORS });
}

export async function onRequestGet(context) {
  var path = (context.params.path || [])[0] || '';
  var url = new URL(context.request.url);
  var db = context.env.DB;

  // 公开路由
  if (path === 'news') {
    if (!verifyToken(context.request.headers.get('Authorization'))) return json({ error: '未登录' }, 401);
    var results = await db.prepare('SELECT * FROM news ORDER BY date DESC, time ASC').all();
    return json({ news: results.results });
  }

  if (path === 'favorites') {
    if (!verifyToken(context.request.headers.get('Authorization'))) return json({ error: '未登录' }, 401);
    var favs = await db.prepare('SELECT * FROM favorites ORDER BY created_at DESC').all();
    return json({ favorites: favs.results });
  }

  return json({ error: '未知路由' }, 404);
}

export async function onRequestPost(context) {
  var path = (context.params.path || [])[0] || '';
  var body = await context.request.json();
  var db = context.env.DB;

  // 登录
  if (path === 'login') {
    var row = await db.prepare('SELECT * FROM admins WHERE username = ? AND password = ?')
      .bind(body.username, body.password).first();
    if (!row) return json({ error: '用户名或密码错误' }, 401);
    return json({ token: createToken(row.username), username: row.username });
  }

  // 以下路由需要认证
  if (!verifyToken(context.request.headers.get('Authorization'))) return json({ error: '未登录' }, 401);

  // 初始化数据库
  if (path === 'init') {
    await db.batch([
      db.prepare('CREATE TABLE IF NOT EXISTS admins (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE NOT NULL, password TEXT NOT NULL)'),
      db.prepare('CREATE TABLE IF NOT EXISTS news (id INTEGER PRIMARY KEY AUTOINCREMENT, time TEXT NOT NULL, type TEXT NOT NULL, title TEXT NOT NULL, summary TEXT, source TEXT, sourceUrl TEXT, date TEXT, created_at TEXT DEFAULT (datetime(\'now\')))'),
      db.prepare('CREATE TABLE IF NOT EXISTS favorites (id INTEGER PRIMARY KEY AUTOINCREMENT, fav_id TEXT NOT NULL, title TEXT, type TEXT, time TEXT, summary TEXT, source TEXT, sourceUrl TEXT, created_at TEXT DEFAULT (datetime(\'now\')))'),
      db.prepare('INSERT OR IGNORE INTO admins (username, password) VALUES (\'admin\', \'admin123\')')
    ]);
    return json({ success: true, message: '数据库初始化成功，管理员账号: admin / admin123' });
  }

  // 新增资讯
  if (path === 'news') {
    var r = await db.prepare('INSERT INTO news (time, type, title, summary, source, sourceUrl, date) VALUES (?, ?, ?, ?, ?, ?, ?)')
      .bind(body.time, body.type, body.title, body.summary || '', body.source || '', body.sourceUrl || '', body.date || '').run();
    return json({ success: true, id: r.meta.last_row_id });
  }

  // 新增收藏
  if (path === 'favorites') {
    await db.prepare('INSERT INTO favorites (fav_id, title, type, time, summary, source, sourceUrl) VALUES (?, ?, ?, ?, ?, ?, ?)')
      .bind(body.fav_id || '', body.title || '', body.type || '', body.time || '', body.summary || '', body.source || '', body.sourceUrl || '').run();
    return json({ success: true });
  }

  return json({ error: '未知路由' }, 404);
}

export async function onRequestPut(context) {
  var path = (context.params.path || [])[0] || '';
  var body = await context.request.json();
  var db = context.env.DB;

  if (!verifyToken(context.request.headers.get('Authorization'))) return json({ error: '未登录' }, 401);

  // 更新资讯
  if (path === 'news') {
    await db.prepare('UPDATE news SET time=?, type=?, title=?, summary=?, source=?, sourceUrl=?, date=? WHERE id=?')
      .bind(body.time, body.type, body.title, body.summary || '', body.source || '', body.sourceUrl || '', body.date || '', body.id).run();
    return json({ success: true });
  }

  return json({ error: '未知路由' }, 404);
}

export async function onRequestDelete(context) {
  var path = (context.params.path || [])[0] || '';
  var url = new URL(context.request.url);
  var id = url.searchParams.get('id');
  var db = context.env.DB;

  if (!verifyToken(context.request.headers.get('Authorization'))) return json({ error: '未登录' }, 401);

  if (path === 'news' && id) {
    await db.prepare('DELETE FROM news WHERE id=?').bind(id).run();
    return json({ success: true });
  }

  if (path === 'favorites' && id) {
    await db.prepare('DELETE FROM favorites WHERE id=?').bind(id).run();
    return json({ success: true });
  }

  return json({ error: '未知路由' }, 404);
}
