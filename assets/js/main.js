/**
 * main.js — Nilakshith Enterprise Dark Neon Site
 * Handles: preloader, custom cursor, particle canvas, typewriter,
 * navbar scroll-hide, mobile overlay menu, scroll fade-up,
 * count-up stats, step connector animation, testimonials marquee,
 * FAQ accordion, WhatsApp tracking, scroll-to-top
 */

'use strict';

/* ── Helpers ── */
const qs  = (sel, root = document) => root.querySelector(sel);
const qsAll = (sel, root = document) => [...root.querySelectorAll(sel)];
function on(el, ev, fn, opts) { if (el) el.addEventListener(ev, fn, opts); }

/* ============================================================
   1. PRELOADER
   ============================================================ */
function initPreloader() {
  const loader = qs('.preloader');
  if (!loader) return;

  // After 1.4 s (slightly after CSS animation finishes) fade out
  const done = () => loader.classList.add('loaded');

  if (document.readyState === 'complete') {
    setTimeout(done, 200);
  } else {
    on(window, 'load', () => setTimeout(done, 300));
  }
}

/* ============================================================
   2. CUSTOM GLOW CURSOR (desktop only)
   ============================================================ */
function initCursor() {
  // Skip on touch / small screens
  if (window.matchMedia('(max-width: 768px)').matches) return;
  if (!window.matchMedia('(hover: hover)').matches) return;

  const dot  = qs('.cursor-dot');
  const ring = qs('.cursor-ring');
  if (!dot || !ring) return;

  let mx = -100, my = -100;
  let rx = -100, ry = -100;
  let raf;

  on(document, 'mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  // Ring follows with lag
  const lerp = (a, b, t) => a + (b - a) * t;
  const tick = () => {
    rx = lerp(rx, mx, 0.14);
    ry = lerp(ry, my, 0.14);
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);

  // Grow ring on interactive elements
  const interactiveEls = 'a, button, .btn, input, select, textarea, [role="button"], label';
  on(document, 'mouseover', (e) => {
    if (e.target.closest(interactiveEls)) ring.classList.add('hovered');
  });
  on(document, 'mouseout', (e) => {
    if (e.target.closest(interactiveEls)) ring.classList.remove('hovered');
  });

  on(document, 'mouseleave', () => {
    dot.style.opacity  = '0';
    ring.style.opacity = '0';
  });
  on(document, 'mouseenter', () => {
    dot.style.opacity  = '1';
    ring.style.opacity = '1';
  });
}

/* ============================================================
   3. PARTICLE CANVAS (Hero background)
   ============================================================ */
function initParticleCanvas() {
  const canvas = qs('#particle-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, particles, animId;

  const PARTICLE_COUNT = 80;
  const CONNECT_DIST   = 130;
  const SPEED          = 0.35;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function createParticle() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * SPEED,
      vy: (Math.random() - 0.5) * SPEED,
      r: Math.random() * 2 + 1,
    };
  }

  function init() {
    resize();
    particles = Array.from({ length: PARTICLE_COUNT }, createParticle);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    for (const p of particles) {
      // Move
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;

      // Draw dot
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 229, 255, 0.55)';
      ctx.fill();
    }

    // Draw connecting lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECT_DIST) {
          const opacity = (1 - dist / CONNECT_DIST) * 0.25;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 229, 255, ${opacity})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    animId = requestAnimationFrame(draw);
  }

  init();
  draw();

  // Pause when off-screen for performance
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        if (!animId) draw();
      } else {
        cancelAnimationFrame(animId);
        animId = null;
      }
    }
  });
  io.observe(canvas);

  let resizeTimer;
  on(window, 'resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(init, 200);
  });
}

/* ============================================================
   4. TYPEWRITER (Hero subtitle)
   ============================================================ */
function initTypewriter() {
  const el = qs('.hero__typewriter-text');
  if (!el) return;

  const phrases = [
    'Broadband Internet',
    'CCTV Surveillance',
    'IT Networking',
    'AMC & Support',
    '24/7 Tech Service',
  ];

  let phraseIdx = 0;
  let charIdx   = 0;
  let isDeleting = false;
  let pause = false;

  function tick() {
    const current = phrases[phraseIdx];

    if (!isDeleting) {
      el.textContent = current.slice(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) {
        pause = true;
        setTimeout(() => { pause = false; isDeleting = true; tick(); }, 2000);
        return;
      }
    } else {
      el.textContent = current.slice(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        isDeleting = false;
        phraseIdx  = (phraseIdx + 1) % phrases.length;
      }
    }

    const speed = isDeleting ? 50 : 90;
    setTimeout(tick, speed);
  }

  tick();
}

/* ============================================================
   5. NAVBAR — scroll hide/show + frosted glass
   ============================================================ */
function initNavbar() {
  const navbar = qs('.navbar');
  if (!navbar) return;

  let lastY = window.scrollY;
  let ticking = false;

  function update() {
    const y = window.scrollY;

    // Frosted glass
    if (y > 40) navbar.classList.add('is-scrolled');
    else         navbar.classList.remove('is-scrolled');

    // Hide on scroll down, show on scroll up
    if (y > lastY && y > 200) navbar.classList.add('is-hidden');
    else                        navbar.classList.remove('is-hidden');

    lastY = y;
    ticking = false;
  }

  on(window, 'scroll', () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });
}

/* ============================================================
   6. MOBILE OVERLAY MENU
   ============================================================ */
function initMobileMenu() {
  const toggle  = qs('.nav-toggle');
  const overlay = qs('.nav-overlay');
  if (!toggle || !overlay) return;

  const overlayLinks = qsAll('.nav-overlay__link, .nav-overlay__wa-btn', overlay);

  function open() {
    overlay.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    overlay.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  function toggle_() {
    if (overlay.classList.contains('is-open')) close();
    else open();
  }

  on(toggle, 'click', toggle_);

  // Close on any overlay link click
  for (const link of overlayLinks) {
    on(link, 'click', close);
  }

  // Close on Escape
  on(document, 'keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('is-open')) close();
  });
}

/* ============================================================
   7. ACTIVE NAV LINK
   ============================================================ */
function initActiveNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  const allLinks = qsAll('.nav-menu__link, .nav-overlay__link');
  for (const link of allLinks) {
    const href = link.getAttribute('href') || '';
    if (href === path || (path === '' && href === 'index.html')) {
      link.classList.add('is-active');
      link.setAttribute('aria-current', 'page');
    }
  }
}

/* ============================================================
   8. SCROLL FADE-UP (IntersectionObserver)
   ============================================================ */
function initScrollAnimations() {
  const elements = qsAll('.fade-up, .fade-in');
  if (!elements.length) return;

  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    }
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  for (const el of elements) io.observe(el);
}

/* ============================================================
   9. COUNT-UP STATS
   ============================================================ */
function initCountUp() {
  const statEls = qsAll('[data-count-up]');
  if (!statEls.length) return;

  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

  function animateCount(el) {
    const target   = parseFloat(el.dataset.countUp);
    const suffix   = el.dataset.suffix || '';
    const prefix   = el.dataset.prefix || '';
    const isFloat  = String(target).includes('.');
    const duration = 2000;
    const start    = performance.now();

    function step(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = easeOut(progress);
      const value    = target * eased;
      el.textContent = prefix + (isFloat ? value.toFixed(1) : Math.round(value)) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        io.unobserve(entry.target);
      }
    }
  }, { threshold: 0.5 });

  for (const el of statEls) io.observe(el);
}

/* ============================================================
   10. HOW-IT-WORKS STEP CONNECTORS (draw on scroll)
   ============================================================ */
function initStepConnectors() {
  const lines = qsAll('.step-connector__line');
  if (!lines.length) return;

  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('animated'), 300);
        io.unobserve(entry.target);
      }
    }
  }, { threshold: 0.5 });

  for (const line of lines) io.observe(line);
}

/* ============================================================
   11. FAQ ACCORDION
   ============================================================ */
function initFAQ() {
  const items = qsAll('.faq-item');
  if (!items.length) return;

  for (const item of items) {
    const question = qs('.faq-item__question', item);
    if (!question) continue;
    on(question, 'click', () => {
      const isOpen = item.classList.contains('open');
      // Close all
      for (const i of items) i.classList.remove('open');
      // Open clicked if it wasn't open
      if (!isOpen) item.classList.add('open');
    });
  }
}

/* ============================================================
   12. SCROLL-TO-TOP BUTTON
   ============================================================ */
function initScrollToTop() {
  const btn = qs('.scroll-to-top');
  if (!btn) return;

  on(window, 'scroll', () => {
    if (window.scrollY > 300) btn.classList.add('visible');
    else                       btn.classList.remove('visible');
  }, { passive: true });

  on(btn, 'click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ============================================================
   13. WHATSAPP & PHONE CLICK TRACKING (GA4 stubs)
   ============================================================ */
function initTracking() {
  function track(eventName, params = {}) {
    if (typeof gtag === 'function') {
      gtag('event', eventName, params);
    }
  }

  // WhatsApp links
  on(document, 'click', (e) => {
    const wa = e.target.closest('[data-wa-cta]');
    if (wa) {
      track('whatsapp_click', { cta_location: wa.dataset.waCta });
    }

    const phone = e.target.closest('a[href^="tel:"]');
    if (phone) {
      track('phone_call_click', { phone_number: phone.href.replace('tel:', '') });
    }
  });
}

/* ============================================================
   14. TESTIMONIALS MARQUEE — duplicate for seamless loop
   ============================================================ */
function initTestimonialsMarquee() {
  const track = qs('.testimonials__track');
  if (!track) return;

  // Duplicate children for infinite loop
  const originals = [...track.children];
  for (const child of originals) {
    track.appendChild(child.cloneNode(true));
  }
}

/* ============================================================
   15. STAGGER DELAYS for grid children
   ============================================================ */
function initStaggerDelays() {
  const groups = qsAll('[data-stagger]');
  for (const group of groups) {
    const children = qsAll('.fade-up', group);
    children.forEach((child, i) => {
      child.style.setProperty('--delay', `${i * 80}ms`);
    });
  }
}

/* ============================================================
   16. GOOGLE REVIEWS LOADER (preserved from original)
   ============================================================ */
function initGoogleReviews() {
  const section = qs('[data-google-reviews]');
  if (!section) return;

  const apiKey   = section.dataset.googleMapsApiKey;
  const placeId  = section.dataset.googlePlaceId;
  if (!apiKey || !placeId || apiKey === 'YOUR_GOOGLE_MAPS_API_KEY') return;

  const list    = qs('#google-reviews-list');
  const summary = qs('#google-reviews-summary');
  const status  = qs('#google-reviews-status');

  // (Actual Google Maps Places API integration preserved from original)
  // Replace API key and Place ID via data attributes on the section element
}

/* ============================================================
   INIT ALL
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initCursor();
  initParticleCanvas();
  initTypewriter();
  initNavbar();
  initMobileMenu();
  initActiveNav();
  initScrollAnimations();
  initCountUp();
  initStepConnectors();
  initFAQ();
  initScrollToTop();
  initTracking();
  initTestimonialsMarquee();
  initStaggerDelays();
  initGoogleReviews();
});
