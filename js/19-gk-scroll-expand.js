
/* ScrollExpand (React Bits) - vanilla port for the existing static page.
   Same maths as the component: smoothstep progress, start/end radius,
   scrollDistance / holdDistance (in stage heights), optional smoothing.
   Difference: instead of clip-path over a duplicated image, the EXISTING card
   (.unbox-stage) is resized in place, so its slides, slider script and text
   keep working untouched. Progress is read from the page scroll (the
   useWindowScroll mode) and rides the single scroll loop (gkScroll). */
(function () {
  'use strict';
  var sec  = document.querySelector('.hero-scene > .unbox');
  var card = sec && sec.querySelector('.unbox-stage');
  var slot = card && card.parentElement;
  var hold = document.querySelector('.unbox-expand-hold');
  if (!sec || !card || !slot || !slot.classList.contains('unbox-slot') || !hold) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;   /* enabled=false: card stays as designed */

  var clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };
  var smoothstep = function (e0, e1, x) { var t = clamp((x - e0) / ((e1 - e0) || 1e-6), 0, 1); return t * t * (3 - 2 * t); };

  var mobile = matchMedia('(max-width:767px)');
  function cfg() {                          /* props (desktop / mobile values) */
    return mobile.matches
      ? { scrollDistance: 0.9, holdDistance: 0.2, endRadius: 0, smoothing: 0.08 }
      : { scrollDistance: 1.2, holdDistance: 0.35, endRadius: 0, smoothing: 0.08 };
  }

  var g = null;                              /* measured geometry */
  var expanding = false, current = 0, target = 0, raf = 0, last = 0;

  function clearInline() {
    ['position','left','top','width','height','margin','min-height','border-radius'].forEach(function (p) { card.style.removeProperty(p); });
    slot.style.removeProperty('height');
    slot.classList.remove('is-expanding');
    expanding = false;
  }

  function measure() {
    var wasExp = expanding;
    if (wasExp) clearInline();               /* measure the resting layout */
    var c = cfg();
    var W = document.documentElement.clientWidth, H = window.innerHeight;
    var secH = sec.offsetHeight;
    var pinTop = Math.min(0, H - secH);
    sec.style.setProperty('--unbox-top', pinTop + 'px');
    hold.style.height = Math.round(H * (c.scrollDistance + c.holdDistance)) + 'px';
    var cs = getComputedStyle(card);
    g = {
      W: W, H: H, c: c, pinTop: pinTop, pinBottom: pinTop + secH,
      mt: parseFloat(cs.marginTop) || 0,
      restH: card.offsetHeight,
      restW: slot.clientWidth,
      radius: parseFloat(cs.borderTopLeftRadius) || 0,
      slotL: slot.offsetLeft, slotT: slot.offsetTop
    };
    apply(current);
  }

  function readProgress() {
    if (!g) return 0;
    var s = g.pinBottom - hold.getBoundingClientRect().top;      /* scroll travelled since the section pinned */
    return clamp(s / (g.H * Math.max(0.01, g.c.scrollDistance)), 0, 1);
  }

  function apply(p) {
    if (!g) return;
    if (p <= 0.0005) { if (expanding) clearInline(); return; }
    var e = smoothstep(0, 1, p);
    var L = 0 + (-g.slotL - 0) * e;
    var T = g.mt + ((-g.pinTop - g.slotT) - g.mt) * e;
    var Wd = g.restW + (g.W - g.restW) * e;
    var Hd = g.restH + (g.H - g.restH) * e;
    var R = g.radius + (g.c.endRadius - g.radius) * e;
    if (!expanding) {
      slot.style.height = (g.mt + g.restH) + 'px';
      slot.classList.add('is-expanding');
      expanding = true;
    }
    var st = card.style;
    st.setProperty('position', 'absolute', 'important');
    st.setProperty('margin', '0', 'important');
    st.setProperty('min-height', '0', 'important');
    st.setProperty('left', L.toFixed(2) + 'px', 'important');
    st.setProperty('top', T.toFixed(2) + 'px', 'important');
    st.setProperty('width', Wd.toFixed(2) + 'px', 'important');
    st.setProperty('height', Hd.toFixed(2) + 'px', 'important');
    st.setProperty('border-radius', R.toFixed(2) + 'px', 'important');
  }

  function tick(t) {
    var dt = Math.min(64, t - last) || 16; last = t;
    var sm = g ? g.c.smoothing : 0;
    var k = sm <= 0 ? 1 : 1 - Math.exp(-dt / (sm * 1000));
    current += (target - current) * k;
    if (Math.abs(target - current) < 0.0004) { current = target; raf = 0; } else { raf = requestAnimationFrame(tick); }
    apply(current);
  }
  function onScroll() {
    target = readProgress();
    /* the page scroll is already eased (gk-smooth): lock to it; native/touch scroll gets light smoothing */
    if (document.documentElement.classList.contains('gk-smooth')) { current = target; apply(current); return; }
    if (!raf) { last = performance.now(); raf = requestAnimationFrame(tick); }
  }

  function boot() {
    measure();
    target = current = readProgress(); apply(current);
    if (window.gkScroll) window.gkScroll.subscribe(onScroll);
    else addEventListener('scroll', onScroll, { passive: true });
    var re = function () { measure(); target = current = readProgress(); apply(current); };
    addEventListener('resize', re);
    addEventListener('load', re);
    if (window.ResizeObserver) { var ro = new ResizeObserver(re); ro.observe(slot); }
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(re);
    if (mobile.addEventListener) mobile.addEventListener('change', re);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
