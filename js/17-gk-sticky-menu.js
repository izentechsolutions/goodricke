
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
