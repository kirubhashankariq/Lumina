
const html = document.documentElement;
const body = document.body;

// Flawless Theme Persistence
if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    html.classList.add('dark');
} else {
    html.classList.remove('dark');
}

// RTL/LTR Layout Persistence
if (localStorage.getItem('dir') === 'rtl') {
    body.setAttribute('dir', 'rtl');
}

// Interactive Toggles
document.querySelectorAll('.theme-toggle, .mobile-theme-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
        html.classList.toggle('dark');
        localStorage.setItem('theme', html.classList.contains('dark') ? 'dark' : 'light');
        initParticles(); // Re-init to perfectly match colors
    });
});

document.querySelectorAll('.dir-toggle, .mobile-dir-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
        const isRtl = body.getAttribute('dir') === 'rtl';
        body.setAttribute('dir', isRtl ? 'ltr' : 'rtl');
        localStorage.setItem('dir', isRtl ? 'ltr' : 'rtl');
    });
});

// Fully Working Animated Mobile Hamburger Menu
const mobileMenuBtns = document.querySelectorAll('.mobile-menu-btn');
const mobileMenu = document.querySelector('.mobile-menu');
const icon = document.querySelector('.mobile-menu-btn i');

mobileMenuBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const isHidden = mobileMenu.classList.contains('hidden');
        if (isHidden) {
            mobileMenu.classList.remove('hidden');
            mobileMenu.classList.add('flex');
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            mobileMenu.classList.add('hidden');
            mobileMenu.classList.remove('flex');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
});

// Functional Dropdown Menu
const dropdownBtns = document.querySelectorAll('.dropdown-btn');
const dropdownMenus = document.querySelectorAll('.dropdown-menu');

dropdownBtns.forEach((btn, index) => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdownMenus[index].classList.toggle('hidden');
        dropdownMenus[index].classList.toggle('flex');
    });
});

window.addEventListener('click', (e) => {
    dropdownBtns.forEach((btn, index) => {
        if (!btn.contains(e.target)) {
            dropdownMenus[index].classList.add('hidden');
            dropdownMenus[index].classList.remove('flex');
        }
    });
});

// Premium Moving Particle Animation
const canvas = document.getElementById('particles-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let particlesArray = [];

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initParticles();
    });

    class Particle {
        constructor(x, y, dx, dy, size, color) {
            this.x = x;
            this.y = y;
            this.dx = dx;
            this.dy = dy;
            this.size = size;
            this.color = color;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
        update() {
            if (this.x > canvas.width || this.x < 0) this.dx = -this.dx;
            if (this.y > canvas.height || this.y < 0) this.dy = -this.dy;
            this.x += this.dx;
            this.y += this.dy;
            this.draw();
        }
    }

    function initParticles() {
        particlesArray = [];
        const isDark = html.classList.contains('dark');
        const color = isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.08)';
        // Optimized count for subtle, premium flow
        const num = Math.min((canvas.width * canvas.height) / 10000, 120); 
        
        for (let i = 0; i < num; i++) {
            let size = Math.random() * 2.5 + 1;
            let x = Math.random() * canvas.width;
            let y = Math.random() * canvas.height;
            // Smooth, slow, continuous movement
            let dx = (Math.random() - 0.5) * 0.5;
            let dy = (Math.random() - 0.5) * 0.5;
            particlesArray.push(new Particle(x, y, dx, dy, size, color));
        }
    }

    function animateParticles() {
        requestAnimationFrame(animateParticles);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particlesArray.forEach(p => p.update());
    }

    initParticles();
    animateParticles();
}
