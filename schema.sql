-- 影视上新快讯 - 数据库建表脚本
-- 在 Cloudflare Dashboard -> D1 -> 执行 SQL 中运行

-- 管理员表
CREATE TABLE IF NOT EXISTS admins (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL
);

-- 资讯表
CREATE TABLE IF NOT EXISTS news (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  time TEXT NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  summary TEXT,
  source TEXT,
  sourceUrl TEXT,
  date TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

-- 收藏表
CREATE TABLE IF NOT EXISTS favorites (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  fav_id TEXT NOT NULL,
  title TEXT,
  type TEXT,
  time TEXT,
  summary TEXT,
  source TEXT,
  sourceUrl TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

-- 插入默认管理员（用户名: admin，密码: admin123）
INSERT OR IGNORE INTO admins (username, password) VALUES ('admin', 'admin123');

-- 插入示例资讯
INSERT OR IGNORE INTO news (time, type, title, summary, source, sourceUrl, date) VALUES
('10:00', '电影', '《逆光航行》定档国庆', '航海题材冒险片锁定国庆档', '光影快讯', 'https://example.com', '2026-08-04'),
('14:30', '电视剧', '《破晓时分》七夕开播', '古装权谋剧定档七夕', '剧集风向标', 'https://example.com', '2026-08-04');
