// ─────────────────────────────────────────
//  DUCK.BRS — script.js
//  Shared across index.html & photos.html
// ─────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {

  const isTouchDevice = () => window.matchMedia('(hover: none) and (pointer: coarse)').matches;

  // ─── Scroll-lock helpers (preserve scroll position) ──
  let _lockScrollY = 0;
  function lockScroll() {
    _lockScrollY = window.scrollY;
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${_lockScrollY}px`;
    document.body.style.width = '100%';
  }
  function unlockScroll() {
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    window.scrollTo(0, _lockScrollY);
  }

  // ─── Custom Cursor (desktop only) ────────
  const cursor = document.getElementById('cursor');
  const ring   = document.getElementById('cursorRing');

  if (cursor && ring && !isTouchDevice()) {
    let mx = 0, my = 0, rx = 0, ry = 0;
    cursor.style.opacity = '0';
    ring.style.opacity   = '0';

    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      cursor.style.left    = mx + 'px';
      cursor.style.top     = my + 'px';
      cursor.style.opacity = '1';
      ring.style.opacity   = '0.5';
    });

    function animateRing() {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';
      requestAnimationFrame(animateRing);
    }
    animateRing();

    document.querySelectorAll('a, button, .event-card, .stat-box, .gallery-item, .collection-card').forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('expand'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('expand'));
    });
  }


  // ─── Burger / Side Drawer ─────────────────
  const burger        = document.getElementById('burger');
  const sideDrawer    = document.getElementById('sideDrawer');
  const drawerOverlay = document.getElementById('drawerOverlay');
  const nav           = document.querySelector('nav');

  function openDrawer() {
    burger.classList.add('open');
    sideDrawer.classList.add('open');
    drawerOverlay.classList.add('open');
    // Show nav solidly when drawer is open (counteracts the hide-on-scroll)
    if (nav) {
      nav.style.transform  = 'translateY(0)';
      nav.style.background = 'rgba(0,0,0,0.92)';
    }
    lockScroll();
  }
  function closeDrawer() {
    burger.classList.remove('open');
    sideDrawer.classList.remove('open');
    drawerOverlay.classList.remove('open');
    if (nav) nav.style.background = '';
    unlockScroll();
  }

  if (burger && sideDrawer) {
    burger.addEventListener('click', () => {
      burger.classList.contains('open') ? closeDrawer() : openDrawer();
    });
    if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDrawer(); });
  }


  // ─── Hero Slideshow ───────────────────────
  const heroSlides = document.querySelectorAll('.hero-slide');
  const heroDots   = document.querySelectorAll('.hero-dot');

  if (heroSlides.length > 0) {
    let currentSlide = 0;
    let slideshowTimer;

    function goToSlide(idx) {
      heroSlides[currentSlide].classList.remove('active');
      if (heroDots[currentSlide]) heroDots[currentSlide].classList.remove('active');
      currentSlide = ((idx % heroSlides.length) + heroSlides.length) % heroSlides.length;
      heroSlides[currentSlide].classList.add('active');
      if (heroDots[currentSlide]) heroDots[currentSlide].classList.add('active');
    }

    function startSlideshow() {
      clearInterval(slideshowTimer);
      slideshowTimer = setInterval(() => goToSlide(currentSlide + 1), 5000);
    }

    goToSlide(0);
    startSlideshow();

    heroDots.forEach((dot, i) => {
      dot.addEventListener('click', () => { goToSlide(i); startSlideshow(); });
    });

    // Touch swipe on hero
    let heroTouchStartX = 0;
    const heroEl = document.querySelector('.hero');
    if (heroEl) {
      heroEl.addEventListener('touchstart', e => {
        heroTouchStartX = e.touches[0].clientX;
      }, { passive: true });
      heroEl.addEventListener('touchend', e => {
        const dx = e.changedTouches[0].clientX - heroTouchStartX;
        if (Math.abs(dx) > 40) {
          goToSlide(currentSlide + (dx < 0 ? 1 : -1));
          startSlideshow();
        }
      }, { passive: true });
    }
  }


  // ─── Scroll Reveal ───────────────────────
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('visible'), i * 80);
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(el => revealObserver.observe(el));
  }


  // ─── Parallax Hero Grid (desktop) ─────────
  const heroGrid = document.querySelector('.hero-grid');
  if (heroGrid && !isTouchDevice()) {
    window.addEventListener('scroll', () => {
      heroGrid.style.transform = `translateY(${window.scrollY * 0.3}px)`;
    }, { passive: true });
  }


  // ─── Hero Wordmark Glitch on Hover ────────
  const heroWordmark = document.getElementById('heroWordmark');
  if (heroWordmark && !isTouchDevice()) {
    let glitching = false;
    heroWordmark.addEventListener('mouseenter', () => {
      if (glitching) return;
      glitching = true;
      let frames = 0;
      heroWordmark.style.transition = 'none';
      const glitch = setInterval(() => {
        const x = (Math.random() - 0.5) * 100;
        const y = (Math.random() - 0.5) * 40;
        heroWordmark.style.transform = `translate(${x}px, ${y}px)`;
        heroWordmark.style.textShadow =
          `${x * 2}px 0 0 rgba(200,168,75,0.9),` +
          `${-x * 2}px 0 0 rgba(255,255,255,0.5),` +
          `0 0 30px rgba(200,168,75,0.4)`;
        frames++;
        if (frames > 10) {
          clearInterval(glitch);
          heroWordmark.style.transition = 'transform 0.3s ease, text-shadow 0.3s ease';
          heroWordmark.style.transform  = '';
          heroWordmark.style.textShadow = '0 0 100px rgba(0,0,0,0.7), 0 2px 30px rgba(0,0,0,0.5)';
          glitching = false;
        }
      }, 55);
    });
  }


  // ─── Nav hide on scroll down, show on scroll up ──
  if (nav) {
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const curr = window.scrollY;
      // Never hide nav while drawer is open
      if (sideDrawer && sideDrawer.classList.contains('open')) return;
      if (curr > 120 && curr > lastScroll) {
        nav.style.transform  = 'translateY(-100%)';
        nav.style.transition = 'transform 0.4s ease';
      } else {
        nav.style.transform  = 'translateY(0)';
        nav.style.transition = 'transform 0.3s ease';
      }
      lastScroll = curr;
    }, { passive: true });
  }


  // ─── Card tilt effect (desktop only) ──────
  if (!isTouchDevice()) {
    document.querySelectorAll('.collection-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 12;
        const y = ((e.clientY - rect.top)  / rect.height - 0.5) * -12;
        card.style.transform  = `perspective(600px) rotateY(${x}deg) rotateX(${y}deg)`;
        card.style.transition = 'transform 0.1s ease';
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform  = '';
        card.style.transition = 'transform 0.5s ease';
      });
    });
  }


  // ─── Marquee pause on hover ───────────────
  const marqueeTrack = document.getElementById('marqueeTrack');
  if (marqueeTrack) {
    marqueeTrack.addEventListener('mouseenter', () => {
      marqueeTrack.style.animationPlayState = 'paused';
    });
    marqueeTrack.addEventListener('mouseleave', () => {
      marqueeTrack.style.animationPlayState = 'running';
    });
  }


  // ─── Gallery Filter ───────────────────────
  const filterBtns   = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  if (filterBtns.length && galleryItems.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        galleryItems.forEach(item => {
          const match = filter === 'all' || item.dataset.category === filter;
          item.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
          if (match) {
            item.style.display = 'block';
            requestAnimationFrame(() => { item.style.opacity = '1'; item.style.transform = 'scale(1)'; });
          } else {
            item.style.opacity = '0'; item.style.transform = 'scale(0.96)';
            setTimeout(() => { if (item.style.opacity === '0') item.style.display = 'none'; }, 360);
          }
        });
      });
    });
  }


  // ─── Legacy lightbox (old gallery grid) ───
  const lightbox      = document.getElementById('lightbox');
  const lightboxImg   = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  if (lightbox && lightboxImg && lightboxClose) {
    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        lightboxImg.src = item.querySelector('img').src;
        lightboxImg.alt = item.dataset.label || '';
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    });
    const closeLegacyLB = () => { lightbox.classList.remove('open'); document.body.style.overflow = ''; };
    lightboxClose.addEventListener('click', closeLegacyLB);
    lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLegacyLB(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLegacyLB(); });
  }

});