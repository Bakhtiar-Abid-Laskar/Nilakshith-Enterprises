/**
 * main.js — Nilakshith Enterprise Unified Script
 * Handles: preloader, scroll reveal animations, navbar scroll state,
 * mobile drawer menu with focus trap, counter animation, FAQ accordion,
 * active page highlights, and WhatsApp floating tooltip.
 */

'use strict';

// Helpers
const qs = (sel, root = document) => root.querySelector(sel);
const qsAll = (sel, root = document) => [...root.querySelectorAll(sel)];

/**
 * 1. PRELOADER
 */
function initPreloader() {
  const loader = qs('.preloader');
  if (!loader) return;

  const done = () => loader.classList.add('loaded');

  if (document.readyState === 'complete') {
    setTimeout(done, 200);
  } else {
    window.addEventListener('load', () => setTimeout(done, 300));
  }
}

/**
 * 2. NAVBAR SCROLL CLASS
 */
function initNavScroll() {
  const nav = qs('.navbar');
  if (!nav) return;

  const handleScroll = () => {
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Check immediately on load
}

/**
 * 3. MOBILE MENU DRAWER (with focus trap)
 */
function initMobileMenu() {
  const toggle = qs('.nav-toggle');
  const overlay = qs('.nav-overlay');
  const drawer = qs('.nav-drawer');
  if (!toggle || !overlay || !drawer) return;

  const focusableElements = drawer.querySelectorAll('a, button');
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  function openMenu() {
    toggle.classList.add('open');
    overlay.classList.add('open');
    drawer.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    if (firstFocusable) firstFocusable.focus();
  }

  function closeMenu() {
    toggle.classList.remove('open');
    overlay.classList.remove('open');
    drawer.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  toggle.addEventListener('click', () => {
    if (drawer.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  overlay.addEventListener('click', closeMenu);

  // Escape key closes drawer
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      closeMenu();
      toggle.focus();
    }
  });

  // Focus trap inside drawer
  drawer.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          if (lastFocusable) lastFocusable.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          if (firstFocusable) firstFocusable.focus();
          e.preventDefault();
        }
      }
    }
  });
}

/**
 * 4. ACTIVE NAV LINK HIGHLIGHT
 */
function initActiveNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  const allLinks = qsAll('.nav-menu__link, .nav-drawer__link');
  allLinks.forEach((link) => {
    const href = link.getAttribute('href') || '';
    if (href === path || (path === '' && href === 'index.html')) {
      link.classList.add('is-active');
      link.setAttribute('aria-current', 'page');
    } else {
      link.classList.remove('is-active');
      link.removeAttribute('aria-current');
    }
  });
}

/**
 * 5. SCROLL REVEAL ANIMATIONS (IntersectionObserver)
 */
function initScrollAnimations() {
  const elements = qsAll('[data-animate]');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -20px 0px'
  });

  elements.forEach((el) => observer.observe(el));
}

/**
 * 6. NUMERICAL COUNTERS ANIMATION
 */
function initCounters() {
  const counters = qsAll('[data-count-up]');
  if (!counters.length) return;

  const easeOut = (t) => 1 - Math.pow(1 - t, 3);

  const animate = (el) => {
    const target = parseFloat(el.getAttribute('data-count-up'));
    const suffix = el.getAttribute('data-suffix') || '';
    const prefix = el.getAttribute('data-prefix') || '';
    const isFloat = String(target).includes('.');
    const duration = 2000;
    const start = performance.now();

    const step = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOut(progress);
      const value = target * eased;
      el.textContent = prefix + (isFloat ? value.toFixed(1) : Math.round(value)) + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animate(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach((c) => observer.observe(c));
}

/**
 * 7. FAQ ACCORDION (Subpages)
 */
function initFAQ() {
  const items = qsAll('.faq-item');
  if (!items.length) return;

  items.forEach((item) => {
    const question = qs('.faq-item__question', item);
    const answer = qs('.faq-item__answer', item);
    if (!question || !answer) return;

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all other FAQs (accordion functionality)
      items.forEach((otherItem) => {
        if (otherItem !== item) {
          otherItem.classList.remove('open');
          const otherAnswer = qs('.faq-item__answer', otherItem);
          if (otherAnswer) otherAnswer.style.maxHeight = '';
        }
      });

      if (isOpen) {
        item.classList.remove('open');
        answer.style.maxHeight = '';
      } else {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
}

/**
 * 8. SCROLL TO TOP BUTTON
 */
function initScrollToTop() {
  const btn = qs('.scroll-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/**
 * 9. FLOATING WHATSAPP BUTTON ACCESSIBILITY
 */
function initFloatingWhatsApp() {
  const wrapper = qs('.wa-float-wrapper');
  const tooltip = qs('.wa-tooltip');
  if (!wrapper || !tooltip) return;

  const fab = qs('.wa-float', wrapper);
  if (fab) {
    fab.addEventListener('focus', () => {
      tooltip.style.opacity = '1';
      tooltip.style.transform = 'translateX(0)';
    });
    fab.addEventListener('blur', () => {
      tooltip.style.opacity = '';
      tooltip.style.transform = '';
    });
  }
}

/**
 * 10. STEP DASHED LINE CONNECTOR ANIMATION
 */
function initStepConnectors() {
  const lines = qsAll('.step-connector__line');
  if (!lines.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('animated'), 300);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  lines.forEach((line) => observer.observe(line));
}

// Initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initNavScroll();
  initMobileMenu();
  initActiveNav();
  initScrollAnimations();
  initCounters();
  initFAQ();
  initScrollToTop();
  initFloatingWhatsApp();
  initStepConnectors();
});
