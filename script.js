/* ════════════════════════════════════════════════
   Lumière Coiffure — JavaScript
   ════════════════════════════════════════════════ */

// ─── NAVBAR SCROLL EFFECT ───────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

// ─── HAMBURGER MENU ─────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ─── FLOATING PARTICLES (HERO) ───────────────────
(function createParticles() {
  const container = document.getElementById('particles');
  const N = 22;
  for (let i = 0; i < N; i++) {
    const p = document.createElement('div');
    const size = Math.random() * 4 + 1.5;
    const isGold = Math.random() > 0.5;
    Object.assign(p.style, {
      position:     'absolute',
      width:         size + 'px',
      height:        size + 'px',
      borderRadius: '50%',
      background:    isGold ? 'rgba(212,175,55,0.55)' : 'rgba(255,255,255,0.25)',
      left:          Math.random() * 100 + '%',
      top:           Math.random() * 100 + '%',
      animation:    `particle-float ${5 + Math.random() * 8}s ${Math.random() * 5}s ease-in-out infinite alternate`,
      filter:        `blur(${Math.random() > 0.6 ? 1 : 0}px)`,
    });
    container.appendChild(p);
  }
  // Inject particle keyframe
  const style = document.createElement('style');
  style.textContent = `@keyframes particle-float {
    from { transform: translate(0, 0) scale(1); opacity: 0.5; }
    to   { transform: translate(${['12px','-10px','8px','-14px'][Math.floor(Math.random()*4)]}, -20px) scale(1.3); opacity: 1; }
  }`;
  document.head.appendChild(style);
})();

// ─── COUNTER ANIMATION ──────────────────────────
function animateCounters() {
  document.querySelectorAll('.stat-num').forEach(el => {
    const target = +el.dataset.target;
    const duration = 1600;
    const start = performance.now();
    function step(now) {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.floor(eased * target).toLocaleString('fr-FR');
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  });
}
let countersAnimated = false;

// ─── SCROLL REVEAL ──────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => entry.target.classList.add('visible'), +delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

// ─── HERO STATS OBSERVER ────────────────────────
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !countersAnimated) {
      countersAnimated = true;
      animateCounters();
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.hero-stats').forEach(el => statsObserver.observe(el));

// Add reveal class to target elements & observe
document.querySelectorAll(
  '.service-card, .gallery-item, .about-image-wrap, .about-content, ' +
  '.testimonial-card, .info-block, .contact-form-wrap, .section-header'
).forEach(el => {
  el.classList.add('reveal');
  revealObserver.observe(el);
});

// ─── TESTIMONIALS CAROUSEL ──────────────────────
const cards = Array.from(document.querySelectorAll('.testimonial-card'));
const dotsContainer = document.getElementById('tDots');
let currentSlide = 0;
let autoTimer;

function buildDots() {
  dotsContainer.innerHTML = '';
  cards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'tctrl-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Avis ${i + 1}`);
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  });
}

function goToSlide(idx) {
  cards[currentSlide].classList.remove('active');
  dotsContainer.children[currentSlide].classList.remove('active');
  currentSlide = (idx + cards.length) % cards.length;
  cards[currentSlide].classList.add('active');
  dotsContainer.children[currentSlide].classList.add('active');
  resetAutoPlay();
}

function resetAutoPlay() {
  clearInterval(autoTimer);
  autoTimer = setInterval(() => goToSlide(currentSlide + 1), 5000);
}

buildDots();
cards[0].classList.add('active');
document.getElementById('tPrev').addEventListener('click', () => goToSlide(currentSlide - 1));
document.getElementById('tNext').addEventListener('click', () => goToSlide(currentSlide + 1));
resetAutoPlay();

// ─── CONTACT FORM ───────────────────────────────
const contactForm  = document.getElementById('contactForm');
const formSuccess  = document.getElementById('formSuccess');
const resetFormBtn = document.getElementById('resetForm');
const submitBtn    = document.getElementById('submitBtn');
const dateInput    = document.getElementById('dateInput');

// Set minimum date to today
const today = new Date().toISOString().split('T')[0];
dateInput.min = today;

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!contactForm.checkValidity()) {
    contactForm.querySelectorAll('input, select, textarea').forEach(input => {
      if (!input.validity.valid) {
        input.style.borderColor = 'rgba(239,68,68,0.6)';
        input.style.boxShadow   = '0 0 0 3px rgba(239,68,68,0.08)';
        input.addEventListener('input', () => {
          input.style.borderColor = '';
          input.style.boxShadow   = '';
        }, { once: true });
      }
    });
    return;
  }
  // Simulate submission
  submitBtn.textContent = '…Envoi en cours';
  submitBtn.disabled = true;
  setTimeout(() => {
    contactForm.hidden = true;
    formSuccess.hidden = false;
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<span class="btn-text">Envoyer la demande</span><span class="btn-icon">✦</span>';
  }, 1200);
});

resetFormBtn.addEventListener('click', () => {
  contactForm.reset();
  contactForm.hidden = false;
  formSuccess.hidden = true;
});

// ─── SMOOTH ACTIVE NAV LINK ─────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinkEls = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinkEls.forEach(link => {
        link.style.color = link.getAttribute('href') === '#' + entry.target.id
          ? 'var(--gold)'
          : '';
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));
