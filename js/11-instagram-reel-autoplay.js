
document.addEventListener("DOMContentLoaded", () => {

  const videos = document.querySelectorAll(".insta-tile video.reel-video");

  const observer = new IntersectionObserver((entries) => {

    entries.forEach(entry => {
      const video = entry.target;
      const tile = video.closest(".insta-tile");

      if (entry.isIntersecting) {
        video.muted = true; // required for autoplay on mobile browsers
        const playPromise = video.play();
        if (playPromise && typeof playPromise.then === "function") {
          playPromise
            .then(() => { if (tile) tile.classList.remove("reel-fallback"); })
            .catch(() => {
              // Autoplay blocked (e.g. low-power mode, browser policy):
              // fall back to showing the poster frame + play icon instead
              // of leaving a broken/frozen video.
              if (tile) tile.classList.add("reel-fallback");
            });
        }
      } else {
        video.pause();
      }
    });

  }, {
    threshold: 0.5
  });

  videos.forEach(video => {
    observer.observe(video);
  });

});
