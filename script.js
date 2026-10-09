/* ============================================================
   KRRAHMAN PORTFOLIO — script.js
   ============================================================ */

// ===== NAVBAR: scroll effect & active link =====
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
  // back-to-top visibility
  backToTop.classList.toggle('visible', window.scrollY > 400);
  // active nav link
  highlightNavLink();
});

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', open);
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.setAttribute('aria-expanded', false);
  });
});

// ===== ACTIVE NAV LINK ON SCROLL =====
function highlightNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const scrollPos = window.scrollY + 100;
  sections.forEach(sec => {
    const top    = sec.offsetTop;
    const height = sec.offsetHeight;
    const id     = sec.getAttribute('id');
    const link   = navLinks.querySelector(`a[href="#${id}"]`);
    if (link) {
      link.classList.toggle('active-link', scrollPos >= top && scrollPos < top + height);
    }
  });
}

// ===== TYPED TEXT EFFECT =====
const phrases = [
  '& Digital Marketer',
  '& WooCommerce Expert',
  '& Theme Developer',
  '& Landing Page Builder',
  '& SEO Specialist',
];
let phraseIndex = 0;
let charIndex   = 0;
let isDeleting  = false;
const typedEl   = document.getElementById('typed-text');

function type() {
  if (!typedEl) return;
  const current = phrases[phraseIndex];

  if (!isDeleting) {
    typedEl.textContent = current.slice(0, charIndex + 1);
    charIndex++;
    if (charIndex === current.length) {
      isDeleting = true;
      setTimeout(type, 1800);
      return;
    }
  } else {
    typedEl.textContent = current.slice(0, charIndex - 1);
    charIndex--;
    if (charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
    }
  }
  setTimeout(type, isDeleting ? 60 : 90);
}
type();

// ===== SCROLL REVEAL =====
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // trigger counter if stat inside
      const counters = entry.target.querySelectorAll('[data-count]');
      counters.forEach(animateCounter);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('[data-reveal], [data-reveal-delay]').forEach(el => {
  revealObserver.observe(el);
});

// Service, portfolio, testimonial cards
document.querySelectorAll('.service-card, .portfolio-item, .testimonial-card, .tech-item').forEach((el, i) => {
  el.style.transitionDelay = `${(i % 4) * 0.08}s`;
  el.setAttribute('data-reveal', '');
  revealObserver.observe(el);
});

// ===== ANIMATED COUNTERS =====
function animateCounter(el) {
  if (el.dataset.animated) return;
  el.dataset.animated = true;
  const target = parseInt(el.dataset.count, 10);
  const duration = 1600;
  const step = Math.ceil(duration / target);
  let current = 0;
  const timer = setInterval(() => {
    current++;
    el.textContent = current;
    if (current >= target) clearInterval(timer);
  }, step);
}

// Observe hero stats separately (hero is above fold)
const statNums = document.querySelectorAll('.stat-num[data-count]');
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
    }
  });
}, { threshold: 0.5 });
statNums.forEach(el => statsObserver.observe(el));

// ===== PORTFOLIO FILTER =====
const filterBtns    = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;
    portfolioItems.forEach(item => {
      const show = filter === 'all' || item.dataset.category === filter;
      item.classList.toggle('hidden', !show);
    });
  });
});

// ===== EMAILJS CONTACT FORM =====
// ─────────────────────────────────────────────────────────────
//  SETUP (one-time, takes ~3 minutes):
//
//  1. Go to https://www.emailjs.com  → Sign Up Free (use khalil5172@gmail.com)
//  2. Dashboard → Email Services → Add New Service → Gmail
//     • Click "Connect Account" → sign in with your Gmail → Save
//     • Copy the Service ID  (e.g. "service_abc123")  → paste below
//
//  3. Dashboard → Email Templates → Create New Template
//     • Subject:  New message from {{from_name}} – Krrahman Portfolio
//     • Body:
//         Name:    {{from_name}}
//         Email:   {{from_email}}
//         Phone:   {{phone}}
//         Budget:  {{budget}}
//         Service: {{service}}
//
//         Message:
//         {{message}}
//     • "To Email" field: khalil5172@gmail.com
//     • Save → Copy the Template ID (e.g. "template_xyz789") → paste below
//
//  4. Dashboard → Account → Public Key → copy → paste below
//
//  Free plan: 200 emails/month — more than enough for a portfolio.
// ─────────────────────────────────────────────────────────────

const EMAILJS_PUBLIC_KEY  = '71C-u82RSRjnvZSD8';
const EMAILJS_SERVICE_ID  = 'service_u73c59d';
const EMAILJS_TEMPLATE_ID = 'template_q0fi7e9';

// Initialise EmailJS with your public key
emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

const contactForm = document.getElementById('contact-form');
const formNote    = document.getElementById('form-note');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const btn = contactForm.querySelector('button[type="submit"]');

  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';
  formNote.style.color = '';
  formNote.textContent = '';

  // Collect form values — names must match your EmailJS template variables
  const templateParams = {
    from_name : document.getElementById('c-name').value.trim(),
    from_email: document.getElementById('c-email').value.trim(),
    phone     : document.getElementById('c-phone').value.trim() || 'Not provided',
    budget    : document.getElementById('c-budget').value      || 'Not specified',
    service   : document.getElementById('c-service').value     || 'Not specified',
    message   : document.getElementById('c-message').value.trim(),
  };

  emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
    .then(() => {
      formNote.style.color = '#43e97b';
      formNote.textContent = '✅ Message sent! I\'ll reply within 24 hours.';
      contactForm.reset();
      btn.disabled = false;
      btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
      setTimeout(() => { formNote.textContent = ''; }, 7000);
    })
    .catch((err) => {
      console.error('EmailJS error:', err);
      formNote.style.color = '#ff6584';
      formNote.textContent = '❌ Oops! Something went wrong. Please email me directly: khalil5172@gmail.com';
      btn.disabled = false;
      btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
    });
});

// ===== BACK TO TOP =====
const backToTop = document.getElementById('back-to-top');
backToTop.addEventListener('click', (e) => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
