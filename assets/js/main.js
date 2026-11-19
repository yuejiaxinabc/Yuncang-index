/* =====================================================
   NovaKit 官网共享脚本 — 全页面通用
   所有交互均带元素存在性判断，子页面缺失的组件自动跳过
   ===================================================== */
(function () {
  "use strict";
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 1. 柔和浮动光点动态背景 ---------- */
  var canvas = document.getElementById("starfield");
  if (canvas) {
    var ctx = canvas.getContext("2d");
    var dots = [], W, H, raf;
    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
      var count = Math.min(90, Math.floor(W * H / 18000));
      dots = [];
      for (var i = 0; i < count; i++) {
        dots.push({
          x: Math.random() * W, y: Math.random() * H,
          r: Math.random() * 2.2 + 0.8,
          vx: (Math.random() - 0.5) * 0.14,
          vy: (Math.random() - 0.5) * 0.14,
          tw: Math.random() * Math.PI * 2,
          hue: Math.random() > 0.6 ? "142,92,246" : (Math.random() > 0.5 ? "255,122,158" : "0,113,227")
        });
      }
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < dots.length; i++) {
        var s = dots[i];
        s.x += s.vx; s.y += s.vy; s.tw += 0.015;
        if (s.x < 0) s.x = W; if (s.x > W) s.x = 0;
        if (s.y < 0) s.y = H; if (s.y > H) s.y = 0;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(" + s.hue + "," + (0.10 + Math.sin(s.tw) * 0.08).toFixed(2) + ")";
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    }
    if (!reduceMotion) {
      resize(); draw();
      window.addEventListener("resize", resize);
      document.addEventListener("visibilitychange", function () {
        if (document.hidden) { cancelAnimationFrame(raf); } else { draw(); }
      });
    }
  }

  /* ---------- 2. 滚动显现 ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("visible"); });
  }

  /* ---------- 3. 滚动视差（仅首页产品窗口） ---------- */
  var heroWin = document.getElementById("heroWindow");
  if (!reduceMotion && heroWin) {
    var ticking = false;
    window.addEventListener("scroll", function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var y = window.scrollY;
        if (y < window.innerHeight * 1.2) {
          heroWin.style.transform = "translateY(" + (y * -0.06) + "px)";
        }
        ticking = false;
      });
    }, { passive: true });
  }

  /* ---------- 4. 导航栏滚动阴影 + 当前页高亮 + 移动端菜单 ---------- */
  var header = document.querySelector(".site-header");
  if (header) {
    window.addEventListener("scroll", function () {
      header.classList.toggle("scrolled", window.scrollY > 10);
    }, { passive: true });
  }
  // 根据路径自动高亮当前导航项
  var path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach(function (a) {
    var href = a.getAttribute("href") || "";
    if (href === path) a.classList.add("active");
  });
  var menuBtn = document.getElementById("menuBtn");
  var navLinks = document.getElementById("navLinks");
  if (menuBtn && navLinks) {
    menuBtn.addEventListener("click", function () {
      var open = navLinks.classList.toggle("open");
      menuBtn.classList.toggle("open", open);
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    navLinks.addEventListener("click", function (e) {
      if (e.target.tagName === "A" && navLinks.classList.contains("open")) {
        navLinks.classList.remove("open"); menuBtn.classList.remove("open");
        menuBtn.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- 5. 卡片悬浮光斑跟随 ---------- */
  document.querySelectorAll(".feature-card").forEach(function (card) {
    card.addEventListener("pointermove", function (e) {
      var rect = card.getBoundingClientRect();
      card.style.setProperty("--mx", (e.clientX - rect.left) + "px");
      card.style.setProperty("--my", (e.clientY - rect.top) + "px");
    });
  });

  /* ---------- 6. 复制部署命令 ---------- */
  document.querySelectorAll(".copy-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var text = btn.getAttribute("data-copy") || "";
      function done() {
        btn.textContent = "已复制 ✓"; btn.classList.add("copied");
        setTimeout(function () { btn.textContent = "复制"; btn.classList.remove("copied"); }, 2000);
      }
      function fallback() {
        var ta = document.createElement("textarea");
        ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
        document.body.appendChild(ta); ta.select();
        try { document.execCommand("copy"); done(); } catch (err) {}
        document.body.removeChild(ta);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(fallback);
      } else { fallback(); }
    });
  });

  /* ---------- 7. 选项卡（部署页 npm / Docker / 云部署） ---------- */
  document.querySelectorAll("[data-tabs]").forEach(function (group) {
    var btns = group.querySelectorAll(".tab-btn");
    var panels = document.querySelectorAll(".tab-panel[data-group=\"" + group.getAttribute("data-tabs") + "\"]");
    btns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var target = btn.getAttribute("data-tab");
        btns.forEach(function (b) { b.classList.toggle("active", b === btn); });
        panels.forEach(function (p) { p.classList.toggle("active", p.getAttribute("data-tab") === target); });
      });
    });
  });

  /* ---------- 8. 平滑锚点 ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href");
      if (id === "#" || id.length < 2) return;
      var target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
      }
    });
  });
})();
