document.addEventListener('DOMContentLoaded', () => {
    // 1. Reveal Animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal, .content-box, .timeline-item, .project-card, h2').forEach((item, index) => {
        item.classList.add('reveal');
        item.style.transitionDelay = `${(index % 3) * 0.1}s`;
        observer.observe(item);
    });

    // 2. Navigation Highlighting Logic
    const navButtons = document.querySelectorAll('.nav-button');
    const sections = document.querySelectorAll('section[id]');

    function updateActiveNav() {
        let current = "";
        
        // Check if we are at the bottom of the page
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50) {
            current = "contact";
        } else {
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                // Offset calculation (approx 1/3 of screen)
                if (pageYOffset >= sectionTop - 200) {
                    current = section.getAttribute('id');
                }
            });
        }

        navButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('href') === `#${current}`) {
                btn.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav);
    updateActiveNav(); // Run on load
});