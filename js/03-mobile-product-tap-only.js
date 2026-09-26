
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
