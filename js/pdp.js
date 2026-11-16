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
  var inr=function(n,d){return '₹'+n.toLocaleString('en-IN',{minimumFractionDigits:d,maximumFractionDigits:d});};
  var pct=function(o){var m=num(o.dataset.mrp),p=num(o.dataset.price);return m>p?Math.round((m-p)/m*100):0;};
  /* "SAVE x%" under each size, worked out from its price and MRP */
  opts.forEach(function(o){var t=o.parentNode.querySelector('.pdp-weight__save'),v=pct(o);if(t){t.textContent=v?'SAVE '+v+'%':'';t.hidden=!v;}});
  var saveEl=root.querySelector('.pdp-save'),stickyPrice=document.querySelector('.pdp-sticky__price');
  /* purchase option (client feedback v02): "Subscribe & save" takes data-sub-discount % off the selected size.
     On Shopify these become selling plans (subscription app); the static build only shows the price. */
  var planBox=root.querySelector('.pdp-plan'),subPct=planBox?(+planBox.dataset.subDiscount||0):0;
  function isSub(){var r=root.querySelector('input[name="pdpPlan"]:checked');return !!r&&r.value==='sub';}
  function showPrice(){
    var once=num(base),n=isSub()?Math.round(once*(100-subPct)/100):once;
    priceEl.textContent=inr(n,2);
    if(stickyPrice) stickyPrice.textContent=priceEl.textContent;
    var o=root.querySelector('.pdp-weight__opt.is-active');
    if(saveEl&&o){var m=num(o.dataset.mrp);saveEl.textContent=m>n?'You save '+inr(m-n,0)+' ('+Math.round((m-n)/m*100)+'%)'+(isSub()?' with Subscribe & save':''):'';saveEl.hidden=!(m>n);}
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
    var cut=root.querySelector('.pdp-price-cut');if(cut) cut.textContent=o.dataset.mrp;
  }
  opts.forEach(function(o){o.addEventListener('click',function(){pick(o);});});
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
  var title=(document.querySelector('.pdp-info__title')||{}).textContent||'';
  function fmt(n){return '₹'+Math.round(n).toLocaleString('en-IN');}
  function on(){return [self].concat(rows.filter(function(r){return !r.hidden;}).map(function(r){return r.querySelector('input');}).filter(function(c){return c.checked;}));}
  function update(){
    var sel=on(),mrp=0,sale=0;
    sel.forEach(function(c){mrp+=+c.dataset.mrp;sale+=+c.dataset.price;});
    saleEl.textContent=fmt(sale);
    mrpEl.textContent=mrp>sale?fmt(mrp):'';
    saveEl.textContent=mrp>sale?'Save '+fmt(mrp-sale):'';
    countEl.textContent=sel.length;
    add.textContent=sel.length>1?'Add all '+sel.length+' to bag':'Add to bag';
    rows.forEach(function(r){r.classList.toggle('is-on',r.querySelector('input').checked);});
  }
  function follow(d){
    if(!d) return;
    self.dataset.price=d.price; self.dataset.mrp=d.mrp;
    self.dataset.name=title.trim()+(d.size?' - '+d.size:'')+(d.sub?' (Subscribe & save)':'');
    var q=function(a){return root.querySelector('['+a+']');};
    q('data-fbt-size').textContent=(d.size||'')+(d.sub?' · Subscribe & save':'');
    q('data-fbt-price').textContent=fmt(d.price); q('data-fbt-mrp').textContent=d.mrp>d.price?fmt(d.mrp):'';
    rows.forEach(function(r){r.hidden=r.dataset.show.split(',').indexOf(d.size)<0;});
    update();
  }
  rows.forEach(function(r){r.querySelector('input').addEventListener('change',update);});
  document.addEventListener('gk-pdp-change',function(e){follow(e.detail);});
  var o=document.querySelector('.pdp-weight__opt.is-active'),p=document.querySelector('.pdp-price');
  if(o&&p) follow({size:o.dataset.size,price:parseFloat(p.textContent.replace(/[^\d.]/g,''))||+self.dataset.price,mrp:parseFloat((o.dataset.mrp||'').replace(/[^\d.]/g,''))||+self.dataset.mrp,sub:false});
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
