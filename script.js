// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('open');
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
        });
    });
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            const navH = document.getElementById('navbar')?.offsetHeight || 68;
            const top = target.getBoundingClientRect().top + window.scrollY - navH;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    });
});

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

function setActiveNav() {
    const scrollY = window.scrollY + 100;
    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');
        if (scrollY >= top && scrollY < top + height) {
            navAnchors.forEach(a => a.classList.remove('active'));
            const active = document.querySelector(`.nav-links a[href="#${id}"]`);
            if (active) active.classList.add('active');
        }
    });
}

window.addEventListener('scroll', setActiveNav, { passive: true });

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.08,
    rootMargin: '0px 0px -60px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

const animatables = document.querySelectorAll(
    '.project-card, .skill-category, .timeline-card, .edu-card, .achieve-card, .stat, .contact-link'
);

animatables.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(22px)';
    el.style.transition = `opacity 0.55s ease ${(i % 4) * 0.08}s, transform 0.55s ease ${(i % 4) * 0.08}s`;
    observer.observe(el);
});

// Add active style inline (CSS class-based approach needs the class in CSS too)
const style = document.createElement('style');
style.textContent = `.nav-links a.active { color: var(--primary) !important; background: rgba(108,99,255,0.1) !important; }`;
document.head.appendChild(style);
