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