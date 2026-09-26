
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
