
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
