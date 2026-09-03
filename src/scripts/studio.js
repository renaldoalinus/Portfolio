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
    // reveal happens between "section reaches top" and ~0.9 viewport later,
    // compressed (×1.3) so the whole line is sharp well before the cards arrive
    const p = clamp01((scrollY - sectionTop + vh * 0.55) / (vh * 0.9)) * 1.3;
    // re-blur only once the cards are genuinely close to covering the line
    let q = 0;
    if (workCards) {
      const cardsTop = workCards.getBoundingClientRect().top;
      q = clamp01((vh * 0.55 - cardsTop) / (vh * 0.45));
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

// ---------------------------------------------------------------- hero stars
// Each star drifts on its own slow vertical sine, and is pushed directly away
// from the cursor when it comes within its influence radius. The push falls off
// quadratically with distance and is eased toward rather than snapped to, so
// the stars drift out of the way and settle back rather than tracking sharply.
const starLayer = document.querySelector('[data-stars]');

if (starLayer && !reducedMotion) {
  const stars = [...starLayer.querySelectorAll('[data-star]')].map((el) => ({
    el,
    cfg: JSON.parse(el.dataset.cfg),
    dx: 0,
    dy: 0,
  }));

  // Parked far outside the layer so nothing is pushed until the cursor arrives.
  const pointer = { x: -1e4, y: -1e4 };
  const start = performance.now();
  let frame = null;

  const tick = () => {
    const elapsed = performance.now() - start;
    const box = starLayer.getBoundingClientRect();

    for (const star of stars) {
      const { cfg } = star;
      const float =
        Math.sin((elapsed / cfg.floatPeriodMs + cfg.floatPhase) * Math.PI * 2) *
        cfg.floatAmplitude;

      // vector from cursor to the star's resting point
      const ax = (cfg.baseLeftPct / 100) * box.width - pointer.x;
      const ay = (cfg.baseTopPct / 100) * box.height - pointer.y;
      const dist = Math.hypot(ax, ay);

      let pushX = 0;
      let pushY = 0;
      if (dist < cfg.influenceRadius && dist > 0.001) {
        const falloff = (1 - dist / cfg.influenceRadius) ** 2;
        pushX = (ax / dist) * falloff * cfg.maxPush;
        pushY = (ay / dist) * falloff * cfg.maxPush;
      }

      star.dx += (pushX - star.dx) * 0.07;
      star.dy += (pushY - star.dy) * 0.07;

      star.el.style.transform =
        `translate(-50%, -50%) translate3d(${star.dx.toFixed(2)}px, ${(star.dy + float).toFixed(2)}px, 0) rotate(${cfg.rotate}deg)`;
    }

    frame = requestAnimationFrame(tick);
  };

  const onMove = (e) => {
    const box = starLayer.getBoundingClientRect();
    pointer.x = e.clientX - box.left;
    pointer.y = e.clientY - box.top;
  };
  const onLeave = () => {
    pointer.x = -1e4;
    pointer.y = -1e4;
  };

  window.addEventListener('mousemove', onMove, { passive: true });
  starLayer.addEventListener('mouseleave', onLeave);

  // The layer is display:none below 768px — no point animating it there.
  const desktop = window.matchMedia('(min-width: 768px)');
  const sync = () => {
    if (desktop.matches && frame === null) frame = requestAnimationFrame(tick);
    else if (!desktop.matches && frame !== null) {
      cancelAnimationFrame(frame);
      frame = null;
    }
  };
  desktop.addEventListener('change', sync);
  sync();
}
