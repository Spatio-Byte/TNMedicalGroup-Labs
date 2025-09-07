/* TNMedicalGroup-Labs — RevUltra
   JS global séparé : navigation, scroll fluide, reveal on scroll,
   thème clair/sombre, barre de progression, parallax produit.
*/
(() => {
  'use strict';

  // ---------- Helpers
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- Nav: menu burger + fermeture au clic anchor
  function initNav() {
    const navBtn = $('#menuBtn');
    const nav = $('#nav');
    if (!navBtn || !nav) return;

    navBtn.addEventListener('click', () => {
      nav.classList.toggle('open');
      navBtn.setAttribute('aria-expanded', nav.classList.contains('open'));
    });

    // Ferme le menu après navigation (mobile)
    $$('#nav a').forEach(a =>
      a.addEventListener('click', () => nav.classList.remove('open'))
    );
  }

  // ---------- Scroll fluide interne (ancres #id)
  function initSmoothScroll() {
    $$('a[href^="#"]').forEach(a => {
      a.addEventListener('click', (e) => {
        const href = a.getAttribute('href');
        const id = (href || '').slice(1);
        const target = id ? document.getElementById(id) : null;
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  // ---------- Reveal on scroll (IntersectionObserver)
  function initRevealOnScroll() {
    const items = $$('.reveal');
    if (!items.length) return;

    if (!prefersReduced && 'IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            io.unobserve(entry.target);
          }
        }
      }, { threshold: 0.12 });

      items.forEach(el => io.observe(el));
    } else {
      items.forEach(el => el.classList.add('in'));
    }
  }

  // ---------- Barre de progression lecture
  function initScrollProgress() {
    const bar = $('#progress');
    if (!bar) return;

    const update = () => {
      const h = document.documentElement;
      const pos = h.scrollTop;
      const height = h.scrollHeight - h.clientHeight;
      const ratio = height > 0 ? Math.max(0, Math.min(1, pos / height)) : 0;
      bar.style.transform = `scaleX(${ratio})`;
    };

    window.addEventListener('scroll', update, { passive: true });
    update(); // init
  }

  // ---------- Boot
  document.addEventListener('DOMContentLoaded', () => {
    initNav();
    initSmoothScroll();
    initRevealOnScroll();
    initTheme();
    initScrollProgress();
    initHeroParallax();
  });
})();
