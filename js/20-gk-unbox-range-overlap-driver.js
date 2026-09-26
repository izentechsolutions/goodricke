
(function () {
  'use strict';
  var unbox = document.querySelector('.hero-scene > .unbox');
  var range = document.querySelector('.range');
  if (!unbox || !range) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var lastP = -1;
  function smoothstep(t){ return t*t*(3-2*t); }
  function update() {
    var vh = window.innerHeight;
    var span = (window.innerWidth <= 767 ? 1.8 : 2.6) * vh;   // very slow ramp
    var top = range.getBoundingClientRect().top;
    var raw = Math.max(0, Math.min(1, (span - top) / span));
    var p = smoothstep(raw);
    p = Math.round(p * 1000) / 1000;
    if (p === lastP) return;
    lastP = p;
    unbox.style.setProperty('--unbox-cover-p', p);
  }
  if (window.gkScroll) window.gkScroll.subscribe(update);
  else { addEventListener('scroll', update, { passive: true }); update(); }
  addEventListener('resize', update);
  addEventListener('load', update);
})();
