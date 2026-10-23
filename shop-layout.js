(()=>{
 document.querySelectorAll('.shop-rail-frame').forEach(frame=>{
  const rail=frame.querySelector('.shop-rail');
  const buttons=[...frame.querySelectorAll('[data-scroll]')];
  const update=()=>{const max=rail.scrollWidth-rail.clientWidth;buttons[0].disabled=rail.scrollLeft<3;buttons[1].disabled=rail.scrollLeft>=max-3;};
  const move=direction=>{const card=rail.querySelector('.shop-product');const step=(card?.getBoundingClientRect().width||rail.clientWidth)+parseFloat(getComputedStyle(rail).columnGap||0);rail.scrollBy({left:direction*step,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});};
  buttons.forEach(button=>button.addEventListener('click',()=>move(Number(button.dataset.scroll))));
  rail.addEventListener('keydown',event=>{if(event.target!==rail)return;if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();move(event.key==='ArrowRight'?1:-1);}});
  rail.addEventListener('scroll',update,{passive:true});new ResizeObserver(update).observe(rail);update();
 });
})();
