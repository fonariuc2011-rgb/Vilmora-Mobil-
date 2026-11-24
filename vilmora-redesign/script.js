(() => {
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const loader = $('.preloader');
  const count = $('.loader-count');
  let n = 0;
  const countTimer = window.setInterval(() => { n = Math.min(100, n + Math.ceil(Math.random()*17)); if(count) count.textContent = String(n).padStart(2,'0'); if(n>=100) window.clearInterval(countTimer); }, 75);
  const hideLoader = () => { if(loader) loader.classList.add('done'); document.body.classList.add('loaded'); };
  window.addEventListener('load', () => window.setTimeout(hideLoader, reduceMotion ? 0 : 650), {once:true});
  window.setTimeout(hideLoader, 2400);

  // Mobile navigation: closes on selection, Escape and outside navigation.
  const menuButton = $('.menu-toggle');
  const mobileMenu = $('.mobile-menu');
  const setMenu = (open) => {
    if(!menuButton || !mobileMenu) return;
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Închide meniul' : 'Deschide meniul');
    mobileMenu.classList.toggle('open', open);
    mobileMenu.inert = !open;
    document.body.classList.toggle('menu-open', open);
  };
  menuButton?.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
  $$('.mobile-menu a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', e => { if(e.key === 'Escape') { setMenu(false); closeLightbox(); } });

  // Scroll progress and reveal-on-scroll.
  const progress = $('.scroll-progress span');
  let scrollQueued = false;
  const updateScroll = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if(progress) progress.style.width = `${max > 0 ? window.scrollY/max*100 : 0}%`;
    scrollQueued = false;
  };
  window.addEventListener('scroll', () => { if(!scrollQueued){scrollQueued=true;requestAnimationFrame(updateScroll);}}, {passive:true});
  updateScroll();
  const revealItems = $$('.reveal');
  if('IntersectionObserver' in window && !reduceMotion){
    const observer = new IntersectionObserver(entries => entries.forEach(entry => { if(entry.isIntersecting){entry.target.classList.add('in-view');observer.unobserve(entry.target);}}), {threshold:.12,rootMargin:'0px 0px -35px 0px'});
    revealItems.forEach(el => observer.observe(el));
  } else revealItems.forEach(el => el.classList.add('in-view'));

  // Subtle custom cursor and magnetic hover effects only on precise pointers.
  const cursor = $('.custom-cursor');
  const finePointer = window.matchMedia('(hover:hover) and (pointer:fine)').matches;
  if(cursor && finePointer && !reduceMotion){
    window.addEventListener('pointermove', e => {cursor.style.left=`${e.clientX}px`;cursor.style.top=`${e.clientY}px`;cursor.classList.add('visible');},{passive:true});
    document.addEventListener('pointerover', e => {if(e.target.closest('a,button,summary'))cursor.classList.add('active');});
    document.addEventListener('pointerout', e => {if(e.target.closest('a,button,summary'))cursor.classList.remove('active');});
  }
  if(finePointer && !reduceMotion){
    $$('.magnetic').forEach(el => {
      el.addEventListener('pointermove', e => {const r=el.getBoundingClientRect();const x=e.clientX-r.left-r.width/2;const y=e.clientY-r.top-r.height/2;el.style.transform=`translate(${x*.08}px,${y*.12}px)`;});
      el.addEventListener('pointerleave', () => {el.style.transform='';});
    });
  }

  // Accessible image lightbox.
  const lightbox = $('.lightbox');
  const lightboxImg = $('img', lightbox);
  const lightboxCaption = $('p', lightbox);
  const closeButton = $('.lightbox-close');
  const closeLightbox = () => { if(lightbox?.open) lightbox.close(); };
  $$('.project-card[data-lightbox]').forEach(card => card.addEventListener('click', () => {
    if(!lightbox) return;
    lightboxImg.src = card.dataset.lightbox;
    lightboxImg.alt = card.querySelector('img')?.alt || card.dataset.caption || 'Lucrare Vilmora Mobilă';
    lightboxCaption.textContent = card.dataset.caption || '';
    if(typeof lightbox.showModal === 'function') lightbox.showModal();
  }));
  closeButton?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', e => { if(e.target === lightbox) closeLightbox(); });

  // Keep only one FAQ item open at a time for a cleaner reading flow.
  $$('.faq-item').forEach(item => item.addEventListener('toggle', () => {
    if(item.open) $$('.faq-item').forEach(other => {if(other !== item) other.open = false;});
  }));
  const year = $('#year'); if(year) year.textContent = new Date().getFullYear();
})();
