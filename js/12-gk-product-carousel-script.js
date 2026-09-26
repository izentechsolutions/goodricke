
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



