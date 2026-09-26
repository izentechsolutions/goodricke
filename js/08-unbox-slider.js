
document.addEventListener("DOMContentLoaded", function () {

  const slides = document.querySelectorAll(".unbox-slide");
  const text = document.querySelector(".unbox-copy");

  if (!slides.length || !text) return;

  let current = 0;

  /* First image + first text animation */
  slides[0].classList.add("active");
  text.classList.add("animate");


  function changeSlide() {

    const previous = current;

    current = (current + 1) % slides.length;


    /* -------------------------
       IMAGE CROSSFADE
       ------------------------- */

    slides[current].style.zIndex = "2";
    slides[previous].style.zIndex = "1";

    slides[current].classList.add("active");


    /* -------------------------
       TEXT ANIMATION RESTART
       ------------------------- */

    text.classList.remove("animate");

    /* Force animation restart */
    void text.offsetWidth;

    text.classList.add("animate");


    /* Remove previous image AFTER fade */
    setTimeout(function () {

      slides[previous].classList.remove("active");
      slides[previous].style.zIndex = "0";

    }, 2300);
  }


  /* Change image every 6 seconds */
  setInterval(changeSlide, 6000);

});
