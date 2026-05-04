/* ========================================
   Grandpa EJ | Premium Portfolio Script
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
    initScrollReveal();
    initParticles();
    initCryptoDialog();
});

/* ========== Scroll Reveal ========== */
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
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

/* ========== Particles System ========== */
function initParticles() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const container = document.getElementById('particles');
    
    if (!container) return;
    
    container.appendChild(canvas);
    
    let particles = [];
    const particleCount = 60;
    
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    window.addEventListener('resize', resize);
    resize();
    
    class Particle {
        constructor() {
            this.reset();
        }
        
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * 2;
            this.alpha = Math.random() * 0.5 + 0.2;
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                this.reset();
            }
        }
        
        draw() {
            ctx.fillStyle = `rgba(0, 255, 136, ${this.alpha})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    }
    
    animate();
}

/* ========== Crypto Interactions ========== */
function initCryptoDialog() {
    const modal = document.getElementById('crypto-dialog');
    const btn = document.getElementById('crypto-more-btn');
    const closeBtn = document.getElementById('close-dialog');
    const overlay = modal?.querySelector('.crypto-dialog-overlay');

    if (!modal || !btn) return;

    btn.onclick = () => modal.classList.add('active');
    closeBtn.onclick = () => modal.classList.remove('active');
    overlay.onclick = () => modal.classList.remove('active');

    window.onkeydown = (e) => {
        if (e.key === 'Escape') modal.classList.remove('active');
    };
}

function copyAddress(address) {
    navigator.clipboard.writeText(address).then(() => {
        const btn = event.target;
        const originalText = btn.textContent;
        btn.textContent = 'Copied!';
        btn.style.background = '#fff';
        btn.style.color = '#000';
        
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
            btn.style.color = '';
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
}
