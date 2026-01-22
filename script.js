// ========================================
// Portfolio Donation Page - Grandpa EJ
// JavaScript for animations and interactions
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all features
    initParticles();
    initScrollReveal();
    initCopyButton();
});

// ========== Floating Particles ==========
function initParticles() {
    const container = document.getElementById('particles');
    if (!container) return;

    const particleCount = 30;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';

        // Random positioning
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';

        // Random size (2-6px)
        const size = 2 + Math.random() * 4;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';

        // Random animation delay and duration
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (10 + Math.random() * 20) + 's';

        // Random opacity
        particle.style.opacity = 0.1 + Math.random() * 0.3;

        container.appendChild(particle);
    }
}

// ========== Scroll Reveal Animation ==========
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');

    if (!revealElements.length) return;

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger the animations slightly
                setTimeout(() => {
                    entry.target.classList.add('active');
                }, index * 100);

                // Optionally unobserve after animation
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => observer.observe(el));
}

// ========== Copy to Clipboard ==========
function initCopyButton() {
    const copyBtn = document.getElementById('copy-btn');
    const walletAddress = document.getElementById('wallet-address');
    const toast = document.getElementById('toast');

    if (!copyBtn || !walletAddress) return;

    copyBtn.addEventListener('click', async () => {
        const address = walletAddress.innerText;

        try {
            await navigator.clipboard.writeText(address);
            showToast();
            animateCopyButton();
        } catch (err) {
            console.error('Failed to copy:', err);
            fallbackCopy(address);
        }
    });

    function showToast() {
        if (!toast) return;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 2500);
    }

    function animateCopyButton() {
        const copyText = copyBtn.querySelector('.copy-text');
        if (copyText) {
            const original = copyText.textContent;
            copyText.textContent = 'Copied!';
            copyBtn.style.background = 'var(--primary)';
            copyBtn.style.color = 'var(--bg-dark)';

            setTimeout(() => {
                copyText.textContent = original;
                copyBtn.style.background = '';
                copyBtn.style.color = '';
            }, 2000);
        }
    }

    function fallbackCopy(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.select();

        try {
            document.execCommand('copy');
            showToast();
            animateCopyButton();
        } catch (err) {
            console.error('Fallback copy failed:', err);
        }

        document.body.removeChild(textArea);
    }
}

// ========== Smooth Scroll for Navigation ==========
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
