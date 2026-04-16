document.addEventListener('DOMContentLoaded', () => {
    // ===== NAVBAR SCROLL =====
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(8, 8, 10, 0.95)';
            navbar.style.padding = '12px 0';
        } else {
            navbar.style.background = 'rgba(10, 10, 13, 0.85)';
            navbar.style.padding = '24px 0';
        }
    });

    // ===== MOBILE MENU =====
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.getElementById('nav-links');
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
        
        // Close menu when a link is clicked
        const links = navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }

    // ===== FAQ TOGGLES =====
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            const chevron = question.querySelector('.faq-chevron');
            
            // Toggle answer visibility
            if (answer.style.display === 'block') {
                answer.style.display = 'none';
                if (chevron) chevron.style.transform = 'rotate(0deg)';
            } else {
                answer.style.display = 'block';
                if (chevron) chevron.style.transform = 'rotate(180deg)';
            }
        });
    });

    // ===== SIMULATOR LOGIC =====
    const inputValor = document.getElementById('sim-valor');
    const displayValor = document.getElementById('sim-value-text');
    const displayDiaria = document.getElementById('sim-diaria');
    const ctaSim = document.getElementById('sim-cta');

    let currentSimValues = { valor: 1000, diaria: 0, total: 0 };

    function updateSimulator() {
        const valor = parseInt(inputValor.value);
        const taxa = 0.30; // 30% de juros
        const prazo = 30;  // 30 dias fixo

        const total = valor * (1 + taxa);
        const diaria = total / prazo;

        currentSimValues = { valor, diaria, total };

        // Update displays
        if (displayValor) displayValor.textContent = valor.toLocaleString('pt-BR');
        if (displayDiaria) displayDiaria.textContent = diaria.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
    }

    if (inputValor) {
        inputValor.addEventListener('input', updateSimulator);
        updateSimulator();
    }

    // ===== TERMS MODAL =====
    const termsOverlay = document.getElementById('terms-overlay');
    const termsClose = document.getElementById('terms-close');
    const termsCheckboxes = document.querySelectorAll('.terms-checkbox');
    const termsBtnWhatsapp = document.getElementById('terms-btn-whatsapp');

    // Open modal when CTA is clicked
    if (ctaSim) {
        ctaSim.addEventListener('click', () => {
            if (termsOverlay) {
                termsOverlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    }

    // Also open modal from hero and nav WhatsApp buttons
    const heroCta = document.getElementById('hero-cta');
    const navBtn = document.querySelector('.nav-btn');
    [heroCta, navBtn].forEach(btn => {
        if (btn) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                // Scroll to simulator first
                document.getElementById('simulador')?.scrollIntoView({ behavior: 'smooth' });
            });
        }
    });

    // Close modal
    function closeTermsModal() {
        if (termsOverlay) {
            termsOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    if (termsClose) termsClose.addEventListener('click', closeTermsModal);
    if (termsOverlay) {
        termsOverlay.addEventListener('click', (e) => {
            if (e.target === termsOverlay) closeTermsModal();
        });
    }

    // Close with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && termsOverlay?.classList.contains('active')) {
            closeTermsModal();
        }
    });

    // Track checkboxes
    function updateTermsButton() {
        const allChecked = [...termsCheckboxes].every(cb => cb.checked);
        if (termsBtnWhatsapp) {
            termsBtnWhatsapp.disabled = !allChecked;
        }
    }

    termsCheckboxes.forEach(cb => {
        cb.addEventListener('change', () => {
            // Toggle visual class on parent
            const parentItem = cb.closest('.terms-item');
            if (parentItem) {
                parentItem.classList.toggle('checked', cb.checked);
            }
            updateTermsButton();
        });
    });

    // WhatsApp redirect on terms button click
    if (termsBtnWhatsapp) {
        termsBtnWhatsapp.addEventListener('click', () => {
            const url = `https://wa.me/message/BMBYSOKISTH4L1`;
            window.open(url, '_blank');
            closeTermsModal();
        });
    }

    // ===== COUNTER ANIMATION =====
    const stats = document.querySelectorAll('.stat-number');
    const animateStats = () => {
        stats.forEach(stat => {
            const target = +stat.getAttribute('data-target');
            const speed = 200;
            const inc = target / speed;
            let current = 0;
            const updateCount = () => {
                if (current < target) {
                    current += inc;
                    stat.textContent = Math.ceil(current);
                    setTimeout(updateCount, 10);
                } else {
                    stat.textContent = target;
                }
            };
            updateCount();
        });
    };

    // Trigger stats animation when hero is in view
    const statsObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            animateStats();
            statsObserver.disconnect();
        }
    }, { threshold: 0.5 });
    
    if (stats.length > 0) statsObserver.observe(document.querySelector('.hero'));

    // ===== REVEAL ON SCROLL =====
    const revealElements = document.querySelectorAll('[data-reveal], .about-card, .step-card, .simulator-card, .faq-item');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
        revealObserver.observe(el);
    });
});
