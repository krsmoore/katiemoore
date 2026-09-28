(() => {
  const nav = document.querySelector('.category-nav');
  if (!nav) return;
  const keys = ['for-you', 'for-teams', 'for-events', 'shop'];
  const panels = keys.map(id => document.getElementById(id));
  const tabs = [...nav.querySelectorAll('a')];
  const viewport = document.createElement('div');
  viewport.className = 'service-carousel';
  nav.after(viewport);
  panels.forEach((panel, index) => {
    viewport.append(panel);
    panel.classList.add('service-panel');
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', `tab-${keys[index]}`);
    panel.tabIndex = 0;
    panel.hidden = index !== 0;

  });
  document.querySelector('.more-services')?.remove();
  nav.setAttribute('role', 'tablist');
  let active = 0;
  function select(index, focus = false) {
    if (index < 0 || index >= tabs.length) return;
    const direction = index >= active ? 1 : -1;
    panels[active].getAnimations().forEach(animation => animation.cancel());
    panels.forEach((panel, i) => { panel.hidden = i !== index; });
    tabs.forEach((tab, i) => {
      tab.setAttribute('aria-selected', String(i === index));
      tab.tabIndex = i === index ? 0 : -1;
    });
    active = index;
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
      panels[index].animate([
        { opacity: 0, transform: `translateX(${direction * 35}px)` },
        { opacity: 1, transform: 'translateX(0)' }
      ], { duration: 240, easing: 'ease-out' });
    }
    if (focus) tabs[index].focus({ preventScroll: true });
  }
  tabs.forEach((tab, index) => {
    tab.id = `tab-${keys[index]}`;
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-controls', keys[index]);
    tab.removeAttribute('aria-current');
    tab.addEventListener('click', event => { event.preventDefault(); select(index); });
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (active + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (active + tabs.length - 1) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next !== undefined) { event.preventDefault(); select(next, true); }
    });
  });
  document.querySelectorAll('.next > a').forEach(link => {
    link.addEventListener('click', event => {
      const index = keys.indexOf(link.hash.slice(1));
      if (index < 0) return;
      event.preventDefault();
      select(index, true);
      nav.scrollIntoView({ block: 'start', behavior: 'instant' });
    });
  });
  const requestedTab = new URLSearchParams(location.search).get('tab') || location.hash.slice(1);
  const initial = keys.indexOf(requestedTab);
  select(initial >= 0 ? initial : 0);
})();
