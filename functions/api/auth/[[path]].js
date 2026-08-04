/* ============================================================
   影视上新快讯 - 用户认证 API
   路由：/api/auth/*
   数据库：Cloudflare D1
   ============================================================ */

var CORS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

function json(data, status) {
  return new Response(JSON.stringify(data), { status: status || 200, headers: CORS });
}

/* ---------- 简易 Token（和 admin 保持一致） ---------- */
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
function getUsernameFromToken(authHeader) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  try {
    var data = JSON.parse(atob(authHeader.slice(7)));
    if (data.e > Date.now()) return data.u;
    return null;
  } catch (e) { return null; }
}

export async function onRequestOptions() {
  return new Response(null, { headers: CORS });
}

/* GET /api/auth/verify - 验证 token 是否有效 */
export async function onRequestGet(context) {
  var path = (context.params.path || [])[0] || '';
  if (path === 'verify') {
    var authHeader = context.request.headers.get('Authorization');
    var username = getUsernameFromToken(authHeader);
    if (username) {
      return json({ valid: true, username: username });
    }
    return json({ valid: false }, 401);
  }
  return json({ error: '未知路由' }, 404);
}

/* POST /api/auth/register | /api/auth/login */
export async function onRequestPost(context) {
  var path = (context.params.path || [])[0] || '';
  var db = context.env.DB;
  if (!db) return json({ error: '数据库未绑定' }, 500);

  try {
    var body = await context.request.json();
    var username = (body.username || '').trim();
    var password = body.password || '';

    if (!username || !password) {
      return json({ error: '用户名和密码不能为空' }, 400);
    }

    /* 注册 */
    if (path === 'register') {
      var exist = await db.prepare('SELECT id FROM users WHERE username = ?').bind(username).first();
      if (exist) return json({ error: '用户名已存在' }, 409);
      await db.prepare('INSERT INTO users (username, password) VALUES (?, ?)').bind(username, password).run();
      return json({ token: createToken(username), username: username });
    }

    /* 登录 */
    if (path === 'login') {
      var row = await db.prepare('SELECT * FROM users WHERE username = ? AND password = ?').bind(username, password).first();
      if (!row) return json({ error: '用户名或密码错误' }, 401);
      return json({ token: createToken(row.username), username: row.username });
    }

    return json({ error: '未知路由' }, 404);
  } catch (e) {
    return json({ error: e.message }, 500);
  }
}
