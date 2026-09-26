
(function(){
  var sec=document.getElementById('promoOvl');
  if(!sec) return;
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var one=sec.querySelector('.is-one'), two=sec.querySelector('.is-two');
  var queued=false;
  function render(){
    queued=false;
    var total=sec.offsetHeight-Math.min(600,window.innerHeight);
    var p=total>0?(-sec.getBoundingClientRect().top)/total:0;
    p=Math.max(0,Math.min(1,p));
    /* crossfade window: 25%-75% of the pinned scroll */
    var t=Math.max(0,Math.min(1,(p-0.12)/0.76));
    var e=t<0.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;   /* smooth ease in-out */
    one.style.opacity=String(1-e);
    one.style.transform='translateY('+(-34*e)+'px) scale('+(1-0.03*e)+')';
    one.style.filter='blur('+(6*e)+'px)';
    two.style.opacity=String(e);
    two.style.transform='translateY('+(48*(1-e))+'px) scale('+(0.985+0.015*e)+')';
    two.style.filter='blur('+(6*(1-e))+'px)';
  }
  function onScroll(){ if(!queued){queued=true;requestAnimationFrame(render);} }
  window.addEventListener('scroll',onScroll,{passive:true});
  window.addEventListener('resize',onScroll);
  render();
})();
