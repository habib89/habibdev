/* ============================================================
   M. Asmaul Habib — Portfolio Script
   ============================================================ */
(function () {
    "use strict";

    const $ = (sel, ctx) => (ctx || document).querySelector(sel);
    const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

    /* ---------- Theme ---------- */
    const themeKey = "portfolio-theme";
    const savedTheme = localStorage.getItem(themeKey) || "dark";
    document.documentElement.setAttribute("data-theme", savedTheme);
    const themeToggle = $("#themeToggle");

    function updateThemeIcon() {
        if (themeToggle) {
            const dark = document.documentElement.getAttribute("data-theme") === "dark";
            themeToggle.innerHTML = dark ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
        }
    }
    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
            document.documentElement.setAttribute("data-theme", next);
            localStorage.setItem(themeKey, next);
            updateThemeIcon();
        });
    }
    updateThemeIcon();

    /* ---------- Language ---------- */
    const langKey = "pl-lang";
    const typedEl = $("#typedText");
    const typedCursor = $(".cursor");
    let typeTimeout = null;

    const roles = {
        en: ["IT Developer", "Freelancer", "Digital Solution", "Full-Stack Developer"],
        id: ["IT Developer", "Freelancer", "Solusi Digital", "Full-Stack Developer"]
    };

    /* ---------- Typed effect (persistent, restart on lang change) ---------- */
    function startTyped(lang) {
        if (!typedEl) return;
        if (typeTimeout) clearTimeout(typeTimeout);
        const words = roles[lang] || roles.en;
        let wordIndex = 0, charIndex = 0, deleting = false;

        function tick() {
            const word = words[wordIndex];
            let text = word.slice(0, charIndex);
            typedEl.textContent = text;

            if (!deleting) {
                charIndex++;
                if (charIndex > word.length) {
                    deleting = true;
                    typeTimeout = setTimeout(tick, 1400);
                    return;
                }
                typeTimeout = setTimeout(tick, 75);
            } else {
                charIndex--;
                if (charIndex === 0) {
                    deleting = false;
                    wordIndex = (wordIndex + 1) % words.length;
                    typeTimeout = setTimeout(tick, 320);
                    return;
                }
                typeTimeout = setTimeout(tick, 38);
            }
        }
        typedEl.textContent = "";
        tick();
    }

    function applyLang(lang) {
        document.documentElement.setAttribute("lang", lang);
        $$(".lang-btn").forEach((b) => b.classList.toggle("active", b.getAttribute("data-lang-btn") === lang));
        $$("[data-ph-en][data-ph-id]").forEach((el) => {
            el.setAttribute("placeholder", el.getAttribute(lang === "id" ? "data-ph-id" : "data-ph-en"));
        });
        startTyped(lang);
    }

    const langToggle = $("#langToggle");
    if (langToggle) {
        langToggle.addEventListener("click", (e) => {
            const btn = e.target.closest("[data-lang-btn]");
            if (btn) applyLang(btn.getAttribute("data-lang-btn"));
        });
    }
    applyLang(localStorage.getItem(langKey) || "en");

    /* ---------- Cursor glow ---------- */
    const glow = $("#cursorGlow");
    if (glow && window.matchMedia("(hover: hover)").matches) {
        let sx = 0, sy = 0, tx = 0, ty = 0, raf = 0;
        window.addEventListener("mousemove", (e) => {
            tx = e.clientX;
            ty = e.clientY;
            if (!raf) {
                (function loop() {
                    sx += (tx - sx) * 0.08;
                    sy += (ty - sy) * 0.08;
                    glow.style.left = sx + "px";
                    glow.style.top = sy + "px";
                    raf = requestAnimationFrame(loop);
                })();
                raf = 1;
            }
        });
        document.addEventListener("mouseleave", () => { if (glow) glow.style.opacity = 0; });
        document.addEventListener("mouseenter", () => { if (glow) glow.style.opacity = 1; });
    }

    /* ---------- Scroll progress ---------- */
    const progress = $("#scrollProgress");
    function updateProgress() {
        if (!progress) return;
        const h = document.documentElement;
        const scrolled = h.scrollTop;
        const max = h.scrollHeight - h.clientHeight;
        progress.style.width = (max > 0 ? (scrolled / max) * 100 : 0) + "%";
    }
    window.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();

    /* ---------- Navbar + active link ---------- */
    const navbar = $("#navbar");
    const navLinks = $$(".nav-link");
    function onScroll() {
        if (navbar) navbar.classList.toggle("scrolled", window.scrollY > 40);
        updateProgress();
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    const sections = ["hero", "services", "portfolio", "order", "contact"];
    const sectionGap = 160;
    function setActive() {
        const pos = window.scrollY + sectionGap;
        let current = sections[0];
        for (const id of sections) {
            const el = document.getElementById(id);
            if (el && el.offsetTop <= pos) current = id;
        }
        navLinks.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + current));
    }
    window.addEventListener("scroll", setActive, { passive: true });
    setActive();

    /* ---------- Hamburger ---------- */
    const hamburger = $("#hamburger");
    const mobileMenu = $("#navLinks");
    function closeMenu() {
        if (hamburger) hamburger.classList.remove("open");
        if (mobileMenu) mobileMenu.classList.remove("open");
    }
    if (hamburger) {
        hamburger.addEventListener("click", () => {
            hamburger.classList.toggle("open");
            mobileMenu.classList.toggle("open");
        });
    }
    $$("#navLinks .nav-link").forEach((link) => link.addEventListener("click", closeMenu));

    /* ---------- Reveal on scroll ---------- */
    const revealEls = $$(".service-card, .portfolio-card, .order-step, .section-header, .cta-band .container, .contact-form-wrapper, .contact-chips");
    revealEls.forEach((el) => el.classList.add("reveal"));
    if ("IntersectionObserver" in window) {
        const io = new IntersectionObserver((entries, obs) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("revealed");
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });
        revealEls.forEach((el) => io.observe(el));
    } else {
        revealEls.forEach((el) => el.classList.add("revealed"));
    }

    /* ---------- Counter animation ---------- */
    const counters = $$(".stat-number[data-target]");
    function animateCounter(el) {
        const target = parseInt(el.getAttribute("data-target"), 10);
        const dur = 1600;
        const start = performance.now();
        function frame(now) {
            const p = Math.min((now - start) / dur, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.floor(eased * target);
            if (p < 1) requestAnimationFrame(frame);
        }
        requestAnimationFrame(frame);
    }
    if ("IntersectionObserver" in window) {
        const cio = new IntersectionObserver((entries, obs) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.6 });
        counters.forEach((c) => cio.observe(c));
    } else {
        counters.forEach((c) => animateCounter(c));
    }

    /* ---------- Tilt effect (cards) ---------- */
    if (window.matchMedia("(hover: hover)").matches) {
        $$("[data-tilt]").forEach((card) => {
            card.addEventListener("mousemove", (e) => {
                const r = card.getBoundingClientRect();
                const x = (e.clientX - r.left) / r.width - 0.5;
                const y = (e.clientY - r.top) / r.height - 0.5;
                card.style.transform = `translateY(-6px) perspective(700px) rotateX(${(-y * 6).toFixed(2)}deg) rotateY(${(x * 6).toFixed(2)}deg)`;
            });
            card.addEventListener("mouseleave", () => {
                card.style.transform = "";
            });
        });
    }

    /* ---------- Contact form -> WhatsApp ---------- */
    const form = $("#contactForm");
    const successBox = $(".form-success");
    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const name = form.name.value.trim();
            const contact = form.email.value.trim();
            const service = form.service.value;
            const message = form.message.value.trim();
            const lang = document.documentElement.getAttribute("lang") || "en";

            const serviceLabels = {
                web: lang === "id" ? "Website / Sistem" : "Website / System",
                gps: lang === "id" ? "GPS / Monitoring" : "GPS / Monitoring",
                backend: lang === "id" ? "Backend / API" : "Backend / API",
                db: lang === "id" ? "Database" : "Database",
                server: lang === "id" ? "Server / Hosting" : "Server / Hosting",
                ai: lang === "id" ? "AI / Otomatisasi" : "AI / Automation",
                other: lang === "id" ? "Lainnya" : "Other",
                "": ""
            };

            const lines = [];
            if (lang === "id") {
                lines.push("Halo Habib! Saya ingin mengirim pekerjaan IT.");
                lines.push("");
                if (name) lines.push("Nama: " + name);
                if (contact) lines.push("Kontak: " + contact);
                if (service) lines.push("Layanan: " + (serviceLabels[service] || service));
                if (message) lines.push("Detail: " + message);
            } else {
                lines.push("Hello Habib! I'd like to send an IT job.");
                lines.push("");
                if (name) lines.push("Name: " + name);
                if (contact) lines.push("Contact: " + contact);
                if (service) lines.push("Service: " + (serviceLabels[service] || service));
                if (message) lines.push("Details: " + message);
            }

            const url = "https://wa.me/6280000000000?text=" + encodeURIComponent(lines.join("\n"));
            window.open(url, "_blank", "noopener");

            if (successBox) {
                successBox.classList.add("show");
                setTimeout(() => successBox.classList.remove("show"), 5000);
            }
            form.reset();
        });
    }

    /* ---------- Respect reduced motion ---------- */
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        document.documentElement.classList.add("reduce-motion");
    }
})();