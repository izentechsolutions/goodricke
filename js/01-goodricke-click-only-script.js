
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
