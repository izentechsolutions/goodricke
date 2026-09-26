
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

    /* Text-label cursor bubbles ("Drag", "Play") intentionally removed per request —
       only the plain dot cursor remains, with no mouse-instruction labels. */

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
