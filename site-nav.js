(() => {
const header=document.querySelector('.site-header'),nav=header?.querySelector('.site-nav');if(!nav)return;
const button=document.createElement('button');button.type='button';button.className='mobile-menu-toggle';button.textContent='Menu';nav.id='site-navigation';button.setAttribute('aria-controls',nav.id);button.setAttribute('aria-expanded','false');header.insertBefore(button,nav);header.classList.add('mobile-nav-ready');
const close=()=>{header.classList.remove('menu-open');button.setAttribute('aria-expanded','false');button.textContent='Menu';};
button.addEventListener('click',()=>{const open=button.getAttribute('aria-expanded')!=='true';header.classList.toggle('menu-open',open);button.setAttribute('aria-expanded',String(open));button.textContent=open?'Close':'Menu';});
header.addEventListener('keydown',event=>{if(event.key==='Escape'&&header.classList.contains('menu-open')){close();button.focus();}});nav.addEventListener('click',event=>{if(event.target.closest('a'))close();});document.addEventListener('click',event=>{if(!header.contains(event.target))close();});
matchMedia('(max-width:800px)').addEventListener('change',close);
const measure=()=>document.documentElement.style.setProperty('--site-header-height',header.getBoundingClientRect().height+'px');new ResizeObserver(measure).observe(header);measure();
})();