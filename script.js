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

mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('active');
  });
});

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
  const duration = 1800;
  const startTime = performance.now();

  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
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
   5. SMOOTH SCROLL
   ──────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const id = link.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const offset = 68;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});


/* ────────────────────────────────────────
   6. CONTACT FORM ? EmailJS 실제 발송
   ──────────────────────────────────────── */
emailjs.init('hiCp0jeQiIEa0Mngy');

const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // 유효성 검사
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
      contactForm.style.animation = 'none';
      setTimeout(() => {
        contactForm.style.animation = 'shake 0.4s ease';
      }, 10);
      return;
    }

    // 전송 시작
    const btn = contactForm.querySelector('.form-submit');
    const originalHTML = btn.innerHTML;
    btn.innerHTML = '<span>전송 중...</span>';
    btn.disabled = true;

    // EmailJS 발송
    const templateParams = {
      company: contactForm.company.value,
      name:    contactForm.name.value,
      phone:   contactForm.phone.value,
      email:   contactForm.email.value,
      subject: contactForm.subject.value || '미선택',
      message: contactForm.message.value,
    };

    emailjs.send('service_dmgaz2u', 'vntrxhe', templateParams)
      .then(() => {
        btn.innerHTML = originalHTML;
        btn.disabled = false;
        formSuccess.style.color = '#6dc87d';
        formSuccess.style.borderColor = 'rgba(100,200,120,0.3)';
        formSuccess.textContent = '? 문의가 접수되었습니다. 영업일 기준 1일 이내 연락드리겠습니다.';
        formSuccess.classList.add('show');
        contactForm.reset();
        setTimeout(() => formSuccess.classList.remove('show'), 6000);
      })
      .catch((error) => {
        btn.innerHTML = originalHTML;
        btn.disabled = false;
        formSuccess.style.color = '#e05353';
        formSuccess.style.borderColor = 'rgba(220,50,50,0.3)';
        formSuccess.textContent = '? 전송 중 오류가 발생했습니다. 전화로 문의해 주세요. (051-319-0979)';
        formSuccess.classList.add('show');
        console.error('EmailJS error:', error);
      });
  });

  contactForm.querySelectorAll('input, textarea').forEach(field => {
    field.addEventListener('input', () => {
      field.style.borderColor = '';
    });
  });
}

// Shake 애니메이션
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
   7. ACTIVE NAV LINK on scroll (spy)
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
   8. HERO PARALLAX
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
   9. PROD CARDS ? 클릭시 문의 폼으로 이동
   ──────────────────────────────────────── */
document.querySelectorAll('.prod-card').forEach(card => {
  card.addEventListener('click', () => {
    const name = card.querySelector('h3')?.textContent || '';
    const subjectSelect = document.getElementById('subject');
    if (subjectSelect) subjectSelect.value = 'quote';
    const messageField = document.getElementById('message');
    if (messageField && !messageField.value) {
      messageField.value = `${name} 관련 견적을 문의드립니다.\n\n`;
      messageField.focus();
    }
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
