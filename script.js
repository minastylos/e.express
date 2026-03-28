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
    const inputPrazo = document.getElementById('sim-prazo');
    const displayValor = document.getElementById('sim-value-text');
    const displayPrazo = document.getElementById('sim-prazo-text');
    const displayTotal = document.getElementById('sim-total');
    const ctaSim = document.getElementById('sim-cta');

    function updateSimulator() {
        const valor = parseInt(inputValor.value);
        const prazo = parseInt(inputPrazo.value);
        const taxaDiaria = 0.01; // 1% ao dia

        const juros = valor * taxaDiaria * prazo;
        const total = valor + juros;

        // Update displays
        if (displayValor) displayValor.textContent = valor.toLocaleString('pt-BR');
        if (displayPrazo) displayPrazo.textContent = prazo;
        if (displayTotal) displayTotal.textContent = total.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });

        // Update WhatsApp Link
        if (ctaSim) {
            const message = `Olá! Vi seu site e gostaria de um empréstimo:\nValor: R$ ${valor.toLocaleString('pt-BR')}\nPrazo: ${prazo} dias\nTotal: R$ ${total.toLocaleString('pt-BR')}`;
            ctaSim.href = `https://w.app/emprestimo-express?text=${encodeURIComponent(message)}`;
        }
    }

    if (inputValor && inputPrazo) {
        inputValor.addEventListener('input', updateSimulator);
        inputPrazo.addEventListener('input', updateSimulator);
        updateSimulator();
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
