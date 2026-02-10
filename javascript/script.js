// Sistema de Filtros
        document.addEventListener('DOMContentLoaded', function() {
            const filterBtns = document.querySelectorAll('.filter-btn');
            const cards = document.querySelectorAll('[data-category]');
            
            filterBtns.forEach(btn => {
                btn.addEventListener('click', function() {
                    filterBtns.forEach(b => b.classList.remove('active'));
                    this.classList.add('active');
                    
                    const filterValue = this.getAttribute('data-filter');
                    
                    cards.forEach(card => {
                        const cardCategory = card.getAttribute('data-category');
                        
                        if (filterValue === 'all' || cardCategory === filterValue) {
                            card.style.display = 'block';
                            card.classList.remove('card-animate');
                            setTimeout(() => card.classList.add('card-animate'), 10);
                        } else {
                            card.style.display = 'none';
                        }
                    });
                });
            });
            
            // Parar carousels quando não estão visíveis
            const carousels = document.querySelectorAll('.carousel');
            carousels.forEach(carousel => {
                // Pausar autoplay por padrão
                const bsCarousel = new bootstrap.Carousel(carousel, {
                    interval: false,
                    ride: false
                });
                
                // Iniciar quando passar o mouse
                carousel.addEventListener('mouseenter', () => {
                    bsCarousel.cycle();
                });
                
                // Parar quando tirar o mouse
                carousel.addEventListener('mouseleave', () => {
                    bsCarousel.pause();
                });
            });
            
            // Animação dos números nas estatísticas
            const animateNumbers = () => {
                const stats = document.querySelectorAll('.stat-number');
                
                stats.forEach(stat => {
                    const target = parseFloat(stat.getAttribute('data-target'));
                    const duration = 2000;
                    const increment = target / (duration / 16);
                    let current = 0;
                    
                    const updateNumber = () => {
                        current += increment;
                        if (current < target) {
                            stat.textContent = Math.floor(current);
                            requestAnimationFrame(updateNumber);
                        } else {
                            stat.textContent = target % 1 === 0 ? target : target.toFixed(1);
                        }
                    };
                    
                    updateNumber();
                });
            };
            
            const statsSection = document.querySelector('.stats-section');
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateNumbers();
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            
            observer.observe(statsSection);
        });


        /* ============================================================
   JERUSALEM TOURISM WEBSITE - MAIN JAVASCRIPT
   ============================================================ */


/* ===================== DOM READY ===================== */
document.addEventListener('DOMContentLoaded', function () {

    /* ---- Initialize all modules ---- */
    initMobileNav();
    initFilterTabs();
    initCarousels();
    initSmoothScroll();

});


/* ===================== MOBILE NAVIGATION ===================== */
/**
 * Toggles the mobile nav menu when the hamburger button is clicked.
 * Adds .open class to .nav-header to expand it via CSS max-height transition.
 */
function initMobileNav() {
    const toggleBtn = document.getElementById('navToggle');
    const nav       = document.getElementById('mainNav');

    if (!toggleBtn || !nav) return;

    toggleBtn.addEventListener('click', function () {
        nav.classList.toggle('open');

        /* Animate hamburger to X shape */
        const spans = toggleBtn.querySelectorAll('span');
        toggleBtn.classList.toggle('active');

        if (toggleBtn.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity   = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        } else {
            spans[0].style.transform = '';
            spans[1].style.opacity   = '';
            spans[2].style.transform = '';
        }
    });

    /* Close nav when any menu link is clicked (mobile UX) */
    nav.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
            nav.classList.remove('open');
            toggleBtn.classList.remove('active');
            const spans = toggleBtn.querySelectorAll('span');
            spans[0].style.transform = '';
            spans[1].style.opacity   = '';
            spans[2].style.transform = '';
        });
    });
}


/* ===================== CATEGORY FILTER TABS ===================== */
/**
 * Filters attraction cards by data-category attribute.
 * Cards that don't match are hidden; matching ones re-trigger their entrance animation.
 */
function initFilterTabs() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const cards      = document.querySelectorAll('[data-category]');

    if (!filterBtns.length) return;

    filterBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {

            /* Update active button state */
            filterBtns.forEach(function (b) { b.classList.remove('active'); });
            this.classList.add('active');

            const selected = this.getAttribute('data-filter');

            /* Show / hide cards */
            cards.forEach(function (card) {
                const category = card.getAttribute('data-category');

                if (selected === 'all' || category === selected) {
                    card.style.display = 'block';

                    /* Re-trigger the slide-up entrance animation */
                    card.classList.remove('card-animate');
                    void card.offsetWidth; /* force reflow */
                    card.classList.add('card-animate');
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}


/* ===================== CAROUSEL INITIALIZATION ===================== */
/**
 * Initialises each Bootstrap carousel.
 * - Auto-play is OFF by default to keep the page calm.
 * - Hovering a card starts the carousel; leaving stops it.
 */
function initCarousels() {
    const carouselEls = document.querySelectorAll('.carousel');

    carouselEls.forEach(function (el) {
        /* Create Bootstrap Carousel instance with auto-play disabled */
        const instance = new bootstrap.Carousel(el, {
            interval: 3000,
            ride:     false,   /* do not auto-start */
            touch:    true     /* enable swipe on mobile */
        });

        /* Start cycling when mouse enters the parent card */
        const card = el.closest('.attraction-card');
        if (card) {
            card.addEventListener('mouseenter', function () { instance.cycle(); });
            card.addEventListener('mouseleave', function () { instance.pause(); });
        }
    });
}


/* ===================== SMOOTH SCROLL ===================== */
/**
 * Intercepts anchor clicks and scrolls smoothly to the target section,
 * accounting for the sticky header height.
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (!target) return;

            e.preventDefault();

            const header = document.getElementById('main-header');
            const headerHeight = header ? header.offsetHeight : 0;
            const targetTop    = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 10;

            window.scrollTo({ top: targetTop, behavior: 'smooth' });
        });
    });
}