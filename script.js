/* ========================================
   Grandpa EJ | Modern Portfolio Script
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
    initScrollReveal();
    initNoise();
    initCountUp();
    initCryptoDialog();
    initNav();
    initTechGlow();
});

/* ========== Scroll Reveal ========== */
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal-item');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    reveals.forEach(reveal => {
        revealObserver.observe(reveal);
    });
}

/* ========== Noise Background ========== */
function initNoise() {
    const canvas = document.getElementById('noise-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    window.addEventListener('resize', resize);
    resize();
    
    const imageData = ctx.createImageData(canvas.width, canvas.height);
    const data = imageData.data;
    
    let frame = 0;
    function updateNoise() {
        frame++;
        if (frame % 2 !== 0) {
            requestAnimationFrame(updateNoise);
            return;
        }
        
        for (let i = 0; i < data.length; i += 4) {
            const value = Math.random() * 255;
            data[i] = value;
            data[i + 1] = value;
            data[i + 2] = value;
            data[i + 3] = 255;
        }
        ctx.putImageData(imageData, 0, 0);
        requestAnimationFrame(updateNoise);
    }
    
    updateNoise();
}

/* ========== Count Up Animation ========== */
function initCountUp() {
    const counters = document.querySelectorAll('.stat-value');
    
    const countObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.count);
                animateCounter(el, target);
                countObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => countObserver.observe(counter));
}

function animateCounter(el, target) {
    const duration = 2000;
    const start = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 4);
        
        el.textContent = Math.floor(eased * target);
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

/* ========== Navigation ========== */
function initNav() {
    const nav = document.querySelector('.nav');
    
    const menuBtn = document.querySelector('.nav-menu');
    
    menuBtn.addEventListener('click', () => {
        nav.classList.toggle('nav-open');
    });

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.style.background = 'rgba(10, 10, 15, 0.95)';
        } else {
            nav.style.background = 'rgba(10, 10, 15, 0.8)';
        }
    });
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                nav.classList.remove('nav-open');
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

/* ========== Crypto Dialog ========== */
function initCryptoDialog() {
    const modal = document.getElementById('crypto-dialog');
    const btn = document.getElementById('crypto-more-btn');
    const closeBtn = document.getElementById('close-dialog');
    const overlay = modal?.querySelector('.crypto-dialog-overlay');

    if (!modal || !btn) return;

    btn.addEventListener('click', () => {
        modal.classList.add('open');
    });
    
    if (closeBtn) {
        closeBtn.addEventListener('click', () => modal.classList.remove('open'));
    }
    
    if (overlay) {
        overlay.addEventListener('click', () => modal.classList.remove('open'));
    }

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') modal.classList.remove('open');
    });
    
    document.querySelectorAll('.btn-copy, .btn-copy-sm').forEach(copyBtn => {
        copyBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const address = this.dataset.address || this.getAttribute('onclick')?.match(/'([^']+)'/)?.[1];
            if (address) {
                copyAddress(address, this);
            }
        });
    });
}

function copyAddress(address, btn) {
    navigator.clipboard.writeText(address).then(() => {
        if (!btn) {
            btn = event.target.closest('button');
        }
        if (!btn) return;
        
        const svg = btn.innerHTML;
        btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>';
        btn.classList.add('copied');
        
        setTimeout(() => {
            btn.innerHTML = svg;
            btn.classList.remove('copied');
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
}

/* ========== Tech Glow Effect ========== */
function initTechGlow() {
    const items = document.querySelectorAll('.tech-item');
    
    items.forEach(item => {
        item.addEventListener('mousemove', e => {
            const rect = item.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            
            item.style.setProperty('--mouse-x', `${x}%`);
            item.style.setProperty('--mouse-y', `${y}%`);
        });
    });
}