
document.addEventListener("DOMContentLoaded", () => {
  const slider = document.querySelector(".team-row");
  if (!slider) return;

  let isDragging = false;
  let isHovering = false;
  let startX = 0;
  let startScrollLeft = 0;
  let direction = 1;

  const speed = 0.3;

  function animate() {
    if (!isDragging && !isHovering) {
      const maxScroll = slider.scrollWidth - slider.clientWidth;

      slider.scrollLeft += speed * direction;

      if (slider.scrollLeft >= maxScroll) {
        direction = -1;
      }

      if (slider.scrollLeft <= 0) {
        direction = 1;
      }
    }

    requestAnimationFrame(animate);
  }

  /* Mouse drag */
  slider.addEventListener("mousedown", (e) => {
    isDragging = true;

    startX = e.pageX - slider.offsetLeft;
    startScrollLeft = slider.scrollLeft;

    slider.classList.add("dragging");
  });

  slider.addEventListener("mousemove", (e) => {
    if (!isDragging) return;

    e.preventDefault();

    const x = e.pageX - slider.offsetLeft;
    const distance = x - startX;

    slider.scrollLeft = startScrollLeft - distance;
  });

  slider.addEventListener("mouseup", () => {
    isDragging = false;
    slider.classList.remove("dragging");
  });

  slider.addEventListener("mouseleave", () => {
    isDragging = false;
    slider.classList.remove("dragging");
  });

  /* Pause on hover */
  slider.addEventListener("mouseenter", () => {
    isHovering = true;
  });

  slider.addEventListener("mouseleave", () => {
    isHovering = false;
  });

  animate();
});
