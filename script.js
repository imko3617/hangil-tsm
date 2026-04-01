/* ============================================================
   한길티에스엠 ? script.js
   ============================================================ */

'use strict';

/* ────────────────────────────────────────
   1. HEADER ? scroll effect & active state
   ──────────────────────────────────────── */
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
}, { passive: true });


/* ────────────────────────────────────────
   2. HAMBURGER MENU (mobile)
   ──────────────────────────────────────── */
const hamburger   = document.getElementById('hamburger');
const mobileMenu  = document.getElementById('mobileMenu');
const mobileLinks = document.querySelectorAll('.mobile-link, .mobile-cta');

hamburger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  hamburger.classList.toggle('active');
  hamburger.setAttribute('aria-label', isOpen ? '메뉴 닫기' : '메뉴 열기');
});

// Close on link click
mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('active');
  });
});

// Close on outside click
document.addEventListener('click', (e) => {
  if (!header.contains(e.target)) {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('active');
  }
});


/* ────────────────────────────────────────
   3. SCROLL REVEAL (Intersection Observer)
   ──────────────────────────────────────── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');

      // Special: trigger about card bar animation
      if (entry.target.classList.contains('about-right')) {
        const fill = entry.target.querySelector('.acb-fill');
        if (fill) fill.classList.add('animate');
      }

      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
});

document.querySelectorAll('.reveal, .reveal-delay').forEach(el => {
  revealObserver.observe(el);
});


/* ────────────────────────────────────────
   4. COUNTER ANIMATION
   ──────────────────────────────────────── */
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1800; // ms
  const startTime = performance.now();

  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease-out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target).toLocaleString();
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.counter').forEach(el => {
  counterObserver.observe(el);
});


/* ────────────────────────────────────────
   5. SMOOTH SCROLL for anchor links
   ──────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const id = link.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const offset = 68; // header height
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});


/* ────────────────────────────────────────
   6. PRODUCT CARDS ? stagger on scroll
   ──────────────────────────────────────── */
// Individual delay already in CSS via --d variable
// Extra: cards inside #products grid use the reveal observer too


/* ────────────────────────────────────────
   7. CONTACT FORM ? validation & submit
   ──────────────────────────────────────── */
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Basic validation
    const required = contactForm.querySelectorAll('[required]');
    let valid = true;

    required.forEach(field => {
      field.style.borderColor = '';
      if (!field.value.trim()) {
        field.style.borderColor = '#e05353';
        valid = false;
      }
    });

    if (!valid) {
      // Shake effect
      contactForm.style.animation = 'none';
      setTimeout(() => {
        contactForm.style.animation = 'shake 0.4s ease';
      }, 10);
      return;
    }

    // Simulate submit
    const btn = contactForm.querySelector('.form-submit');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<span>전송 중...</span>';
    btn.disabled = true;

    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.disabled = false;
      formSuccess.classList.add('show');
      contactForm.reset();

      // Hide success after 6s
      setTimeout(() => {
        formSuccess.classList.remove('show');
      }, 6000);
    }, 1200);
  });

  // Real-time validation clear on input
  contactForm.querySelectorAll('input, textarea').forEach(field => {
    field.addEventListener('input', () => {
      field.style.borderColor = '';
    });
  });
}

// Shake keyframe injected dynamically
const style = document.createElement('style');
style.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20% { transform: translateX(-8px); }
    40% { transform: translateX(8px); }
    60% { transform: translateX(-5px); }
    80% { transform: translateX(5px); }
  }
`;
document.head.appendChild(style);


/* ────────────────────────────────────────
   8. ACTIVE NAV LINK on scroll (spy)
   ──────────────────────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

const spyObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navAnchors.forEach(a => {
        a.style.color = '';
        if (a.getAttribute('href') === `#${id}`) {
          a.style.color = 'var(--orange-l)';
        }
      });
    }
  });
}, {
  rootMargin: '-40% 0px -50% 0px'
});

sections.forEach(s => spyObserver.observe(s));


/* ────────────────────────────────────────
   9. HERO BACKGROUND PARALLAX (subtle)
   ──────────────────────────────────────── */
const heroGlow = document.querySelector('.hero-glow');
if (heroGlow) {
  window.addEventListener('mousemove', (e) => {
    if (window.scrollY > window.innerHeight) return;
    const x = (e.clientX / window.innerWidth - 0.5) * 30;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;
    heroGlow.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
  }, { passive: true });
}


/* ────────────────────────────────────────
   10. PROD CARDS ? open feedback (optional)
   ──────────────────────────────────────── */
document.querySelectorAll('.prod-card').forEach(card => {
  card.addEventListener('click', () => {
    const name = card.querySelector('h3')?.textContent || '';
    // Scroll to contact and pre-fill subject
    const subjectSelect = document.getElementById('subject');
    if (subjectSelect) {
      subjectSelect.value = 'quote';
    }
    const messageField = document.getElementById('message');
    if (messageField && !messageField.value) {
      messageField.value = `${name} 관련 견적을 문의드립니다.\n\n`;
      messageField.focus();
    }
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});