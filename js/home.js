/* Goodricke — home.js: Home page only (the approved home modules). */

// ==== Product cards: click to open ====
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


})(); } catch (e) { console.error("Product cards: click to open", e); }

// ==== Product cards: close on outside click ====
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


})(); } catch (e) { console.error("Product cards: close on outside click", e); }

// ==== Product cards: mobile tap ====
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


})(); } catch (e) { console.error("Product cards: mobile tap", e); }

// ==== Product cards: mobile toggle ====
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


})(); } catch (e) { console.error("Product cards: mobile toggle", e); }

// ==== Story video modal ====
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


})(); } catch (e) { console.error("Story video modal", e); }

// ==== Unbox slider ====
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


})(); } catch (e) { console.error("Unbox slider", e); }

// ==== Product carousel: auto-scroll ====
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


})(); } catch (e) { console.error("Product carousel: auto-scroll", e); }

// ==== Product carousel: drag and hover pause ====
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


})(); } catch (e) { console.error("Product carousel: drag and hover pause", e); }

// ==== Instagram reels: autoplay ====
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


})(); } catch (e) { console.error("Instagram reels: autoplay", e); }

// ==== Bestsellers carousel ====
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


})(); } catch (e) { console.error("Bestsellers carousel", e); }

// ==== Product cards: mobile open state ====
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


})(); } catch (e) { console.error("Product cards: mobile open state", e); }

// ==== Range and bestseller sections: mobile tap ====
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


})(); } catch (e) { console.error("Range and bestseller sections: mobile tap", e); }

// ==== Unbox scroll-expand ====
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


})(); } catch (e) { console.error("Unbox scroll-expand", e); }

// ==== Unbox / range overlap ====
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


})(); } catch (e) { console.error("Unbox / range overlap", e); }

