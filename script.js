// ─────────────────────────────────────────
//  PEAK 22° — script.js
//  Shared across index.html & photos.html
// ─────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {

  // ─── Custom Cursor ───────────────────────
  const cursor = document.getElementById('cursor');
  const ring   = document.getElementById('cursorRing');

  if (cursor && ring) {
    let mx = 0, my = 0, rx = 0, ry = 0;

    // Hide until mouse moves so it doesn't sit at 0,0 on load
    cursor.style.opacity = '0';
    ring.style.opacity   = '0';

    document.addEventListener('mousemove', e => {
      mx = e.clientX;
      my = e.clientY;
      cursor.style.left    = mx + 'px';
      cursor.style.top     = my + 'px';
      cursor.style.opacity = '1';
      ring.style.opacity   = '0.6';
    });

    function animateRing() {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';
      requestAnimationFrame(animateRing);
    }
    animateRing();

    document.querySelectorAll('a, button, .event-card, .stat-box, .gallery-item').forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('expand'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('expand'));
    });
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
    }, {
      threshold: 0,
      rootMargin: '0px 0px -40px 0px'
    });

    reveals.forEach(el => revealObserver.observe(el));
  }


  // ─── Parallax Hero Grid (index only) ─────
  const heroGrid = document.querySelector('.hero-grid');

  if (heroGrid) {
    window.addEventListener('scroll', () => {
      heroGrid.style.transform = `translateY(${window.scrollY * 0.3}px)`;
    }, { passive: true });
  }


  // ─── Hero Logo Glitch on Hover (index only) ─────
  // No invert — logo uses mix-blend-mode:screen to drop the white bg.
  // Glitch = translate + chromatic aberration via drop-shadow only.
  const heroLogo = document.getElementById('heroLogo');

  if (heroLogo) {
    let glitching = false;

    heroLogo.addEventListener('mouseenter', () => {
      if (glitching) return;
      glitching = true;
      let frames = 0;
      heroLogo.style.transition = 'none';

      const glitch = setInterval(() => {
        const x = (Math.random() - 0.5) * 12;
        const y = (Math.random() - 0.5) * 6;
        heroLogo.style.transform = `translate(${x}px, ${y}px)`;
        heroLogo.style.filter    =
          `drop-shadow(${x * 1.5}px 0 0 rgba(42,191,191,0.9)) ` +
          `drop-shadow(${-x * 1.5}px 0 0 rgba(255,255,255,0.5)) ` +
          `drop-shadow(0 0 24px rgba(42,191,191,0.4))`;

        frames++;
        if (frames > 10) {
          clearInterval(glitch);
          heroLogo.style.transition = 'transform 0.3s ease, filter 0.3s ease';
          heroLogo.style.transform  = '';
          heroLogo.style.filter     = 'drop-shadow(0 0 50px rgba(42,191,191,0.35))';
          glitching = false;
        }
      }, 55);
    });
  }


  // ─── Gallery Filter (photos only) ────────
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
            requestAnimationFrame(() => {
              item.style.opacity   = '1';
              item.style.transform = 'scale(1)';
            });
          } else {
            item.style.opacity   = '0';
            item.style.transform = 'scale(0.96)';
            setTimeout(() => {
              if (item.style.opacity === '0') item.style.display = 'none';
            }, 360);
          }
        });
      });
    });
  }


  // ─── Lightbox (photos only) ──────────────
  const lightbox      = document.getElementById('lightbox');
  const lightboxImg   = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');

  if (lightbox && lightboxImg && lightboxClose) {

    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        const src   = item.querySelector('img').src;
        const label = item.dataset.label || '';
        lightboxImg.src = src;
        lightboxImg.alt = label;
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    });

    function closeLightbox() {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    }

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', e => {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeLightbox();
    });
  }

});