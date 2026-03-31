// ============================================
// ALKY's Mind's Eye — App Logic
// ============================================

(function () {
  'use strict';

  // ---------- Theme Toggle ----------
  const toggle = document.querySelector('[data-theme-toggle]');
  const root = document.documentElement;
  let theme = matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  root.setAttribute('data-theme', theme);
  updateToggleIcon();

  if (toggle) {
    toggle.addEventListener('click', () => {
      theme = theme === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', theme);
      updateToggleIcon();
    });
  }

  function updateToggleIcon() {
    if (!toggle) return;
    toggle.innerHTML = theme === 'dark'
      ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
      : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
    toggle.setAttribute('aria-label', 'Switch to ' + (theme === 'dark' ? 'light' : 'dark') + ' mode');
  }


  // ---------- Header Scroll State ----------
  const header = document.getElementById('header');
  let lastScrollY = 0;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y > 80) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
    lastScrollY = y;
  }, { passive: true });


  // ---------- Mobile Nav ----------
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('nav');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    nav.classList.toggle('open');
    document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
  });

  // Close nav on link click
  nav.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      nav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });


  // ---------- Portfolio Filter ----------
  const filterTabs = document.querySelectorAll('.filter-tab');
  const portfolioItems = document.querySelectorAll('.portfolio__item');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const filter = tab.dataset.filter;

      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      portfolioItems.forEach(item => {
        if (filter === 'all' || item.dataset.category === filter) {
          item.style.display = '';
          item.style.opacity = '0';
          requestAnimationFrame(() => {
            item.style.transition = 'opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
            item.style.opacity = '1';
          });
        } else {
          item.style.opacity = '0';
          setTimeout(() => { item.style.display = 'none'; }, 300);
        }
      });
    });
  });


  // ---------- Lightbox ----------
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxCat = document.getElementById('lightboxCat');
  const lightboxClose = lightbox.querySelector('.lightbox__close');
  const lightboxPrev = lightbox.querySelector('.lightbox__nav--prev');
  const lightboxNext = lightbox.querySelector('.lightbox__nav--next');

  let currentIndex = 0;
  let visibleItems = [];

  function getVisibleItems() {
    return Array.from(portfolioItems).filter(
      item => item.style.display !== 'none'
    );
  }

  function openLightbox(index) {
    visibleItems = getVisibleItems();
    currentIndex = index;
    showImage();
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  function showImage() {
    const item = visibleItems[currentIndex];
    if (!item) return;
    const img = item.querySelector('img');
    const title = item.querySelector('.portfolio__item-title');
    const cat = item.querySelector('.portfolio__item-cat');
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxTitle.textContent = title ? title.textContent : '';
    lightboxCat.textContent = cat ? cat.textContent : '';
  }

  function prevImage() {
    currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
    showImage();
  }

  function nextImage() {
    currentIndex = (currentIndex + 1) % visibleItems.length;
    showImage();
  }

  portfolioItems.forEach((item) => {
    item.addEventListener('click', () => {
      const vis = getVisibleItems();
      const idx = vis.indexOf(item);
      openLightbox(idx >= 0 ? idx : 0);
    });
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', (e) => { e.stopPropagation(); prevImage(); });
  lightboxNext.addEventListener('click', (e) => { e.stopPropagation(); nextImage(); });

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') prevImage();
    if (e.key === 'ArrowRight') nextImage();
  });


  // ---------- Smooth Scroll for Anchor Links ----------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

})();
