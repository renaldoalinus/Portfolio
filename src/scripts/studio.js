// Studio interactions — smooth scroll (Lenis) + all scroll-driven motion.
import Lenis from 'lenis';

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const easeOutExpo = [0.22, 1, 0.36, 1];

// ---------------------------------------------------------------- lenis
let lenis = null;
if (!reducedMotion) {
  lenis = new Lenis({ autoRaf: false });
}

// Anchor links scroll through lenis (falls back to native).
document.querySelectorAll('a[data-scroll]').forEach((link) => {
  link.addEventListener('click', (e) => {
    const id = link.getAttribute('href');
    if (!id || !id.startsWith('#')) return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    closeMobileNav();
    if (lenis) lenis.scrollTo(target, { offset: -24 });
    else target.scrollIntoView({ behavior: 'smooth' });
  });
});

// ---------------------------------------------------------------- hero entrance
// Masked lines slide up once fonts settle (next frame is enough).
requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    document.getElementById('hero')?.classList.add('is-in');
  });
});

// ---------------------------------------------------------------- scroll orchestration
const hero = document.querySelector('[data-hero]');
const circleZone = document.querySelector('[data-circle-zone]');
const circleDisc = document.querySelector('[data-circle-disc]');
const aboutFade = document.querySelector('[data-about-fade]');
const blurSection = document.querySelector('[data-blur-headline]');
const blurWords = Array.from(document.querySelectorAll('[data-blur-word]'));
const workCards = document.getElementById('work-cards');
const nav = document.getElementById('site-nav');

const clamp01 = (v) => Math.min(1, Math.max(0, v));

function onFrame(scrollY) {
  const vh = window.innerHeight;

  // Hero: scale down + fade out over the first ~90vh of scroll.
  if (hero) {
    const p = clamp01(scrollY / (vh * 0.9));
    hero.style.opacity = String(1 - p);
    hero.style.transform = `scale(${1 - 0.05 * p})`;
    hero.style.visibility = p >= 1 ? 'hidden' : 'visible';
    hero.style.pointerEvents = p > 0.5 ? 'none' : '';
  }

  // Nav pill background once we've left the top.
  if (nav) nav.classList.toggle('is-scrolled', scrollY > 24);

  // Circular reveal: the dark disc grows across the zone's scroll range.
  if (circleZone && circleDisc) {
    const rect = circleZone.getBoundingClientRect();
    const p = clamp01((vh - rect.top) / (rect.height));
    circleDisc.style.transform = `translate(-50%, -50%) scale(${(0.1 + p * 2.1).toFixed(4)})`;
    // about content fades up inside the circle while it grows
    if (aboutFade && !reducedMotion) {
      aboutFade.style.opacity = clamp01((p - 0.3) / 0.65).toFixed(3);
    }
  }

  // Word-by-word blur reveal across the sticky headline's scroll range —
  // then the whole line blurs away again as the cards scroll over it, so
  // the thumbnails read with clean contrast.
  if (blurSection && blurWords.length && !reducedMotion) {
    const rect = blurSection.parentElement.getBoundingClientRect();
    const sectionTop = rect.top + scrollY;
    // reveal happens between "section reaches top" and ~0.9 viewport later
    const p = clamp01((scrollY - sectionTop + vh * 0.55) / (vh * 0.9));
    // re-blur as the cards container climbs into the viewport
    let q = 0;
    if (workCards) {
      const cardsTop = workCards.getBoundingClientRect().top;
      q = clamp01((vh * 0.85 - cardsTop) / (vh * 0.6));
    }
    const n = blurWords.length;
    blurWords.forEach((word, i) => {
      const t = clamp01(p * n - i);
      const blur = Math.max(18 * (1 - t), 18 * q);
      const opacity = Math.min(0.12 + 0.88 * t, 1 - 0.88 * q);
      word.style.filter = blur < 0.2 ? 'none' : `blur(${blur.toFixed(1)}px)`;
      word.style.opacity = opacity.toFixed(3);
    });
  }
}

if (lenis) {
  lenis.on('scroll', ({ scroll }) => onFrame(scroll));
  const raf = (time) => {
    lenis.raf(time);
    requestAnimationFrame(raf);
  };
  requestAnimationFrame(raf);
  onFrame(window.scrollY);
} else {
  const passive = { passive: true };
  const handler = () => onFrame(window.scrollY);
  window.addEventListener('scroll', handler, passive);
  window.addEventListener('resize', handler, passive);
  handler();
}

// ---------------------------------------------------------------- reveals
// Cards rise in; sections fade; masked lines inside scroll targets slide up.
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);
document
  .querySelectorAll('[data-card-reveal], [data-section-fade], [data-mask-scroll]')
  .forEach((el) => io.observe(el));

// ---------------------------------------------------------------- portrait glitch
document.querySelectorAll('[data-glitch]').forEach((el) => {
  if (reducedMotion) return;
  const trigger = () => {
    el.classList.remove('is-glitching');
    // restart the animation
    void el.offsetWidth;
    el.classList.add('is-glitching');
    setTimeout(() => el.classList.remove('is-glitching'), 520);
  };
  el.addEventListener('mouseenter', trigger);
  setInterval(() => {
    const rect = el.getBoundingClientRect();
    if (rect.bottom > 0 && rect.top < window.innerHeight) trigger();
  }, 4200);
});

// ---------------------------------------------------------------- copy email
document.querySelectorAll('[data-copy-email]').forEach((btn) => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard?.writeText(btn.getAttribute('data-copy-email')).then(() => {
      btn.classList.add('is-copied');
      setTimeout(() => btn.classList.remove('is-copied'), 1600);
    });
  });
});

// ---------------------------------------------------------------- mobile nav
const burger = document.getElementById('nav-burger');
const mobileNav = document.getElementById('mobile-nav');

function closeMobileNav() {
  mobileNav?.classList.remove('is-open');
  mobileNav?.setAttribute('aria-hidden', 'true');
  burger?.setAttribute('aria-expanded', 'false');
}

burger?.addEventListener('click', () => {
  const open = mobileNav.classList.toggle('is-open');
  mobileNav.setAttribute('aria-hidden', String(!open));
  burger.setAttribute('aria-expanded', String(open));
});
mobileNav?.addEventListener('click', (e) => {
  if (e.target === mobileNav) closeMobileNav();
});
