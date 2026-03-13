// ==========================================
// NAVIGATION
// ==========================================

const navbar = document.getElementById('navbar');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const navLinks = document.querySelectorAll('.nav-link');
const mobileLinks = document.querySelectorAll('.mobile-link');
const sections = document.querySelectorAll('.section');

// Scroll handler for navbar
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    
    if (currentScroll > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
    
    // Update active nav link based on scroll
    updateActiveLink();
});

// Active link updater
function updateActiveLink() {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === current) {
            link.classList.add('active');
        }
    });
}

// Mobile menu toggle
mobileMenuBtn.addEventListener('click', () => {
    mobileMenuBtn.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
});

// Close mobile menu on link click
mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenuBtn.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// ==========================================
// SMOOTH SCROLLING
// ==========================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ==========================================
// STAT COUNTER ANIMATION
// ==========================================

function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        if (counter.dataset.animated) return;
        
        const target = parseInt(counter.dataset.count);
        const duration = 2000;
        const startTime = performance.now();
        
        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(eased * target);
            
            counter.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
                counter.dataset.animated = 'true';
            }
        }
        
        requestAnimationFrame(updateCounter);
    });
}

// ==========================================
// SKILL LEVEL BAR ANIMATION
// ==========================================

function animateSkillBars() {
    const bars = document.querySelectorAll('.level-bar');
    bars.forEach(bar => {
        bar.classList.add('animate');
    });
}

// ==========================================
// SCROLL REVEAL / INTERSECTION OBSERVER
// ==========================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Skill cards animation
            if (entry.target.classList.contains('skill-card')) {
                const delay = entry.target.dataset.aosDelay || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
            }

            // Skills section - animate bars
            if (entry.target.id === 'skills') {
                setTimeout(animateSkillBars, 500);
            }

            // Hero section - animate counters
            if (entry.target.id === 'hero') {
                setTimeout(animateCounters, 800);
            }

            // Generic reveal
            if (entry.target.classList.contains('reveal')) {
                entry.target.classList.add('visible');
            }

            // Project cards
            if (entry.target.classList.contains('project-card')) {
                entry.target.classList.add('visible');
            }
        }
    });
}, observerOptions);

// Add reveal class and observe elements
document.querySelectorAll('.skill-card').forEach((card, i) => {
    card.classList.add('reveal');
    card.dataset.aosDelay = i * 100;
    observer.observe(card);
});

document.querySelectorAll('.project-card').forEach((card, i) => {
    card.classList.add('reveal');
    card.dataset.aosDelay = i * 150;
    observer.observe(card);
});

// Observe sections
sections.forEach(section => {
    observer.observe(section);
});

// Observe contact CTA
const ctaElement = document.querySelector('.contact-cta');
if (ctaElement) {
    ctaElement.classList.add('reveal');
    observer.observe(ctaElement);
}

// ==========================================
// CURSOR GLOW EFFECT
// ==========================================

const cursorGlow = document.createElement('div');
cursorGlow.classList.add('cursor-glow');
document.body.appendChild(cursorGlow);

let mouseX = 0, mouseY = 0;
let glowX = 0, glowY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function updateCursorGlow() {
    glowX += (mouseX - glowX) * 0.1;
    glowY += (mouseY - glowY) * 0.1;
    
    cursorGlow.style.left = glowX + 'px';
    cursorGlow.style.top = glowY + 'px';
    
    requestAnimationFrame(updateCursorGlow);
}

updateCursorGlow();

// ==========================================
// TYPING EFFECT (Optional for code window)
// ==========================================

// Add a subtle blinking cursor effect to code window
const codeBody = document.querySelector('.code-body code');
if (codeBody) {
    const cursor = document.createElement('span');
    cursor.style.cssText = `
        display: inline-block;
        width: 8px;
        height: 16px;
        background: var(--accent-1);
        margin-left: 4px;
        animation: blink 1s step-end infinite;
        vertical-align: middle;
    `;
    
    // Add blink animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    codeBody.appendChild(cursor);
}

// ==========================================
// PARALLAX EFFECT ON ORBS
// ==========================================

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    
    document.querySelectorAll('.gradient-orb').forEach((orb, i) => {
        const speed = (i + 1) * 0.02;
        orb.style.transform = `translateY(${scrollY * speed}px)`;
    });
});

// ==========================================
// INITIALIZE ON DOM LOAD
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    // Trigger hero animations after page load
    setTimeout(() => {
        animateCounters();
    }, 1000);
    
    // Add loaded class for potential entrance animations
    document.body.classList.add('loaded');
});

// Prevent scroll snap issues on load
window.addEventListener('load', () => {
    if (window.location.hash) {
        const target = document.querySelector(window.location.hash);
        if (target) {
            setTimeout(() => {
                target.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    }
});
