
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
