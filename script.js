/**
 * LUMINA CENTER FOR NEURODIVERSITY & PEDIATRIC THERAPY
 * Core Application Logic (Theme, RTL, Navigation, Filters, Modals, Strict Validation)
 * Strictly Vanilla JavaScript
 */

(function () {
  'use strict';

  // --- LOCAL STORAGE KEYS ---
  const THEME_KEY = 'lumina_theme';
  const DIR_KEY = 'lumina_direction';

  // --- THEME MANAGEMENT ---
  function initTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY);
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = savedTheme ? savedTheme === 'dark' : prefersDark;

    if (isDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.style.backgroundColor = '#0B0F19';
      document.documentElement.style.colorScheme = 'dark';
      if (document.body) document.body.style.backgroundColor = '#0B0F19';
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.backgroundColor = '#FFFFFF';
      document.documentElement.style.colorScheme = 'light';
      if (document.body) document.body.style.backgroundColor = '#FFFFFF';
    }
    updateThemeIcons(isDark);
  }

  function toggleTheme() {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
    document.documentElement.style.backgroundColor = isDark ? '#0B0F19' : '#FFFFFF';
    document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
    if (document.body) {
      document.body.style.backgroundColor = isDark ? '#0B0F19' : '#FFFFFF';
    }
    updateThemeIcons(isDark);
  }

  function updateThemeIcons(isDark) {
    const themeButtons = document.querySelectorAll('.theme-toggle-btn');
    themeButtons.forEach((btn) => {
      const sunIcon = btn.querySelector('.icon-sun');
      const moonIcon = btn.querySelector('.icon-moon');
      const label = btn.querySelector('.theme-label');
      if (sunIcon && moonIcon) {
        if (isDark) {
          sunIcon.classList.remove('hidden');
          moonIcon.classList.add('hidden');
        } else {
          sunIcon.classList.add('hidden');
          moonIcon.classList.remove('hidden');
        }
      }
      if (label) {
        label.textContent = isDark ? 'Light' : 'Dark';
      }
      btn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
      btn.setAttribute('title', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    });
  }

  // --- DIRECTION (RTL / LTR) MANAGEMENT ---
  function initDirection() {
    const savedDir = localStorage.getItem(DIR_KEY) || 'ltr';
    document.documentElement.setAttribute('dir', savedDir);
    if (document.body) document.body.setAttribute('dir', savedDir);
    updateDirectionLabels(savedDir);
  }

  function toggleDirection() {
    const currentDir = document.documentElement.getAttribute('dir') || 'ltr';
    const nextDir = currentDir === 'ltr' ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('dir', nextDir);
    if (document.body) document.body.setAttribute('dir', nextDir);
    localStorage.setItem(DIR_KEY, nextDir);
    updateDirectionLabels(nextDir);
    if (window.showToast) {
      window.showToast(nextDir.toUpperCase() + ' direction enabled', 'info', 'Layout Direction');
    }
  }

  function updateDirectionLabels(dir) {
    const dirButtons = document.querySelectorAll('.rtl-toggle-btn');
    dirButtons.forEach((btn) => {
      const label = btn.querySelector('.rtl-label');
      if (label) {
        label.textContent = dir === 'rtl' ? 'LTR' : 'RTL';
      }
      const titleText = dir === 'rtl' ? 'Switch to LTR layout' : 'Switch to RTL layout';
      btn.setAttribute('aria-label', titleText);
      btn.setAttribute('title', titleText);
    });
  }

  // --- MOBILE NAVIGATION DRAWER ---
  function initMobileMenu() {
    const hamburgerBtn = document.getElementById('mobile-menu-toggle');
    const mobileDrawer = document.getElementById('mobile-menu-drawer');
    const closeBtn = document.getElementById('mobile-menu-close');
    const backdrop = document.getElementById('mobile-menu-backdrop');

    if (!hamburgerBtn || !mobileDrawer) return;

    function openMenu() {
      mobileDrawer.classList.remove('hidden');
      if (backdrop) backdrop.classList.remove('hidden');
      document.body.classList.add('overflow-hidden');
    }

    function closeMenu() {
      mobileDrawer.classList.add('hidden');
      if (backdrop) backdrop.classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
    }

    hamburgerBtn.addEventListener('click', openMenu);
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);
    if (backdrop) backdrop.addEventListener('click', closeMenu);

    const mobileLinks = mobileDrawer.querySelectorAll('a');
    mobileLinks.forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth >= 1024 && !mobileDrawer.classList.contains('hidden')) {
        closeMenu();
      }
    });
  }

  // --- ACTIVE LINK HIGHLIGHTING ---
  function highlightActiveLink() {
    const pathname = window.location.pathname;
    let pageName = pathname.substring(pathname.lastIndexOf('/') + 1);

    if (pageName.includes('?')) pageName = pageName.split('?')[0];
    if (pageName.includes('#')) pageName = pageName.split('#')[0];

    // Normalize root path to index.html
    if (!pageName || pageName === '' || pageName === '/') {
      pageName = 'index.html';
    }

    // Synchronize Home Dropdown Active State
    const homeDropdownBtns = document.querySelectorAll('.home-nav-dropdown > button');
    homeDropdownBtns.forEach((btn) => {
      if (pageName === 'index.html' || pageName === 'index2.html') {
        btn.classList.add('active');
        btn.setAttribute('aria-current', 'page');
      } else {
        btn.classList.remove('active');
        btn.removeAttribute('aria-current');
      }
    });

    // Synchronize Mobile Home Selection Box
    const mobileHomeSelectors = document.querySelectorAll('#mobile-home-selector');
    mobileHomeSelectors.forEach((sel) => {
      if (pageName === 'index.html' || pageName === 'index2.html') {
        sel.value = pageName;
      }
    });

    const navLinks = document.querySelectorAll('.nav-link-item:not(.home-nav-dropdown > button)');
    navLinks.forEach((link) => {
      const href = link.getAttribute('href');
      let linkPage = href ? href.split('?')[0].split('#')[0] : '';
      if (linkPage.startsWith('./')) linkPage = linkPage.substring(2);

      const isActive = (linkPage === pageName);

      if (isActive) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      } else {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
      }
    });
  }

  // --- TOAST NOTIFICATION SYSTEM ---
  window.showToast = function (message, type = 'info', title = '') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';

    let iconColor = 'text-teal-600 dark:text-teal-400';
    let iconChar = '✓';
    if (type === 'error') {
      iconColor = 'text-red-600 dark:text-red-400';
      iconChar = '✕';
    } else if (type === 'info') {
      iconColor = 'text-amber-600 dark:text-amber-400';
      iconChar = 'ℹ';
    }

    toast.innerHTML = `
      <div class="w-6 h-6 flex-shrink-0 flex items-center justify-center font-black ${iconColor}">${iconChar}</div>
      <div class="flex-1">
        ${title ? `<div class="font-extrabold text-xs uppercase tracking-wider text-slate-900 dark:text-slate-100">${title}</div>` : ''}
        <div class="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">${message}</div>
      </div>
      <button class="text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 text-sm font-bold leading-none">&times;</button>
    `;

    const closeBtn = toast.querySelector('button');
    closeBtn.addEventListener('click', () => toast.remove());

    container.appendChild(toast);

    setTimeout(() => {
      if (toast.parentElement) {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s ease';
        setTimeout(() => toast.remove(), 300);
      }
    }, 4500);
  };

  // --- STRICT FORM VALIDATION RULES ---
  // Blocks numbers in Name, Blocks letters in Phone, Strict Email Regex
  function attachStrictFormValidation(formElement, onSuccess) {
    if (!formElement) return;

    const nameInputs = formElement.querySelectorAll('input[type="text"][name*="name"], input[id*="name"]');
    const phoneInputs = formElement.querySelectorAll('input[type="tel"], input[name*="phone"], input[id*="phone"]');
    const emailInputs = formElement.querySelectorAll('input[type="email"], input[name*="email"], input[id*="email"]');

    // Strict Name Validation: Block numbers
    nameInputs.forEach((input) => {
      input.addEventListener('keydown', (e) => {
        if (/[0-9]/.test(e.key)) {
          e.preventDefault();
        }
      });
      input.addEventListener('input', () => {
        input.value = input.value.replace(/[0-9]/g, '');
        if (input.value.trim().length >= 2) {
          input.classList.remove('is-invalid');
          input.classList.add('is-valid');
        } else {
          input.classList.remove('is-valid');
        }
      });
    });

    // Strict Phone Validation: Block letters
    phoneInputs.forEach((input) => {
      input.addEventListener('keydown', (e) => {
        const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter', '+', '-', '(', ')', ' '];
        if (allowedKeys.includes(e.key)) return;
        if (!/[0-9]/.test(e.key)) {
          e.preventDefault();
        }
      });
      input.addEventListener('input', () => {
        input.value = input.value.replace(/[^0-9+\-() ]/g, '');
        const digitsOnly = input.value.replace(/[^0-9]/g, '');
        if (digitsOnly.length >= 7) {
          input.classList.remove('is-invalid');
          input.classList.add('is-valid');
        } else {
          input.classList.remove('is-valid');
        }
      });
    });

    // Strict Email Regex Validation
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
    emailInputs.forEach((input) => {
      input.addEventListener('input', () => {
        const val = input.value.trim();
        if (emailRegex.test(val)) {
          input.classList.remove('is-invalid');
          input.classList.add('is-valid');
        } else {
          input.classList.remove('is-valid');
        }
      });
    });

    formElement.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      // Validate Names
      nameInputs.forEach((input) => {
        if (input.hasAttribute('required') && input.value.trim().length < 2) {
          input.classList.add('is-invalid');
          isValid = false;
        }
      });

      // Validate Phones
      phoneInputs.forEach((input) => {
        const digits = input.value.replace(/[^0-9]/g, '');
        if (input.hasAttribute('required') && digits.length < 7) {
          input.classList.add('is-invalid');
          isValid = false;
        }
      });

      // Validate Emails
      emailInputs.forEach((input) => {
        if (input.hasAttribute('required') && !emailRegex.test(input.value.trim())) {
          input.classList.add('is-invalid');
          isValid = false;
        }
      });

      if (!isValid) {
        window.showToast('Please verify all required fields in the highlighted format.', 'error', 'Validation Error');
        return;
      }

      if (onSuccess) {
        onSuccess(formElement);
      }
    });
  }

  // --- PROGRAM FILTERING (programs.html) ---
  function initProgramFilters() {
    const filterBtns = document.querySelectorAll('.program-filter-btn');
    const programCards = document.querySelectorAll('.program-card');

    if (!filterBtns.length || !programCards.length) return;

    function applyFilter(selectedCategory) {
      filterBtns.forEach((b) => {
        if (b.getAttribute('data-filter') === selectedCategory) {
          b.classList.add('active');
        } else {
          b.classList.remove('active');
        }
      });

      programCards.forEach((card) => {
        const cardCategories = (card.getAttribute('data-category') || '').split(' ');
        if (selectedCategory === 'all' || cardCategories.includes(selectedCategory)) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    }

    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const selectedCategory = btn.getAttribute('data-filter') || 'all';
        applyFilter(selectedCategory);
      });
    });

    // Check URL query parameters (e.g. ?filter=autism)
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const filterParam = urlParams.get('filter');
      if (filterParam) {
        const exists = Array.from(filterBtns).some(b => b.getAttribute('data-filter') === filterParam);
        if (exists) {
          applyFilter(filterParam);
        }
      }
    } catch (e) {}
  }

  // --- THERAPIST DIRECTORY FILTERING (therapists.html) ---
  function initTherapistFilters() {
    const filterBtns = document.querySelectorAll('.therapist-filter-btn');
    const therapistCards = document.querySelectorAll('.therapist-card');

    if (!filterBtns.length || !therapistCards.length) return;

    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const selectedSpecialty = btn.getAttribute('data-specialty');

        therapistCards.forEach((card) => {
          const specialty = card.getAttribute('data-specialty');
          if (selectedSpecialty === 'all' || specialty === selectedSpecialty) {
            card.classList.remove('hidden');
          } else {
            card.classList.add('hidden');
          }
        });
      });
    });
  }

  // --- CONSULTATION & TOUR BOOKING MODAL ---
  function initBookingModal() {
    const modal = document.getElementById('booking-modal');
    const openBtns = document.querySelectorAll('.open-booking-modal-btn');
    const closeBtn = document.getElementById('booking-modal-close');
    const therapistNameInput = document.getElementById('modal-therapist-name');
    const bookingForm = document.getElementById('booking-modal-form');

    if (!modal) return;

    function openModal(therapistName = '') {
      modal.classList.remove('hidden');
      document.body.classList.add('overflow-hidden');
      if (therapistNameInput && therapistName) {
        therapistNameInput.value = therapistName;
      }
    }

    function closeModal() {
      modal.classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
      if (bookingForm) bookingForm.reset();
    }

    openBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const therapist = btn.getAttribute('data-therapist') || '';
        openModal(therapist);
      });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    if (bookingForm) {
      attachStrictFormValidation(bookingForm, (form) => {
        const parentName = document.getElementById('modal-parent-name')?.value || 'Valued Parent';
        closeModal();
        window.showToast(`Thank you, ${parentName}. Your consultation request has been routed to our clinical triage team. We will contact you within 24 hours.`, 'info', 'Consultation Requested');
      });
    }
  }

  // --- INTERACTIVE FAQ ACCORDIONS ---
  function initFaqAccordions() {
    const accordions = document.querySelectorAll('.faq-accordion-toggle');
    accordions.forEach((btn) => {
      btn.addEventListener('click', () => {
        const content = btn.nextElementSibling;
        const icon = btn.querySelector('.faq-icon');
        const isExpanded = !content.classList.contains('hidden');

        // Close all others
        document.querySelectorAll('.faq-accordion-toggle').forEach((otherBtn) => {
          if (otherBtn !== btn) {
            otherBtn.nextElementSibling?.classList.add('hidden');
            const otherIcon = otherBtn.querySelector('.faq-icon');
            if (otherIcon) otherIcon.textContent = '+';
          }
        });

        if (isExpanded) {
          content.classList.add('hidden');
          if (icon) icon.textContent = '+';
        } else {
          content.classList.remove('hidden');
          if (icon) icon.textContent = '−';
        }
      });
    });
  }

  // --- FOOTER NEWSLETTER & INTAKE FORMS ---
  function initGeneralForms() {
    // Newsletter Forms
    const newsletterForms = document.querySelectorAll('.newsletter-form');
    newsletterForms.forEach((form) => {
      attachStrictFormValidation(form, (f) => {
        window.showToast('Thank you for subscribing to Lumina Neurodiversity Research & Family Dispatches.', 'info', 'Subscribed');
        f.reset();
      });
    });

    // Contact Page Intake Form
    const contactForm = document.getElementById('contact-intake-form');
    if (contactForm) {
      attachStrictFormValidation(contactForm, (f) => {
        const nameVal = document.getElementById('contact-name')?.value || 'Parent / Guardian';
        window.showToast(`Intake packet successfully transmitted for ${nameVal}. Our admissions director will review your child's profile and reply today.`, 'info', 'Intake Received');
        f.reset();
      });
    }
  }

  // Synchronous execution upon script evaluation
  initTheme();
  initDirection();

  // DOM Ready Initialization
  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initDirection();
    initMobileMenu();
    highlightActiveLink();
    initProgramFilters();
    initTherapistFilters();
    initBookingModal();
    initFaqAccordions();
    initGeneralForms();

    // Attach theme toggle listeners across all buttons
    document.querySelectorAll('.theme-toggle-btn').forEach((btn) => {
      btn.addEventListener('click', toggleTheme);
    });

    // Attach RTL toggle listeners across all buttons
    document.querySelectorAll('.rtl-toggle-btn').forEach((btn) => {
      btn.addEventListener('click', toggleDirection);
    });
  });

})();
