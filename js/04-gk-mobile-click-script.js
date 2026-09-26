
document.addEventListener('DOMContentLoaded', function(){
  const cards = Array.from(document.querySelectorAll('.gk-product-card'));
  if (!cards.length) return;

  const isMobile = () => window.matchMedia('(max-width: 768px), (hover: none)').matches;

  cards.forEach(card => {
    card.addEventListener('click', function(e){
      if (!isMobile()) return;

      /* Let the actual controls work without toggling the card */
      if (e.target.closest('.gk-action-btn, .gk-add-cart, a, button')) return;

      cards.forEach(other => {
        if (other !== card) other.classList.remove('gk-card-active');
      });

      card.classList.toggle('gk-card-active');
    });
  });

  document.addEventListener('click', function(e){
    if (!e.target.closest('.gk-product-card')) {
      cards.forEach(card => card.classList.remove('gk-card-active'));
    }
  });
});
