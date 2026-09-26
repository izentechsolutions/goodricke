
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
