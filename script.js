// Particle Canvas Background
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
        this.opacity = Math.random() * 0.5 + 0.2;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
        if (this.y > canvas.height || this.y < 0) this.speedY *= -1;
    }

    draw() {
        ctx.fillStyle = `rgba(59, 130, 246, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

const particles = [];
for (let i = 0; i < 80; i++) {
    particles.push(new Particle());
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        
        // Connect particles
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                ctx.strokeStyle = `rgba(59, 130, 246, ${0.2 - distance / 500})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
    
    requestAnimationFrame(animateParticles);
}

animateParticles();

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Mobile menu toggle
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

mobileMenuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

// Close mobile menu when clicking on a link
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
    });
});

// Smooth scroll with offset for fixed navbar
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const navHeight = document.querySelector('nav').offsetHeight;
            const targetPosition = targetElement.offsetTop - navHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Active navigation link highlighting
function setActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    const navHeight = document.querySelector('nav').offsetHeight;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - navHeight - 100;
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// Update active nav link on scroll
window.addEventListener('scroll', setActiveNavLink);

// Set initial active link
setActiveNavLink();

// Add scroll-based navbar shadow
const navbar = document.querySelector('nav');
window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
        navbar.classList.add('shadow-lg');
    } else {
        navbar.classList.remove('shadow-lg');
    }
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '0';
            entry.target.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                entry.target.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, 100);
            
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const elementsToAnimate = document.querySelectorAll('.project-card, .achievement-card, .glass-card');
    elementsToAnimate.forEach(element => {
        observer.observe(element);
    });
    
    // Parallax effect on scroll
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                const parallaxElements = document.querySelectorAll('.animate-float');
                
                parallaxElements.forEach(el => {
                    const speed = 0.5;
                    el.style.transform = `translateY(${scrolled * speed}px)`;
                });
                
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // Gradient text animation
    const gradientText = document.querySelector('.gradient-text');
    if (gradientText) {
        let hue = 0;
        setInterval(() => {
            hue = (hue + 1) % 360;
            gradientText.style.filter = `hue-rotate(${hue}deg)`;
        }, 50);
    }
    
    // Add cursor trail effect
    const trail = [];
    const trailLength = 10;
    
    document.addEventListener('mousemove', (e) => {
        trail.push({ x: e.clientX, y: e.clientY, time: Date.now() });
        
        if (trail.length > trailLength) {
            trail.shift();
        }
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!mobileMenu.contains(e.target) && !mobileMenuButton.contains(e.target)) {
        mobileMenu.classList.add('hidden');
    }
});

// Handle image load errors
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function() {
        this.style.display = 'none';
        console.warn(`Failed to load image: ${this.src}`);
    });
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Smooth reveal of sections
    const sections = document.querySelectorAll('section');
    sections.forEach((section, index) => {
        setTimeout(() => {
            section.style.opacity = '1';
        }, index * 100);
    });
});

// Keyboard navigation for mobile menu
mobileMenuButton.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        mobileMenu.classList.toggle('hidden');
    }
});

// Escape key to close mobile menu
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.add('hidden');
    }
});

console.log('Portfolio website loaded successfully!');

// Idle Points Counter System
let s = 1;  // Significand
let e = 0;  // Exponent
let l = 0;  // Level (e-prefix count)

const idlePointsElement = document.getElementById("idle-points");

let lastTime = Date.now();

function formatNumber(value, decimals = 0) {
    return value.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    });
}

function updateIdlePoints() {
    const now = Date.now();
    let deltaTime = now - lastTime;
    lastTime = now;
    deltaTime /= 1000; // Convert to seconds
    
    // Calculate growth rate
    const growth = ((e / 10 + 0.1) / (5 ** l)) * deltaTime;
    e += Math.floor(growth);
    s *= 10 ** (growth % 1);
    
    // Handle significand overflow
    const significandDigits = Math.floor(Math.log10(s));
    if (significandDigits >= 1) {
        s /= 10 ** significandDigits;
        e += significandDigits;
    }
    
    // Level up when e reaches 1 million
    if (e >= 1e6) {
        s = e;
        e = 0;
        l++;
    }
    
    // Format and display
    const ePrefix = "".padEnd(l, "e");
    let displayValue;
    
    if (e >= 6) {
        const decimals = Math.max(4 - Math.floor(Math.log10(e || 1)), 0);
        displayValue = ePrefix + formatNumber(s, decimals) + "e" + formatNumber(e, 0);
    } else {
        displayValue = ePrefix + formatNumber(s * (10 ** e), 0);
    }
    
    idlePointsElement.innerText = displayValue;
}

// Update every 3 seconds
setInterval(updateIdlePoints, 3000);

// Initial update
updateIdlePoints();

// Hacker rain effect
const hackerCanvas = document.getElementById('hacker-rain');
const hackerCtx = hackerCanvas ? hackerCanvas.getContext('2d') : null;
let hackerRainActive = false;
let hackerRainFrame = null;
let hackerColumns = [];

function resizeHackerRain() {
    if (!hackerCanvas) return;
    hackerCanvas.width = window.innerWidth;
    hackerCanvas.height = window.innerHeight;
    const columnCount = Math.floor(hackerCanvas.width / 16);
    hackerColumns = new Array(columnCount).fill(0).map(() => Math.random() * hackerCanvas.height);
}

function drawHackerRain() {
    if (!hackerCtx || !hackerCanvas) return;
    hackerCtx.fillStyle = 'rgba(0, 0, 0, 0.08)';
    hackerCtx.fillRect(0, 0, hackerCanvas.width, hackerCanvas.height);

    hackerCtx.fillStyle = '#00ff7a';
    hackerCtx.font = '14px monospace';

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/=<>[]{}()';
    hackerColumns.forEach((y, index) => {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = index * 16;
        hackerCtx.fillText(char, x, y);
        if (y > hackerCanvas.height + Math.random() * 100) {
            hackerColumns[index] = 0;
        } else {
            hackerColumns[index] = y + 14 + Math.random() * 10;
        }
    });

    if (hackerRainActive) {
        hackerRainFrame = requestAnimationFrame(drawHackerRain);
    }
}

function startHackerRain() {
    if (!hackerCanvas || hackerRainActive) return;
    hackerRainActive = true;
    hackerCanvas.classList.remove('hidden');
    resizeHackerRain();
    drawHackerRain();
}

function stopHackerRain() {
    if (!hackerCanvas) return;
    hackerRainActive = false;
    hackerCanvas.classList.add('hidden');
    if (hackerRainFrame) {
        cancelAnimationFrame(hackerRainFrame);
        hackerRainFrame = null;
    }
    if (hackerCtx) {
        hackerCtx.clearRect(0, 0, hackerCanvas.width, hackerCanvas.height);
    }
}

window.addEventListener('resize', resizeHackerRain);

// Theme Switcher
function setTheme(theme) {
    const root = document.documentElement;
    if (theme === 'light') {
        root.style.setProperty('--bg-primary', '#ffffff');
        root.style.setProperty('--bg-secondary', '#f9fafb');
        root.style.setProperty('--bg-tertiary', '#f3f4f6');
        root.style.setProperty('--text-primary', '#111827');
        root.style.setProperty('--text-secondary', '#6b7280');
        root.style.setProperty('--text-accent', '#3b82f6');
        root.style.setProperty('--border-color', '#e5e7eb');
        root.style.setProperty('--glass-bg', 'rgba(255, 255, 255, 0.7)');
        root.style.setProperty('--glass-border', 'rgba(255, 255, 255, 0.3)');
        root.style.setProperty('--shadow-color', 'rgba(31, 38, 135, 0.15)');
        root.style.setProperty('--blob-1', 'rgba(59, 130, 246, 0.2)');
        root.style.setProperty('--blob-2', 'rgba(168, 85, 247, 0.2)');
        root.style.setProperty('--blob-3', 'rgba(236, 72, 153, 0.2)');
        stopHackerRain();
    } else if (theme === 'dark') {
        root.style.setProperty('--bg-primary', '#0b1020');
        root.style.setProperty('--bg-secondary', '#111827');
        root.style.setProperty('--bg-tertiary', '#1f2937');
        root.style.setProperty('--text-primary', '#f3f4f6');
        root.style.setProperty('--text-secondary', '#cbd5f5');
        root.style.setProperty('--text-accent', '#93c5fd');
        root.style.setProperty('--border-color', '#273244');
        root.style.setProperty('--glass-bg', 'rgba(15, 23, 42, 0.7)');
        root.style.setProperty('--glass-border', 'rgba(99, 102, 241, 0.18)');
        root.style.setProperty('--shadow-color', 'rgba(0, 0, 0, 0.45)');
        root.style.setProperty('--blob-1', 'rgba(37, 99, 235, 0.18)');
        root.style.setProperty('--blob-2', 'rgba(139, 92, 246, 0.18)');
        root.style.setProperty('--blob-3', 'rgba(236, 72, 153, 0.18)');
        stopHackerRain();
    } else if (theme === 'hacker') {
        root.style.setProperty('--bg-primary', '#050505');
        root.style.setProperty('--bg-secondary', '#0b0b0b');
        root.style.setProperty('--bg-tertiary', '#101010');
        root.style.setProperty('--text-primary', '#00ff7a');
        root.style.setProperty('--text-secondary', '#6bff95');
        root.style.setProperty('--text-accent', '#a7ffcf');
        root.style.setProperty('--border-color', '#00ff7a');
        root.style.setProperty('--glass-bg', 'rgba(5, 5, 5, 0.8)');
        root.style.setProperty('--glass-border', 'rgba(0, 255, 122, 0.35)');
        root.style.setProperty('--shadow-color', 'rgba(0, 255, 122, 0.25)');
        root.style.setProperty('--blob-1', 'rgba(0, 255, 122, 0.12)');
        root.style.setProperty('--blob-2', 'rgba(0, 255, 122, 0.12)');
        root.style.setProperty('--blob-3', 'rgba(0, 255, 122, 0.12)');
        startHackerRain();
    } else if (theme === 'random') {
        const randomColor = () => `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
        root.style.setProperty('--bg-primary', randomColor());
        root.style.setProperty('--bg-secondary', randomColor());
        root.style.setProperty('--bg-tertiary', randomColor());
        root.style.setProperty('--text-primary', randomColor());
        root.style.setProperty('--text-secondary', randomColor());
        root.style.setProperty('--text-accent', randomColor());
        root.style.setProperty('--border-color', randomColor());
        root.style.setProperty('--glass-bg', `rgba(${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)}, 0.7)`);
        root.style.setProperty('--glass-border', `rgba(${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)}, 0.3)`);
        root.style.setProperty('--shadow-color', `rgba(${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)}, 0.2)`);
        root.style.setProperty('--blob-1', `rgba(${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)}, 0.2)`);
        root.style.setProperty('--blob-2', `rgba(${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)}, 0.2)`);
        root.style.setProperty('--blob-3', `rgba(${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)}, 0.2)`);
        stopHackerRain();
    }
}

// Event listeners for theme buttons
document.getElementById('light-theme').addEventListener('click', () => setTheme('light'));
document.getElementById('dark-theme').addEventListener('click', () => setTheme('dark'));
document.getElementById('hacker-theme').addEventListener('click', () => setTheme('hacker'));
document.getElementById('random-theme').addEventListener('click', () => setTheme('random'));