/* Goodricke — common.js: Shared on every page: header, menus, smooth scroll, cursor, mega-menu, search, bag drawer, lazy videos. */

// ==== Header bag count ====
/* Keeps every "Bag (n)" label in the header in sync, for the session. */
window.gkBag = (function () {
  var KEY = 'gkBagCount', n = 0;
  try { n = parseInt(sessionStorage.getItem(KEY), 10) || 0; } catch (e) {}
  function render() {
    document.querySelectorAll('.cart-link span').forEach(function (el) {
      if (/^\s*Bag \(\d+\)\s*$/.test(el.textContent)) el.textContent = 'Bag (' + n + ')';
    });
  }
  function add(qty) { n += qty || 1; try { sessionStorage.setItem(KEY, n); } catch (e) {} render(); return n; }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render); else render();
  return { add: add, count: function () { return n; } };
})();


// ==== Mobile menu ====
try { (function(){

document.addEventListener('DOMContentLoaded', function () {
    const menuToggle = document.querySelector('.menu-toggle');
    const menu = document.querySelector('.pillnav');
    if (!menuToggle || !menu) return;

    function setOpen(on) {
        menu.classList.toggle('open', on);
        menuToggle.classList.toggle('active', on);
        menuToggle.setAttribute('aria-expanded', on ? 'true' : 'false');
        menuToggle.setAttribute('aria-label', on ? 'Close menu' : 'Open menu');
        document.body.classList.toggle('gk-menu-lock', on);   /* page stays put behind the menu */
    }
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.addEventListener('click', function () { setOpen(!menu.classList.contains('open')); });
    menu.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () { setOpen(false); });
    });
    /* tap on the dimmed page or press Escape to close */
    document.addEventListener('click', function (e) {
        if (menu.classList.contains('open') && !menu.contains(e.target) && !menuToggle.contains(e.target)) setOpen(false);
    });
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && menu.classList.contains('open')) { setOpen(false); menuToggle.focus(); }
    });
    window.addEventListener('resize', function () { if (window.innerWidth > 767 && menu.classList.contains('open')) setOpen(false); });
});


})(); } catch (e) { console.error("Mobile menu", e); }

// ==== Smooth scroll ====
try { (function(){

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
      var b = document.body;
      return b.style.overflow === 'hidden' || root.classList.contains('gk-scroll-lock') ||
        b.classList.contains('gk-bag-lock') || b.classList.contains('gk-filter-lock') || b.classList.contains('gk-menu-lock');
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
        if (e.ctrlKey || e.defaultPrevented) return;                  /* pinch-zoom */
        var dy = e.deltaY, dx = e.deltaX;
        /* a drawer/modal is open: only its own scroll area moves, never the page behind it */
        if (locked()) { if (!insideScroller(e.target, dy)) e.preventDefault(); return; }
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


})(); } catch (e) { console.error("Smooth scroll", e); }

// ==== Sticky header ====
try { (function(){

/* Hero pill -> white sticky header. One scroll-driven driver, subscribed to the
   single scroll loop (gk-smooth-scroll). Replaces the old two-header handoff. */
(function () {
  'use strict';
  var bar = document.getElementById('stickybar');
  var hero = document.querySelector('.hero');
  var pill = document.querySelector('.hero .pillnav');
  if (!bar || !hero) return;
  var logo = document.querySelector('.hero .navwrap > img');
  var actions = document.querySelector('.hero .navactions');
  var topline = document.querySelector('.hero .topline');
  var toggle = document.querySelector('.hero .menu-toggle');
  var mqMobile = matchMedia('(max-width:900px)');
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var RANGE = 170;                       /* scroll px for the full expansion */

  function measure() {
    if (!pill || mqMobile.matches) return;
    var r = pill.getBoundingClientRect(), h = hero.getBoundingClientRect();
    if (!r.width) return;
    bar.style.setProperty('--x0', (r.left + r.width / 2) + 'px');
    bar.style.setProperty('--w0', r.width + 'px');
    bar.style.setProperty('--h0', r.height + 'px');
    bar.style.setProperty('--t0', (r.top - h.top) + 'px');
  }
  function setFade(el, o) { if (el) { el.style.opacity = o; el.style.pointerEvents = o < 0.05 ? 'none' : ''; } }

  var lastKey = '';
  function update(sy) {
    var mobile = mqMobile.matches;
    var p = reduce ? (sy > 1 ? 1 : 0) : Math.max(0, Math.min(1, sy / RANGE));
    p = Math.round(p * 1000) / 1000;
    var on = sy > 1;
    var key = p + '|' + on + '|' + mobile;
    if (key === lastKey) return;
    lastKey = key;

    bar.style.setProperty('--hp', p);
    bar.classList.toggle('show', on && (mobile ? sy >= 70 : true));

    /* hero header pieces: pill is swapped instantly (the bar sits exactly on it),
       logo / actions / top strip fade out over the first 40% of the expansion */
    var f = mobile ? Math.max(0, Math.min(1, sy / 70)) : Math.max(0, Math.min(1, p / 0.4));
    if (pill && !mobile) { pill.style.visibility = on ? 'hidden' : ''; }
    setFade(logo, 1 - f); setFade(actions, 1 - f); setFade(topline, 1 - f); setFade(toggle, 1 - f);
    var nw = document.querySelector('.hero .navwrap');
    if (nw && mobile) nw.style.pointerEvents = f >= 1 ? 'none' : '';
    if (topline) topline.style.visibility = f >= 1 ? 'hidden' : '';
    if (logo) logo.style.visibility = f >= 1 ? 'hidden' : '';
    if (actions) actions.style.visibility = f >= 1 ? 'hidden' : '';
    if (toggle) toggle.style.visibility = f >= 1 ? 'hidden' : '';
  }

  function boot() {
    measure();
    if (window.gkScroll) window.gkScroll.subscribe(update);
    else { addEventListener('scroll', function () { update(window.pageYOffset); }, { passive: true }); update(window.pageYOffset); }
    addEventListener('resize', function () { measure(); lastKey = ''; update(window.pageYOffset); });
    addEventListener('load', function () { measure(); lastKey = ''; update(window.pageYOffset); });
    if (mqMobile.addEventListener) mqMobile.addEventListener('change', function () { measure(); lastKey = ''; update(window.pageYOffset); });
  }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { measure(); });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();


})(); } catch (e) { console.error("Sticky header", e); }

// ==== Sticky header menu ====
try { (function(){

(function () {
  var bar = document.getElementById('stickybar'), btn = document.getElementById('stickyToggle');
  if (!bar || !btn) return;
  function set(open) {
    bar.classList.toggle('menu-open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  btn.addEventListener('click', function (e) { e.stopPropagation(); set(!bar.classList.contains('menu-open')); });
  bar.querySelectorAll('.sticky-menu a').forEach(function (a) { a.addEventListener('click', function () { set(false); }); });
  document.addEventListener('click', function (e) { if (!bar.contains(e.target)) set(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') set(false); });
  /* the menu can never stay open while the bar is hidden (back at top) */
  new MutationObserver(function () { if (!bar.classList.contains('show')) set(false); })
    .observe(bar, { attributes: true, attributeFilter: ['class'] });
})();


})(); } catch (e) { console.error("Sticky header menu", e); }


// ==== Custom cursor ====
try { (function(){

(function () {
  'use strict';
  try {
    if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var root = document.documentElement;

    var mark = document.createElement('div');
    mark.className = 'gk-cursor'; mark.setAttribute('aria-hidden', 'true');
    mark.innerHTML = '<i></i>';
    var label = document.createElement('div');
    label.className = 'gk-cursor-label'; label.setAttribute('aria-hidden', 'true');
    label.innerHTML = '<span></span>';
    var labelText = label.firstChild;
    document.body.appendChild(mark); document.body.appendChild(label);

    /* Plain dot cursor (no text labels). */

    var tx = -100, ty = -100, x = tx, y = ty, raf = 0, last = 0, moveT = 0, seen = false, down = false;
    var TAU = 55;                              /* ms: follow smoothing (lower = tighter) */

    function frame(t) {
      raf = 0;
      var dt = Math.min(64, t - last) || 16; last = t;
      var k = 1 - Math.exp(-dt / TAU);
      x += (tx - x) * k; y += (ty - y) * k;
      var tr = 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0)';
      mark.style.transform = tr; label.style.transform = tr;
      if (Math.abs(tx - x) > 0.1 || Math.abs(ty - y) > 0.1) raf = requestAnimationFrame(frame);
    }
    function kick() { if (!raf) { last = performance.now(); raf = requestAnimationFrame(frame); } }

    function classify(el) {
      var link = false, text = '';
      for (var n = el; n && n !== document.documentElement; n = n.parentElement) {
        if (n.nodeType !== 1) continue;
        var cl = n.getAttribute('data-cursor-label'), cd = n.getAttribute('data-cursor');
        if (cl) { text = cl; break; }
        if (cd === 'drag') { text = 'Drag'; break; }
        if (!link && n.matches('a,button,[role="button"],summary,label,select,input,textarea')) link = true;
      }
      mark.classList.toggle('is-link', link && !text);
      var has = !!text;
      if (has && labelText.textContent !== text) labelText.textContent = text;
      label.classList.toggle('has-label', has);
      mark.classList.toggle('has-label', has);
    }

    var lastEl = null;
    function refresh() { var el = document.elementFromPoint(tx, ty); if (el !== lastEl) { lastEl = el; classify(el); } }

    addEventListener('pointermove', function (e) {
      if (e.pointerType && e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
      tx = e.clientX; ty = e.clientY;
      if (!seen) {
        seen = true; x = tx; y = ty;
        mark.style.transform = label.style.transform = 'translate3d(' + x + 'px,' + y + 'px,0)';
        root.classList.add('gk-cursor-on');    /* native cursor hidden only once ours is alive */
        mark.classList.add('is-on'); label.classList.add('is-on');
      }
      mark.classList.add('is-moving'); clearTimeout(moveT);
      moveT = setTimeout(function () { mark.classList.remove('is-moving'); }, 140);
      refresh(); kick();
    }, { passive: true });

    addEventListener('pointerdown', function () { down = true; mark.classList.add('is-down'); }, { passive: true });
    addEventListener('pointerup',   function () { down = false; mark.classList.remove('is-down'); }, { passive: true });
    document.addEventListener('mouseleave', function () { mark.classList.remove('is-on'); label.classList.remove('is-on'); });
    document.addEventListener('mouseenter', function () { if (seen) { mark.classList.add('is-on'); label.classList.add('is-on'); } });

    /* page moves under a still pointer: re-evaluate what is beneath it (rides the single scroll loop) */
    if (window.gkScroll) window.gkScroll.subscribe(function () { if (seen) refresh(); });
  } catch (err) {
    document.documentElement.classList.remove('gk-cursor-on');   /* failsafe: native cursor back */
  }
})();

})(); } catch (e) { console.error("Custom cursor", e); }


// ==== Mega-menu panels ====
try { (function(){

(function () {
  'use strict';
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  var root = document.getElementById('gkNavPanels');
  if (!root) return;
  var panels = {};
  root.querySelectorAll('.nav-panel').forEach(function (p) { panels[p.dataset.panel] = p; });
  var triggers = document.querySelectorAll('[data-panel-trigger]');

  var openTimer = null, closeTimer = null, current = null, lastTrigger = null;

  function positionFor(trigger) {
    var header = trigger.closest('.navwrap, #stickybar');
    var rect = (header || trigger).getBoundingClientRect();
    root.style.top = Math.max(0, rect.bottom) + 'px';
  }

  function positionCard(panel, trigger) {
    if (!panel.classList.contains('nav-panel--card')) return;
    var tRect = trigger.getBoundingClientRect();
    var vw = document.documentElement.clientWidth;
    var w = panel.offsetWidth;
    var left = Math.min(Math.max(tRect.left, 24), Math.max(24, vw - w - 24));
    panel.style.left = left + 'px';
  }

  function setWell(panel, src) {
    if (!panel || !src) return;
    var a = panel.querySelector('.nav-panel__well-img--a');
    var b = panel.querySelector('.nav-panel__well-img--b');
    if (!a || !b) return;
    var front = a.classList.contains('is-active') ? a : b;
    var back = front === a ? b : a;
    if (front.getAttribute('src') === src) return;
    back.setAttribute('src', src);
    back.classList.add('is-active');
    front.classList.remove('is-active');
  }

  function openPanel(key, trigger) {
    clearTimeout(closeTimer);
    clearTimeout(openTimer);
    lastTrigger = trigger;
    openTimer = setTimeout(function () {
      var panel = panels[key];
      if (!panel) return;
      if (current && current !== panel) {
        current.classList.remove('is-open');
        current.hidden = true;
      }
      positionFor(trigger);
      panel.hidden = false;
      void panel.offsetWidth; // force reflow so the transition runs
      positionCard(panel, trigger);
      panel.classList.add('is-open');
      current = panel;
      var first = panel.querySelector('.nav-panel__link');
      if (first) setWell(panel, first.dataset.img);
      document.querySelectorAll('[data-panel-trigger="' + key + '"]').forEach(function (t) {
        t.setAttribute('aria-expanded', 'true');
      });
    }, 60);
  }

  function closePanel() {
    clearTimeout(openTimer);
    closeTimer = setTimeout(function () {
      if (current) current.classList.remove('is-open');
      triggers.forEach(function (t) { t.setAttribute('aria-expanded', 'false'); });
      var closing = current;
      current = null;
      setTimeout(function () { if (closing) closing.hidden = true; }, 420);
    }, 180);
  }

  triggers.forEach(function (t) {
    t.addEventListener('mouseenter', function () { openPanel(t.dataset.panelTrigger, t); });
    t.addEventListener('focus', function () { openPanel(t.dataset.panelTrigger, t); });
    t.addEventListener('mouseleave', closePanel);
    t.addEventListener('blur', closePanel);
  });
  root.addEventListener('mouseenter', function () { clearTimeout(closeTimer); });
  root.addEventListener('mouseleave', closePanel);

  root.querySelectorAll('.nav-panel__link').forEach(function (link) {
    link.addEventListener('mouseenter', function () {
      var panel = link.closest('.nav-panel');
      setWell(panel, link.dataset.img);
      panel.querySelectorAll('.nav-panel__link').forEach(function (l) { l.classList.remove('is-active'); });
      link.classList.add('is-active');
    });
  });

  addEventListener('scroll', function () { if (current) closePanel(); }, { passive: true });
  addEventListener('keydown', function (e) { if (e.key === 'Escape' && current) closePanel(); });
  addEventListener('resize', function () {
    if (current && lastTrigger) {
      positionFor(lastTrigger);
      positionCard(current, lastTrigger);
    }
  });
})();

})(); } catch (e) { console.error("Mega-menu panels", e); }

// ==== Bag drawer ====
/* "Added to Bag" tray (static HTML build): shows the product(s) just added, with subtotal,
   discount and total for them. The coupon field is layout only. The Shopify theme replaces
   this with the real cart (Cart API), so nothing is stored here. */
try { (function(){
  var FREE_SHIP = 999; /* matches "Free shipping over ₹999" in the top bar */

  function initGoodrickeBagDrawer(){
    var drawer = document.getElementById('gkBagDrawer');
    if(!drawer || drawer.dataset.initialized === 'true') return;
    drawer.dataset.initialized = 'true';
    var $ = function(id){ return document.getElementById(id); };
    var overlay = $('gkBagOverlay'), list = $('gkBagItems'), lines = [];

    var inr = function(n){ return '₹' + Math.round(n).toLocaleString('en-IN'); };
    var num = function(t){ var m = String(t || '').replace(/,/g,'').match(/[0-9]+(?:\.[0-9]+)?/); return m ? parseFloat(m[0]) : 0; };
    var esc = function(t){ return String(t).replace(/[&<>"']/g, function(c){ return '&#' + c.charCodeAt(0) + ';'; }); };
    var oldMoney = function(el){ return firstMoney(el); };

    function firstMoney(el){
      var m=(el?el.textContent:'').replace(/\s+/g,' ').match(/(?:₹|Rs\.?)\s?[\d,]+(?:\.\d+)?/i);
      return m?m[0].replace(/\s/g,''):'';
    }
    function getProductData(button){
      /* PDP main "Add to bag" button */
      if(button.classList.contains('pdp-cta')){
        var qtyIn=document.querySelector('.pdp-qty input');
        var gimg=document.querySelector('.pdp-gallery__slide img');
        var wt=document.querySelector('.pdp-weight__opt.is-active');
        var ttl=document.querySelector('.pdp-info__title');
        return {
          image: gimg ? gimg.getAttribute('src') : '',
          alt: ttl ? ttl.textContent.trim() : '',
          name: ttl ? ttl.textContent.trim() : 'Goodricke Product',
          size: wt ? (wt.dataset.size || wt.dataset.pack || wt.textContent.trim().replace(/\s+/g,' ')) : '',
          price: firstMoney(document.querySelector('.pdp-price')),
          oldPrice: oldMoney(document.querySelector('.pdp-price-cut')),
          qty: qtyIn ? parseInt(qtyIn.value,10) || 1 : 1
        };
      }
      /* Home: bestseller cards */
      var shop = button.closest('.gk-product-card');
      if(shop){
        var simg = shop.querySelector('.gk-product-media img');
        var sname = shop.querySelector('.gk-product-info h3');
        var ssize = shop.querySelector('.size-chips .active') || shop.querySelector('.size-chips span');
        return {
          image: simg ? simg.getAttribute('src') : '',
          alt: simg ? (simg.getAttribute('alt') || '') : '',
          name: sname ? sname.textContent.trim() : 'Goodricke Product',
          size: ssize ? ssize.textContent.trim() : '',
          price: firstMoney(shop.querySelector('.glc-money')||shop.querySelector('.shop-price')),
          oldPrice: oldMoney(shop.querySelector('.old-price'))
        };
      }
      /* Home: range cards */
      var range = button.closest('.range-card');
      if(range){
        var rimg = range.querySelector('.range-media img');
        var rname = range.querySelector('h3');
        var rsize = range.querySelector('.range-sizes .active') || range.querySelector('.range-sizes span');
        return {
          image: rimg ? rimg.getAttribute('src') : '',
          alt: rimg ? (rimg.getAttribute('alt') || '') : '',
          name: rname ? rname.textContent.trim().replace(/\s+/g,' ') : 'Goodricke Product',
          size: rsize ? rsize.textContent.trim() : '',
          price: firstMoney(range.querySelector('.range-price')),
          oldPrice: oldMoney(range.querySelector('.old-price'))
        };
      }
      var card = button.closest('.product-item');
      if(!card) return null;

      var img = card.querySelector('.product-image img');
      var name = card.querySelector('.product-details h2');
      var size = card.querySelector('.size-option.is-active') || card.querySelector('.size-option');
      var price = card.querySelector('.product-price');

      return {
        image: img ? img.getAttribute('src') : '',
        alt: img ? (img.getAttribute('alt') || '') : '',
        name: name ? name.textContent.trim() : 'Goodricke Product',
        size: size ? size.textContent.trim() : '',
        price: firstMoney(price),
        oldPrice: oldMoney(card.querySelector('.product-cut-price'))
      };
    }

    function render(){
      var mrp = 0, sell = 0, qty = 0;
      lines.forEach(function(it){ sell += it.price * it.qty; mrp += Math.max(it.mrp, it.price) * it.qty; qty += it.qty; });
      $('gkBagCount').textContent = qty;
      list.innerHTML = lines.map(function(it, i){
        var save = it.mrp > it.price;
        return '<li class="gk-bag-item is-new" data-i="' + i + '">' +
          '<div class="gk-bag-item__img">' + (it.image ? '<img alt="" src="' + esc(it.image) + '"/>' : '') + '</div>' +
          '<div class="gk-bag-item__body">' +
            '<p class="gk-bag-item__name">' + esc(it.name) + '</p>' +
            (it.size ? '<p class="gk-bag-item__meta">' + esc(it.size) + '</p>' : '') +
            '<p class="gk-bag-item__price"><span>' + inr(it.price * it.qty) + '</span>' + (save ? '<s>' + inr(it.mrp * it.qty) + '</s><em>' + Math.round((it.mrp - it.price) / it.mrp * 100) + '% off</em>' : '') + '</p>' +
            '<div class="gk-bag-item__row">' +
              '<div class="gk-bag-qty"><button type="button" data-step="-1" aria-label="Decrease quantity">\u2212</button><span>' + it.qty + '</span><button type="button" data-step="1" aria-label="Increase quantity">+</button></div>' +
              '<button type="button" class="gk-bag-item__remove" aria-label="Remove item"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3"/></svg></button>' +
            '</div>' +
          '</div></li>';
      }).join('');
      var left = FREE_SHIP - sell;
      $('gkBagShipText').innerHTML = left > 0 ? 'You are <strong>' + inr(left) + '</strong> away from free shipping' : '<strong>You\u2019ve unlocked free shipping</strong>';
      $('gkBagShipFill').style.width = Math.min(100, sell / FREE_SHIP * 100) + '%';
      $('gkBagShip').classList.toggle('is-done', left <= 0);
      $('gkBagMrp').textContent = inr(mrp);
      $('gkBagDiscRow').hidden = !(mrp > sell); $('gkBagDisc').textContent = '\u2212' + inr(mrp - sell);
      $('gkBagShipAmt').textContent = left <= 0 ? 'FREE' : 'Calculated at checkout';
      $('gkBagShipAmt').classList.toggle('is-free', left <= 0);
      $('gkBagTotal').textContent = inr(sell);
      $('gkBagSaved').hidden = !(mrp > sell); $('gkBagSaved').textContent = 'You save ' + inr(mrp - sell) + ' on this order';
      $('gkBagCheckout').textContent = 'Check out \u00b7 ' + inr(sell);
    }

    list.addEventListener('click', function(e){
      var li = e.target.closest('.gk-bag-item'); if(!li) return;
      var it = lines[+li.dataset.i]; if(!it) return;
      var step = e.target.closest('[data-step]');
      if(step){ it.qty = Math.min(99, Math.max(1, it.qty + parseInt(step.dataset.step, 10))); render(); }
      else if(e.target.closest('.gk-bag-item__remove')){ lines.splice(+li.dataset.i, 1); if(lines.length) render(); else closeDrawer(); }
    });

    /* items: [{name, size, image, price, oldPrice, qty}] — the product(s) just added */
    function openDrawer(items){
      lines = items.map(function(d){ return { name: d.name, size: d.size || '', image: d.image || '', price: num(d.price), mrp: num(d.oldPrice), qty: d.qty || 1 }; });
      if(window.gkBag) window.gkBag.add(lines.reduce(function(n, it){ return n + it.qty; }, 0));
      render();
      drawer.classList.remove('is-open');
      void drawer.offsetWidth;
      drawer.classList.add('is-open');
      overlay.classList.add('is-open');
      drawer.setAttribute('aria-hidden','false');
      overlay.setAttribute('aria-hidden','false');
      document.body.classList.add('gk-bag-lock');
      window.setTimeout(function(){ $('gkBagClose').focus(); }, 120);
    }
    function closeDrawer(){
      drawer.classList.remove('is-open');
      overlay.classList.remove('is-open');
      drawer.setAttribute('aria-hidden','true');
      overlay.setAttribute('aria-hidden','true');
      document.body.classList.remove('gk-bag-lock');
    }

    document.addEventListener('click', function(e){
      var button = e.target.closest('.product-add-to-bag, .pdp-cta, .gk-add-cart, .range-add-cart');
      if(!button) return;
      e.preventDefault();
      e.stopPropagation();
      var data = getProductData(button);
      if(!data) return;
      var label = button.classList.contains('product-add-to-bag') ? button.querySelector('span') : null;
      if(label){ button.classList.add('is-added'); label.textContent = 'ADDED TO BAG'; }
      openDrawer([data]);
      if(label){ window.setTimeout(function(){ button.classList.remove('is-added'); label.textContent = 'ADD TO BAG'; }, 1400); }
    }, true);

    /* other sections (e.g. Frequently Bought Together) can open the tray: detail = {items:[{name, price, mrp, img}]} */
    document.addEventListener('gk-cart-add', function(e){
      var d = e.detail || {}, items = d.items || [d];
      openDrawer(items.map(function(x){ return { name: x.name || 'Goodricke Product', size: x.size || '', image: x.img || '', price: String(x.price || ''), oldPrice: String(x.mrp || ''), qty: x.qty || 1 }; }));
    });

    /* "You may also like": + adds that product to the tray */
    drawer.querySelector('.gk-bag-upsell') && drawer.querySelector('.gk-bag-upsell').addEventListener('click', function(e){
      var b = e.target.closest('.gk-bag-upsell__add'); if(!b) return;
      var c = b.closest('.gk-bag-upsell__card'), name = c.querySelector('.gk-bag-upsell__name').textContent;
      var hit = lines.filter(function(it){ return it.name === name; })[0];
      if(hit) hit.qty = Math.min(99, hit.qty + 1);
      else lines.push({ name: name, size: '', image: c.querySelector('img').getAttribute('src'), price: num(c.querySelector('.gk-bag-upsell__price span').textContent), mrp: num(c.querySelector('.gk-bag-upsell__price s').textContent), qty: 1 });
      if(window.gkBag) window.gkBag.add(1);
      render();
    });
    $('gkBagClose').addEventListener('click', closeDrawer);
    $('gkBagContinue').addEventListener('click', closeDrawer);
    $('gkBagCouponForm').addEventListener('submit', function(e){ e.preventDefault(); }); /* wired up by the Shopify theme */
    overlay.addEventListener('click', closeDrawer);
    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape' && drawer.classList.contains('is-open')) closeDrawer();
    });
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initGoodrickeBagDrawer);
  else initGoodrickeBagDrawer();
})(); } catch (e) { console.error("Bag drawer", e); }

// ==== Header search ====
try { (function(){
(function(){
  var trigger=document.getElementById('headerSearch');
  var box=document.getElementById('hsearch');
  var input=document.getElementById('hsearchInput');
  var list=document.getElementById('hsearchResults');
  if(!trigger||!box||!input||!list) return;
  var closeBtn=box.querySelector('.hsearch__close');
  var pages=['Home','Shop','Our Gardens','Journal','Contact'];

  function position(){
    var r=trigger.getBoundingClientRect();
    var pill=document.querySelector('.pillnav');
    var acts=document.querySelector('.navactions');
    var wide=window.innerWidth>900&&pill&&acts;
    var right,width;
    if(wide){
      var pr=pill.getBoundingClientRect(),ar=acts.getBoundingClientRect();
      right=Math.max(12,window.innerWidth-ar.right);
      width=ar.right-pr.left;
    }else{
      width=Math.min(460,window.innerWidth-24);
      right=Math.max(12,window.innerWidth-r.right-8);
      /* keep the whole panel on screen: never let it start left of the 12px margin */
      if(window.innerWidth-right-width<12) right=Math.max(12,window.innerWidth-12-width);
    }
    box.style.top=Math.max(8,r.top+r.height/2-24)+'px';
    box.style.right=right+'px';
    box.style.setProperty('--hs-w',width+'px');
  }
  function open(){
    position();
    box.classList.add('is-open');
    document.body.classList.add('search-open');
    trigger.setAttribute('aria-expanded','true');
    setTimeout(function(){input.focus();},120);
    render();
  }
  function close(){
    box.classList.remove('is-open');
    document.body.classList.remove('search-open');
    trigger.setAttribute('aria-expanded','false');
    input.value='';
    list.innerHTML='';
  }
  function products(){
    return Array.prototype.map.call(document.querySelectorAll('.product-item'),function(el){
      var h=el.querySelector('.product-details h2');
      var img=el.querySelector('.product-image img');
      var price=el.querySelector('.product-price');
      return h?{el:el,name:h.textContent.trim(),img:img?img.getAttribute('src'):'',price:price?price.childNodes[0].textContent.trim():''}:null;
    }).filter(Boolean);
  }
  function esc(t){return t.replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
  function render(){
    var q=input.value.trim().toLowerCase();
    var html='';
    if(!q){
      html='<li class="hsearch__label">Popular searches</li>'+['Darjeeling','Assam','Chai','Green Tea','Gift'].map(function(t){return '<li><button class="hsearch__chip" data-q="'+t+'" type="button">'+t+'</button></li>';}).join('');
      list.innerHTML=html;return;
    }
    var seen={};
    var prods=products().filter(function(p){if(seen[p.name]||p.name.toLowerCase().indexOf(q)<0)return false;seen[p.name]=1;return true;}).slice(0,6);
    var pg=pages.filter(function(n){return n.toLowerCase().indexOf(q)>-1;});
    if(prods.length){
      html+='<li class="hsearch__label">Products</li>'+prods.map(function(p,i){
        return '<li><button class="hsearch__item" data-p="'+i+'" type="button"><img alt="" src="'+esc(p.img)+'"/><span>'+esc(p.name)+'</span><em>'+esc(p.price)+'</em></button></li>';
      }).join('');
    }
    if(pg.length){
      html+='<li class="hsearch__label">Pages</li>'+pg.map(function(n){return '<li><button class="hsearch__item hsearch__item--page" type="button"><span>'+esc(n)+'</span></button></li>';}).join('');
    }
    if(!html) html='<li class="hsearch__empty">No results for “'+esc(input.value.trim())+'”</li>';
    list.innerHTML=html;
    list._prods=prods;
  }
  function goTo(p){
    close();
    p.el.scrollIntoView({behavior:'smooth',block:'center'});
    p.el.classList.add('hsearch-hit');
    setTimeout(function(){p.el.classList.remove('hsearch-hit');},2200);
  }
  trigger.addEventListener('click',function(e){e.preventDefault();box.classList.contains('is-open')?close():open();});
  closeBtn.addEventListener('click',close);
  input.addEventListener('input',function(){
    render();
    var pi=document.getElementById('productSearchInput');
    if(pi){pi.value=input.value;pi.dispatchEvent(new Event('input',{bubbles:true}));}
  });
  input.addEventListener('keydown',function(e){
    if(e.key==='Enter'){var first=list.querySelector('.hsearch__item[data-p]');if(first)first.click();}
  });
  list.addEventListener('click',function(e){
    var chip=e.target.closest('.hsearch__chip');
    if(chip){input.value=chip.getAttribute('data-q');render();input.focus();return;}
    var item=e.target.closest('.hsearch__item[data-p]');
    if(item&&list._prods){goTo(list._prods[+item.getAttribute('data-p')]);}
  });
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&box.classList.contains('is-open'))close();});
  document.addEventListener('click',function(e){
    if(box.classList.contains('is-open')&&!box.contains(e.target)&&!trigger.contains(e.target))close();
  });
  window.addEventListener('resize',function(){if(box.classList.contains('is-open'))position();});
  window.addEventListener('scroll',function(){if(box.classList.contains('is-open'))position();},{passive:true});
})();


})(); } catch (e) { console.error("Header search", e); }

// ==== Lazy background videos ====
/* Videos marked .gk-lazy-video don't download on page load; they start when
   scrolled near and pause when off-screen. The poster shows the first frame. */
try { (function () {
  var vids = document.querySelectorAll('video.gk-lazy-video');
  if (!vids.length) return;
  if (!('IntersectionObserver' in window)) { vids.forEach(function (v) { v.preload = 'auto'; v.play().catch(function () {}); }); return; }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      var v = e.target;
      if (e.isIntersecting) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
      else if (!v.paused) v.pause();
    });
  }, { rootMargin: '300px 0px' });
  vids.forEach(function (v) { io.observe(v); });
})(); } catch (e) { console.error('lazy-video', e); }
