// ============================================================
// TRUE FORK — main.js
// ============================================================

// ---- Scroll progress bar ----

const scrollBar = document.getElementById('scroll-progress');
if (scrollBar) {
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    scrollBar.style.width = (scrolled / total * 100) + '%';
  }, { passive: true });
}

// ---- Mobile nav toggle ----

const navToggle  = document.querySelector('.nav-toggle');
const navLinks   = document.querySelector('.nav-links');
const navBackdrop = document.querySelector('.nav-backdrop');

function closeNav() {
  navLinks.classList.remove('is-open');
  navToggle.classList.remove('is-open');
  navToggle.setAttribute('aria-expanded', 'false');
  if (navBackdrop) navBackdrop.classList.remove('is-visible');
}

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('is-open');
    navToggle.classList.toggle('is-open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    if (navBackdrop) navBackdrop.classList.toggle('is-visible', open);
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeNav);
  });
}

if (navBackdrop) {
  navBackdrop.addEventListener('click', closeNav);
}

// ---- Fork icon draw animation (staggered left → right) ----
//
// When triggered:
//   1. .is-drawing is added to #fork-icon — both tines snap hidden via
//      the `backwards` fill-mode on their animations.
//   2. .tine-left animates from hidden → visible immediately.
//   3. .tine-right animates from hidden → visible after a delay
//      (~50% through the left tine's draw), creating the staggered effect.
//   4. .is-drawing is removed on animationend of .tine-right (the last
//      to finish), resetting the icon so the next hover can re-trigger.
//
// Desktop: mouseenter on the logo link.
// Mobile:  touchstart on the icon (passive — does not block navigation).
//
// Speed is controlled by --draw-speed in :root (styles.css line 8).

const forkIcon = document.getElementById('fork-icon');
const logoLink  = forkIcon?.closest('.logo-link');
const rightTine = forkIcon?.querySelector('.tine-right');

function triggerDraw() {
  if (!forkIcon || forkIcon.classList.contains('is-drawing')) return;
  forkIcon.classList.add('is-drawing');

  if (rightTine) {
    rightTine.addEventListener('animationend', () => {
      forkIcon.classList.remove('is-drawing');
    }, { once: true });
  }
}

if (logoLink) {
  // Desktop: hover
  logoLink.addEventListener('mouseenter', triggerDraw);

  // Desktop + mobile: click/tap. Delay navigation so the animation has time
  // to play before the page changes. No delay needed when already on this page.
  logoLink.addEventListener('click', (e) => {
    const dest = new URL(logoLink.href, location.href).pathname;
    if (dest !== location.pathname) {
      e.preventDefault();
      triggerDraw();
      setTimeout(() => { location.href = logoLink.href; }, 480);
    } else {
      triggerDraw();
    }
  });
}

// Auto-draw on every page load/refresh
window.addEventListener('load', () => {
  setTimeout(triggerDraw, 350);
});

// ---- Service card scroll reveal ----
//
// Adds .is-visible to each .service-card when it enters the viewport.
// CSS handles the fade+lift transition and per-card stagger delays.
// Fires once per card — no re-animation on scroll back up.

const serviceCards = document.querySelectorAll('.service-card');
if (serviceCards.length) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  serviceCards.forEach(card => revealObserver.observe(card));
}

const appCards = document.querySelectorAll('.app-card');
if (appCards.length) {
  const appRevealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        appRevealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  appCards.forEach(card => appRevealObserver.observe(card));
}

