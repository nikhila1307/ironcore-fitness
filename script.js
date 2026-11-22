
/* =========================================
   IRONCORE FITNESS - JAVASCRIPT
========================================= */

/* =========================================
   SUPABASE CONNECTION
========================================= */

const SUPABASE_URL = "https://mnejknwihilgekxfexly.supabase.co";

const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_g_DEPPRMmFxS73U9DsMB1A_d6cYdOn8";

const { createClient } = window.supabase;

const supabaseClient = createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);
/* =========================================
   1. MOBILE NAVIGATION
========================================= */

const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");

const navLinks = document.querySelectorAll(".nav-link");
const allNavLinks = document.querySelectorAll(".nav a");

function closeMenu() {
    nav.classList.remove("open");
    menuToggle.classList.remove("active");

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");

    document.body.classList.remove("menu-open");
}

menuToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");

    menuToggle.classList.toggle("active", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));

    menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation" : "Open navigation"
    );

    document.body.classList.toggle("menu-open", isOpen);
});

allNavLinks.forEach(link => {
    link.addEventListener("click", closeMenu);
});


/* =========================================
   2. HEADER SCROLL EFFECT
========================================= */

const header = document.getElementById("header");

window.addEventListener("scroll", () => {
    header.classList.toggle("scrolled", window.scrollY > 50);
});


/* =========================================
   3. SCROLL REVEAL ANIMATION
========================================= */

const revealElements = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.12
});

revealElements.forEach(element => {
    observer.observe(element);
});


/* =========================================
   4. ACTIVE NAVIGATION LINK
========================================= */

const sections = document.querySelectorAll("main section[id]");

window.addEventListener("scroll", () => {
    let currentSection = "home";

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 150;

        if (window.scrollY >= sectionTop) {
            currentSection = section.id;
        }
    });

    navLinks.forEach(link => {
        link.classList.remove("active");

        if (link.getAttribute("href") === `#${currentSection}`) {
            link.classList.add("active");
        }
    });
});


/* =========================================
   5. CONTACT FORM
========================================= */


/* =========================================
   5. CONTACT FORM - SUPABASE INTEGRATION
========================================= */

const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
    }

    const formData = new FormData(contactForm);

    const customerName = String(formData.get("name") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const interest = String(formData.get("interest") || "").trim();
    const message = String(formData.get("message") || "").trim();

    const submitButton = contactForm.querySelector(
        'button[type="submit"]'
    );

    if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = "SENDING...";
    }

    formStatus.style.color = "#C9A45C";
    formStatus.textContent = "Submitting your enquiry...";

    try {
        const { error } = await supabaseClient
            .from("enquiries")
            .insert({
                customer_name: customerName,
                phone: phone,
                interest: interest,
                message: message || null,
                status: "New"
            });

        if (error) {
            throw error;
        }

        formStatus.style.color = "#C9A45C";
        formStatus.textContent =
            `Thank you, ${customerName}! Your enquiry has been received.`;

        contactForm.reset();

    } catch (error) {
        console.error("Supabase enquiry error:", error);

        formStatus.style.color = "#ff6b6b";
        formStatus.textContent =
            "Sorry, your enquiry could not be submitted. Please try again.";

    } finally {
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = "SEND MESSAGE";
        }
    }
});


/* =========================================
   6. AUTOMATIC FOOTER YEAR
========================================= */

document.getElementById("year").textContent =
    new Date().getFullYear();


/* =========================================
   7. CLOSE MOBILE MENU ON RESIZE
========================================= */

window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
        closeMenu();
    }
});


/* =========================================
   8. ANIMATED NUMBER COUNTERS
========================================= */

const counters = document.querySelectorAll(".counter");

const counterObserver = new IntersectionObserver((entries, observer) => {

    entries.forEach(entry => {

        if (!entry.isIntersecting) return;

        const counter = entry.target;
        const target = Number(counter.dataset.target);
        const suffix = counter.dataset.suffix || "";

        if (!Number.isFinite(target)) {
            console.error("Invalid counter target:", counter);
            observer.unobserve(counter);
            return;
        }

        const duration = 2000;
        const startTime = performance.now();

        function updateCounter(currentTime) {

            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            const easedProgress = 1 - Math.pow(1 - progress, 4);

            const currentNumber = Math.floor(
                easedProgress * target
            );

            counter.textContent = currentNumber + suffix;

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target + suffix;
            }
        }

        requestAnimationFrame(updateCounter);
        observer.unobserve(counter);

    });

}, {
    threshold: 0.2
});

counters.forEach(counter => {
    counterObserver.observe(counter);
});


/* =========================================
   9. INITIALISE WEBSITE
========================================= */

console.log("IRONCORE FITNESS website loaded successfully.");

/* =========================================
   10. CINEMATIC LOADING SCREEN
========================================= */

const loader = document.getElementById("loader");

const minimumLoadingTime = 1500;
const loadingStartTime = performance.now();

function hideLoader() {
    if (!loader) return;

    const elapsedTime = performance.now() - loadingStartTime;
    const remainingTime = Math.max(0, minimumLoadingTime - elapsedTime);

    setTimeout(() => {
        loader.classList.add("hide");

        setTimeout(() => {
            loader.remove();
        }, 900);

    }, remainingTime);
}

if (document.readyState === "complete") {
    hideLoader();
} else {
    window.addEventListener("load", hideLoader, { once: true });
}

/* =========================================
   11. HERO PARALLAX EFFECT
========================================= */

const hero = document.querySelector(".hero");

if (hero && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    window.addEventListener("scroll", () => {
        if (window.innerWidth <= 768) return;

        const scrollPosition = window.scrollY;

        if (scrollPosition < window.innerHeight) {
            hero.style.backgroundPositionY = `${50 + scrollPosition * 0.04}%`;
        }
    }, { passive: true });
}

/* =========================================
   12. GOLD SCROLL PROGRESS BAR
========================================= */

const progressBar = document.createElement("div");
progressBar.className = "scroll-progress";

const progressFill = document.createElement("span");
progressBar.appendChild(progressFill);

document.body.appendChild(progressBar);

let progressFrame = null;

function updateScrollProgress() {
    if (progressFrame) return;

    progressFrame = requestAnimationFrame(() => {
        const scrollableHeight =
            document.documentElement.scrollHeight - window.innerHeight;

        const progress = scrollableHeight > 0
            ? window.scrollY / scrollableHeight
            : 0;

        progressFill.style.transform =
            `scaleX(${Math.min(1, Math.max(0, progress))})`;

        progressFrame = null;
    });
}

window.addEventListener("scroll", updateScrollProgress, {
    passive: true
});

window.addEventListener("resize", updateScrollProgress);

updateScrollProgress();