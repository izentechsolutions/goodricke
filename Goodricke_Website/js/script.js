// ==== js/01-goodricke-click-only-script.js ====
try { (function(){

document.addEventListener("DOMContentLoaded", function () {
  const cards = document.querySelectorAll(".gk-product-card");

  cards.forEach(function (card) {

    card.addEventListener("click", function (event) {

      /* Do not toggle the card when clicking its controls */
      if (
        event.target.closest(".gk-action-btn") ||
        event.target.closest(".gk-add-cart") ||
        event.target.closest("a") ||
        event.target.closest("button")
      ) {
        return;
      }

      /* Close every other product */
      cards.forEach(function (otherCard) {
        if (otherCard !== card) {
          otherCard.classList.remove("gk-card-active");
        }
      });

      /* Open/close the clicked product */
      card.classList.toggle("gk-card-active");
    });
  });

  /* Close when clicking outside the product cards */
  document.addEventListener("click", function (event) {
    if (!event.target.closest(".gk-product-card")) {
      cards.forEach(function (card) {
        card.classList.remove("gk-card-active");
      });
    }
  });

  /* Close with Escape */
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      cards.forEach(function (card) {
        card.classList.remove("gk-card-active");
      });
    }
  });
});


})(); } catch (e) { console.error("js/01-goodricke-click-only-script.js", e); }

// ==== js/02-goodricke-final-click-script.js ====
try { (function(){

document.addEventListener("DOMContentLoaded", function () {
  const rangeCards = Array.from(document.querySelectorAll(".range-card"));
  const productCards = Array.from(document.querySelectorAll(".gk-product-card"));
  const allCards = [...rangeCards, ...productCards];

  function closeAll(except) {
    allCards.forEach(function (card) {
      if (card !== except) {
        card.classList.remove("range-card-active");
        card.classList.remove("gk-card-active");
      }
    });
  }

  allCards.forEach(function (card) {
    card.addEventListener("click", function (event) {

      /* Buttons/links perform their own action and should not
         toggle the card underneath them. */
      if (
        event.target.closest("button") ||
        event.target.closest("a")
      ) {
        return;
      }

      const isRange = card.classList.contains("range-card");

      closeAll(card);

      if (isRange) {
        card.classList.toggle("range-card-active");
      } else {
        card.classList.toggle("gk-card-active");
      }
    });
  });

  /* Clicking outside closes all product options */
  document.addEventListener("click", function (event) {
    if (!event.target.closest(".range-card, .gk-product-card")) {
      closeAll(null);
    }
  });

  /* Escape closes all */
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeAll(null);
    }
  });
});


})(); } catch (e) { console.error("js/02-goodricke-final-click-script.js", e); }

// ==== js/03-mobile-product-tap-only.js ====
try { (function(){

document.addEventListener("DOMContentLoaded", function () {
  const cards = document.querySelectorAll(
    ".gk-product-card, .range-card"
  );

  cards.forEach(function (card) {
    card.addEventListener("click", function (event) {

      /* On desktop, CSS hover handles the interaction.
         On mobile/touch, this click activates the card. */
      const isTouch =
        window.matchMedia("(max-width: 900px)").matches ||
        window.matchMedia("(hover: none)").matches;

      if (!isTouch) return;

      /* Don't toggle when clicking an actual control */
      if (
        event.target.closest("button") ||
        event.target.closest("a")
      ) {
        return;
      }

      cards.forEach(function (other) {
        if (other !== card) {
          other.classList.remove("gk-card-active");
          other.classList.remove("range-card-active");
        }
      });

      if (card.classList.contains("gk-product-card")) {
        card.classList.toggle("gk-card-active");
      } else {
        card.classList.toggle("range-card-active");
      }
    });
  });
});


})(); } catch (e) { console.error("js/03-mobile-product-tap-only.js", e); }

// ==== js/04-gk-mobile-click-script.js ====
try { (function(){

document.addEventListener('DOMContentLoaded', function(){
  const cards = Array.from(document.querySelectorAll('.gk-product-card'));
  if (!cards.length) return;

  const isMobile = () => window.matchMedia('(max-width: 768px), (hover: none)').matches;

  cards.forEach(card => {
    card.addEventListener('click', function(e){
      if (!isMobile()) return;

      /* Let the actual controls work without toggling the card */
      if (e.target.closest('.gk-action-btn, .gk-add-cart, a, button')) return;

      cards.forEach(other => {
        if (other !== card) other.classList.remove('gk-card-active');
      });

      card.classList.toggle('gk-card-active');
    });
  });

  document.addEventListener('click', function(e){
    if (!e.target.closest('.gk-product-card')) {
      cards.forEach(card => card.classList.remove('gk-card-active'));
    }
  });
});


})(); } catch (e) { console.error("js/04-gk-mobile-click-script.js", e); }

// ==== js/05-promo-overlap-crossfade.js ====
try { (function(){

(function(){
  var sec=document.getElementById('promoOvl');
  if(!sec) return;
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var one=sec.querySelector('.is-one'), two=sec.querySelector('.is-two');
  var queued=false;
  function render(){
    queued=false;
    var total=sec.offsetHeight-Math.min(600,window.innerHeight);
    var p=total>0?(-sec.getBoundingClientRect().top)/total:0;
    p=Math.max(0,Math.min(1,p));
    /* crossfade window: 25%-75% of the pinned scroll */
    var t=Math.max(0,Math.min(1,(p-0.12)/0.76));
    var e=t<0.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;   /* smooth ease in-out */
    one.style.opacity=String(1-e);
    one.style.transform='translateY('+(-34*e)+'px) scale('+(1-0.03*e)+')';
    one.style.filter='blur('+(6*e)+'px)';
    two.style.opacity=String(e);
    two.style.transform='translateY('+(48*(1-e))+'px) scale('+(0.985+0.015*e)+')';
    two.style.filter='blur('+(6*(1-e))+'px)';
  }
  function onScroll(){ if(!queued){queued=true;requestAnimationFrame(render);} }
  window.addEventListener('scroll',onScroll,{passive:true});
  window.addEventListener('resize',onScroll);
  render();
})();


})(); } catch (e) { console.error("js/05-promo-overlap-crossfade.js", e); }

// ==== js/06-mobile-menu-toggle.js ====
try { (function(){

document.addEventListener('DOMContentLoaded', function () {

    const menuToggle = document.querySelector('.menu-toggle');
    const menu = document.querySelector('.pillnav');

    if (!menuToggle || !menu) return;

    menuToggle.addEventListener('click', function () {
        menu.classList.toggle('open');
        menuToggle.classList.toggle('active');
    });

    menu.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
            menu.classList.remove('open');
            menuToggle.classList.remove('active');
        });
    });

});


})(); } catch (e) { console.error("js/06-mobile-menu-toggle.js", e); }

// ==== js/07-story-video-modal.js ====
try { (function(){

(function(){
  var btn      = document.getElementById('watchStoryBtn');
  var modal    = document.getElementById('videoModal');
  var closeBtn = document.getElementById('videoModalClose');
  var player   = document.getElementById('videoModalPlayer');

  if(!btn || !modal || !player) return;

  btn.addEventListener('click', function(e){
    e.preventDefault();
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    player.currentTime = 0;
    player.play();
  });

  function closeModal(){
    modal.classList.remove('open');
    player.pause();
    player.currentTime = 0;
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', closeModal);


  modal.addEventListener('click', function(e){
    if(e.target === modal) closeModal();
  });
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape') closeModal();
  });
})();


})(); } catch (e) { console.error("js/07-story-video-modal.js", e); }

// ==== js/08-unbox-slider.js ====
try { (function(){

document.addEventListener("DOMContentLoaded", function () {

  const slides = document.querySelectorAll(".unbox-slide");
  const text = document.querySelector(".unbox-copy");

  if (!slides.length || !text) return;

  let current = 0;

  /* First image + first text animation */
  slides[0].classList.add("active");
  text.classList.add("animate");


  function changeSlide() {

    const previous = current;

    current = (current + 1) % slides.length;


    /* -------------------------
       IMAGE CROSSFADE
       ------------------------- */

    slides[current].style.zIndex = "2";
    slides[previous].style.zIndex = "1";

    slides[current].classList.add("active");


    /* -------------------------
       TEXT ANIMATION RESTART
       ------------------------- */

    text.classList.remove("animate");

    /* Force animation restart */
    void text.offsetWidth;

    text.classList.add("animate");


    /* Remove previous image AFTER fade */
    setTimeout(function () {

      slides[previous].classList.remove("active");
      slides[previous].style.zIndex = "0";

    }, 2300);
  }


  /* Change image every 6 seconds */
  setInterval(changeSlide, 6000);

});


})(); } catch (e) { console.error("js/08-unbox-slider.js", e); }

// ==== js/09-team-row-autoscroll-a.js ====
try { (function(){

document.addEventListener("DOMContentLoaded", () => {
  const slider = document.querySelector(".team-row");

  if (!slider) return;

  let isDragging = false;
  let startX = 0;
  let startScrollLeft = 0;
  let animationFrame;
  let direction = 1;

  /* Smooth automatic movement */
  function autoSlide() {
    if (!isDragging) {
      const maxScroll = slider.scrollWidth - slider.clientWidth;

      slider.scrollLeft += 0.35 * direction;

      /* Reach right → smoothly change direction */
      if (slider.scrollLeft >= maxScroll - 1) {
        direction = -1;
      }

      /* Reach left → smoothly change direction */
      if (slider.scrollLeft <= 1) {
        direction = 1;
      }
    }

    animationFrame = requestAnimationFrame(autoSlide);
  }

  autoSlide();

  /* Mouse drag */
  slider.addEventListener("mousedown", (e) => {
    isDragging = true;
    slider.classList.add("dragging");

    startX = e.pageX - slider.offsetLeft;
    startScrollLeft = slider.scrollLeft;
  });

  slider.addEventListener("mousemove", (e) => {
    if (!isDragging) return;

    e.preventDefault();

    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 1.5;

    slider.scrollLeft = startScrollLeft - walk;
  });

  function stopDragging() {
    isDragging = false;
    slider.classList.remove("dragging");
  }

  slider.addEventListener("mouseup", stopDragging);
  slider.addEventListener("mouseleave", stopDragging);

  /* Pause when mouse is over the section */
  slider.addEventListener("mouseenter", () => {
    if (!isDragging) {
      // Keeps position but pauses automatic movement
      slider.dataset.hover = "true";
    }
  });

  slider.addEventListener("mouseleave", () => {
    slider.dataset.hover = "false";
  });
});


})(); } catch (e) { console.error("js/09-team-row-autoscroll-a.js", e); }

// ==== js/10-team-row-autoscroll-b.js ====
try { (function(){

document.addEventListener("DOMContentLoaded", () => {
  const slider = document.querySelector(".team-row");
  if (!slider) return;

  let isDragging = false;
  let isHovering = false;
  let startX = 0;
  let startScrollLeft = 0;
  let direction = 1;

  const speed = 0.3;

  function animate() {
    if (!isDragging && !isHovering) {
      const maxScroll = slider.scrollWidth - slider.clientWidth;

      slider.scrollLeft += speed * direction;

      if (slider.scrollLeft >= maxScroll) {
        direction = -1;
      }

      if (slider.scrollLeft <= 0) {
        direction = 1;
      }
    }

    requestAnimationFrame(animate);
  }

  /* Mouse drag */
  slider.addEventListener("mousedown", (e) => {
    isDragging = true;

    startX = e.pageX - slider.offsetLeft;
    startScrollLeft = slider.scrollLeft;

    slider.classList.add("dragging");
  });

  slider.addEventListener("mousemove", (e) => {
    if (!isDragging) return;

    e.preventDefault();

    const x = e.pageX - slider.offsetLeft;
    const distance = x - startX;

    slider.scrollLeft = startScrollLeft - distance;
  });

  slider.addEventListener("mouseup", () => {
    isDragging = false;
    slider.classList.remove("dragging");
  });

  slider.addEventListener("mouseleave", () => {
    isDragging = false;
    slider.classList.remove("dragging");
  });

  /* Pause on hover */
  slider.addEventListener("mouseenter", () => {
    isHovering = true;
  });

  slider.addEventListener("mouseleave", () => {
    isHovering = false;
  });

  animate();
});


})(); } catch (e) { console.error("js/10-team-row-autoscroll-b.js", e); }

// ==== js/11-instagram-reel-autoplay.js ====
try { (function(){

document.addEventListener("DOMContentLoaded", () => {

  const videos = document.querySelectorAll(".insta-tile video.reel-video");

  const observer = new IntersectionObserver((entries) => {

    entries.forEach(entry => {
      const video = entry.target;
      const tile = video.closest(".insta-tile");

      if (entry.isIntersecting) {
        video.muted = true; // required for autoplay on mobile browsers
        const playPromise = video.play();
        if (playPromise && typeof playPromise.then === "function") {
          playPromise
            .then(() => { if (tile) tile.classList.remove("reel-fallback"); })
            .catch(() => {
              // Autoplay blocked (e.g. low-power mode, browser policy):
              // fall back to showing the poster frame + play icon instead
              // of leaving a broken/frozen video.
              if (tile) tile.classList.add("reel-fallback");
            });
        }
      } else {
        video.pause();
      }
    });

  }, {
    threshold: 0.5
  });

  videos.forEach(video => {
    observer.observe(video);
  });

});


})(); } catch (e) { console.error("js/11-instagram-reel-autoplay.js", e); }

// ==== js/12-gk-product-carousel-script.js ====
try { (function(){

document.addEventListener("DOMContentLoaded", function(){
  const root = document.querySelector("[data-gk-slider]");
  if(!root) return;

  const row = root.querySelector(".gk-product-row");
  const prev = root.querySelector(".shop-nav--prev");
  const next = root.querySelector(".shop-nav--next");
  if(!row || !prev || !next) return;

  function getStep(){
    const card = row.querySelector(".gk-product-card");
    if(!card) return row.clientWidth;
    const gap = parseFloat(getComputedStyle(row).gap) || 0;
    return card.getBoundingClientRect().width + gap;
  }

  function updateButtons(){
    const max = Math.max(0, row.scrollWidth - row.clientWidth);
    prev.disabled = row.scrollLeft <= 2;
    next.disabled = row.scrollLeft >= max - 2;
    const canSlide = max > 2;
    prev.style.visibility = canSlide ? "visible" : "visible";
    next.style.visibility = canSlide ? "visible" : "visible";
  }

  prev.addEventListener("click", function(){
    row.scrollBy({left:-getStep(), behavior:"smooth"});
  });

  next.addEventListener("click", function(){
    row.scrollBy({left:getStep(), behavior:"smooth"});
  });

  row.addEventListener("scroll", updateButtons, {passive:true});
  window.addEventListener("resize", updateButtons, {passive:true});
  updateButtons();

  root.querySelectorAll(".gk-product-card").forEach(function(card){
    const view = card.querySelector(".gk-view-btn");
    if(view){
      view.addEventListener("click", function(){
        card.classList.toggle("gk-card-focused");
      });
    }
  });
});


})(); } catch (e) { console.error("js/12-gk-product-carousel-script.js", e); }

// ==== js/13-gk-mobile-click-final.js ====
try { (function(){

document.addEventListener("DOMContentLoaded", function () {
  const cards = Array.from(document.querySelectorAll(".gk-product-card"));

  function isMobile() {
    return window.matchMedia("(max-width: 768px)").matches;
  }

  cards.forEach(function (card) {
    card.addEventListener("click", function (event) {

      if (!isMobile()) return;

      /* Action buttons should not toggle the card */
      if (
        event.target.closest(".gk-action-btn") ||
        event.target.closest(".gk-add-cart") ||
        event.target.closest("a") ||
        event.target.closest("button")
      ) {
        return;
      }

      /* Close all other GK cards */
      cards.forEach(function (other) {
        if (other !== card) {
          other.classList.remove("gk-card-active");
        }
      });

      /* Toggle clicked card */
      card.classList.toggle("gk-card-active");
    });
  });

  /* Clicking outside closes active GK card */
  document.addEventListener("click", function (event) {
    if (!event.target.closest(".gk-product-card")) {
      cards.forEach(function (card) {
        card.classList.remove("gk-card-active");
      });
    }
  });
});


})(); } catch (e) { console.error("js/13-gk-mobile-click-final.js", e); }

// ==== js/14-isolated-both-product-sections-click.js ====
try { (function(){

document.addEventListener("DOMContentLoaded", function(){

  const rangeCards = Array.from(document.querySelectorAll(".gkr-card"));
  const bestCards  = Array.from(document.querySelectorAll(".gks-card"));

  /* Close only cards inside the same section */
  function closeRange(except){
    rangeCards.forEach(function(card){
      if(card !== except) card.classList.remove("gkr-active");
    });
  }

  function closeBest(except){
    bestCards.forEach(function(card){
      if(card !== except) card.classList.remove("gks-active");
    });
  }

  /* RANGE SECTION — mobile click */
  rangeCards.forEach(function(card){
    card.addEventListener("click", function(event){

      if(window.innerWidth > 768) return;

      if(
        event.target.closest(".gkr-action") ||
        event.target.closest(".gkr-add") ||
        event.target.closest("button")
      ){
        return;
      }

      closeRange(card);
      card.classList.toggle("gkr-active");
    });
  });

  /* BESTSELLERS SECTION — mobile click */
  bestCards.forEach(function(card){
    card.addEventListener("click", function(event){

      if(window.innerWidth > 768) return;

      if(
        event.target.closest(".gks-action") ||
        event.target.closest(".gks-add") ||
        event.target.closest("button")
      ){
        return;
      }

      closeBest(card);
      card.classList.toggle("gks-active");
    });
  });

  /* Outside click closes both independently */
  document.addEventListener("click", function(event){

    if(!event.target.closest(".gkr-card")){
      closeRange(null);
    }

    if(!event.target.closest(".gks-card")){
      closeBest(null);
    }
  });

});


})(); } catch (e) { console.error("js/14-isolated-both-product-sections-click.js", e); }

// ==== js/15-gk-smooth-scroll.js ====
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


})(); } catch (e) { console.error("js/15-gk-smooth-scroll.js", e); }

// ==== js/16-gk-header-expand.js ====
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


})(); } catch (e) { console.error("js/16-gk-header-expand.js", e); }

// ==== js/17-gk-sticky-menu.js ====
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


})(); } catch (e) { console.error("js/17-gk-sticky-menu.js", e); }


// ==== js/19-gk-scroll-expand.js ====
try { (function(){

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


})(); } catch (e) { console.error("js/19-gk-scroll-expand.js", e); }

// ==== js/20-gk-unbox-range-overlap-driver.js ====
try { (function(){

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


})(); } catch (e) { console.error("js/20-gk-unbox-range-overlap-driver.js", e); }

// ==== js/21-gk-nav-panels-driver.js ====
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

})(); } catch (e) { console.error("js/21-gk-nav-panels-driver.js", e); }

// ==== js/mobile-menu.js ====
try { (function(){
document.addEventListener('DOMContentLoaded', function () {

    const menuToggle = document.querySelector('.menu-toggle');
    const menu = document.querySelector('.pillnav');

    if (!menuToggle || !menu) return;

    menuToggle.addEventListener('click', function () {
        menu.classList.toggle('open');
        menuToggle.classList.toggle('active');
    });

    menu.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
            menu.classList.remove('open');
            menuToggle.classList.remove('active');
        });
    });

});


})(); } catch (e) { console.error("js/mobile-menu.js", e); }

// ==== js/video-modal.js ====
try { (function(){
(function(){
  var btn      = document.getElementById('watchStoryBtn');
  var modal    = document.getElementById('videoModal');
  var closeBtn = document.getElementById('videoModalClose');
  var player   = document.getElementById('videoModalPlayer');

  if(!btn || !modal || !player) return;

  btn.addEventListener('click', function(e){
    e.preventDefault();
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    player.currentTime = 0;
    player.play();
  });

  function closeModal(){
    modal.classList.remove('open');
    player.pause();
    player.currentTime = 0;
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', closeModal);


  modal.addEventListener('click', function(e){
    if(e.target === modal) closeModal();
  });
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape') closeModal();
  });
})();


})(); } catch (e) { console.error("js/video-modal.js", e); }

// ==== js/header-expand.js ====
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


})(); } catch (e) { console.error("js/header-expand.js", e); }

// ==== js/sticky-menu.js ====
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


})(); } catch (e) { console.error("js/sticky-menu.js", e); }


// ==== js/scroll-expand.js ====
try { (function(){
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


})(); } catch (e) { console.error("js/scroll-expand.js", e); }

// ==== js/nav-panels.js ====
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


})(); } catch (e) { console.error("js/nav-panels.js", e); }

// ==== js/product-box-interactions.js ====
try { (function(){
(function(){
  'use strict';

  function initGoodrickeProductBoxes(){
    var products = document.querySelectorAll('section.product-listing .product-item');
    if (!products.length) return;

    products.forEach(function(card){
      var wishlist = card.querySelector('.product-wishlist');
      var addButton = card.querySelector('.product-add-to-bag');
      var sizeButtons = card.querySelectorAll('.size-option');

      sizeButtons.forEach(function(btn){
        btn.addEventListener('click', function(e){
          e.preventDefault();
          e.stopPropagation();
          sizeButtons.forEach(function(item){ item.classList.remove('is-active'); });
          btn.classList.add('is-active');
        });
      });

      if (wishlist){
        wishlist.addEventListener('click', function(e){
          e.preventDefault();
          e.stopPropagation();
          wishlist.classList.toggle('is-liked');
          wishlist.setAttribute(
            'aria-label',
            wishlist.classList.contains('is-liked')
              ? 'Remove from wishlist'
              : 'Add to wishlist'
          );
        });
      }

      var quickView = card.querySelector('.product-quickview');
      if (quickView){
        quickView.addEventListener('click', function(e){
          e.preventDefault();
          e.stopPropagation();
          card.classList.add('quick-view-active');
          window.setTimeout(function(){
            card.classList.remove('quick-view-active');
          }, 420);
        });
      }

      if (addButton){
        addButton.addEventListener('click', function(e){
          e.preventDefault();
          e.stopPropagation();

          if (addButton.classList.contains('is-added')) return;

          addButton.classList.add('is-added');
          var label = addButton.querySelector('span');
          if (label) label.textContent = 'ADDED TO BAG';

          window.setTimeout(function(){
            addButton.classList.remove('is-added');
            if (label) label.textContent = 'ADD TO BAG';
          }, 1400);
        });
      }
    });
  }

  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', initGoodrickeProductBoxes);
  } else {
    initGoodrickeProductBoxes();
  }
})();


})(); } catch (e) { console.error("js/product-box-interactions.js", e); }

// ==== js/bag-drawer.js ====
try { (function(){
(function(){
  function initGoodrickeBagDrawer(){
    var drawer = document.getElementById('gkBagDrawer');
    var overlay = document.getElementById('gkBagOverlay');
    var closeBtn = document.getElementById('gkBagClose');
    var continueBtn = document.getElementById('gkBagContinue');
    var countEl = document.getElementById('gkBagCount');
    var imageEl = document.getElementById('gkBagProductImage');
    var nameEl = document.getElementById('gkBagProductName');
    var sizeEl = document.getElementById('gkBagProductSize');
    var priceEl = document.getElementById('gkBagProductPrice');
    var quantityEl = document.getElementById('gkBagQuantity');
    var subtotalEl = document.getElementById('gkBagSubtotal');
    var minusBtn = document.getElementById('gkBagMinus');
    var plusBtn = document.getElementById('gkBagPlus');
    var removeBtn = document.getElementById('gkBagRemove');
    var currentPrice = 0;
    var currentOld = 0;
    var oldEl = document.getElementById('gkBagProductOld');
    var savingRow = document.getElementById('gkBagSavingRow');
    var savingEl = document.getElementById('gkBagSaving');
    var quantity = 1;

    if(!drawer || drawer.dataset.initialized === 'true') return;
    drawer.dataset.initialized = 'true';

    var bagCount = 0;

    function firstMoney(el){
      var m=(el?el.textContent:'').replace(/\s+/g,' ').match(/(?:₹|Rs\.?)\s?[\d,]+(?:\.\d+)?/i);
      return m?m[0].replace(/\s/g,''):'';
    }
    function oldMoney(el){
      return firstMoney(el);
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

    function updateBagTotal(){
      if(quantityEl) quantityEl.textContent = quantity;
      if(subtotalEl) subtotalEl.textContent = '₹' + Math.round(currentPrice * quantity).toLocaleString('en-IN');
      var save = currentOld > currentPrice ? (currentOld - currentPrice) * quantity : 0;
      if(savingRow){
        savingRow.hidden = !save;
        if(savingEl) savingEl.textContent = '₹' + Math.round(save).toLocaleString('en-IN');
      }
    }
    function openDrawer(data){
      if(!data) return;

      bagCount += 1;
      countEl.textContent = bagCount;

      imageEl.src = data.image || '';
      imageEl.alt = data.alt || data.name;
      nameEl.textContent = data.name;
      sizeEl.textContent = data.size;
      priceEl.textContent = data.price ? '·  ' + data.price : '';

      quantity = data.qty || 1;
      if(quantityEl) quantityEl.textContent = quantity;
      var priceMatch = (data.price || '').replace(/,/g,'').match(/[0-9]+(?:\.[0-9]+)?/);
      currentPrice = priceMatch ? parseFloat(priceMatch[0]) : 0;
      var oldMatch = (data.oldPrice || '').replace(/,/g,'').match(/[0-9]+(?:\.[0-9]+)?/);
      currentOld = oldMatch ? parseFloat(oldMatch[0]) : 0;
      if(oldEl) oldEl.textContent = currentOld > currentPrice ? data.oldPrice : '';
      updateBagTotal();

      drawer.classList.remove('is-open');
      void drawer.offsetWidth;
      drawer.classList.add('is-open');
      overlay.classList.add('is-open');
      drawer.setAttribute('aria-hidden','false');
      overlay.setAttribute('aria-hidden','false');
      document.body.classList.add('gk-bag-lock');

      window.setTimeout(function(){
        if(nameEl) nameEl.focus && nameEl.focus();
      }, 120);
    }

    function closeDrawer(){
      if(sheet) setSheet(false);
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
      if(label){
        button.classList.add('is-added');
        label.textContent = 'ADDED TO BAG';
      }

      openDrawer(data);

      if(label){
        window.setTimeout(function(){
          button.classList.remove('is-added');
          label.textContent = 'ADD TO BAG';
        }, 1400);
      }
    }, true);

    /* other sections (e.g. Frequently Bought Together) can open the drawer */
    document.addEventListener('gk-cart-add', function(e){
      var d = e.detail || {};
      var m = String(d.price || '').match(/[\d,]+(?:\.\d+)?/);
      openDrawer({
        image: d.img || '',
        alt: d.name || '',
        name: d.name || 'Goodricke Product',
        size: d.ref || '',
        price: m ? '₹' + m[0] : '',
        qty: 1
      });
    });

    /* coupon sheet slides up from the bottom of the tray */
    var couponBtn = drawer.querySelector('.gk-bag-coupon');
    var sheet = document.getElementById('gkBagCouponSheet');
    var codeInput = document.getElementById('gkBagCouponInput');
    function setSheet(on){
      if(!sheet) return;
      sheet.classList.toggle('is-open', on);
      sheet.setAttribute('aria-hidden', on ? 'false' : 'true');
      if(on) window.setTimeout(function(){ if(codeInput) codeInput.focus(); }, 300);
    }
    if(couponBtn && sheet){
      couponBtn.addEventListener('click', function(){ setSheet(true); });
      document.getElementById('gkBagCouponCancel').addEventListener('click', function(){ if(codeInput) codeInput.value = ''; setSheet(false); });
      document.getElementById('gkBagCouponSave').addEventListener('click', function(){
        var code = codeInput ? codeInput.value.trim() : '';
        var label = couponBtn.querySelector('span');
        if(label) label.textContent = code ? 'Coupon: ' + code.toUpperCase() : 'Coupon';
        setSheet(false);
      });
      if(codeInput) codeInput.addEventListener('keydown', function(e){ if(e.key === 'Enter'){ e.preventDefault(); document.getElementById('gkBagCouponSave').click(); } });
    }

    minusBtn.addEventListener('click', function(){quantity=Math.max(1,quantity-1);updateBagTotal();});
    plusBtn.addEventListener('click', function(){quantity+=1;updateBagTotal();});
    removeBtn.addEventListener('click', function(){quantity=0;updateBagTotal();closeDrawer();});
    closeBtn.addEventListener('click', closeDrawer);
    continueBtn.addEventListener('click', closeDrawer);
    overlay.addEventListener('click', closeDrawer);

    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape' && drawer.classList.contains('is-open')){
        closeDrawer();
      }
    });
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', initGoodrickeBagDrawer);
  }else{
    initGoodrickeBagDrawer();
  }
})();


})(); } catch (e) { console.error("js/bag-drawer.js", e); }

// ==== js/product-slider.js ====
try { (function(){
(function(){
  function initProductSlider(){
    const track = document.querySelector('.products-track');
    if(!track) return;

    const prev = document.querySelector('.slider-prev');
    const next = document.querySelector('.slider-next');
    const slides = Array.from(track.querySelectorAll('.product-slide'));

    if(!prev || !next || !slides.length) return;

    let page = 0;

    function getVisibleCount(){
      return window.innerWidth <= 700 ? 1 : 2;
    }

    function getMaxPage(){
      return Math.max(0, Math.ceil(slides.length / getVisibleCount()) - 1);
    }

    function goToPage(newPage, behavior='smooth'){
      const visible = getVisibleCount();
      const maxPage = getMaxPage();

      page = Math.max(0, Math.min(newPage, maxPage));

      const targetIndex = page * visible;
      const target = slides[targetIndex];

      if(target){
        track.scrollTo({
          left: target.offsetLeft,
          behavior: behavior
        });
      }

      prev.disabled = page === 0;
      next.disabled = page === maxPage;

      prev.setAttribute('aria-disabled', String(page === 0));
      next.setAttribute('aria-disabled', String(page === maxPage));
    }

    prev.addEventListener('click', function(e){
      e.preventDefault();
      goToPage(page - 1);
    });

    next.addEventListener('click', function(e){
      e.preventDefault();
      goToPage(page + 1);
    });

    let scrollTimer;

    track.addEventListener('scroll', function(){
      clearTimeout(scrollTimer);

      scrollTimer = setTimeout(function(){
        const visible = getVisibleCount();
        const left = track.scrollLeft;

        let closestIndex = 0;
        let closestDistance = Infinity;

        slides.forEach(function(slide, index){
          const distance = Math.abs(slide.offsetLeft - left);

          if(distance < closestDistance){
            closestDistance = distance;
            closestIndex = index;
          }
        });

        page = Math.min(
          Math.floor(closestIndex / visible),
          getMaxPage()
        );

        prev.disabled = page === 0;
        next.disabled = page === getMaxPage();

        prev.setAttribute('aria-disabled', String(page === 0));
        next.setAttribute('aria-disabled', String(page === getMaxPage()));
      }, 80);
    }, {passive:true});

    window.addEventListener('resize', function(){
      goToPage(page, 'auto');
    });

    goToPage(0, 'auto');
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', initProductSlider);
  }else{
    initProductSlider();
  }
})();


})(); } catch (e) { console.error("js/product-slider.js", e); }

// ==== js/filter-sort.js ====
try { (function(){
(function(){
  'use strict';
  function initGoodrickeFilterSort(){
    var trigger=document.querySelector('.product-listing .filter-button');
    var drawer=document.getElementById('gkFilterDrawer');
    var overlay=document.getElementById('gkFilterOverlay');
    var close=document.getElementById('gkFilterClose');
    var apply=document.getElementById('gkFilterApply');
    var clear=document.getElementById('gkFilterClear');
    if(!trigger||!drawer||!overlay||drawer.dataset.initialized==='true') return;
    drawer.dataset.initialized='true';

    function open(){drawer.classList.add('is-open');overlay.classList.add('is-open');drawer.setAttribute('aria-hidden','false');overlay.setAttribute('aria-hidden','false');document.body.classList.add('gk-filter-lock')}
    function closeDrawer(){drawer.classList.remove('is-open');overlay.classList.remove('is-open');drawer.setAttribute('aria-hidden','true');overlay.setAttribute('aria-hidden','true');document.body.classList.remove('gk-filter-lock')}
    trigger.addEventListener('click',function(e){e.preventDefault();open()});
    close.addEventListener('click',closeDrawer);overlay.addEventListener('click',closeDrawer);apply.addEventListener('click',closeDrawer);

    drawer.querySelectorAll('.gk-filter-section-head').forEach(function(btn){
      var section = btn.parentElement;
      btn.setAttribute('aria-expanded', section.classList.contains('is-open') ? 'true' : 'false');
      btn.addEventListener('click',function(){
        var isOpen = section.classList.toggle('is-open');
        btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });
    });

    function selected(name){return Array.from(drawer.querySelectorAll('input[name="'+name+'"]:checked')).map(function(i){return i.value})}
    function price(card){var el=card.querySelector('.product-price');if(!el)return 0;var m=(el.textContent||'').replace(/[^0-9.]/g,'');return parseFloat(m)||0}
    function productText(card){return (card.textContent||'').toLowerCase()}
    function applyFilters(){
      var cards=Array.from(document.querySelectorAll('section.product-listing .product-grid > .product-item'));
      var cats=selected('gkCategory'),cols=selected('gkCollection'),benefits=selected('gkConcern'),textures=selected('gkTexture'),prices=selected('gkPrice'),availability=selected('gkAvailability');
      cards.forEach(function(card){
        var text=productText(card),p=price(card),ok=true;
        if(cats.length)ok=ok&&cats.some(function(v){return text.indexOf(v.toLowerCase())>-1});
        if(cols.length)ok=ok&&cols.some(function(v){return text.indexOf(v.toLowerCase())>-1});
        if(benefits.length)ok=ok&&benefits.some(function(v){return text.indexOf(v.toLowerCase())>-1});
        if(textures.length)ok=ok&&textures.some(function(v){return text.indexOf(v.toLowerCase())>-1});
        if(prices.length)ok=ok&&prices.some(function(v){return v==='under500'?p<500:v==='500to1000'?p>=500&&p<=1000:p>1000});
        if(availability.length){var inStock=text.indexOf('out of stock')===-1;ok=ok&&availability.some(function(v){return v==='in-stock'?inStock:!inStock})}
        card.style.display=ok?'':'none';
      });
      var count=document.querySelector('.product-listing .product-count');
      if(count){var visible=cards.filter(function(c){return c.style.display!=='none'}).length;count.textContent=visible+' Products'}
    }
    function sortProducts(){
      var grid=document.querySelector('section.product-listing .product-grid');if(!grid)return;
      var cards=Array.from(grid.querySelectorAll(':scope > .product-item'));
      var value=(drawer.querySelector('input[name="gkSort"]:checked')||{}).value||'featured';
      if(value==='az'||value==='za'||value==='low'||value==='high'){
        cards.sort(function(a,b){
          if(value==='low'||value==='high')return value==='low'?price(a)-price(b):price(b)-price(a);
          var an=(a.querySelector('.product-details h2')||{}).textContent||'',bn=(b.querySelector('.product-details h2')||{}).textContent||'';
          return value==='az'?an.localeCompare(bn):bn.localeCompare(an);
        });
        cards.forEach(function(c){grid.appendChild(c)});
      }
    }
    apply.addEventListener('click',function(){sortProducts();applyFilters();closeDrawer()});
    clear.addEventListener('click',function(){
      drawer.querySelectorAll('input[type="checkbox"]').forEach(function(i){i.checked=false});
      var newest=drawer.querySelector('input[name="gkSort"][value="new"]');if(newest)newest.checked=true;
      var grid=document.querySelector('section.product-listing .product-grid');if(grid)Array.from(grid.querySelectorAll(':scope > .product-item')).forEach(function(c){c.style.display=''});
      var count=document.querySelector('.product-listing .product-count');if(count)count.textContent='81 Products';
    });
    document.addEventListener('keydown',function(e){if(e.key==='Escape'&&drawer.classList.contains('is-open'))closeDrawer()});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initGoodrickeFilterSort);else initGoodrickeFilterSort();
})();


})(); } catch (e) { console.error("js/filter-sort.js", e); }

// ==== js/editorial-options.js ====
try { (function(){
(function(){
  function initEditorialOptions(){
    document.querySelectorAll('.editorial-wishlist').forEach(function(btn){
      if(btn.dataset.bound === 'true') return;
      btn.dataset.bound = 'true';
      btn.addEventListener('click',function(e){
        e.preventDefault();
        e.stopPropagation();
        btn.classList.toggle('is-liked');
        btn.setAttribute('aria-label',btn.classList.contains('is-liked') ? 'Remove from wishlist' : 'Add to wishlist');
      });
    });
    document.querySelectorAll('.editorial-quickview').forEach(function(btn){
      if(btn.dataset.bound === 'true') return;
      btn.dataset.bound = 'true';
      btn.addEventListener('click',function(e){
        e.preventDefault();
        e.stopPropagation();
        var card=btn.closest('.editorial-item');
        if(!card) return;
        card.classList.add('quick-view-active');
        window.setTimeout(function(){card.classList.remove('quick-view-active');},420);
      });
    });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',initEditorialOptions);
  else initEditorialOptions();
})();


})(); } catch (e) { console.error("js/editorial-options.js", e); }

// ==== js/header-search.js ====
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


})(); } catch (e) { console.error("js/header-search.js", e); }

// ==== js/hero-slider.js ====
try { (function(){
(function(){
  function startShopHeroSlider(){
    var slides=document.querySelectorAll('.hero .hero-slide');
    if(slides.length<2) return;
    var prev=document.querySelector('.hero .hero-arrow--prev');
    var next=document.querySelector('.hero .hero-arrow--next');
    var current=0,timer=null;
    slides.forEach(function(slide,index){slide.classList.toggle('active',index===0);});
    function go(i){
      slides[current].classList.remove('active');
      current=(i+slides.length)%slides.length;
      slides[current].classList.add('active');
    }
    function restart(){
      window.clearInterval(timer);
      timer=window.setInterval(function(){go(current+1);},3000);
    }
    if(prev) prev.addEventListener('click',function(){go(current-1);restart();});
    if(next) next.addEventListener('click',function(){go(current+1);restart();});
    restart();
  }
  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',startShopHeroSlider);
  }else{startShopHeroSlider();}
})();

})(); } catch (e) { console.error("js/hero-slider.js", e); }

// ==== js/menu-toggle.js ====
try { (function(){
document.addEventListener('DOMContentLoaded', function () {

    const menuToggle = document.querySelector('.menu-toggle');
    const menu = document.querySelector('.pillnav');

    if (!menuToggle || !menu) return;

    menuToggle.addEventListener('click', function () {
        menu.classList.toggle('open');
        menuToggle.classList.toggle('active');
    });

    menu.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
            menu.classList.remove('open');
            menuToggle.classList.remove('active');
        });
    });

});


})(); } catch (e) { console.error("js/menu-toggle.js", e); }

// ==== js/nav-panels-driver.js ====
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


})(); } catch (e) { console.error("js/nav-panels-driver.js", e); }

// ==== js/pdp.js ====
try { (function(){
(function(){
  'use strict';
  var root=document.querySelector('.pdp');
  if(!root) return;

  /* gallery */
  var track=root.querySelector('.pdp-gallery__track');
  var slides=root.querySelectorAll('.pdp-gallery__slide');
  var dots=root.querySelectorAll('.pdp-gallery__dot');
  var idx=0;
  function go(n){
    idx=(n+slides.length)%slides.length;
    track.style.transform='translateX(-'+idx*100+'%)';
    dots.forEach(function(d,i){d.setAttribute('aria-current',i===idx?'true':'false');});
  }
  root.querySelector('.pdp-gallery__nav--prev').addEventListener('click',function(){go(idx-1);});
  root.querySelector('.pdp-gallery__nav--next').addEventListener('click',function(){go(idx+1);});
  dots.forEach(function(d,i){d.addEventListener('click',function(){go(i);});});

  /* quantity */
  var input=root.querySelector('.pdp-qty input');
  root.querySelector('[data-qty="-"]').addEventListener('click',function(){input.value=Math.max(1,(+input.value||1)-1);});
  root.querySelector('[data-qty="+"]').addEventListener('click',function(){input.value=Math.min(99,(+input.value||1)+1);});
  input.addEventListener('change',function(){input.value=Math.min(99,Math.max(1,parseInt(input.value,10)||1));});

  /* wishlist */
  var wish=root.querySelector('.pdp-wish');
  wish.addEventListener('click',function(){wish.setAttribute('aria-pressed',wish.getAttribute('aria-pressed')!=='true');});

  /* net weight: selects a size and updates the price */
  var opts=root.querySelectorAll('.pdp-weight__opt'),priceEl=root.querySelector('.pdp-price');
  var base=root.querySelector('.pdp-weight__opt.is-active').dataset.price,gift=document.getElementById('pdpGift');
  function showPrice(){
    var n=parseFloat(base.replace(/[^\d.]/g,''))+(gift&&gift.checked?100:0);
    priceEl.textContent='₹'+n.toLocaleString('en-IN',{minimumFractionDigits:2,maximumFractionDigits:2});
  }
  if(gift) gift.addEventListener('change',showPrice);
  function pick(o){
    opts.forEach(function(x){var on=x===o;x.classList.toggle('is-active',on);x.setAttribute('aria-checked',on);});
    base=o.dataset.price;showPrice();
    var cut=root.querySelector('.pdp-price-cut');if(cut) cut.textContent=o.dataset.mrp;
  }
  opts.forEach(function(o){o.addEventListener('click',function(){pick(o);});});
  root.querySelector('.pdp-weight__clear').addEventListener('click',function(){pick(opts[0]);});

  /* story circles: autoplay the preview muted; stay still for reduced-motion users */
  root.querySelectorAll('.pdp-story__video').forEach(function(sv){
    if(matchMedia('(prefers-reduced-motion: reduce)').matches){sv.removeAttribute('autoplay');sv.pause();return;}
    var p=sv.play();if(p&&p.catch)p.catch(function(){});
  });

  /* "Learn more" toggles the description open/closed */
  var more=root.querySelector('.pdp-more'),learn=document.getElementById('pdp-learn');
  if(more&&learn) more.addEventListener('click',function(){
    var open=learn.classList.toggle('is-open');
    more.setAttribute('aria-expanded',open);
    more.querySelector('u').textContent=open?'Show less':'Learn more';
  });
})();


})(); } catch (e) { console.error("js/pdp.js", e); }

// ==== js/cart-drawer.js ====
try { (function(){
(function(){
  'use strict';
  var drawer=document.getElementById('gkCart');
  var overlay=document.getElementById('gkCartOverlay');
  if(!drawer||!overlay) return;
  var $=function(id){return document.getElementById(id);};
  var track=$('gkSelTrack'),prev=$('gkSelPrev'),next=$('gkSelNext');
  var dots=[].slice.call(document.querySelectorAll('#gkSelDots .gk-sel__dot'));
  var cards=[].slice.call(track.children);

  function fill(d){
    $('gkCartImg').src=d.img||'';
    $('gkCartImg').alt=d.name;
    $('gkCartName').textContent=d.name;
    $('gkCartRef').textContent='Ref. '+d.ref;
    $('gkCartPrice').textContent=d.price;
    $('gkCartQty').textContent=d.qty||1;
  }
  function open(d){
    fill(d);
    drawer.scrollTop=0;
    drawer.classList.add('is-open');overlay.classList.add('is-open');
    drawer.setAttribute('aria-hidden','false');overlay.setAttribute('aria-hidden','false');
    document.body.classList.add('gk-cart-lock');
    sync();
  }
  function close(){
    drawer.classList.remove('is-open');overlay.classList.remove('is-open');
    drawer.setAttribute('aria-hidden','true');overlay.setAttribute('aria-hidden','true');
    document.body.classList.remove('gk-cart-lock');
  }
  function firstPrice(el){
    var m=(el&&el.firstChild?el.firstChild.textContent:'').match(/₹\s?[\d,]+(?:\.\d+)?/);
    return m?m[0].replace(/\s/g,''):'';
  }

  document.addEventListener('click',function(e){
    var main=e.target.closest('.pdp-cta');
    var bag=e.target.closest('.product-add-to-bag');
    if(main){
      var qty=document.querySelector('.pdp-qty input');
      var img=document.querySelector('.pdp-gallery__slide img');
      open({name:document.querySelector('.pdp-info__title').textContent.trim(),
        ref:(document.querySelector('.pdp-gallery__meta span')||{textContent:''}).textContent.replace(/^SKU\s*/,'')+['.pdp-weight__opt.is-active'].map(function(s){var e=document.querySelector(s);return e?' · '+(e.dataset.size||e.dataset.pack):'';}).join('')+(document.getElementById('pdpGift')&&document.getElementById('pdpGift').checked?' · Gift wrap':''),
        price:document.querySelector('.pdp-price').textContent.trim(),
        img:img&&img.getAttribute('src'),qty:qty?qty.value:1});
    }else if(bag){
      var card=bag.closest('.product-item');if(!card) return;
      var im=card.querySelector('.product-image img');
      var src=im?im.getAttribute('src'):'';
      open({name:card.querySelector('.product-details h2').textContent.trim(),
        ref:'GK-'+src.replace(/^.*\//,'').replace(/\..*$/,'').toUpperCase(),
        price:firstPrice(card.querySelector('.product-price')),img:src,qty:1});
    }
  },true); /* capture: product-box-interactions.js stops bubbling on the card button */

  /* other sections (e.g. Frequently Bought Together) can open the drawer */
  document.addEventListener('gk-cart-add',function(e){open(e.detail);});

  /* "Our Selection": ADD swaps the summary at the top to that product */
  track.addEventListener('click',function(e){
    var btn=e.target.closest('.gk-sel__add');if(!btn) return;
    var c=btn.closest('.gk-sel__card');
    fill({name:c.querySelector('.gk-sel__name').textContent,ref:c.dataset.ref,
      price:c.querySelector('.gk-sel__price').textContent,img:c.dataset.img,qty:1});
    drawer.scrollTo({top:0,behavior:'smooth'});
    btn.textContent='ADDED';setTimeout(function(){btn.textContent='ADD';},1200);
  });

  /* slider */
  function step(){var c=cards[0];return c?c.getBoundingClientRect().width+14:track.clientWidth;}
  function sync(){
    var i=Math.round(track.scrollLeft/step());i=Math.min(Math.max(i,0),cards.length-1);
    dots.forEach(function(d,n){d.setAttribute('aria-current',n===i?'true':'false');});
    prev.disabled=track.scrollLeft<=2;
    next.disabled=track.scrollLeft+track.clientWidth>=track.scrollWidth-2;
  }
  prev.addEventListener('click',function(){track.scrollBy({left:-step(),behavior:'smooth'});});
  next.addEventListener('click',function(){track.scrollBy({left:step(),behavior:'smooth'});});
  dots.forEach(function(d,n){d.addEventListener('click',function(){track.scrollTo({left:n*step(),behavior:'smooth'});});});
  track.addEventListener('scroll',function(){window.requestAnimationFrame(sync);},{passive:true});
  window.addEventListener('resize',sync);

  $('gkCartClose').addEventListener('click',close);
  $('gkCartContinue').addEventListener('click',close);
  overlay.addEventListener('click',close);
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&drawer.classList.contains('is-open')) close();});
})();


})(); } catch (e) { console.error("js/cart-drawer.js", e); }

// ==== js/story-modal.js ====
try { (function(){
(function(){
  'use strict';
  var modal=document.getElementById('gkStory');
  if(!modal) return;
  var $=function(id){return document.getElementById(id);};
  var video=$('gkStoryVideo'),bars=$('gkStoryBars'),title=$('gkStoryTitle');
  var btnPlay=$('gkStoryPlay'),btnMute=$('gkStoryMute'),prev=$('gkStoryPrev'),next=$('gkStoryNext');
  var slides=[],idx=0,opener=null;

  function swap(a,b,showA){a.hidden=!showA;b.hidden=showA;}
  function syncButtons(){
    swap($('gkStoryIconPause'),$('gkStoryIconPlay'),!video.paused);
    btnPlay.setAttribute('aria-label',video.paused?'Play':'Pause');
    swap($('gkStoryIconSound'),$('gkStoryIconMuted'),!video.muted);
    btnMute.setAttribute('aria-label',video.muted?'Unmute':'Mute');
  }
  function buildBars(){
    bars.innerHTML='';
    slides.forEach(function(){var b=document.createElement('span');b.className='gk-story__bar';b.appendChild(document.createElement('i'));bars.appendChild(b);});
    var multi=slides.length>1;prev.hidden=!multi;next.hidden=!multi;
  }
  function show(i){
    idx=Math.max(0,Math.min(slides.length-1,i));
    [].forEach.call(bars.children,function(b,n){b.classList.toggle('is-done',n<idx);b.firstChild.style.width=n<idx?'100%':'0';});
    video.src=slides[idx];
    video.currentTime=0;
    var p=video.play();if(p&&p.catch)p.catch(function(){syncButtons();});
  }
  function open(src,name,from){
    slides=src.split(',').map(function(s){return s.trim();}).filter(Boolean);
    if(!slides.length) return;
    opener=from;title.textContent=name||'';
    buildBars();
    video.muted=false;                      /* opened by a click, so sound is allowed */
    modal.classList.add('is-open');modal.setAttribute('aria-hidden','false');
    document.body.classList.add('gk-story-lock');
    show(0);
    $('gkStoryClose').focus();
  }
  function close(){
    modal.classList.remove('is-open');modal.setAttribute('aria-hidden','true');
    document.body.classList.remove('gk-story-lock');
    video.pause();video.removeAttribute('src');video.load();
    if(opener&&opener.focus) opener.focus();
  }

  document.addEventListener('click',function(e){
    var t=e.target.closest('[data-story-src]');
    if(t){e.preventDefault();open(t.getAttribute('data-story-src'),t.getAttribute('data-story-title'),t);}
  });
  video.addEventListener('timeupdate',function(){
    if(!video.duration) return;
    var f=bars.children[idx];if(f) f.firstChild.style.width=(video.currentTime/video.duration*100)+'%';
  });
  video.addEventListener('ended',function(){if(idx<slides.length-1) show(idx+1); else close();});
  video.addEventListener('play',syncButtons);video.addEventListener('pause',syncButtons);video.addEventListener('volumechange',syncButtons);
  btnPlay.addEventListener('click',function(){if(video.paused) video.play(); else video.pause();});
  btnMute.addEventListener('click',function(){video.muted=!video.muted;});
  prev.addEventListener('click',function(){show(idx-1);});
  next.addEventListener('click',function(){if(idx<slides.length-1) show(idx+1); else close();});
  $('gkStoryClose').addEventListener('click',close);
  modal.addEventListener('click',function(e){if(e.target===modal) close();});
  document.addEventListener('keydown',function(e){
    if(!modal.classList.contains('is-open')) return;
    if(e.key==='Escape') close();
    else if(e.key==='ArrowRight'&&slides.length>1) show(idx+1);
    else if(e.key==='ArrowLeft'&&slides.length>1) show(idx-1);
  });
})();


})(); } catch (e) { console.error("js/story-modal.js", e); }

// ==== js/pdp-tabs.js ====
try { (function(){
(function(){
  'use strict';
  var tabs=[].slice.call(document.querySelectorAll('.pdp-tabs__tab'));
  if(!tabs.length) return;
  function select(t){
    tabs.forEach(function(x){
      var on=x===t;
      x.classList.toggle('is-active',on);x.setAttribute('aria-selected',on);x.tabIndex=on?0:-1;
      document.getElementById(x.getAttribute('aria-controls')).hidden=!on;
    });
  }
  tabs.forEach(function(t,i){
    t.addEventListener('click',function(){select(t);});
    t.addEventListener('keydown',function(e){
      var n=e.key==='ArrowRight'?i+1:e.key==='ArrowLeft'?i-1:null;
      if(n===null) return;
      e.preventDefault();var to=tabs[(n+tabs.length)%tabs.length];select(to);to.focus();
    });
  });
})();


})(); } catch (e) { console.error("js/pdp-tabs.js", e); }

// ==== js/reviews.js ====
try { (function(){
(function(){
  'use strict';
  var viewport=document.querySelector('.rv__tabs');
  var track=viewport&&viewport.querySelector('.rv__track');
  var tabs=track?[].slice.call(track.querySelectorAll('.rv__who')):[];
  if(!tabs.length) return;

  /* ---- reviewer selection (shows that person's quote) ---- */
  var clones=[];
  function select(t){
    var idx=tabs.indexOf(t);
    tabs.forEach(function(x,n){
      var on=n===idx;
      x.classList.toggle('is-active',on);x.setAttribute('aria-selected',on);x.tabIndex=on?0:-1;
      document.getElementById(x.getAttribute('aria-controls')).hidden=!on;
      if(clones[n]) clones[n].classList.toggle('is-active',on);
    });
  }

  /* ---- seamless loop: a second, decorative copy of every pill ---- */
  tabs.forEach(function(t){
    var c=t.cloneNode(true);
    c.removeAttribute('id');c.removeAttribute('role');c.removeAttribute('aria-controls');c.removeAttribute('aria-selected');
    c.setAttribute('aria-hidden','true');c.tabIndex=-1;c.classList.remove('is-active');
    track.appendChild(c);clones.push(c);
  });
  [].forEach.call(track.querySelectorAll('img'),function(i){i.setAttribute('draggable','false');});

  var expanded=false,pos=0,setW=0,last=0,raf=0,paused=false,dragging=false,moved=false,startX=0,startPos=0,suppress=false;
  var SPEED=45; /* px per second, content moves right to left */
  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function measure(){
    var gap=parseFloat(getComputedStyle(track).columnGap)||0;
    setW=clones[0].offsetLeft-tabs[0].offsetLeft||(track.scrollWidth/2+gap/2);
  }
  function wrap(){
    if(!setW) return;
    pos=((pos%setW)+setW)%setW;
  }
  function paint(){track.style.transform='translate3d('+(-pos).toFixed(2)+'px,0,0)';}
  function frame(t){
    raf=window.requestAnimationFrame(frame);
    var dt=Math.min(64,t-last)||16;last=t;
    if(expanded&&!paused&&!dragging&&!reduce&&t>holdUntil){pos+=SPEED*dt/1000;wrap();paint();}
  }

  /* ---- mouse / touch drag ---- */
  viewport.addEventListener('pointerdown',function(e){
    if(!expanded) return;
    if(e.pointerType==='mouse'&&e.button!==0) return;
    dragging=true;moved=false;startX=e.clientX;startPos=pos;
  });
  viewport.addEventListener('pointermove',function(e){
    if(!dragging) return;
    var dx=e.clientX-startX;
    if(!moved&&Math.abs(dx)>5){
      moved=true;viewport.classList.add('is-dragging');
      try{viewport.setPointerCapture(e.pointerId);}catch(err){}   /* capture only once it is a real drag, so plain clicks still reach the pill */
    }
    if(!moved) return;
    pos=startPos-dx;wrap();paint();
  });
  function endDrag(e){
    if(!dragging) return;
    dragging=false;viewport.classList.remove('is-dragging');
    try{viewport.releasePointerCapture(e.pointerId);}catch(err){}
    if(moved){suppress=true;window.setTimeout(function(){suppress=false;},0);}
  }
  viewport.addEventListener('pointerup',endDrag);
  viewport.addEventListener('pointercancel',endDrag);

  /* pause while a mouse hovers or a pill has keyboard focus */
  viewport.addEventListener('pointerenter',function(e){if(e.pointerType==='mouse') paused=true;});
  viewport.addEventListener('pointerleave',function(e){if(e.pointerType==='mouse') paused=false;});
  viewport.addEventListener('focusin',function(){paused=true;});
  viewport.addEventListener('focusout',function(){paused=false;});

  /* click a pill = show that review (ignored when the click ended a drag) */
  track.addEventListener('click',function(e){
    var b=e.target.closest('.rv__who');
    if(!b) return;
    if(suppress){e.preventDefault();e.stopPropagation();return;}
    var i=tabs.indexOf(b);if(i<0) i=clones.indexOf(b);
    if(i>=0) select(tabs[i]);
  },true);

  tabs.forEach(function(t,i){
    t.addEventListener('keydown',function(e){
      var n=e.key==='ArrowRight'?i+1:e.key==='ArrowLeft'?i-1:null;
      if(n===null) return;
      e.preventDefault();var to=tabs[(n+tabs.length)%tabs.length];select(to);to.focus({preventScroll:true});
    });
  });

  /* "View all" expands the 3 default reviewers into the full sliding strip */
  var allBtn=document.querySelector('.rv__all');
  var EASE='cubic-bezier(.4,0,.2,1)',DUR=800,holdUntil=0,busyUntil=0;
  function label(on){
    if(!allBtn) return;
    allBtn.setAttribute('aria-expanded',on?'true':'false');
    var tn=[].slice.call(allBtn.childNodes).filter(function(n){return n.nodeType===3;})[0];
    if(tn) tn.textContent=on?'Show less ':'View all ';
  }
  function rects(list){return list.map(function(el){return el.getBoundingClientRect();});}
  /* FLIP: the first three pills glide from their old spot to the new one, the height eases, the rest fade/slide in */
  function setExpanded(on){
    if(performance.now()<busyUntil||on===expanded) return;
    var first=tabs.slice(0,3),before=rects(first),h0=viewport.getBoundingClientRect().height;
    var animate=!reduce&&viewport.animate;
    function swap(){
      expanded=on;
      viewport.classList.toggle('is-collapsed',!on);
      label(on);
      pos=0;
      if(on){measure();paint();}else{track.style.transform='';select(tabs[1]);}
      if(!animate) return;
      var after=rects(first),h1=viewport.getBoundingClientRect().height;
      first.forEach(function(el,i){
        var dx=before[i].left-after[i].left,dy=before[i].top-after[i].top;
        el.animate([{transform:'translate('+dx+'px,'+dy+'px)'},{transform:'none'}],{duration:DUR,easing:EASE});
      });
      viewport.animate([{height:h0+'px'},{height:h1+'px'}],{duration:DUR,easing:EASE});
      if(on){
        var rest=[].slice.call(track.children).filter(function(el){return first.indexOf(el)<0&&el.offsetParent!==null;});
        rest.forEach(function(el,i){
          if(el.getBoundingClientRect().left>window.innerWidth) return;
          el.animate([{opacity:0,transform:'translateX(60px)'},{opacity:1,transform:'none'}],{duration:DUR,delay:200+Math.min(i,10)*60,easing:EASE,fill:'backwards'});
        });
        holdUntil=performance.now()+DUR+400;
      }
      busyUntil=performance.now()+DUR;
    }
    if(!on&&animate){
      /* fade the extra pills out first, then fold back to three */
      var extra=[].slice.call(track.children).filter(function(el){return first.indexOf(el)<0&&el.offsetParent!==null;});
      expanded=false;paused=true;
      var fades=extra.map(function(el){return el.animate([{opacity:1},{opacity:0}],{duration:250,easing:'ease',fill:'forwards'});});
      busyUntil=performance.now()+260+DUR;
      window.setTimeout(function(){
        fades.forEach(function(f){f.cancel();});
        expanded=true;paused=false;swap();
      },260);
      return;
    }
    swap();
  }
  if(allBtn){
    allBtn.setAttribute('aria-expanded','false');
    allBtn.addEventListener('click',function(e){e.preventDefault();setExpanded(!expanded);});
  }

  measure();
  window.addEventListener('resize',function(){measure();wrap();paint();});
  window.addEventListener('load',function(){measure();wrap();paint();});
  raf=window.requestAnimationFrame(frame);
})();


})(); } catch (e) { console.error("js/reviews.js", e); }

// ==== js/fbt.js ====
try { (function(){
(function(){
  'use strict';
  var root=document.getElementById('pdp-fbt');
  if(!root) return;
  var checks=[].slice.call(root.querySelectorAll('.pdp-fbt__check'));
  var mrpEl=document.getElementById('pdpFbtMrp'),saleEl=document.getElementById('pdpFbtSale');
  var saveEl=document.getElementById('pdpFbtSave'),countEl=document.getElementById('pdpFbtCount'),add=document.getElementById('pdpFbtAdd');
  function fmt(n){return '₹'+n.toLocaleString('en-IN',{minimumFractionDigits:2,maximumFractionDigits:2});}
  function on(){return checks.filter(function(c){return c.checked;});}
  function update(){
    var sel=on(),mrp=0,sale=0;
    sel.forEach(function(c){mrp+=+c.dataset.mrp;sale+=+c.dataset.price;});
    saleEl.textContent=fmt(sale);
    mrpEl.textContent=sel.length?fmt(mrp):'';
    saveEl.textContent=sel.length&&mrp>sale?'You save '+fmt(mrp-sale):'';
    countEl.textContent=sel.length;
    add.disabled=!sel.length;
    checks.forEach(function(c){c.closest('.pdp-fbt__card').classList.toggle('is-on',c.checked);});
  }
  checks.forEach(function(c){c.addEventListener('change',update);});
  add.addEventListener('click',function(){
    var sel=on();if(!sel.length) return;
    var total=sel.reduce(function(s,c){return s+ +c.dataset.price;},0);
    document.dispatchEvent(new CustomEvent('gk-cart-add',{detail:{
      name:sel.map(function(c){return c.dataset.name;}).join(' + '),
      ref:sel.map(function(c){return c.dataset.ref;}).join(', '),
      price:fmt(total),img:sel[0].dataset.img,qty:sel.length}}));
  });
  update();
})();

})(); } catch (e) { console.error("js/fbt.js", e); }
