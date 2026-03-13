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

    // 3. Contact Form Submission Logic
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    if(contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Evita che la pagina si ricarichi
            
            // Prendi la risposta del reCAPTCHA
            const recaptchaResponse = grecaptcha.getResponse();
            if (!recaptchaResponse) {
                formStatus.textContent = "Please complete the reCAPTCHA!";
                formStatus.className = "form-status status-error";
                return;
            }

            // Cambia il testo del bottone mentre carica
            const submitBtn = document.getElementById('submitBtn');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = "<span>Sending...</span>";
            formStatus.textContent = "";

            // Raccogli i dati
            const formData = {
                name: document.getElementById('senderName').value,
                email: document.getElementById('senderEmail').value,
                message: document.getElementById('senderMessage').value,
                recaptcha: recaptchaResponse
            };

            try {
                // Invia i dati al nostro futuro backend!
                const response = await fetch('/api/send-email', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                const result = await response.json();

                if (response.ok) {
                    formStatus.textContent = "Message sent successfully! I'll be in touch.";
                    formStatus.className = "form-status status-success";
                    contactForm.reset();
                    grecaptcha.reset(); // Resetta il captcha
                } else {
                    throw new Error(result.error || "Failed to send message");
                }
            } catch (error) {
                formStatus.textContent = error.message;
                formStatus.className = "form-status status-error";
            } finally {
                submitBtn.innerHTML = originalBtnText;
            }
        });
    }
});