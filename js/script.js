/* =========================================================
   MASRAM — 2026 LUXURY INTERACTIONS
   Premium animations, counters, and UI enhancements
   ========================================================= */

(function () {
  'use strict';

  /* ---------- 1. PRELOADER ---------- */
  window.addEventListener('load', function () {
    const preloader = document.getElementById('preloader');
    if (preloader) {
      setTimeout(() => preloader.classList.add('hidden'), 400);
    }
  });

  /* ---------- 2. STICKY NAVBAR ---------- */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    const handleScroll = () => {
      if (window.scrollY > 60) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  /* ---------- 3. INTERSECTION OBSERVER — FADE ANIMATIONS ---------- */
  const animatedElements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .scale-in');

  if ('IntersectionObserver' in window && animatedElements.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );
    animatedElements.forEach((el) => observer.observe(el));
  } else {
    animatedElements.forEach((el) => el.classList.add('visible'));
  }

  /* ---------- 4. ANIMATED COUNTERS ---------- */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length > 0 && 'IntersectionObserver' in window) {
    const animateCounter = (el) => {
      const target = parseInt(el.getAttribute('data-count'), 10);
      const duration = 2000;
      const startTime = performance.now();
      const step = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target).toLocaleString();
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach((c) => counterObserver.observe(c));
  }

  /* ---------- 5. BACK TO TOP ---------- */
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    const toggleBtn = () => {
      backToTop.style.display = window.scrollY > 400 ? 'flex' : 'none';
    };
    window.addEventListener('scroll', toggleBtn, { passive: true });
    toggleBtn();
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- 6. SMOOTH SCROLL FOR ANCHOR LINKS ---------- */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ---------- 7. ACTIVE NAV LINK ON SCROLL ---------- */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
  if (sections.length > 0 && navLinks.length > 0) {
    const activateLink = () => {
      const scrollY = window.scrollY + 120;
      sections.forEach((section) => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');
        if (scrollY >= top && scrollY < top + height) {
          navLinks.forEach((link) => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `${id}.html` || link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            }
          });
        }
      });
    };
    window.addEventListener('scroll', activateLink, { passive: true });
  }

  /* ---------- 8. PARALLAX HERO (subtle) ---------- */
  const heroVideo = document.querySelector('.hero-video');
  if (heroVideo && window.matchMedia('(min-width: 992px)').matches) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      if (scrolled < window.innerHeight) {
        heroVideo.style.transform = `translate(-50%, calc(-50% + ${scrolled * 0.3}px))`;
      }
    }, { passive: true });
  }

  /* ---------- 9. FORM SUBMISSION FEEDBACK ---------- */
  document.querySelectorAll('form').forEach((form) => {
    form.addEventListener('submit', function () {
      const btn = this.querySelector('button[type="submit"]');
      if (btn) {
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Sending...';
        btn.disabled = true;
        setTimeout(() => {
          btn.innerHTML = originalHTML;
          btn.disabled = false;
        }, 5000);
      }
    });
  });

  /* ---------- 10. LIGHTBOX (for gallery.html) ---------- */
  const galleryItems = document.querySelectorAll('.gallery-item img');
  const overlay = document.getElementById('lightboxOverlay');
  const lightboxImg = document.getElementById('lightboxImg');

  if (galleryItems.length > 0 && overlay && lightboxImg) {
    let currentIndex = 0;
    const items = Array.from(galleryItems);

    const openLightbox = (index) => {
      currentIndex = index;
      // Use getAttribute to ensure we get the actual src, especially with lazy loading
      lightboxImg.src = items[currentIndex].getAttribute('src') || items[currentIndex].src;
      overlay.classList.add('show');
      document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
      overlay.classList.remove('show');
      document.body.style.overflow = '';
    };

    items.forEach((img, i) => {
      img.closest('.gallery-item').addEventListener('click', (e) => {
        e.preventDefault();
        openLightbox(i);
      });
    });

    document.getElementById('closeLightbox')?.addEventListener('click', closeLightbox);
    
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeLightbox();
    });

    document.getElementById('prevLightbox')?.addEventListener('click', (e) => {
      e.stopPropagation();
      currentIndex = (currentIndex - 1 + items.length) % items.length;
      lightboxImg.src = items[currentIndex].getAttribute('src') || items[currentIndex].src;
    });

    document.getElementById('nextLightbox')?.addEventListener('click', (e) => {
      e.stopPropagation();
      currentIndex = (currentIndex + 1) % items.length;
      lightboxImg.src = items[currentIndex].getAttribute('src') || items[currentIndex].src;
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!overlay.classList.contains('show')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') document.getElementById('prevLightbox')?.click();
      if (e.key === 'ArrowRight') document.getElementById('nextLightbox')?.click();
    });

    // Touch swipe
    let startX = 0;
    lightboxImg.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
    }, { passive: true });
    
    lightboxImg.addEventListener('touchend', (e) => {
      const endX = e.changedTouches[0].clientX;
      if (endX - startX > 50) {
        document.getElementById('prevLightbox')?.click();
      } else if (startX - endX > 50) {
        document.getElementById('nextLightbox')?.click();
      }
    }, { passive: true });
  }

  /* ---------- 11. EVENTS POPUP (for events.html) ---------- */
  window.openPopup = function (src) {
    const popupImg = document.getElementById('popupImg');
    const popupOverlay = document.getElementById('popupOverlay');
    if (popupImg && popupOverlay) {
      popupImg.src = src;
      popupOverlay.classList.add('show');
      document.body.style.overflow = 'hidden';
    }
  };

  const closePopupBtn = document.getElementById('closePopup');
  const popupOverlayEl = document.getElementById('popupOverlay');
  
  if (closePopupBtn) {
    closePopupBtn.addEventListener('click', () => {
      popupOverlayEl?.classList.remove('show');
      document.body.style.overflow = '';
    });
  }
  
  if (popupOverlayEl) {
    popupOverlayEl.addEventListener('click', (e) => {
      if (e.target === popupOverlayEl) {
        popupOverlayEl.classList.remove('show');
        document.body.style.overflow = '';
      }
    });
  }

})();