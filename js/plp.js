/* Goodricke — plp.js: Product listing page only (incl. the Shop hero slider). */

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

// ==== Filter and sort ====
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
    function productText(card){return ((card.getAttribute('data-tags')||'')+' '+(card.textContent||'')).toLowerCase()}
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
      var count=document.querySelector('.product-listing .product-count');if(count&&grid)count.textContent=grid.querySelectorAll(':scope > .product-item').length+' Products';
    });
    document.addEventListener('keydown',function(e){if(e.key==='Escape'&&drawer.classList.contains('is-open'))closeDrawer()});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initGoodrickeFilterSort);else initGoodrickeFilterSort();
})();


})(); } catch (e) { console.error("Filter and sort", e); }


// ==== Shop hero slider ====
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

})(); } catch (e) { console.error("Shop hero slider", e); }

