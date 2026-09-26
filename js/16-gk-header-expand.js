
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
