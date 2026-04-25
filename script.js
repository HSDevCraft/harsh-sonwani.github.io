/* ============================================================
   PORTFOLIO SCRIPT v2 — Enriched Interactions
   Dark Mode · Typing · 3D Tilt · Magnetic · Particles · Reveal
   ============================================================ */

/* ── Theme Toggle ── */
const themeToggle = document.getElementById('themeToggle');
const themeIcon   = document.getElementById('themeIcon');
const html        = document.documentElement;

const savedTheme = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', savedTheme);
themeIcon.className = savedTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';

themeToggle.addEventListener('click', () => {
  const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  themeIcon.className = next === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
});

/* ── Mobile Nav ── */
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
  navLinks.querySelectorAll('a').forEach(l => l.addEventListener('click', () => navLinks.classList.remove('open')));
}

/* ── Smooth Scroll ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 68, behavior: 'smooth' });
    }
  });
});

/* ── Navbar: Scroll Shadow + Active Section ── */
const navbar   = document.getElementById('navbar');
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
  const mid = window.scrollY + window.innerHeight / 2;
  sections.forEach(sec => {
    if (mid >= sec.offsetTop && mid < sec.offsetTop + sec.offsetHeight) {
      navItems.forEach(a => a.classList.remove('active'));
      const m = document.querySelector(`.nav-link[href="#${sec.id}"]`);
      if (m) m.classList.add('active');
    }
  });
}, { passive: true });

/* ── Cursor Glow ── */
const cursorGlow = document.getElementById('cursorGlow');
if (cursorGlow && window.matchMedia('(pointer:fine)').matches) {
  let cx = 0, cy = 0, tx = 0, ty = 0;
  document.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; });
  (function moveCursor() {
    cx += (tx - cx) * 0.08;
    cy += (ty - cy) * 0.08;
    cursorGlow.style.left = cx + 'px';
    cursorGlow.style.top  = cy + 'px';
    requestAnimationFrame(moveCursor);
  })();
}

/* ── Typing Effect ── */
const phrases = ['RAG Pipelines', 'Agentic AI Systems', 'LLM Solutions', 'GenAI Platforms', 'Knowledge Graphs', 'Scalable AI'];
const typedEl = document.getElementById('typedText');
let phraseIdx = 0, charIdx = 0, deleting = false;
function type() {
  if (!typedEl) return;
  const cur = phrases[phraseIdx];
  typedEl.textContent = deleting ? cur.slice(0, --charIdx) : cur.slice(0, ++charIdx);
  let delay = deleting ? 45 : 85;
  if (!deleting && charIdx === cur.length) { delay = 2000; deleting = true; }
  else if (deleting && charIdx === 0)      { deleting = false; phraseIdx = (phraseIdx + 1) % phrases.length; delay = 400; }
  setTimeout(type, delay);
}
setTimeout(type, 900);

/* ── Staggered Scroll Reveal (per-section grouping) ── */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el  = entry.target;
    const idx = parseInt(el.dataset.revealIdx || 0);
    setTimeout(() => el.classList.add('revealed'), idx * 120);
    revealObs.unobserve(el);
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach((el, i, arr) => {
  /* Group siblings in same parent for per-group staggering */
  const siblings = Array.from(el.parentElement.querySelectorAll('.reveal-up, .reveal-left, .reveal-right'));
  const localIdx = siblings.indexOf(el);
  el.dataset.revealIdx = localIdx >= 0 ? localIdx : i % 5;
  revealObs.observe(el);
});

/* ── Counter Animation ── */
function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  let current  = 0;
  const step   = target / 80;
  const timer  = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = (target > 100 ? Math.floor(current).toLocaleString() : Math.floor(current)) + suffix;
    if (current >= target) clearInterval(timer);
  }, 20);
}
const counterObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { animateCounter(e.target); counterObs.unobserve(e.target); } });
}, { threshold: 0.6 });
document.querySelectorAll('.stat-num').forEach(el => counterObs.observe(el));

/* ── Skill Bar Animation (staggered per group) ── */
const skillObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const group = entry.target;
    group.querySelectorAll('.skill-bar').forEach((bar, i) => {
      setTimeout(() => {
        const fill  = bar.querySelector('.sb-fill');
        const level = bar.dataset.level;
        if (fill && level) fill.style.width = level + '%';
      }, i * 180);
    });
    skillObs.unobserve(group);
  });
}, { threshold: 0.2 });
document.querySelectorAll('.skill-group').forEach(g => skillObs.observe(g));

/* ── 3D Tilt on Project Cards ── */
document.querySelectorAll('.proj-card[data-tilt]').forEach(card => {
  const glow = card.querySelector('.proj-glow');

  card.addEventListener('mousemove', e => {
    const rect  = card.getBoundingClientRect();
    const x     = e.clientX - rect.left;
    const y     = e.clientY - rect.top;
    const cx    = rect.width  / 2;
    const cy    = rect.height / 2;
    const rotX  = ((y - cy) / cy) * -8;
    const rotY  = ((x - cx) / cx) *  8;
    const pctX  = ((x / rect.width)  * 100).toFixed(1);
    const pctY  = ((y / rect.height) * 100).toFixed(1);

    card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-8px) scale(1.01)`;
    if (glow) { glow.style.setProperty('--mx', pctX + '%'); glow.style.setProperty('--my', pctY + '%'); }
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.boxShadow = '';
  });
});

/* ── Magnetic Buttons ── */
document.querySelectorAll('.btn-primary, .btn-ghost').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const rect = btn.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width  / 2);
    const dy = e.clientY - (rect.top  + rect.height / 2);
    btn.style.transform = `translate(${dx * 0.22}px, ${dy * 0.22}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
    btn.style.transition = 'transform 0.5s cubic-bezier(0.23,1,0.32,1)';
    setTimeout(() => btn.style.transition = '', 500);
  });
});

/* ── Sparkle Burst on Primary Button Click ── */
function createSparkle(x, y) {
  for (let i = 0; i < 10; i++) {
    const dot = document.createElement('span');
    const angle = (i / 10) * Math.PI * 2;
    const dist  = 40 + Math.random() * 40;
    dot.style.cssText = `
      position:fixed; width:5px; height:5px; border-radius:50%;
      background:hsl(${240 + Math.random()*60},100%,70%);
      left:${x}px; top:${y}px; pointer-events:none; z-index:9999;
      transform:translate(-50%,-50%);
      transition: all 0.6s cubic-bezier(0,1,0.5,1); opacity:1;
    `;
    document.body.appendChild(dot);
    requestAnimationFrame(() => {
      dot.style.left    = (x + Math.cos(angle) * dist) + 'px';
      dot.style.top     = (y + Math.sin(angle) * dist) + 'px';
      dot.style.opacity = '0';
      dot.style.transform = 'translate(-50%,-50%) scale(0)';
    });
    setTimeout(() => dot.remove(), 700);
  }
}
document.querySelectorAll('.btn-primary').forEach(btn => {
  btn.addEventListener('click', e => createSparkle(e.clientX, e.clientY));
});

/* ── Chip Cloud hover ripple ── */
document.querySelectorAll('.chip-cloud span').forEach(chip => {
  chip.addEventListener('mouseenter', function() {
    this.style.transform = 'translateY(-3px) scale(1.06)';
    this.style.boxShadow = '0 0 12px rgba(108,99,255,0.35)';
  });
  chip.addEventListener('mouseleave', function() {
    this.style.transform = '';
    this.style.boxShadow = '';
  });
});

/* ── Achievement card stagger on enter ── */
const achObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    Array.from(entry.target.querySelectorAll('.ach-card')).forEach((c, i) => {
      setTimeout(() => c.classList.add('revealed'), i * 150);
    });
    achObs.unobserve(entry.target);
  });
}, { threshold: 0.1 });
const achGrid = document.querySelector('.ach-grid');
if (achGrid) {
  achGrid.querySelectorAll('.ach-card').forEach(c => {
    c.classList.add('reveal-up');
  });
  achObs.observe(achGrid);
}

/* ── Contact Methods ── */
/* Direct contact links - no form submission needed */

/* ── Section progress indicator (subtle top bar) ── */
const progressBar = document.createElement('div');
progressBar.style.cssText = 'position:fixed;top:0;left:0;height:2px;background:linear-gradient(90deg,#6c63ff,#00d4ff);z-index:99999;transition:width 0.1s linear;pointer-events:none;';
document.body.appendChild(progressBar);
window.addEventListener('scroll', () => {
  const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
  progressBar.style.width = Math.min(pct, 100) + '%';
}, { passive: true });
