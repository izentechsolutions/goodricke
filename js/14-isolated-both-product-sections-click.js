
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
