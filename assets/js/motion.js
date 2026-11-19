/* 首页动效：数字滚动 + 视差（轻量、失败不影响阅读） */
(function () {
  'use strict';

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 首屏数字滚动 ---------- */
  function animateNumber(el) {
    var text = (el.textContent || '').trim();
    var target = parseInt(text, 10);
    if (!isFinite(target) || String(target) !== text) return; // 只处理纯数字
    var start = performance.now();
    var dur = 900;
    el.classList.add('counting');
    function tick(now) {
      var p = Math.min(1, (now - start) / dur);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = String(Math.round(target * eased));
      if (p < 1) requestAnimationFrame(tick);
      else { el.textContent = String(target); el.classList.remove('counting'); }
    }
    requestAnimationFrame(tick);
  }

  var nums = document.querySelectorAll('.hero-meta b');
  if (!reduce && 'IntersectionObserver' in window && nums.length) {
    var seen = false;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting || seen) return;
        seen = true;
        nums.forEach(animateNumber);
        io.disconnect();
      });
    }, { threshold: 0.4 });
    var meta = document.querySelector('.hero-meta');
    if (meta) io.observe(meta);
  }

  /* ---------- 光斑轻微视差 ---------- */
  if (!reduce && window.matchMedia && window.matchMedia('(pointer:fine)').matches) {
    var hero = document.querySelector('.hero');
    if (hero) {
      var raf = null;
      hero.addEventListener('mousemove', function (ev) {
        if (raf) return;
        raf = requestAnimationFrame(function () {
          var r = hero.getBoundingClientRect();
          var x = (ev.clientX - r.left) / r.width - 0.5;
          var y = (ev.clientY - r.top) / r.height - 0.5;
          hero.style.setProperty('--mx', (x * 18).toFixed(1) + 'px');
          hero.style.setProperty('--my', (y * 14).toFixed(1) + 'px');
          raf = null;
        });
      });
      hero.addEventListener('mouseleave', function () {
        hero.style.setProperty('--mx', '0px');
        hero.style.setProperty('--my', '0px');
      });
    }
  }
})();
