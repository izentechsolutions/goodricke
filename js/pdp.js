/* Goodricke — pdp.js: Product detail page only. */

// ==== Product boxes ====
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


})(); } catch (e) { console.error("Product boxes", e); }

// ==== PDP: gallery, weights, pincode ====
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
  var base=root.querySelector('.pdp-weight__opt.is-active').dataset.price;
  var num=function(v){return parseFloat(String(v||'').replace(/[^\d.]/g,''))||0;};
  /* prices in the HTML are INR; gkMarket (common.js) shows them in the shopper's currency */
  var M=window.gkMarket;
  var cv=function(n){return M?M.price(n):n;};
  var inr=function(n,d){return M?M.fmt(cv(n),d):'₹'+n.toLocaleString('en-IN',{minimumFractionDigits:d,maximumFractionDigits:d});};
  var moneyHTML=function(n,d){return M?M.span(n,d):inr(n,d);};
  var pct=function(o){var m=cv(num(o.dataset.mrp)),p=cv(num(o.dataset.price));return m>p?Math.round((m-p)/m*100):0;};
  /* "SAVE x%" under each size, worked out from its price and MRP */
  function labels(){opts.forEach(function(o){var t=o.parentNode.querySelector('.pdp-weight__save'),v=pct(o);if(t){t.textContent=v?'SAVE '+v+'%':'';t.hidden=!v;}});}
  labels();
  var saveEl=root.querySelector('.pdp-save'),stickyPrice=document.querySelector('.pdp-sticky__price');
  /* purchase option (client feedback v02): "Subscribe & save" takes data-sub-discount % off the selected size.
     On Shopify these become selling plans (subscription app); the static build only shows the price. */
  var planBox=root.querySelector('.pdp-plan'),subPct=planBox?(+planBox.dataset.subDiscount||0):0;
  function isSub(){var r=root.querySelector('input[name="pdpPlan"]:checked');return !!r&&r.value==='sub';}
  function showPrice(){
    var once=num(base),n=isSub()?Math.round(once*(100-subPct)/100):once;
    priceEl.innerHTML=moneyHTML(n,2);
    if(stickyPrice) stickyPrice.innerHTML=priceEl.innerHTML;
    var o=root.querySelector('.pdp-weight__opt.is-active');
    if(saveEl&&o){var m=num(o.dataset.mrp),mc=cv(m),nc=cv(n);saveEl.textContent=mc>nc?'You save '+(M?M.fmt(mc-nc,0):inr(m-n,0))+' ('+Math.round((mc-nc)/mc*100)+'%)'+(isSub()?' with Subscribe & save':''):'';saveEl.hidden=!(mc>nc);}
    if(planBox){
      var a=planBox.querySelector('[data-plan-price="once"]'),b=planBox.querySelector('[data-plan-price="sub"]');
      if(a) a.textContent=inr(once,0); if(b) b.textContent=inr(Math.round(once*(100-subPct)/100),0);
      planBox.querySelectorAll('.pdp-plan__opt').forEach(function(l){l.classList.toggle('is-on',l.querySelector('input').checked);});
    }
    document.dispatchEvent(new CustomEvent('gk-pdp-change',{detail:{size:o?o.dataset.size:'',price:n,mrp:o?num(o.dataset.mrp):n,sub:isSub()}}));
  }
  if(planBox) planBox.addEventListener('change',function(e){if(e.target.name==='pdpPlan') showPrice();});
  showPrice();
  function pick(o){
    opts.forEach(function(x){var on=x===o;x.classList.toggle('is-active',on);x.setAttribute('aria-checked',on);});
    base=o.dataset.price;showPrice();
    /* variant photo: a weight/pack option with data-img swaps the main gallery image
       (on Shopify, each variant's featured image does the same) */
    var vImg=o.dataset.img,first=root.querySelector('.pdp-gallery__slide img');
    if(first){if(!first.dataset.defaultSrc) first.dataset.defaultSrc=first.getAttribute('src');first.setAttribute('src',vImg||first.dataset.defaultSrc);go(0);}
    var cut=root.querySelector('.pdp-price-cut');if(cut) cut.innerHTML=moneyHTML(num(o.dataset.mrp),2);
  }
  opts.forEach(function(o){o.addEventListener('click',function(){pick(o);});});
  /* country changed: new currency for the price, savings and size labels */
  document.addEventListener('gk-market-change',function(){labels();showPrice();});
  /* another product of the group was opened (group module below): sizes were refilled, select the first */
  document.addEventListener('gk-pdp-product',function(){
    labels();
    var first=[].filter.call(opts,function(o){return !o.closest('.pdp-weight__item').hidden;})[0];
    var img=root.querySelector('.pdp-gallery__slide img');if(img) img.dataset.defaultSrc=img.getAttribute('src');
    if(first) pick(first);
    input.value=1; wish.setAttribute('aria-pressed','false'); go(0);
  });
  var clearBtn=root.querySelector('.pdp-weight__clear');if(clearBtn) clearBtn.addEventListener('click',function(){pick(opts[0]);});

  /* pincode checker: validates a 6-digit Indian pincode. Static build only: the delivery
     estimate below is a placeholder (data-eta-min/max days); on Shopify a delivery-date app
     or the store's shipping API answers serviceability and dates. */
  var pin=document.getElementById('pdpPin');
  if(pin){
    var pinIn=pin.querySelector('input'),pinMsg=document.getElementById('pdpPinMsg');
    var fmtDay=function(d){return d.toLocaleDateString('en-IN',{weekday:'short',day:'numeric',month:'short'});};
    pinIn.addEventListener('input',function(){pinIn.value=pinIn.value.replace(/\D/g,'').slice(0,6);pin.classList.remove('is-error');});
    pin.addEventListener('submit',function(e){
      e.preventDefault();
      var v=pinIn.value.trim();
      if(!/^[1-9][0-9]{5}$/.test(v)){pin.classList.add('is-error');pin.classList.remove('is-ok');pinMsg.textContent='Please enter a valid 6-digit pincode.';pinIn.focus();return;}
      var lo=+(pin.dataset.etaMin||3),hi=+(pin.dataset.etaMax||5),a=new Date(),b=new Date();
      a.setDate(a.getDate()+lo);b.setDate(b.getDate()+hi);
      pin.classList.remove('is-error');pin.classList.add('is-ok');
      pinMsg.innerHTML='Delivery to <strong>'+v+'</strong> by '+fmtDay(a)+' \u2013 '+fmtDay(b)+'. Free shipping over \u20b9999.';
    });
  }

  /* story circles: autoplay the preview muted; stay still for reduced-motion users */
  root.querySelectorAll('.pdp-story__video').forEach(function(sv){
    if(matchMedia('(prefers-reduced-motion: reduce)').matches){sv.removeAttribute('autoplay');sv.pause();return;}
    var p=sv.play();if(p&&p.catch)p.catch(function(){});
  });

  /* mobile buy bar: shows while the main "Add to bag" button is off screen */
  var bar=document.getElementById('pdpSticky'),cta=root.querySelector('.pdp-cta');
  if(bar&&cta&&'IntersectionObserver' in window){
    new IntersectionObserver(function(en){var on=!en[0].isIntersecting;bar.classList.toggle('is-on',on);bar.setAttribute('aria-hidden',on?'false':'true');bar.querySelector('button').tabIndex=on?0:-1;}).observe(cta);
    bar.querySelector('button').addEventListener('click',function(){cta.click();});
  }
})();


})(); } catch (e) { console.error("PDP: gallery, weights, pincode", e); }

// ==== Cart drawer ====
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
    if(window.gkBag) window.gkBag.add(d.qty||1);
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


})(); } catch (e) { console.error("Cart drawer", e); }

// ==== Story viewer ====
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


})(); } catch (e) { console.error("Story viewer", e); }

// ==== PDP tabs ====
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


})(); } catch (e) { console.error("PDP tabs", e); }

// ==== Reviews: featured quote ====
try { (function(){
(function(){
  'use strict';
  if(document.querySelector('.rv--compact')) return;   /* replaced by "Reviews: compact cards" */
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
    /* "View all" opens the full review list (see "Reviews: full list") */
  }

  measure();
  window.addEventListener('resize',function(){measure();wrap();paint();});
  window.addEventListener('load',function(){measure();wrap();paint();});
  raf=window.requestAnimationFrame(frame);
})();


})(); } catch (e) { console.error("Reviews: featured quote", e); }

// ==== Frequently bought together (under Add to bag) ====
/* Client feedback v02: sits right under "Add to bag" and follows the shopper's choices:
   - "This item" shows the selected size, price and purchase option;
   - the suggestions change with the size (data-show = sizes that row is shown for:
     small packs suggest small packs, 500g/1kg suggest bulk packs);
   - the total updates as boxes are ticked. On Shopify, use the product recommendations API. */
try { (function(){
  var root=document.getElementById('pdp-fbt');
  if(!root) return;
  var mrpEl=document.getElementById('pdpFbtMrp'),saleEl=document.getElementById('pdpFbtSale');
  var saveEl=document.getElementById('pdpFbtSave'),countEl=document.getElementById('pdpFbtCount'),add=document.getElementById('pdpFbtAdd');
  var self=root.querySelector('.pdp-fbt2__row--this .pdp-fbt__check');
  var rows=[].slice.call(root.querySelectorAll('.pdp-fbt2__row[data-show]'));
  var M=window.gkMarket;
  /* amounts below are already in the shopper's currency (each item converted, then added up) */
  function fmt(n){return M?M.fmt(n,0):'₹'+Math.round(n).toLocaleString('en-IN');}
  function cv(n){return M?M.price(n):+n;}
  function on(){return [self].concat(rows.filter(function(r){return !r.hidden&&!r.classList.contains('gk-not-sold');}).map(function(r){return r.querySelector('input');}).filter(function(c){return c.checked;}));}
  function update(){
    var sel=on(),mrp=0,sale=0;
    sel.forEach(function(c){mrp+=cv(+c.dataset.mrp);sale+=cv(+c.dataset.price);});
    saleEl.textContent=fmt(sale);
    mrpEl.textContent=mrp>sale?fmt(mrp):'';
    saveEl.textContent=mrp>sale?'Save '+fmt(mrp-sale):'';
    countEl.textContent=sel.length;
    if(countEl.nextSibling&&countEl.nextSibling.nodeType===3) countEl.nextSibling.nodeValue=(sel.length===1?' item':' items')+' \u00b7 ';
    add.textContent=sel.length>1?'Add all '+sel.length+' to bag':'Add to bag';
    /* no suggestion left for this size / country: hide the block */
    root.classList.toggle('is-empty',!rows.some(function(r){return !r.hidden&&!r.classList.contains('gk-not-sold');}));
    rows.forEach(function(r){r.classList.toggle('is-on',r.querySelector('input').checked);});
  }
  function follow(d){
    if(!d) return;
    self.dataset.price=d.price; self.dataset.mrp=d.mrp;
    var title=((document.querySelector('.pdp-info__title')||{}).textContent||'').trim();
    self.dataset.name=title+(d.size?' - '+d.size:'')+(d.sub?' (Subscribe & save)':'');
    var q=function(a){return root.querySelector('['+a+']');};
    q('data-fbt-size').textContent=(d.size||'')+(d.sub?' · Subscribe & save':'');
    q('data-fbt-price').textContent=fmt(cv(d.price)); q('data-fbt-mrp').textContent=cv(d.mrp)>cv(d.price)?fmt(cv(d.mrp)):'';
    /* never suggest the product being viewed (any size of it) */
    rows.forEach(function(r){var nm=r.querySelector('input').dataset.name||'';r.hidden=r.dataset.show.split(',').indexOf(d.size)<0||nm.indexOf(title)===0;});
    update();
  }
  rows.forEach(function(r){r.querySelector('input').addEventListener('change',update);});
  document.addEventListener('gk-pdp-change',function(e){follow(e.detail);});
  document.addEventListener('gk-market-change',update);
  var o=document.querySelector('.pdp-weight__opt.is-active'),p=document.querySelector('.pdp-price');
  if(o&&p) follow({size:o.dataset.size,price:(M?M.inrOf(p):parseFloat(p.textContent.replace(/[^\d.]/g,'')))||+self.dataset.price,mrp:parseFloat((o.dataset.mrp||'').replace(/[^\d.]/g,''))||+self.dataset.mrp,sub:false});
  add.addEventListener('click',function(){
    var sel=on();
    document.dispatchEvent(new CustomEvent('gk-cart-add',{detail:{items:sel.map(function(c){
      return {name:c.dataset.name,price:c.dataset.price,mrp:c.dataset.mrp,img:c.dataset.img,qty:1};})}}));
  });
})(); } catch (e) { console.error("Frequently bought together", e); }


// ==== Reviews: compact cards ====
/* Client feedback v02 (slide 12): instead of one big quote + photo, a rating summary with a
   breakdown, and a row of short review cards (swipe / arrows). Built from the same reviewer
   data (.rv__who + quote) that "View all reviews" uses. */
try { (function(){
  var sec=document.querySelector('.rv--compact'); if(!sec) return;
  var strip=sec.querySelector('.rv__strip'), bars=sec.querySelector('.rv__bars');
  var tabs=[].slice.call(sec.querySelectorAll('.rv__track .rv__who[aria-controls]'));
  if(!strip||!tabs.length) return;
  var data=tabs.map(function(t){
    var q=document.getElementById(t.getAttribute('aria-controls'));
    var text=q?[].slice.call(q.childNodes).filter(function(n){return n.nodeType===3;}).map(function(n){return n.textContent;}).join('').trim():'';
    return {r:+t.getAttribute('data-rating')||5, name:(t.querySelector('.rv__meta strong')||{}).textContent||'',
      city:(t.querySelector('.rv__meta > span:not(.rv__stars)')||{}).textContent||'', avatar:(t.querySelector('.rv__avatar')||{}).outerHTML||'', text:text};
  });
  var star=function(n){return '<span class="rv__stars" role="img" aria-label="Rated '+n+' out of 5" style="--rating:'+n+'"></span>';};
  strip.innerHTML=data.slice(0,8).map(function(x){
    return '<article class="rv__mini"><header>'+x.avatar+'<div><strong>'+x.name+'</strong><span>'+x.city+' · Verified buyer</span></div></header>'+star(x.r)+'<p>'+x.text+'</p></article>';
  }).join('');
  if(bars){
    bars.innerHTML=[5,4,3,2,1].map(function(l){
      var c=data.filter(function(x){return x.r===l;}).length, w=Math.round(c/data.length*100);
      return '<li><span>'+l+'★</span><i><b style="width:'+w+'%"></b></i><span>'+w+'%</span></li>';
    }).join('');
  }
  if(window.gkScrollHint) window.gkScrollHint.refresh();
  /* "View all reviews" and the prev/next arrows sit on the heading line, to save space */
  var head=sec.querySelector('.rv__head'), all=sec.querySelector('.rv__all'), arrows=strip.nextElementSibling;
  if(head&&all){
    var act=document.createElement('div'); act.className='rv__actions'; head.appendChild(act); act.appendChild(all);
    if(arrows&&arrows.classList.contains('gk-arrows')) act.appendChild(arrows);
  }
})(); } catch (e) { console.error("Reviews: compact cards", e); }


// ==== Reviews: full list ====
/* "View all reviews" opens a list of every review (avatar, name, city, star rating, text)
   built from the reviewer pills + quotes above, with a rating filter, sorting and paging.
   Ratings come from data-rating on each .rv__who button (placeholder data: replace with real reviews). */
try { (function(){
  var btn=document.querySelector('.rv__all'), list=document.getElementById('rvList');
  var tabs=[].slice.call(document.querySelectorAll('.rv__track .rv__who[aria-controls]'));
  if(!btn||!list||!tabs.length) return;
  var grid=list.querySelector('.rv__grid'), more=list.querySelector('.rv__more'), sortSel=list.querySelector('.rv__sort');
  var filtersBox=list.querySelector('.rv__filters'), countEl=list.querySelector('.rv__list-count');
  var PAGE=6, shown=PAGE, filter=0, sort='featured';
  var reviews=tabs.map(function(t,i){
    var q=document.getElementById(t.getAttribute('aria-controls'));
    var text=q?[].slice.call(q.childNodes).filter(function(n){return n.nodeType===3;}).map(function(n){return n.textContent;}).join('').trim():'';
    return {i:i, rating:+t.getAttribute('data-rating')||5, name:(t.querySelector('.rv__meta strong')||{}).textContent||'',
            city:(t.querySelector('.rv__meta > span:not(.rv__stars)')||{}).textContent||'', avatar:(t.querySelector('.rv__avatar')||{}).outerHTML||'', text:text};
  });
  function stars(n){return '<span class="rv__stars" role="img" aria-label="Rated '+n+' out of 5" style="--rating:'+n+'"></span>';}
  /* filter chips with counts */
  var levels=[0,5,4,3];
  filtersBox.innerHTML=levels.map(function(l){
    var c=l?reviews.filter(function(r){return l===3?r.rating<=3:r.rating===l;}).length:reviews.length;
    if(l&&!c) return '';
    return '<button type="button" class="rv__chip'+(l===0?' is-active':'')+'" data-level="'+l+'" aria-pressed="'+(l===0)+'">'+(l?(l===3?'3 & below':l+' stars'):'All')+' <span>('+c+')</span></button>';
  }).join('');
  function current(){
    var r=reviews.filter(function(x){return !filter||(filter===3?x.rating<=3:x.rating===filter);});
    if(sort==='high') r=r.slice().sort(function(a,b){return b.rating-a.rating||a.i-b.i;});
    if(sort==='low') r=r.slice().sort(function(a,b){return a.rating-b.rating||a.i-b.i;});
    return r;
  }
  function render(){
    var r=current();
    countEl.textContent='('+r.length+')';
    grid.innerHTML=r.slice(0,shown).map(function(x){
      return '<article class="rv__card"><header class="rv__card-head">'+x.avatar+'<div class="rv__card-who"><strong>'+x.name+'</strong><span>'+x.city+'</span></div>'+stars(x.rating)+'</header><p class="rv__card-text">'+x.text+'</p></article>';
    }).join('');
    more.hidden=shown>=r.length;
  }
  filtersBox.addEventListener('click',function(e){
    var c=e.target.closest('.rv__chip'); if(!c) return;
    filter=+c.getAttribute('data-level'); shown=PAGE;
    [].forEach.call(filtersBox.children,function(b){var on=b===c;b.classList.toggle('is-active',on);b.setAttribute('aria-pressed',on);});
    render();
  });
  sortSel.addEventListener('change',function(){sort=sortSel.value;shown=PAGE;render();});
  more.addEventListener('click',function(){shown+=PAGE;render();});
  function setOpen(on){
    list.hidden=!on; btn.setAttribute('aria-expanded',on?'true':'false');
    var tn=[].slice.call(btn.childNodes).filter(function(n){return n.nodeType===3;})[0];
    if(tn) tn.textContent=on?'Hide reviews ':'View all reviews ('+reviews.length+') ';
    if(on){render(); list.scrollIntoView({behavior:'smooth',block:'start'});}
  }
  btn.addEventListener('click',function(e){e.preventDefault();setOpen(list.hidden);});
})(); } catch (e) { console.error("Reviews: full list", e); }

// ==== Group products ====
/* "Explore the range" on the product page: the other teas of this product's group.
   Clicking one swaps the whole page in place (photos, name, rating, caffeine, price, sizes,
   description, details, brewing, Frequently Bought Together, buy bar) and updates the
   address (?product=...), so the link can be shared and Back returns to the previous tea.
   Each tile is a real link, so it also works without JavaScript.
   Products not sold in the shopper's country are hidden; if the open product is not sold
   there, the page says so and "Add to bag" is switched off.
   On Shopify: a product metafield lists the group's products (or "combined listings");
   the swap fetches the other product's section HTML (Section Rendering API). */
try { (function(){
  var root = document.querySelector('.pdp'), box = document.getElementById('pdpGroup');
  if (!root || !box) return;
  var M = window.gkMarket;
  var g = 'assets/images/';
  /* demo data: content to be confirmed by the client */
  var GROUP = [
    { id:'estate-gift-set', short:'Estate Gift Set', name:'Goodricke Estate Gift Set', badge:'Limited Edition',
      sub:'Assorted Darjeeling, Assam &amp; Dooars teas &ndash; 40 tea bags', crumb:['Tea Boxes &amp; Gifts','All Boxes'],
      rating:4.9, reviews:20, caffeine:3, mg:'~40&ndash;60 mg / cup',
      images:[[g+'product-09.webp','Goodricke Estate Gift Set'],[g+'product-04.webp','Gift set open, showing tea bags'],[g+'product-03.webp','Gift set details'],[g+'product-01.webp','Gift set packaging']],
      sizes:[['100g',1499,1799],['250g',3373,4498],['500g',6746,8995],['1kg',10493,17990]],
      desc:'A varied assortment of estate-fresh teas to discover Goodricke’s finest gardens: single-estate Darjeeling, robust Assam and bright Dooars teas, packed for gifting.',
      long:'The <a href="#">Goodricke</a> Estate Gift Set brings together estate-fresh teas from our own gardens in Darjeeling, Assam and the Dooars, packed in a box made for gifting. Each tea bag is sealed to keep its flavour and aroma fresh, so every cup tastes as if it had just been plucked. It is a thoughtful way to share the best of Goodricke with family, friends and colleagues.',
      flavour:'Floral Darjeeling, malty Assam and brisk Dooars, in one box',
      facts:['Darjeeling, Assam &amp; Dooars <a href="#">Black Tea</a>','Assorted','Tea bags','Assorted <a href="#">Darjeeling Tea</a>, Assam tea and Dooars tea; sourced from Goodricke’s own Tea Estates'],
      about:['Darjeeling, Assam &amp; Dooars','Own Tea Estates','Assorted','Assorted','24 months','With or without milk','Black tea','Tea bags'],
      brew:'Add one tea bag per cup in the tea pot (or one teaspoon, about 1.2 g, of loose leaf)' },
    { id:'castleton-muscatel', short:'Castleton Muscatel', name:'Castleton Premium Muscatel', badge:'Single Estate',
      sub:'Second flush Darjeeling from Castleton estate &ndash; loose leaf tin', crumb:['Darjeeling Tea','Loose Leaf'],
      rating:4.8, reviews:32, caffeine:2, mg:'~30&ndash;40 mg / cup',
      images:[[g+'range-product-4.webp','Castleton Premium Muscatel tin'],[g+'darjeeling.webp','Tea leaves in a Darjeeling garden'],[g+'hero-tea-cup.webp','A cup of Darjeeling tea'],[g+'region-section-bg.webp','Darjeeling tea gardens']],
      sizes:[['100g',788,875],['250g',1899,2199],['500g',3599,4375]],
      desc:'A second flush Darjeeling from the Castleton estate, known for its muscatel character: bright, fruity and smooth.',
      long:'Castleton Premium Muscatel is plucked in the second flush, when the Darjeeling bushes give the full, grape-like muscatel note the estate is known for. The whole leaves are gently rolled and packed in a tin to keep them fresh. Best enjoyed without milk.',
      flavour:'Muscatel grape, ripe fruit and a smooth, lingering finish',
      facts:['Darjeeling <a href="#">Black Tea</a>','Second flush','Whole leaf','Single-estate <a href="#">Darjeeling Tea</a> from Castleton, one of Goodricke’s own Tea Estates'],
      about:['Darjeeling','Castleton','Muscatel','Second flush','24 months','Without milk','Black tea','Loose leaf'],
      brew:'Add one teaspoon (about 2.5 g) of leaves per cup in the tea pot' },
    { id:'roasted-darjeeling', short:'Roasted Darjeeling', name:'Goodricke Roasted Darjeeling Tea Jar', badge:'Bestseller',
      sub:'Roasted Darjeeling, golden orange pekoe &ndash; jar', crumb:['Darjeeling Tea','Loose Leaf'],
      rating:4.7, reviews:45, caffeine:3, mg:'~40&ndash;60 mg / cup',
      images:[[g+'shop-roasted-darjeeling.webp','Goodricke Roasted Darjeeling Tea jar'],[g+'range-product-1.webp','Roasted Darjeeling Tea jar, side view'],[g+'darjeeling.webp','Tea leaves in a Darjeeling garden'],[g+'hero-tea-cup.webp','A cup of roasted Darjeeling tea']],
      sizes:[['250g',285,335],['500g',549,670]],
      desc:'Darjeeling leaves given a gentle roast for a warm, toasty cup with the garden’s floral notes, in a resealable jar.',
      long:'Goodricke Roasted Darjeeling takes golden orange pekoe leaves from our Darjeeling gardens and gives them a slow, gentle roast. The result is a rounder, toasty cup that keeps the floral lift of Darjeeling. The jar reseals to keep every spoonful fresh.',
      flavour:'Toasty, warm and rounded, with a floral finish',
      facts:['Darjeeling <a href="#">Black Tea</a>','Assorted','Golden orange pekoe','Roasted <a href="#">Darjeeling Tea</a> from Goodricke’s own Tea Estates'],
      about:['Darjeeling','Own Tea Estates','Roasted','Assorted','24 months','With or without milk','Black tea','Loose leaf'],
      brew:'Add one teaspoon (about 2.5 g) of leaves per cup in the tea pot' },
    { id:'thurbo-whole-leaf', short:'Thurbo Whole Leaf', name:'Goodricke Thurbo Darjeeling Whole Leaf', badge:'New',
      sub:'Single estate Darjeeling, whole leaf &ndash; carton', crumb:['Darjeeling Tea','Loose Leaf'],
      rating:4.8, reviews:18, caffeine:2, mg:'~30&ndash;40 mg / cup',
      images:[[g+'shop-thurbo-whole-leaf.webp','Goodricke Thurbo Darjeeling Whole Leaf carton'],[g+'khaass-pack-3.webp','Thurbo Whole Leaf carton in the garden'],[g+'darjeeling.webp','Tea leaves in a Darjeeling garden'],[g+'hero-tea-cup.webp','A cup of Darjeeling tea']],
      sizes:[['100g',502,602],['250g',1149,1399],['500g',2199,2699]],
      desc:'Whole Darjeeling leaves from the Thurbo estate for a light, floral and aromatic cup.',
      long:'Thurbo sits high in the Mirik valley of Darjeeling. Its whole leaves are hand plucked and carefully withered to give a light, floral and aromatic cup with a clean finish. Packed in a carton that keeps out light and moisture.',
      flavour:'Light, floral and aromatic, with a clean finish',
      facts:['Darjeeling <a href="#">Black Tea</a>','Assorted','Whole leaf','Single-estate <a href="#">Darjeeling Tea</a> from Thurbo, one of Goodricke’s own Tea Estates'],
      about:['Darjeeling','Thurbo','Floral','Assorted','24 months','Without milk','Black tea','Loose leaf'],
      brew:'Add one teaspoon (about 2.5 g) of leaves per cup in the tea pot' },
    { id:'khaass-assam', short:'Khaass Assam', name:'Khaass Exclusive Assam Tea', badge:'Bestseller',
      sub:'Strong, malty Assam CTC &ndash; pouch', crumb:['Assam Tea','CTC'],
      rating:4.6, reviews:64, caffeine:3, mg:'~50&ndash;70 mg / cup',
      images:[[g+'range-product-3.webp','Khaass Exclusive Assam Tea pouch'],[g+'product-01.webp','Khaass Exclusive Assam Tea, large pouch'],[g+'product-07.webp','Khaass Exclusive Assam Tea carton'],[g+'assam.webp','Assam tea gardens']],
      sizes:[['250g',149,189],['500g',279,360],['1kg',533,710]],
      desc:'A strong, malty Assam CTC for a rich everyday cup that stands up to milk and sugar.',
      long:'Khaass Exclusive brings together CTC teas from the Brahmaputra valley in Assam for a strong, malty and full-bodied cup. It brews quickly to a deep colour and is made for milk tea and chai.',
      flavour:'Strong, malty and full-bodied',
      facts:['Assam <a href="#">Black Tea</a>','Assorted','CTC','Assam CTC tea from Goodricke’s own Tea Estates'],
      about:['Assam','Own Tea Estates','Malty','Assorted','18 months','With milk','Black tea','CTC'],
      brew:'Add one teaspoon (about 2.5 g) of tea per cup, or simmer with milk for chai' }
  ];
  var byId = {}; GROUP.forEach(function(p){ byId[p.id] = p; });
  var ABOUT = ['Region','Garden','Tea Style','Flush Type','Shelf Life','Ideal For','Tea Type','Format'];
  var LEVELS = ['Low','Medium','High'];
  var $ = function(s){ return root.querySelector(s); };
  var esc = function(t){ var d = document.createElement('div'); d.innerHTML = t; return d.textContent; };
  var money = function(inr){ return M ? M.span(inr, 0) : '₹' + inr.toLocaleString('en-IN'); };
  var current = byId['estate-gift-set'];

  /* tiles */
  var row = box.querySelector('.pdp-group__row');
  row.innerHTML = GROUP.map(function(p){
    return '<a class="pdp-group__item" data-product="' + p.id + '" data-gk-product="' + esc(p.name) + '" href="pdp.html?product=' + p.id + '">' +
      '<span class="pdp-group__img"><img alt="" loading="lazy" src="' + p.images[0][0] + '"/></span>' +
      '<span class="pdp-group__name">' + p.short + '</span>' +
      '<span class="pdp-group__price">from ' + money(p.sizes[0][1]) + '</span></a>';
  }).join('');
  if (M) M.refresh();

  function mark(p){
    box.querySelectorAll('.pdp-group__item').forEach(function(a){
      var on = a.dataset.product === p.id;
      a.classList.toggle('is-active', on);
      if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
      /* keep the active tile in view inside the row (row only, never the page) */
      if (on){ var l = a.offsetLeft - row.offsetLeft, r = l + a.offsetWidth;
        if (l < row.scrollLeft || r > row.scrollLeft + row.clientWidth) row.scrollLeft = Math.max(0, l - 12); }
    });
  }
  function inrText(n){ return '₹' + n.toLocaleString('en-IN', { minimumFractionDigits:2, maximumFractionDigits:2 }); }

  function fill(p){
    document.title = esc(p.name) + ' — Goodricke';
    var crumbs = root.querySelectorAll('.pdp-breadcrumb li');
    if (crumbs.length >= 4){ crumbs[1].firstChild.innerHTML = p.crumb[0]; crumbs[2].firstChild.innerHTML = p.crumb[1]; crumbs[3].textContent = esc(p.name); }
    var badge = $('.pdp-badge'); if (badge){ badge.textContent = p.badge || ''; badge.hidden = !p.badge; }
    /* gallery */
    root.querySelectorAll('.pdp-gallery__slide img').forEach(function(img, i){
      var im = p.images[i] || p.images[0]; img.src = im[0]; img.alt = im[1];
    });
    /* heading, rating, caffeine */
    $('.pdp-info__title').innerHTML = p.name;
    $('.pdp-info__sub').innerHTML = p.sub;
    var stars = $('.pdp-rating .rv__stars');
    if (stars){ stars.style.setProperty('--rating', p.rating); stars.setAttribute('aria-label', 'Rated ' + p.rating + ' out of 5'); }
    var rt = $('.pdp-rating__text'); if (rt) rt.textContent = p.rating + ' · Read ' + p.reviews + ' reviews';
    var caf = $('.pdp-caffeine');
    if (caf){
      caf.dataset.level = p.caffeine;
      caf.setAttribute('aria-label', 'Caffeine level: ' + LEVELS[p.caffeine - 1] + ', about ' + esc(p.mg).replace('~', '').replace('–', ' to ').replace(' / cup', ' per cup'));
      caf.querySelectorAll('.pdp-caffeine__steps i').forEach(function(s, i){ s.classList.toggle('is-on', i === p.caffeine - 1); });
      var note = caf.querySelector('.pdp-caffeine__note'); if (note) note.innerHTML = p.mg;
    }
    /* sizes: refill the size buttons (prices kept in INR, shown in the shopper's currency) */
    root.querySelectorAll('.pdp-weight__item').forEach(function(item, i){
      var sz = p.sizes[i], btn = item.querySelector('.pdp-weight__opt');
      item.hidden = !sz;
      if (!sz) return;
      btn.dataset.size = sz[0]; btn.dataset.price = inrText(sz[1]); btn.dataset.mrp = inrText(sz[2]);
      btn.querySelector('strong').textContent = sz[0];
    });
    /* description, details, brewing */
    var d = $('.pdp-desc'); if (d) d.textContent = p.desc;
    var bodies = root.querySelectorAll('.pdp-more__body');
    if (bodies[0]){
      var ps = bodies[0].querySelectorAll(':scope > p');
      if (ps[0]) ps[0].innerHTML = p.long;
      if (ps[1]) ps[1].innerHTML = '<strong>Flavour:</strong> ' + p.flavour;
      bodies[0].querySelectorAll('.pdp-facts dd').forEach(function(dd, i){ if (p.facts[i] != null) dd.innerHTML = p.facts[i]; });
    }
    if (bodies[1]) bodies[1].querySelectorAll('.pdp-about__item').forEach(function(li, i){
      var h = li.querySelector('h3'), v = li.querySelector('p'); if (h) h.textContent = ABOUT[i]; if (v && p.about[i] != null) v.innerHTML = p.about[i];
    });
    var step2 = root.querySelectorAll('.pdp-brew__step p')[1]; if (step2) step2.textContent = p.brew;
    var revLink = root.querySelector('.pdp-more__links a[href="#rv"]'); if (revLink) revLink.textContent = 'Reviews (' + p.reviews + ')';
    /* "This item" in Frequently Bought Together, buy bar */
    var self = root.querySelector('.pdp-fbt2__row--this');
    if (self){
      var chk = self.querySelector('input'); chk.dataset.img = p.images[0][0]; chk.dataset.ref = 'GK-' + p.id.toUpperCase();
      var im = self.querySelector('img'); if (im) im.src = p.images[0][0];
      var nm = self.querySelector('.pdp-fbt2__name'); if (nm && nm.childNodes[1]) nm.childNodes[1].nodeValue = esc(p.name);
    }
    var sn = document.querySelector('.pdp-sticky__name'); if (sn) sn.textContent = esc(p.name);
    mark(p);
    current = p;
    document.dispatchEvent(new CustomEvent('gk-pdp-product', { detail:{ id:p.id } }));
    availability();
  }

  /* country: hide the pincode check outside India; switch off buying if this tea is not sold there */
  var notice = document.createElement('p');
  notice.className = 'pdp-unavail'; notice.setAttribute('role', 'status'); notice.hidden = true;
  var actions = $('.pdp-actions'); if (actions) actions.parentNode.insertBefore(notice, actions.nextSibling);
  function availability(){
    var sold = !M || M.isSold(esc(current.name)), cname = M ? (M.market().inName || M.market().name) : '';
    notice.hidden = sold;
    notice.textContent = sold ? '' : 'This tea is not sold in ' + cname + '. Choose another tea from the range above, or change your country.';
    root.classList.toggle('is-not-sold', !sold);
    [$('.pdp-cta'), document.querySelector('.pdp-sticky__btn')].forEach(function(b){ if (b){ b.disabled = !sold; b.setAttribute('aria-disabled', String(!sold)); } });
    var fbt = document.getElementById('pdp-fbt'); if (fbt) fbt.hidden = !sold;
    var pin = document.getElementById('pdpPin'); if (pin) pin.hidden = !!M && M.code !== 'IN';
  }
  document.addEventListener('gk-market-change', availability);

  /* open another product of the group */
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function open(id, push){
    var p = byId[id]; if (!p || p === current) return;
    var grid = root.querySelector('.pdp__grid');
    if (reduce || !grid){ fill(p); }
    else { grid.classList.add('is-swapping'); setTimeout(function(){ fill(p); grid.classList.remove('is-swapping'); }, 160); }
    if (push){
      var url = new URL(location.href); url.searchParams.set('product', id);
      history.pushState({ product:id }, '', url.pathname + url.search);
    }
  }
  box.addEventListener('click', function(e){
    var a = e.target.closest('.pdp-group__item'); if (!a) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return; /* open in new tab still works */
    e.preventDefault();
    open(a.dataset.product, true);
  });
  window.addEventListener('popstate', function(){
    var id = new URLSearchParams(location.search).get('product') || 'estate-gift-set';
    if (byId[id]) open(id, false);
  });
  /* opened from a shared link */
  var start = new URLSearchParams(location.search).get('product');
  if (start && byId[start] && byId[start] !== current) fill(byId[start]);
  else { mark(current); availability(); }
})(); } catch (e) { console.error("Group products", e); }
