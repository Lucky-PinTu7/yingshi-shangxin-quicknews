/* ============================================================
   影视上新快讯 - 逻辑层
   依赖：data.js（CATEGORIES, SCENES, CAROUSEL_DATA, TIMELINE_DATA 等）
   ============================================================ */
(function () {
  'use strict';

  var EXTERNAL_LINK_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17L17 7M9 7h8v8"/></svg>';
  var activeCategory = 'all';

  function el(id) { return document.getElementById(id); }
  function escapeHtml(str) { return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

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
  function renderCard(item) {
    var accent = CATEGORIES[TYPE_TO_KEY[item.type]].accent;
    return '<article class="news-card" style="--card-accent:' + accent + '">' +
      '<div class="card-top"><span class="card-time">' + item.time + '</span><span class="card-type">' + item.type + '</span></div>' +
      '<h3 class="card-title">' + escapeHtml(item.title) + '</h3>' +
      '<p class="card-summary">' + escapeHtml(item.summary) + '</p>' +
      '<div class="card-source"><span class="source-label">来源：<strong>' + escapeHtml(item.source) + '</strong></span>' +
      '<a class="source-link" href="' + item.sourceUrl + '" target="_blank" rel="noopener noreferrer">查看来源 ' + EXTERNAL_LINK_ICON + '</a></div>' +
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
        '<div class="date-items">' + filtered.map(renderCard).join('') + '</div>';
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
    document.querySelectorAll('.tab').forEach(function (t) {
      var on = t.getAttribute('data-cat') === key;
      t.classList.toggle('active', on);
      t.setAttribute('aria-selected', on);
    });
    applyTheme(key);
    showScene(key);
    renderTimeline();
    scrollToToday();
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

  function init() {
    renderHeaderDate();
    renderScenes();
    renderTabs();
    renderCarousel();
    applyTheme(activeCategory);
    showScene(activeCategory);
    renderTimeline();
    requestAnimationFrame(function () { setTimeout(scrollToToday, 120); });
  }

  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', init); }
  else { init(); }
})();
