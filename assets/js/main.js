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
 * 1. PRELOADER & SKELETON LOADER
 */
function initPreloader() {
  const loader = qs('.preloader');
  if (!loader) return;

  // Inject responsive skeleton screen layout matching the website structure
  loader.innerHTML = `
    <div class="skeleton-wrapper" aria-hidden="true">
      <div class="skeleton-header">
        <div class="skeleton-logo skeleton-pulse"></div>
        <div class="skeleton-nav skeleton-pulse"></div>
      </div>
      <div class="skeleton-hero">
        <div class="skeleton-hero-left">
          <div class="skeleton-badge skeleton-pulse"></div>
          <div class="skeleton-title skeleton-pulse"></div>
          <div class="skeleton-text skeleton-pulse"></div>
          <div class="skeleton-ctas">
            <div class="skeleton-btn skeleton-pulse"></div>
            <div class="skeleton-btn skeleton-pulse"></div>
          </div>
        </div>
        <div class="skeleton-hero-right skeleton-pulse"></div>
      </div>
    </div>
  `;

  const done = () => {
    loader.addEventListener('transitionend', () => {
      loader.remove();
    }, { once: true });
    loader.style.transition = 'opacity 0.3s ease';
    loader.style.opacity = '0';
    loader.setAttribute('aria-hidden', 'true');
  };

  if (document.readyState === 'complete') {
    done();
  } else {
    window.addEventListener('load', done);
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

    const mainEl = qs('#main');
    const footerEl = qs('footer');
    if (mainEl) mainEl.setAttribute('aria-hidden', 'true');
    if (footerEl) footerEl.setAttribute('aria-hidden', 'true');
  }

  function closeMenu() {
    toggle.classList.remove('open');
    overlay.classList.remove('open');
    drawer.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';

    const mainEl = qs('#main');
    const footerEl = qs('footer');
    if (mainEl) mainEl.removeAttribute('aria-hidden');
    if (footerEl) footerEl.removeAttribute('aria-hidden');
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

  items.forEach((item, idx) => {
    const question = qs('.faq-item__question', item);
    const answer = qs('.faq-item__answer', item);
    if (!question || !answer) return;

    // Set unique IDs for relation mapping
    const questionId = question.id || `faq-q-${idx}`;
    const answerId = answer.id || `faq-a-${idx}`;
    question.id = questionId;
    answer.id = answerId;

    // Dynamic A11y attributes
    question.setAttribute('tabindex', '0');
    question.setAttribute('role', 'button');
    question.setAttribute('aria-expanded', 'false');
    question.setAttribute('aria-controls', answerId);

    function toggleFAQ() {
      const isOpen = item.classList.contains('open');

      // Close all other FAQs (accordion functionality)
      items.forEach((otherItem) => {
        if (otherItem !== item) {
          otherItem.classList.remove('open');
          const otherQ = qs('.faq-item__question', otherItem);
          const otherAnswer = qs('.faq-item__answer', otherItem);
          if (otherQ) otherQ.setAttribute('aria-expanded', 'false');
          if (otherAnswer) otherAnswer.style.maxHeight = '';
        }
      });

      if (isOpen) {
        item.classList.remove('open');
        question.setAttribute('aria-expanded', 'false');
        answer.style.maxHeight = '';
      } else {
        const height = answer.scrollHeight;
        item.classList.add('open');
        question.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = height + 'px';
      }
    }

    question.addEventListener('click', toggleFAQ);

    // Support Space and Enter keypresses
    question.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        toggleFAQ();
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


/**
 * 12. WHATSAPP CHOICE MODAL INJECTION & LOGIC
 */
function initWhatsAppModal() {
  const waFab = qs('.wa-float');
  if (!waFab) return;

  const wrapper = qs('.wa-float-wrapper');
  if (!wrapper) return;

  // Inject modal markup into DOM if not present
  let modalOverlay = qs('.wa-modal-overlay');
  if (!modalOverlay) {
    const modalHTML = `
      <div class="wa-modal-overlay" id="wa-choice-modal" aria-hidden="true" inert role="dialog" aria-modal="true" aria-labelledby="wa-modal-title-id">
        <div class="wa-modal-card">
          <div class="wa-modal-header">
            <span class="wa-modal-title" id="wa-modal-title-id">How can we help you?</span>
            <button type="button" class="wa-modal-close" aria-label="Close modal">&times;</button>
          </div>
          <div class="wa-modal-body">
            <span class="wa-modal-subtitle">Select your enquiry type</span>
            <div class="wa-modal-options">
              <label class="wa-modal-option">
                <input type="radio" name="wa-enquiry-type" value="broadband" checked>
                <span class="wa-modal-option-card">
                  <span class="wa-modal-option-icon">🌐</span>
                  <span class="wa-modal-option-text">New Broadband Connection</span>
                </span>
              </label>
              <label class="wa-modal-option">
                <input type="radio" name="wa-enquiry-type" value="cctv">
                <span class="wa-modal-option-card">
                  <span class="wa-modal-option-icon">🎥</span>
                  <span class="wa-modal-option-text">CCTV Camera Installation</span>
                </span>
              </label>
              <label class="wa-modal-option">
                <input type="radio" name="wa-enquiry-type" value="amc">
                <span class="wa-modal-option-card">
                  <span class="wa-modal-option-icon">🛡️</span>
                  <span class="wa-modal-option-text">CCTV Annual Maintenance (AMC)</span>
                </span>
              </label>
              <label class="wa-modal-option">
                <input type="radio" name="wa-enquiry-type" value="networking">
                <span class="wa-modal-option-card">
                  <span class="wa-modal-option-icon">💻</span>
                  <span class="wa-modal-option-text">IT Networking &amp; Support</span>
                </span>
              </label>
              <label class="wa-modal-option">
                <input type="radio" name="wa-enquiry-type" value="general">
                <span class="wa-modal-option-card">
                  <span class="wa-modal-option-icon">❓</span>
                  <span class="wa-modal-option-text">General Enquiry</span>
                </span>
              </label>
            </div>
            
            <div class="wa-modal-text-group">
              <label for="wa-modal-custom-text" class="wa-modal-label">Additional details (Optional)</label>
              <textarea id="wa-modal-custom-text" class="wa-modal-textarea" placeholder="E.g., location, package name, or number of cameras..."></textarea>
            </div>
          </div>
          <div class="wa-modal-footer">
            <button type="button" class="btn btn--outline wa-modal-cancel">Cancel</button>
            <button type="button" class="btn btn--whatsapp-modal" id="wa-modal-submit-btn">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 0 0 1.333 4.965L2 22l5.233-1.371a9.944 9.944 0 0 0 4.773 1.216h.004c5.506 0 9.989-4.478 9.99-9.984A9.995 9.995 0 0 0 12.012 2zm5.793 13.593c-.319.897-1.558 1.637-2.146 1.745-.589.108-1.168.162-3.834-.912-3.41-1.376-5.607-4.85-5.777-5.077-.17-.228-1.357-1.802-1.357-3.437 0-1.636.852-2.438 1.157-2.775.305-.336.666-.42.887-.42h.638c.204 0 .476.006.697.528.221.522.756 1.834.821 1.971.066.137.108.297.017.476-.09.18-.135.297-.272.456-.137.159-.289.356-.413.476-.137.137-.282.287-.121.562.161.275.717 1.183 1.536 1.91.543.484.992.836 1.357 1.019.365.183.578.115.756-.09.178-.205.757-.88 1.012-1.222.256-.341.512-.284.862-.153.35.13.222.102 2.222 1.102.13.065.215.297.16.592z"/></svg>
              Open WhatsApp Chat
            </button>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    modalOverlay = qs('.wa-modal-overlay');
  }

  const closeBtn = qs('.wa-modal-close', modalOverlay);
  const cancelBtn = qs('.wa-modal-cancel', modalOverlay);
  const submitModalBtn = qs('#wa-modal-submit-btn', modalOverlay);
  const customTextarea = qs('#wa-modal-custom-text', modalOverlay);

  function openModal(e) {
    e.preventDefault();
    modalOverlay.classList.add('open');
    modalOverlay.removeAttribute('inert');
    modalOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    
    // Focus first active input
    const firstRadio = qs('input[name="wa-enquiry-type"]', modalOverlay);
    if (firstRadio) firstRadio.focus();
  }

  function closeModal() {
    modalOverlay.classList.remove('open');
    modalOverlay.setAttribute('inert', '');
    modalOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    waFab.focus();
  }

  // Bind trigger click
  waFab.addEventListener('click', openModal);

  // Bind close buttons
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

  // Close when clicking overlay backdrop
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  // Keyboard support: Escape closes modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('open')) {
      closeModal();
    }
  });

  // Handle submit action
  if (submitModalBtn) {
    submitModalBtn.addEventListener('click', () => {
      const type = qs('input[name="wa-enquiry-type"]:checked', modalOverlay)?.value || 'general';
      const details = customTextarea?.value.trim() || '';

      let baseMessage = 'Hi Nilakshith Enterprise, ';
      if (type === 'broadband') {
        baseMessage += 'I would like to enquire about getting a new broadband internet connection.';
      } else if (type === 'cctv') {
        baseMessage += 'I would like to get a quote for a professional CCTV surveillance camera installation.';
      } else if (type === 'amc') {
        baseMessage += 'I would like to enquire about your CCTV Annual Maintenance Contract (AMC) plans.';
      } else if (type === 'networking') {
        baseMessage += 'I would like to discuss an IT networking or business connectivity project.';
      } else {
        baseMessage += 'I have a general enquiry regarding your services.';
      }

      if (details) {
        baseMessage += ` Here are some details: ${details}`;
      }

      const waURL = `https://wa.me/919706817032?text=${encodeURIComponent(baseMessage)}`;
      
      closeModal();
      window.open(waURL, '_blank', 'noopener,noreferrer');
    });
  }
}

/**
 * 13. NATIVE GOOGLE FORM INTEGRATION & DYNAMIC LOGIC
 */
function initEnquiryForm() {
  const form = qs('#enquiry-form');
  if (!form) return;

  const successCard = qs('#form-success-card');
  const errorCard = qs('#form-error-card');
  const serviceSelect = qs('#form-service');
  const submitBtn = qs('.form-submit-btn', form);
  const btnText = qs('.btn-text', submitBtn);
  const btnSpinner = qs('.btn-spinner', submitBtn);

  const condBroadband = qs('#form-cond-broadband');
  const condCctv = qs('#form-cond-cctv');
  const condNetworking = qs('#form-cond-networking');

  // Input elements for conditional fields
  const broadbandPlan = qs('#form-broadband-plan');
  const cctvCameras = qs('#form-cctv-cameras');
  const networkingReqs = qs('#form-networking-reqs');

  // Helper to show/hide group and update "required" attributes on inputs
  function toggleGroup(group, show, inputEl) {
    if (!group) return;
    if (show) {
      group.classList.remove('hidden');
      if (inputEl) inputEl.setAttribute('required', 'true');
    } else {
      group.classList.add('hidden');
      if (inputEl) {
        inputEl.removeAttribute('required');
        inputEl.value = ''; // Reset value
        // Clear validation errors
        const groupParent = inputEl.closest('.form-group');
        if (groupParent) groupParent.classList.remove('has-error');
      }
    }
  }

  // Handle Dynamic Fields
  if (serviceSelect) {
    serviceSelect.addEventListener('change', () => {
      const val = serviceSelect.value;
      
      toggleGroup(condBroadband, val === 'Internet Broadband', broadbandPlan);
      toggleGroup(condCctv, val === 'CCTV Installation', cctvCameras);
      toggleGroup(condNetworking, val === 'Networking Services', networkingReqs);
    });
  }

  // Field validation helper
  function validateField(field) {
    const parent = field.closest('.form-group');
    if (!parent) return true;

    let isValid = true;
    
    // Check built-in HTML5 validation
    if (!field.checkValidity()) {
      isValid = false;
    }

    // Special regex check for 10-digit Indian phone number
    if (field.id === 'form-phone') {
      const phoneRegex = /^[6-9]\d{9}$/;
      if (!phoneRegex.test(field.value)) {
        isValid = false;
      }
    }

    // Special regex check for 6-digit Pincode
    if (field.id === 'form-pincode') {
      const pinRegex = /^\d{6}$/;
      if (field.value && !pinRegex.test(field.value)) {
        isValid = false;
      }
    }

    if (isValid) {
      parent.classList.remove('has-error');
    } else {
      parent.classList.add('has-error');
    }

    return isValid;
  }

  // Add validation on blur and input to keep UX high-quality
  const inputsToValidate = form.querySelectorAll('input, select, textarea');
  inputsToValidate.forEach(field => {
    ['blur', 'input', 'change'].forEach(eventType => {
      field.addEventListener(eventType, () => {
        const parent = field.closest('.form-group');
        if (parent && (parent.classList.contains('has-error') || eventType === 'blur')) {
          validateField(field);
        }
      });
    });
  });

  // Handle Submit
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Validate all fields
    let formIsValid = true;
    let firstErrorField = null;

    inputsToValidate.forEach(field => {
      // Check if field is visible/active (not inside a hidden group)
      const condGroup = field.closest('.form-conditional-group');
      const isFieldActive = !condGroup || !condGroup.classList.contains('hidden');

      if (isFieldActive) {
        const isFieldValid = validateField(field);
        if (!isFieldValid) {
          formIsValid = false;
          if (!firstErrorField) firstErrorField = field;
        }
      }
    });

    if (!formIsValid) {
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstErrorField.focus();
      }
      return;
    }

    // Capture name before form reset
    const userName = qs('#form-name')?.value || 'Customer';

    // Show loading spinner
    submitBtn.setAttribute('disabled', 'true');
    if (btnText) btnText.textContent = 'Submitting...';
    if (btnSpinner) btnSpinner.classList.remove('hidden');

    const formData = new FormData(form);

    // Google Form submission action URL
    const actionURL = 'https://docs.google.com/forms/d/e/1FAIpQLSdJ38JpziOKJ7DEL5AquCv7ao8jGfxm9RF2m8leQOoaCyuNaQ/formResponse';

    fetch(actionURL, {
      method: 'POST',
      body: formData,
      mode: 'no-cors'
    })
    .then(() => {
      // Opaque response is expected due to CORS, treated as success
      form.reset();
      
      // Reset active categories
      toggleGroup(condBroadband, false, broadbandPlan);
      toggleGroup(condCctv, false, cctvCameras);
      toggleGroup(condNetworking, false, networkingReqs);

      // Populate success card name
      const successNameSpan = qs('#success-name');
      if (successNameSpan) successNameSpan.textContent = userName;

      // Show success card
      form.classList.add('hidden');
      if (successCard) successCard.classList.remove('hidden');
      
      // Scroll to result card
      successCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    })
    .catch((error) => {
      console.error('Submission error:', error);
      // Show error card
      form.classList.add('hidden');
      if (errorCard) errorCard.classList.remove('hidden');
      
      errorCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    })
    .finally(() => {
      // Restore submit button state
      submitBtn.removeAttribute('disabled');
      if (btnText) btnText.textContent = 'Submit Enquiry';
      if (btnSpinner) btnSpinner.classList.add('hidden');
    });
  });

  // Reset and Retry triggers
  const resetBtn = qs('#form-reset-btn');
  const retryBtn = qs('#form-retry-btn');

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (successCard) successCard.classList.add('hidden');
      form.classList.remove('hidden');
      form.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  if (retryBtn) {
    retryBtn.addEventListener('click', () => {
      if (errorCard) errorCard.classList.add('hidden');
      form.classList.remove('hidden');
      form.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }
}

/**
 * 14. COOKIE CONSENT BANNER
 */
function initCookieConsent() {
  const banner = qs('#cookie-consent-banner');
  const acceptBtn = qs('#btn-accept-cookies');
  if (!banner || !acceptBtn) return;

  const consentKey = 'cookie-consent-accepted';

  // Handle accept button click
  acceptBtn.addEventListener('click', () => {
    banner.classList.add('hidden');
    localStorage.setItem(consentKey, 'true');
    banner.addEventListener('transitionend', function handler() {
      banner.style.display = 'none';
      banner.removeEventListener('transitionend', handler);
    });
  });
}

// Delay cookie banner to avoid it being the LCP element
function showCookieBanner() {
  const consentKey = 'cookie-consent-accepted';
  if (!localStorage.getItem(consentKey)) {
    const banner = document.querySelector('.cookie-banner');
    if (banner) {
      banner.style.display = 'block';
      // Force layout recalculation to trigger transition from display: none
      banner.offsetHeight;
      banner.classList.remove('hidden');
    }
  }
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
  initWhatsAppModal();
  initEnquiryForm();
  initCookieConsent();
  initBrandsCarouselScaling();
  initLazyReviews();

  window.addEventListener('load', () => {
    setTimeout(showCookieBanner, 500);
  });
});

/**
 * 15. BRANDS CAROUSEL GEOMETRIC SCALING (Center-grow effect)
 */
function initBrandsCarouselScaling() {
  const wrapper = qs('.brands-track-wrapper');
  if (!wrapper) return;
  const logos = qsAll('.brand-logo', wrapper);
  if (!logos.length) return;

  let wrapperWidth = 0;
  let centerX = 0;
  let maxDistance = 0;
  let cachedWrapperLeft = 0;
  const logoOffsets = [];

  function measureWrapper() {
    // Reset transforms to get correct layout offsets
    logos.forEach(logo => {
      logo.style.transform = '';
      logo.style.opacity = '';
    });

    const wrapperRect = wrapper.getBoundingClientRect();
    wrapperWidth = wrapperRect.width;
    cachedWrapperLeft = wrapperRect.left;
    centerX = cachedWrapperLeft + wrapperWidth / 2;
    maxDistance = wrapperWidth / 2;

    const track = qs('.brands-track', wrapper);
    if (track) {
      const originalTransform = track.style.transform;
      track.style.transform = 'none';

      const trackRect = track.getBoundingClientRect();
      logoOffsets.length = 0;
      logos.forEach(logo => {
        const logoRect = logo.getBoundingClientRect();
        logoOffsets.push({
          logo,
          width: logoRect.width,
          offsetLeft: logoRect.left - trackRect.left
        });
      });

      track.style.transform = originalTransform;
    }
  }

  window.addEventListener('resize', measureWrapper);
  measureWrapper(); // initial measure

  function updateScales() {
    const track = qs('.brands-track', wrapper);
    if (!track || !logoOffsets.length) {
      requestAnimationFrame(updateScales);
      return;
    }

    // Get current horizontal displacement from computed transform (composited, no reflow!)
    const style = window.getComputedStyle(track);
    const transform = style.transform || style.webkitTransform;
    let translateX = 0;
    if (transform && transform !== 'none') {
      const matrix = transform.match(/matrix.*\((.+)\)/);
      if (matrix) {
        const values = matrix[1].split(',');
        translateX = parseFloat(values[4]) || 0;
      }
    }

    const trackLeft = cachedWrapperLeft + translateX;

    logoOffsets.forEach(({ logo, width, offsetLeft }) => {
      const logoCenterX = trackLeft + offsetLeft + width / 2;
      const distanceFromCenter = Math.abs(centerX - logoCenterX);

      // Normalized distance (0 at center, 1 at edges)
      let normalizedDistance = distanceFromCenter / maxDistance;
      if (normalizedDistance > 1) normalizedDistance = 1;

      // Scale: 1.35 at center, 0.65 at edges
      const minScale = 0.65;
      const maxScale = 1.35;
      let scale = maxScale - (maxScale - minScale) * normalizedDistance;

      // Boost scale if hovered
      const isHovered = logo.closest('.brand-item')?.matches(':hover');
      if (isHovered) {
        scale *= 1.15;
      }

      // Opacity: 1.0 at center, 0.4 at edges
      const minOpacity = 0.4;
      const maxOpacity = 1.0;
      let opacity = maxOpacity - (maxOpacity - minOpacity) * normalizedDistance;
      if (isHovered) {
        opacity = 1.0;
      }

      logo.style.transform = `scale(${scale})`;
      logo.style.opacity = opacity;
    });

    requestAnimationFrame(updateScales);
  }

  // Only run if user doesn't prefer reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReducedMotion) {
    requestAnimationFrame(updateScales);
  }
}

/**
 * 16. DYNAMIC MAP LOADER (On click placeholder)
 */
window.loadRealMap = function(id) {
  const placeholder = document.getElementById('map-placeholder-' + id);
  const realMap = document.getElementById('map-real-' + id);
  if (placeholder && realMap) {
    placeholder.style.display = 'none';
    realMap.style.display = 'block';
    let url = '';
    if (id === 'index') {
      url = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d350000!2d92.54!3d24.80!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x374e4bf68d1d8b05%3A0xfc15cedc07960658!2sNILAKSHITH%20ENTERPRISE!5e0!3m2!1sen!2sin!4v1718500000000';
    } else if (id === 'contact') {
      url = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3640.3!2d92.7847028!3d24.8025006!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x374e4bf68d1d8b05%3A0xfc15cedc07960658!2sNILAKSHITH%20ENTERPRISE!5e0!3m2!1sen!2sin!4v1';
    }
    realMap.innerHTML = `<iframe src="${url}" width="100%" height="100%" style="border:0; display:block;" allowfullscreen loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="Nilakshith Enterprise location Map"></iframe>`;
  }
};

/**
 * 17. LAZY SOCIAL REVIEWS LOADER
 */
function initLazyReviews() {
  const container = document.getElementById('tagembed-container');
  if (!container) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        observer.disconnect();
        container.innerHTML = `
          <iframe
            src="https://widget.tagembed.com/328135?website=1"
            allow="fullscreen"
            style="width:100%;height:100%;overflow:auto;border:none;"
            title="Nilakshith Enterprise - Google Customer Reviews"
            loading="lazy">
          </iframe>
        `;
      }
    });
  }, { rootMargin: '200px' });

  observer.observe(container);
}


