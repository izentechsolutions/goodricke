
(function(){
  var btn      = document.getElementById('watchStoryBtn');
  var modal    = document.getElementById('videoModal');
  var closeBtn = document.getElementById('videoModalClose');
  var player   = document.getElementById('videoModalPlayer');

  if(!btn || !modal || !player) return;

  btn.addEventListener('click', function(e){
    e.preventDefault();
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    player.currentTime = 0;
    player.play();
  });

  function closeModal(){
    modal.classList.remove('open');
    player.pause();
    player.currentTime = 0;
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', closeModal);


  modal.addEventListener('click', function(e){
    if(e.target === modal) closeModal();
  });
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape') closeModal();
  });
})();

