// Shots page — nav state + the full-size lightbox.
// Full-resolution sources are only fetched when a shot is actually opened,
// so the gallery itself stays light.

// Dark page: the top nav needs its white pill state from the start.
document.getElementById('site-nav')?.classList.add('is-scrolled');

const lightbox = document.querySelector('[data-lightbox]');
const lightboxImg = document.querySelector('[data-lightbox-img]');

if (lightbox && lightboxImg) {
  let lastFocused = null;

  const open = (button) => {
    lastFocused = button;
    lightboxImg.src = button.dataset.full;
    lightboxImg.alt = button.dataset.alt || '';
    lightbox.hidden = false;
    // next frame, so the fade/scale transition actually runs
    requestAnimationFrame(() => lightbox.classList.add('is-open'));
    document.body.style.overflow = 'hidden';
    lightbox.querySelector('.lightbox__close')?.focus();
  };

  const close = () => {
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
    lastFocused?.focus();
    const done = () => {
      lightbox.hidden = true;
      lightboxImg.removeAttribute('src'); // drop the full-res frame from memory
    };
    // wait out the fade, but never hang if the transition never fires
    lightbox.addEventListener('transitionend', done, { once: true });
    setTimeout(done, 400);
  };

  document.querySelectorAll('[data-lightbox-open]').forEach((button) => {
    button.addEventListener('click', () => open(button));
  });

  lightbox.querySelectorAll('[data-lightbox-close]').forEach((button) => {
    button.addEventListener('click', close);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !lightbox.hidden) close();
  });
}
