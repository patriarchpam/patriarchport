/* =============================================
   PATRIARCH.DEV — PORTFOLIO JAVASCRIPT
   ============================================= */

'use strict';

// ── Typing Animation ────────────────────────────────────────────────────────
(function initTyping() {
  const el = document.getElementById('typed-text');
  if (!el) return;

  const phrases = [
    'stunning web apps.',
    'beautiful UIs.',
    'React experiences.',
    'Flutter apps.',
    'creative solutions.',
    'full-stack products.',
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let pause = false;

  function type() {
    if (pause) return;
    const current = phrases[phraseIndex];

    if (!isDeleting) {
      el.textContent = current.slice(0, charIndex + 1);
      charIndex++;
      if (charIndex === current.length) {
        pause = true;
        setTimeout(() => { isDeleting = true; pause = false; type(); }, 2000);
        return;
      }
    } else {
      el.textContent = current.slice(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
      }
    }

    const speed = isDeleting ? 45 : 85;
    setTimeout(type, speed);
  }

  // Start after a brief delay
  setTimeout(type, 800);
})();

// ── Scroll-triggered Navbar ──────────────────────────────────────────────────
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  function onScroll() {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

// ── Mobile Menu ──────────────────────────────────────────────────────────────
(function initMobileMenu() {
  const btn = document.getElementById('menu-btn');
  const navLinks = document.getElementById('nav-links');
  const overlay = document.getElementById('mobile-overlay');
  if (!btn || !navLinks) return;

  function close() {
    btn.classList.remove('open');
    navLinks.classList.remove('open');
    if (overlay) overlay.classList.remove('active');
    btn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  function toggle() {
    const isOpen = navLinks.classList.contains('open');
    if (isOpen) {
      close();
    } else {
      btn.classList.add('open');
      navLinks.classList.add('open');
      if (overlay) overlay.classList.add('active');
      btn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }
  }

  btn.addEventListener('click', toggle);
  if (overlay) overlay.addEventListener('click', close);

  // Close on nav link click
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', close);
  });
})();

// ── Active Nav Spy ────────────────────────────────────────────────────────────
(function initNavSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[data-section]');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.toggle('active', link.dataset.section === id);
        });
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });

  sections.forEach(s => observer.observe(s));
})();

// ── Scroll Reveal ─────────────────────────────────────────────────────────────
(function initReveal() {
  const elements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  if (!elements.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  elements.forEach(el => observer.observe(el));
})();

// ── Back to Top ───────────────────────────────────────────────────────────────
(function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

// ── Project Filter ────────────────────────────────────────────────────────────
(function initFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card');
  if (!filterBtns.length || !cards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      cards.forEach((card, i) => {
        const category = card.dataset.category;
        const show = filter === 'all' || category === filter;

        if (show) {
          card.classList.remove('hidden');
          // Stagger re-appearance
          card.style.transitionDelay = `${i * 0.05}s`;
        } else {
          card.classList.add('hidden');
          card.style.transitionDelay = '0s';
        }
      });
    });
  });
})();

// ── Project Modal ─────────────────────────────────────────────────────────────
function openModal(imgSrc, title, description, tags) {
  const modal = document.getElementById('projectModal');
  const body = document.getElementById('modalBody');
  if (!modal || !body) return;

  const tagsHtml = Array.isArray(tags)
    ? `<div class="modal-tags">${tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>`
    : '';

  body.innerHTML = `
    <img src="${imgSrc}" alt="${title}" loading="lazy">
    <h2>${title}</h2>
    ${tagsHtml}
    <p>${description}</p>
  `;

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';

  // Close on Escape
  document.addEventListener('keydown', closeOnEsc);
}

function closeModal() {
  const modal = document.getElementById('projectModal');
  if (!modal) return;
  modal.classList.remove('open');
  document.body.style.overflow = '';
  document.removeEventListener('keydown', closeOnEsc);
}

function closeOnEsc(e) {
  if (e.key === 'Escape') closeModal();
}

// Expose to global for inline onclick attributes
window.openModal = openModal;
window.closeModal = closeModal;

// ── EmailJS Init ──────────────────────────────────────────────────────────────
// 📌 SETUP STEPS (one-time, free):
//  1. Go to https://emailjs.com and sign up (free — 200 emails/month)
//  2. Add a Gmail "Email Service" and copy the Service ID
//  3. Create an Email Template with these variables:
//       {{from_name}}, {{from_email}}, {{phone}}, {{subject}}, {{message}}
//     Set the "To Email" in the template to: patriachpam@gmail.com
//  4. Copy your Public Key from Account > API Keys
//  5. Replace the three placeholder strings below:
const EMAILJS_PUBLIC_KEY  = 'YOUR_PUBLIC_KEY';   // ← paste here
const EMAILJS_SERVICE_ID  = 'YOUR_SERVICE_ID';   // ← paste here
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';  // ← paste here

if (typeof emailjs !== 'undefined') {
  emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
}

// ── Contact Form — Email + WhatsApp SMS ──────────────────────────────────────
(function initContactForm() {
  const form      = document.getElementById('contact-form');
  const statusBox = document.getElementById('form-status');
  const submitBtn = document.getElementById('submit-btn');
  const btnText   = document.getElementById('btn-text');
  if (!form || !statusBox || !submitBtn) return;

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    // ── Collect values ──────────────────────────────────────────────────────
    const name    = form.elements['name'].value.trim();
    const email   = form.elements['email'].value.trim();
    const phone   = form.elements['phone']?.value.trim() || 'Not provided';
    const subject = form.elements['subject']?.value.trim() || 'Portfolio Contact';
    const message = form.elements['message'].value.trim();

    // ── Loading state ───────────────────────────────────────────────────────
    submitBtn.classList.add('loading');
    if (btnText) btnText.textContent = 'Sending…';
    statusBox.className = 'form-status';
    statusBox.style.display = 'none';

    let emailSent = false;

    // ── 1. Send Email via EmailJS ───────────────────────────────────────────
    try {
      if (typeof emailjs !== 'undefined' && EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
          from_name : name,
          from_email: email,
          phone     : phone,
          subject   : subject,
          message   : message,
        });
        emailSent = true;
      } else {
        // Fallback: open mailto link if EmailJS not configured yet
        const mailto = `mailto:patriachpam@gmail.com`
          + `?subject=${encodeURIComponent('[Portfolio] ' + subject)}`
          + `&body=${encodeURIComponent(`From: ${name}\nEmail: ${email}\nPhone: ${phone}\n\n${message}`)}`;
        window.location.href = mailto;
        emailSent = true;
      }
    } catch (err) {
      console.error('EmailJS error:', err);
    }

    // ── 2. Send WhatsApp "SMS" notification to your phone ───────────────────
    // This opens WhatsApp web/app with a pre-filled message so you get
    // an instant phone notification whenever someone contacts you.
    const waText = encodeURIComponent(
      `📬 *New Portfolio Contact!*\n\n`
      + `👤 *Name:* ${name}\n`
      + `📧 *Email:* ${email}\n`
      + `📞 *Phone:* ${phone}\n`
      + `📌 *Subject:* ${subject}\n\n`
      + `💬 *Message:*\n${message}`
    );
    const waUrl = `https://wa.me/2348035379082?text=${waText}`;

    // Open WhatsApp in a new tab (silently — won't block the page)
    const waWindow = window.open(waUrl, '_blank', 'noopener,noreferrer');

    // ── Show result ─────────────────────────────────────────────────────────
    submitBtn.classList.remove('loading');
    if (btnText) btnText.textContent = 'Send Message';

    if (emailSent) {
      statusBox.textContent = '✅ Message sent! Email delivered + WhatsApp notification opened.';
      statusBox.className = 'form-status success';
      form.reset();
    } else {
      statusBox.textContent = '⚠️ Email delivery failed. A WhatsApp window was opened as backup — please complete it.';
      statusBox.className = 'form-status error';
    }
  });
})();


// ── GitHub Profile Stats (live fetch via GitHub API) ──────────────────────────
(function initGithubStats() {
  const accounts = [
    { username: 'patriarchpam', cardId: 'gh-card-1', nameId: 'gh1-name', avatarId: 'gh1-avatar', linkId: 'gh1-link' },
    { username: 'patriarchpamyeipyeng', cardId: 'gh-card-2', nameId: 'gh2-name', avatarId: 'gh2-avatar', linkId: 'gh2-link' },
  ];

  accounts.forEach(({ username, cardId, nameId, avatarId, linkId }) => {
    const card = document.getElementById(cardId);
    if (!card) return;

    const statVals = card.querySelectorAll('.gh-stat-val');

    fetch(`https://api.github.com/users/${username}`)
      .then(res => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then(data => {
        // Update avatar
        const avatarEl = document.getElementById(avatarId);
        if (avatarEl && data.avatar_url) {
          avatarEl.src = data.avatar_url;
        }

        // Update name
        const nameEl = document.getElementById(nameId);
        if (nameEl) nameEl.textContent = `@${data.login}`;

        // Update link
        const linkEl = document.getElementById(linkId);
        if (linkEl) linkEl.href = data.html_url;

        // Update stats: repos, (stars n/a without extra call), followers
        if (statVals[0]) statVals[0].textContent = data.public_repos ?? '—';
        if (statVals[2]) statVals[2].textContent = data.followers ?? '—';

        // Fetch starred repos for star count approx
        return fetch(`https://api.github.com/users/${username}/repos?per_page=100`);
      })
      .then(res => {
        if (!res || !res.ok) return null;
        return res.json();
      })
      .then(repos => {
        if (!repos || !Array.isArray(repos)) return;
        const totalStars = repos.reduce((acc, r) => acc + (r.stargazers_count || 0), 0);
        const card2 = document.getElementById(cardId);
        if (!card2) return;
        const sv = card2.querySelectorAll('.gh-stat-val');
        if (sv[1]) sv[1].textContent = totalStars;
      })
      .catch(() => {
        // Silently fail — placeholder dashes remain
      });
  });
})();

// ── Smooth scroll polyfill for older browsers ─────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
