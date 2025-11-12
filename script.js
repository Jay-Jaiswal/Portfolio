// Smooth Navigation
const navLinks = document.querySelectorAll('.ul-list li a');
const sections = document.querySelectorAll('section');

function removeActive() {
    navLinks.forEach(link => link.parentElement.classList.remove('active'));
}

navLinks.forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);

        window.scrollTo({
            top: targetSection.offsetTop - 80,
            behavior: 'smooth'
        });

        removeActive();
        link.parentElement.classList.add('active');
    });
});

// Active Navigation on Scroll
window.addEventListener('scroll', () => {
    let scrollPos = window.scrollY + 100;

    sections.forEach(section => {
        if (scrollPos >= section.offsetTop && scrollPos < section.offsetTop + section.offsetHeight) {
            removeActive();
            const activeLink = document.querySelector(`.ul-list li a[href="#${section.id}"]`);
            if (activeLink) activeLink.parentElement.classList.add('active');
        }
    });

    // Show/Hide Back to Top Button
    if (window.scrollY > 500) {
        backToTop.style.display = "flex";
    } else {
        backToTop.style.display = "none";
    }

    // Reveal Elements on Scroll
    revealElements.forEach(el => {
        const windowHeight = window.innerHeight;
        const elementTop = el.getBoundingClientRect().top;
        const revealPoint = 150;

        if (elementTop < windowHeight - revealPoint) {
            el.classList.add('active-reveal');
        }
    });
});

// Reveal Animation
const revealElements = document.querySelectorAll('.home-container, .about-container, .projects-container, .services-container, .contact-content');
revealElements.forEach(el => el.classList.add('reveal'));

// Back to Top Button
const backToTop = document.createElement('div');
backToTop.innerHTML = '<i class="fa-solid fa-chevron-up"></i>';
backToTop.id = "back-to-top";
document.body.appendChild(backToTop);

backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Card Hover Effects
const cards = document.querySelectorAll('.project-card, .c1, .service-card');
cards.forEach(card => {
    card.addEventListener('mouseenter', () => card.style.transform = 'translateY(-8px) scale(1.05)');
    card.addEventListener('mouseleave', () => card.style.transform = 'translateY(0) scale(1)');
});

// Typing Effect
const typingElement = document.querySelector('.info-home h3');
const words = ["Full Stack Developer", "Ml DataPreprocessing", "Web Enthusiast", "React Developer"];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 100;

function type() {
    const currentWord = words[wordIndex];
    let displayedText = currentWord.substring(0, charIndex);

    typingElement.innerHTML = displayedText + '<span class="cursor">|</span>';

    if (!isDeleting && charIndex < currentWord.length) {
        charIndex++;
        setTimeout(type, typingSpeed);
    } else if (isDeleting && charIndex > 0) {
        charIndex--;
        setTimeout(type, typingSpeed / 2);
    } else {
        isDeleting = !isDeleting;
        if (!isDeleting) {
            wordIndex = (wordIndex + 1) % words.length;
        }
        setTimeout(type, 1000);
    }
}

document.addEventListener('DOMContentLoaded', type);

// Loading Screen Animation
document.addEventListener("DOMContentLoaded", () => {
    const loadingText = document.getElementById("loading-text");
    const mainIcon = document.querySelector(".main-icon");
    const subIcons = document.querySelectorAll(".sub-icons i");
    const designerText = document.getElementById("designer-text");
    const loadingScreen = document.getElementById("loading-screen");

    function showElement(element, delay = 0) {
        setTimeout(() => {
            element.classList.remove("hidden");
            element.classList.add("fall");
        }, delay);
    }

    showElement(loadingText, 0);
    showElement(mainIcon, 800);
    subIcons.forEach((icon, idx) => {
        showElement(icon, 1600 + idx * 400);
    });
    showElement(designerText, 2800);

    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => loadingScreen.style.display = 'none', 500);
    }, 4000);
});

// Contact Form Submission
const contactForm = document.getElementById('contact-form');
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(contactForm);
    const name = formData.get('user_name');
    const email = formData.get('user_email');
    const message = formData.get('message');

    // You can add your form submission logic here
    // For example, using EmailJS or a backend API

    alert(`Thank you ${name}! Your message has been received. We'll get back to you at ${email} soon.`);
    contactForm.reset();
});

// Add cursor styling for typing effect
const style = document.createElement('style');
style.textContent = `
    .cursor {
        animation: blink 0.7s infinite;
    }
    
    @keyframes blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0; }
    }
`;
document.head.appendChild(style);
