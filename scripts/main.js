document.addEventListener('DOMContentLoaded', function () {
  // Smooth appearance for hero
  const hero = document.querySelector('.hero');
  if (hero) {
    // wait a tick then add class to animate
    requestAnimationFrame(() => setTimeout(() => hero.classList.add('visible'), 150));
  }

  // Intersection Observer for reveal on scroll
  const observerOptions = { root: null, rootMargin: '0px 0px -10% 0px', threshold: 0.12 };
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.section .section-container, .content-box, .project').forEach(el => {
    el.classList.add('reveal');
    revealObserver.observe(el);
  });

  // Active nav highlighting based on scroll position
  const navLinks = Array.from(document.querySelectorAll('a.nav-button'));
  const sections = navLinks.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);

  function onScroll() {
    const middleY = window.innerHeight / 2 + window.scrollY;
    let currentIndex = -1;
    sections.forEach((sec, idx) => {
      const rect = sec.getBoundingClientRect();
      const top = rect.top + window.scrollY;
      const bottom = top + rect.height;
      if (middleY >= top && middleY < bottom) currentIndex = idx;
    });

    navLinks.forEach((link, idx) => {
      if (idx === currentIndex) link.classList.add('active'); else link.classList.remove('active');
    });
  }

  onScroll();
  window.addEventListener('scroll', throttle(onScroll, 120), { passive: true });

  // Simple throttle
  function throttle(fn, wait) {
    let last = 0;
    return function (...args) {
      const now = Date.now();
      if (now - last >= wait) {
        last = now;
        fn.apply(this, args);
      }
    };
  }

  // Helpful keyboard support for nav (space/enter)
  navLinks.forEach(a => a.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') a.click();
  }));
});
