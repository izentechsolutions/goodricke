
/* ==========================================================
   ONE authoritative scroll system (no library, no duplicates).
   - Desktop (mouse/trackpad): wheel is eased with frame-rate-independent
     damping -> smooth, premium, not elastic, not laggy.
   - Touch / reduced-motion: native scrolling is left untouched.
   - Nested scrollers (product rows, modals) and horizontal wheel stay native.
   - Failsafe: any error leaves normal native scrolling in place.
   - The hero/unbox effect subscribes to this same loop (no extra listeners).
   ========================================================== */
(function () {
  'use strict';
  var root = document.documentElement;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine   = matchMedia('(hover: hover) and (pointer: fine)').matches;
  var smooth = fine && !reduce;

  var EASE = 0.13;      /* seconds: time constant of the glide (higher = slower/softer) */
  var MULT = 1.0;       /* wheel distance multiplier */

  var subs = [], raf = 0, animating = false, lastT = 0, queued = false;
  var cur = window.pageYOffset, tgt = cur, last = cur;

  function maxY() { return Math.max(0, root.scrollHeight - window.innerHeight); }
  function emit(y) { for (var i = 0; i < subs.length; i++) subs[i](y); }

  function tick(t) {
    raf = 0;
    var dt = Math.min(64, t - lastT) || 16; lastT = t;
    var diff = tgt - cur;
    if (Math.abs(diff) < 0.4) { cur = tgt; animating = false; }
    else { cur += diff * (1 - Math.exp(-dt / (EASE * 1000))); }
    last = cur;
    window.scrollTo(0, cur);
    emit(cur);
    if (animating) raf = requestAnimationFrame(tick);
  }
  function run() {
    if (animating) return;
    animating = true; lastT = performance.now();
    raf = requestAnimationFrame(tick);
  }
  function sync() {                       /* adopt a scroll we did not cause */
    if (raf) { cancelAnimationFrame(raf); raf = 0; }
    animating = false; cur = tgt = last = window.pageYOffset;
  }
  function goTo(y) {
    if (!animating) sync();
    tgt = Math.max(0, Math.min(maxY(), y)); run();
  }

  /* native scroll events: scrollbar drag, keyboard, anchors, touch */
  window.addEventListener('scroll', function () {
    var y = window.pageYOffset;
    if (Math.abs(y - last) > 3) sync();   /* external change wins */
    if (!animating && !queued) {
      queued = true;
      requestAnimationFrame(function () { queued = false; emit(window.pageYOffset); });
    }
  }, { passive: true });
  window.addEventListener('resize', function () { emit(window.pageYOffset); });

  window.gkScroll = { subscribe: function (fn) { subs.push(fn); fn(window.pageYOffset); } };

  if (smooth) {
    root.classList.add('gk-smooth');

    var locked = function () {
      return document.body.style.overflow === 'hidden' || root.classList.contains('gk-scroll-lock');
    };
    var insideScroller = function (el, dy) {
      while (el && el !== document.body && el !== root) {
        if (el.nodeType === 1) {
          if (el.hasAttribute('data-gk-native')) return true;
          var oy = getComputedStyle(el).overflowY;
          if ((oy === 'auto' || oy === 'scroll') && el.scrollHeight > el.clientHeight + 1) {
            if (dy < 0 && el.scrollTop > 0) return true;
            if (dy > 0 && el.scrollTop + el.clientHeight < el.scrollHeight - 1) return true;
          }
        }
        el = el.parentNode;
      }
      return false;
    };

    window.addEventListener('wheel', function (e) {
      try {
        if (e.ctrlKey || e.defaultPrevented || locked()) return;      /* pinch-zoom, modals */
        var dy = e.deltaY, dx = e.deltaX;
        if (Math.abs(dx) > Math.abs(dy)) return;                      /* horizontal stays native */
        if (insideScroller(e.target, dy)) return;                     /* nested scrollers stay native */
        if (e.deltaMode === 1) dy *= 32; else if (e.deltaMode === 2) dy *= window.innerHeight;
        e.preventDefault();
        if (!animating) sync();
        tgt = Math.max(0, Math.min(maxY(), tgt + dy * MULT));
        run();
      } catch (err) { /* never trap the user: fall back to native */ }
    }, { passive: false });

    /* in-page anchors glide instead of jumping */
    document.addEventListener('click', function (e) {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button) return;
      var a = e.target.closest && e.target.closest('a[href^="#"]');
      if (!a) return;
      var h = a.getAttribute('href'), el = null;
      if (h !== '#') { try { el = document.querySelector(h); } catch (x) {} if (!el) return; }
      e.preventDefault();
      goTo(el ? el.getBoundingClientRect().top + window.pageYOffset : 0);
    });
  }

  /* ---------- HERO -> UNBOX overlap driver (scoped to #heroScene) ---------- */
  var scene = document.getElementById('heroScene');
  var hero  = scene && scene.querySelector('.hero');
  if (scene && hero && !reduce) {
    var H = hero.offsetHeight || window.innerHeight, lastP = -1;
    window.addEventListener('resize', function () { H = hero.offsetHeight || window.innerHeight; });
    window.addEventListener('load',   function () { H = hero.offsetHeight || window.innerHeight; });
    subs.push(function (y) {
      var p = Math.max(0, Math.min(1, y / (H * 0.85)));
      p = Math.round(p * 1000) / 1000;
      if (p === lastP) return;              /* no writes when nothing changed / offscreen */
      lastP = p;
      scene.style.setProperty('--hero-p', p);
    });
    emit(window.pageYOffset);
  }
})();
