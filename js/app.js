/* ============================================================
   影视上新快讯 - 逻辑层
   依赖：data.js（SCENES, CATEGORIES, CAROUSEL_DATA, TIMELINE_DATA 等）
   数据由 data.js 通过 fetch 加载 JSON 后调用 window.appInit()
   ============================================================ */
(function () {
  'use strict';

  var EXTERNAL_LINK_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17L17 7M9 7h8v8"/></svg>';
  var HEART_OUTLINE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>';
  var HEART_FILLED = '<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>';
  var activeCategory = 'all';
  var favorites = [];
  var itemMap = {};
  var favMode = false;
  var userToken = null;
  var userName = null;
  /* ---------- AI 聊天状态 ---------- */
  var chatMessages = [];
  var chatMode = 'chat';
  var chatOpen = false;
  var chatLoading = false;

  function el(id) { return document.getElementById(id); }
  function escapeHtml(str) { return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

  /* ---------- 收藏夹（localStorage 持久化） ---------- */
  function loadFavorites() {
    try { favorites = JSON.parse(localStorage.getItem('ys_favorites')) || []; }
    catch (e) { favorites = []; }
  }
  function saveFavorites() {
    try { localStorage.setItem('ys_favorites', JSON.stringify(favorites)); } catch (e) {}
  }
  function isFavorited(id) {
    return favorites.some(function (f) { return f.id === id; });
  }
  function toggleFavorite(id) {
    var idx = favorites.findIndex(function (f) { return f.id === id; });
    var authHeaders = { 'Content-Type': 'application/json' };
    if (userToken) authHeaders['Authorization'] = 'Bearer ' + userToken;
    if (idx >= 0) {
      favorites.splice(idx, 1);
      // 同步删除数据库记录
      fetch('/api/favorites?fav_id=' + encodeURIComponent(id), { method: 'DELETE', headers: authHeaders }).catch(function(){});
    } else if (itemMap[id]) {
      favorites.push(itemMap[id]);
      // 同步写入数据库
      fetch('/api/favorites', {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({
          fav_id: id,
          title: itemMap[id].title,
          type: itemMap[id].type,
          time: itemMap[id].time,
          summary: itemMap[id].summary,
          source: itemMap[id].source,
          sourceUrl: itemMap[id].sourceUrl
        })
      }).catch(function(){});
    }
    saveFavorites();
    updateFavCount();
  }
  function updateFavCount() {
    var c = el('favCount'); if (c) c.textContent = favorites.length;
  }

  /* ---------- 用户认证 ---------- */
  function loadUser() {
    try {
      userToken = localStorage.getItem('ys_token') || null;
      userName = localStorage.getItem('ys_username') || null;
    } catch (e) { userToken = null; userName = null; }
  }
  function saveUser(token, username) {
    userToken = token;
    userName = username;
    try {
      localStorage.setItem('ys_token', token);
      localStorage.setItem('ys_username', username);
    } catch (e) {}
  }
  function logout() {
    userToken = null;
    userName = null;
    try {
      localStorage.removeItem('ys_token');
      localStorage.removeItem('ys_username');
    } catch (e) {}
    updateUserUI();
  }
  function updateUserUI() {
    var area = el('userArea');
    if (!area) return;
    if (userToken && userName) {
      area.innerHTML = '<div class="user-info"><span class="user-name">' + escapeHtml(userName) + '</span><button class="user-btn logout-btn" id="logoutBtn" type="button">退出</button></div>';
      var lb = el('logoutBtn');
      if (lb) lb.addEventListener('click', logout);
    } else {
      area.innerHTML = '<button class="user-btn" id="loginBtn" type="button">登录</button><button class="user-btn" id="registerBtn" type="button">注册</button>';
      var li = el('loginBtn');
      var rg = el('registerBtn');
      if (li) li.addEventListener('click', function () { showAuthModal('login'); });
      if (rg) rg.addEventListener('click', function () { showAuthModal('register'); });
    }
  }
  function showAuthModal(mode) {
    var modal = el('authModal');
    var title = el('authModalTitle');
    var submit = el('authSubmit');
    var error = el('authError');
    if (!modal) return;
    title.textContent = mode === 'register' ? '注册' : '登录';
    submit.textContent = mode === 'register' ? '注册' : '登录';
    error.textContent = '';
    el('authUsername').value = '';
    el('authPassword').value = '';
    modal.classList.add('active');
    modal.dataset.mode = mode;
  }
  function hideAuthModal() {
    var modal = el('authModal');
    if (modal) modal.classList.remove('active');
  }
  function handleAuth(mode) {
    var username = el('authUsername').value.trim();
    var password = el('authPassword').value;
    var error = el('authError');
    var submit = el('authSubmit');
    if (!username || !password) {
      error.textContent = '用户名和密码不能为空';
      return;
    }
    error.textContent = '';
    submit.disabled = true;
    submit.textContent = '处理中...';
    fetch('/api/auth/' + mode, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username, password: password })
    }).then(function (res) { return res.json(); }).then(function (data) {
      submit.disabled = false;
      submit.textContent = mode === 'register' ? '注册' : '登录';
      if (data.error) {
        error.textContent = data.error;
        return;
      }
      saveUser(data.token, data.username);
      updateUserUI();
      hideAuthModal();
    }).catch(function (e) {
      submit.disabled = false;
      submit.textContent = mode === 'register' ? '注册' : '登录';
      error.textContent = '网络错误，请稍后重试';
    });
  }

  /* ---------- 主题 ---------- */
  function applyTheme(catKey) {
    var cfg = CATEGORIES[catKey];
    var root = document.documentElement;
    root.style.setProperty('--bg-color', cfg.color);
    root.style.setProperty('--bg-deep', cfg.deep);
    root.style.setProperty('--bg-accent', cfg.accent);
    document.body.setAttribute('data-cat', catKey);
  }

  /* ---------- 背景剪影 ---------- */
  function renderScenes() {
    var container = el('bgScenes');
    var html = '';
    Object.keys(SCENES).forEach(function (key) {
      html += '<div class="bg-scene" data-scene="' + key + '">' + SCENES[key] + '</div>';
    });
    container.innerHTML = html;
  }
  function showScene(catKey) {
    document.querySelectorAll('.bg-scene').forEach(function (s) {
      s.classList.toggle('active', s.getAttribute('data-scene') === catKey);
    });
  }

  /* ---------- 品类 Tab ---------- */
  function renderTabs() {
    var tabs = el('categoryTabs');
    var html = '';
    Object.keys(CATEGORIES).forEach(function (key) {
      var c = CATEGORIES[key];
      html += '<button class="tab' + (key === activeCategory ? ' active' : '') + '" data-cat="' + key + '" type="button" role="tab" aria-selected="' + (key === activeCategory) + '"><span class="tab-dot" style="color:' + c.accent + '"></span>' + c.label + '</button>';
    });
    tabs.innerHTML = html;
    tabs.addEventListener('click', function (e) {
      var btn = e.target.closest('.tab');
      if (!btn) return;
      var key = btn.getAttribute('data-cat');
      if (key === activeCategory) return;
      setActiveCategory(key);
    });
  }

  /* ---------- 轮播图 ---------- */
  var carouselIndex = 0;
  var carouselTimer = null;

  function renderCarousel() {
    var track = el('carouselTrack');
    var dots = el('carouselDots');
    var slidesHtml = '';
    var dotsHtml = '';
    CAROUSEL_DATA.forEach(function (item, i) {
      var accent = CATEGORIES[item.typeKey].accent;
      slidesHtml +=
        '<div class="carousel-slide" style="--slide-accent:' + accent + '">' +
          '<img src="' + item.poster + '" alt="' + escapeHtml(item.title) + '海报" loading="' + (i === 0 ? 'eager' : 'lazy') + '">' +
          '<div class="carousel-overlay">' +
            '<span class="carousel-tag">' + item.type + '</span>' +
            '<h3 class="carousel-title">' + escapeHtml(item.title) + '</h3>' +
            '<p class="carousel-date">' + escapeHtml(item.date) + '</p>' +
            '<p class="carousel-desc">' + escapeHtml(item.desc) + '</p>' +
          '</div>' +
        '</div>';
      dotsHtml += '<span class="carousel-dot' + (i === 0 ? ' active' : '') + '" data-idx="' + i + '"></span>';
    });
    track.innerHTML = slidesHtml;
    dots.innerHTML = dotsHtml;
    dots.addEventListener('click', function (e) {
      var dot = e.target.closest('.carousel-dot');
      if (dot) goToSlide(parseInt(dot.getAttribute('data-idx'), 10));
    });
    el('carouselPrev').addEventListener('click', function () { goToSlide(carouselIndex - 1); });
    el('carouselNext').addEventListener('click', function () { goToSlide(carouselIndex + 1); });
    startCarouselAuto();
  }

  function goToSlide(idx) {
    var total = CAROUSEL_DATA.length;
    carouselIndex = (idx + total) % total;
    el('carouselTrack').style.transform = 'translateX(-' + (carouselIndex * 100) + '%)';
    document.querySelectorAll('.carousel-dot').forEach(function (d, i) {
      d.classList.toggle('active', i === carouselIndex);
    });
    restartCarouselAuto();
  }

  function startCarouselAuto() {
    carouselTimer = setInterval(function () { goToSlide(carouselIndex + 1); }, 5000);
  }
  function restartCarouselAuto() {
    if (carouselTimer) clearInterval(carouselTimer);
    startCarouselAuto();
  }

  /* ---------- 时间轴 ---------- */
  function renderCard(item, day) {
    var accent = CATEGORIES[TYPE_TO_KEY[item.type]].accent;
    var favId = (day ? day.date : (item.date || '')) + '|' + item.time + '|' + item.title;
    itemMap[favId] = {
      id: favId, time: item.time, type: item.type, title: item.title,
      summary: item.summary, source: item.source, sourceUrl: item.sourceUrl,
      date: day ? day.date : (item.date || ''), label: day ? day.label : (item.label || '')
    };
    var isFav = isFavorited(favId);
    return '<article class="news-card" style="--card-accent:' + accent + '">' +
      '<div class="card-top"><span class="card-time">' + item.time + '</span><span class="card-type">' + item.type + '</span></div>' +
      '<h3 class="card-title">' + escapeHtml(item.title) + '</h3>' +
      '<p class="card-summary">' + escapeHtml(item.summary) + '</p>' +
      '<div class="card-source"><span class="source-label">来源：<strong>' + escapeHtml(item.source) + '</strong></span>' +
      '<div class="card-actions">' +
      '<a class="source-link" href="' + item.sourceUrl + '" target="_blank" rel="noopener noreferrer">查看来源 ' + EXTERNAL_LINK_ICON + '</a>' +
      '<button class="fav-btn' + (isFav ? ' active' : '') + '" data-fav-id="' + escapeHtml(favId) + '" type="button" aria-label="收藏">' + (isFav ? HEART_FILLED : HEART_OUTLINE) + '</button>' +
      '</div></div>' +
      '</article>';
  }

  function renderTimeline() {
    var timeline = el('timeline');
    var frag = document.createDocumentFragment();
    TIMELINE_DATA.forEach(function (day) {
      var filtered = activeCategory === 'all' ? day.items : day.items.filter(function (it) { return TYPE_TO_KEY[it.type] === activeCategory; });
      if (filtered.length === 0) return;
      var section = document.createElement('section');
      section.className = 'date-section' + (day.isToday ? ' is-today' : '');
      section.setAttribute('data-date', day.date);
      if (day.isToday) section.setAttribute('id', 'today-section');
      section.innerHTML =
        '<div class="date-marker"><div class="date-dot"></div></div>' +
        '<h2 class="date-title">' + day.label + '<span class="weekday">' + day.weekday + '</span>' + (day.isToday ? '<span class="today-badge">今日</span>' : '') + '</h2>' +
        '<div class="date-items">' + filtered.map(function (item) { return renderCard(item, day); }).join('') + '</div>';
      frag.appendChild(section);
    });
    if (frag.childElementCount === 0) {
      var empty = document.createElement('div');
      empty.className = 'empty-state';
      empty.textContent = '当前品类暂无上新资讯，换个品类看看吧～';
      frag.appendChild(empty);
    }
    timeline.innerHTML = '';
    timeline.appendChild(frag);
  }

  function setActiveCategory(key) {
    activeCategory = key;
    favMode = false;
    var ft = el('favTab'); if (ft) ft.classList.remove('active');
    document.querySelectorAll('.tab[data-cat]').forEach(function (t) {
      var on = t.getAttribute('data-cat') === key;
      t.classList.toggle('active', on);
      t.setAttribute('aria-selected', on);
    });
    applyTheme(key);
    showScene(key);
    renderTimeline();
    scrollToToday();
  }

  /* ---------- 收藏夹视图 ---------- */
  function renderFavorites() {
    var timeline = el('timeline');
    if (favorites.length === 0) {
      timeline.innerHTML = '<div class="fav-empty">还没有收藏任何资讯，点击卡片右下角的爱心来收藏吧～</div>';
      return;
    }
    timeline.innerHTML = '<div class="fav-view">' +
      '<h2 class="fav-view-title">我的收藏夹 <span class="fav-count-large">' + favorites.length + ' 条</span></h2>' +
      '<div class="date-items">' + favorites.map(function (item) { return renderCard(item); }).join('') + '</div></div>';
  }

  function toggleFavMode() {
    favMode = !favMode;
    el('favTab').classList.toggle('active', favMode);
    if (favMode) {
      document.querySelectorAll('.tab[data-cat]').forEach(function (t) {
        t.classList.remove('active'); t.setAttribute('aria-selected', false);
      });
      renderFavorites();
    } else { setActiveCategory(activeCategory); }
  }

  function scrollToToday() {
    var today = document.getElementById('today-section');
    if (today) { requestAnimationFrame(function () { today.scrollIntoView({ behavior: 'smooth', block: 'start' }); }); }
    else { var tl = el('timeline'); if (tl) tl.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  }

  function renderHeaderDate() {
    var d = new Date();
    var weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    el('headerDate').textContent = d.getMonth() + 1 + '月' + d.getDate() + '日 ' + weekdays[d.getDay()];
    el('footerYear').textContent = d.getFullYear();
  }

  /* ============================================================
     AI 影视助手
     ============================================================ */

  /* 打开/关闭聊天面板 */
  function toggleChat() {
    chatOpen = !chatOpen;
    var panel = el('aiChatPanel');
    var fab = el('aiFab');
    if (!panel || !fab) return;
    if (chatOpen) {
      panel.classList.add('active');
      panel.setAttribute('aria-hidden', 'false');
      fab.classList.add('hidden');
      var input = el('aiChatInput');
      if (input) setTimeout(function () { input.focus(); }, 200);
    } else {
      panel.classList.remove('active');
      panel.setAttribute('aria-hidden', 'true');
      fab.classList.remove('hidden');
    }
  }

  /* 渲染聊天记录 */
  function renderChatMessages() {
    var box = el('aiChatMessages');
    if (!box) return;
    var html = '';
    chatMessages.forEach(function (msg) {
      if (msg.role === 'user') {
        html += '<div class="ai-msg ai-msg-user">' + escapeHtml(msg.content) + '</div>';
      } else if (msg.role === 'assistant') {
        /* AI 消息支持换行显示 */
        html += '<div class="ai-msg ai-msg-bot">' + escapeHtml(msg.content).replace(/\n/g, '<br>') + '</div>';
      } else if (msg.role === 'loading') {
        html += '<div class="ai-msg ai-msg-bot ai-msg-loading"><span class="ai-dot"></span><span class="ai-dot"></span><span class="ai-dot"></span></div>';
      } else if (msg.role === 'error') {
        html += '<div class="ai-msg ai-msg-bot ai-msg-error">' + escapeHtml(msg.content) + '</div>';
      }
    });
    box.innerHTML = html;
    /* 滚动到底部 */
    box.scrollTop = box.scrollHeight;
  }

  /* 发送消息，调用 /api/chat */
  function sendChatMessage() {
    if (chatLoading) return;
    var input = el('aiChatInput');
    if (!input) return;
    var text = input.value.trim();
    if (!text) return;

    /* 添加用户消息 */
    chatMessages.push({ role: 'user', content: text });
    input.value = '';
    /* 添加 loading 占位 */
    chatMessages.push({ role: 'loading', content: '' });
    chatLoading = true;
    renderChatMessages();

    /* 组装发送给 API 的消息（排除 loading 和 error） */
    var apiMessages = [];
    for (var i = 0; i < chatMessages.length; i++) {
      if (chatMessages[i].role === 'user' || chatMessages[i].role === 'assistant') {
        apiMessages.push({ role: chatMessages[i].role, content: chatMessages[i].content });
      }
    }

    fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: apiMessages, mode: chatMode })
    }).then(function (res) { return res.json(); }).then(function (data) {
      /* 移除 loading 占位 */
      var loadingIdx = -1;
      for (var j = 0; j < chatMessages.length; j++) {
        if (chatMessages[j].role === 'loading') { loadingIdx = j; break; }
      }
      if (loadingIdx >= 0) chatMessages.splice(loadingIdx, 1);

      if (data.error) {
        chatMessages.push({ role: 'error', content: data.error });
      } else {
        chatMessages.push({ role: 'assistant', content: data.reply || '（无回复内容）' });
      }
      chatLoading = false;
      renderChatMessages();
    }).catch(function () {
      /* 移除 loading 占位 */
      var loadingIdx2 = -1;
      for (var k = 0; k < chatMessages.length; k++) {
        if (chatMessages[k].role === 'loading') { loadingIdx2 = k; break; }
      }
      if (loadingIdx2 >= 0) chatMessages.splice(loadingIdx2, 1);
      chatMessages.push({ role: 'error', content: '网络错误，请稍后重试' });
      chatLoading = false;
      renderChatMessages();
    });
  }

  /* 初始化 AI 聊天功能 */
  function initAIChat() {
    /* 欢迎消息 */
    chatMessages.push({ role: 'assistant', content: '你好！我是 AI 影视助手，可以回答影视问题、推荐影视作品、生成资讯摘要。' });
    renderChatMessages();

    /* 悬浮按钮点击 */
    var fab = el('aiFab');
    if (fab) fab.addEventListener('click', toggleChat);

    /* 关闭按钮 */
    var closeBtn = el('aiChatClose');
    if (closeBtn) closeBtn.addEventListener('click', toggleChat);

    /* 发送按钮 */
    var sendBtn = el('aiChatSend');
    if (sendBtn) sendBtn.addEventListener('click', sendChatMessage);

    /* 输入框 Enter 键发送 */
    var input = el('aiChatInput');
    if (input) input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        sendChatMessage();
      }
    });

    /* 模式切换标签 */
    var modeTabs = document.querySelectorAll('.ai-mode-tab');
    modeTabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        if (chatLoading) return;
        modeTabs.forEach(function (t) { t.classList.remove('active'); });
        tab.classList.add('active');
        chatMode = tab.getAttribute('data-mode') || 'chat';
      });
    });
  }

  function init() {
    loadFavorites();
    updateFavCount();
    loadUser();
    updateUserUI();
    renderHeaderDate();
    renderScenes();
    renderTabs();
    renderCarousel();
    applyTheme(activeCategory);
    showScene(activeCategory);
    renderTimeline();
    requestAnimationFrame(function () { setTimeout(scrollToToday, 120); });

    /* 收藏按钮点击 */
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('.fav-btn');
      if (!btn) return;
      e.preventDefault();
      /* 未登录禁止收藏 */
      if (!userToken) {
        showAuthModal('login');
        return;
      }
      var id = btn.getAttribute('data-fav-id');
      toggleFavorite(id);
      var isFav = isFavorited(id);
      btn.classList.toggle('active', isFav);
      btn.innerHTML = isFav ? HEART_FILLED : HEART_OUTLINE;
    });

    /* 收藏夹 Tab */
    var ft = el('favTab');
    if (ft) ft.addEventListener('click', toggleFavMode);

    /* 登录/注册模态框事件 */
    var authModal = el('authModal');
    var authModalClose = el('authModalClose');
    var authSubmit = el('authSubmit');
    if (authModalClose) authModalClose.addEventListener('click', hideAuthModal);
    if (authSubmit) authSubmit.addEventListener('click', function () {
      var mode = authModal.dataset.mode || 'login';
      handleAuth(mode);
    });
    /* 点击遮罩关闭模态框 */
    if (authModal) authModal.addEventListener('click', function (e) {
      if (e.target === authModal) hideAuthModal();
    });
    /* 回车提交 */
    var authPassword = el('authPassword');
    if (authPassword) authPassword.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        var mode = authModal.dataset.mode || 'login';
        handleAuth(mode);
      }
    });

    /* 初始化 AI 影视助手 */
    initAIChat();
  }

  /* 暴露 init 给 data.js 在 JSON 加载完成后调用 */
  window.appInit = init;
})();
