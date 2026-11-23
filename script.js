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
        en: ["Freelance Engineer", "IoT & Maritime Engineer", "Full-Stack Developer", "AI Automation Builder"],
        id: ["Freelance Engineer", "Engineer IoT & Maritim", "Full-Stack Developer", "Pembuat Otomatisasi AI"]
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

    const sections = ["hero", "journey", "services", "featured", "portfolio", "order", "contact"];
    const sectionGap = 160;
    function setActive() {
        const pos = window.scrollY + sectionGap;
        let current = sections[0];
        for (const id of sections) {
            const el = document.getElementById(id);
            if (el && el.offsetTop <= pos) current = id;
        }
        if (current === "featured") current = "portfolio";
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


    /* ---------- Career journey (scroll-driven timeline) ---------- */
    (function journey() {
        const track = $("#journeyTrack");
        if (!track) return;
        const fill = $("#journeyFill");
        const traveler = $("#journeyTraveler");
        const hudLevel = $("#hudLevel");
        const hudYear = $("#hudYear");
        const hudTitle = $("#hudTitle");
        const hudBar = $("#hudBar");
        const milestones = $$(".milestone", track);
        const maxLevel = milestones.length - 1;
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        let currentLevel = -3, ticking = false, toastTimer = 0, firstRun = true;

        const toast = document.createElement("div");
        toast.className = "levelup-toast";
        document.body.appendChild(toast);

        function lang() { return document.documentElement.getAttribute("lang") === "id" ? "id" : "en"; }

        function sparks(node) {
            if (reduce) return;
            const colors = ["#34d399", "#fbbf24", "#4ade80", "#6ee7b7"];
            const r = node.getBoundingClientRect(), t = track.getBoundingClientRect();
            for (let i = 0; i < 14; i++) {
                const s = document.createElement("span");
                s.className = "levelup-spark";
                const a = (Math.PI * 2 * i) / 14, d = 40 + Math.random() * 30;
                s.style.left = (r.left - t.left + r.width / 2 - 4) + "px";
                s.style.top = (r.top - t.top + r.height / 2 - 4) + "px";
                s.style.background = colors[i % colors.length];
                s.style.setProperty("--dx", Math.cos(a) * d + "px");
                s.style.setProperty("--dy", Math.sin(a) * d + "px");
                track.appendChild(s);
                setTimeout(() => s.remove(), 950);
            }
        }

        function setLevel(lv, celebrate) {
            if (lv === currentLevel) return;
            const goingUp = lv > currentLevel;
            currentLevel = lv;
            const m = milestones[Math.max(lv, 0)];
            hudLevel.textContent = Math.max(lv, 0);
            hudYear.textContent = m.dataset.year;
            hudTitle.textContent = m.dataset["title" + (lang() === "id" ? "Id" : "En")];
            if (celebrate && goingUp && lv > 0) {
                hudLevel.classList.remove("bump"); void hudLevel.offsetWidth; hudLevel.classList.add("bump");
                sparks($(".milestone-node", m));
                toast.textContent = "⚡ LEVEL UP! LV " + lv + " — " + hudTitle.textContent;
                toast.classList.add("show");
                clearTimeout(toastTimer);
                toastTimer = setTimeout(() => toast.classList.remove("show"), 1800);
            }
        }

        function update() {
            ticking = false;
            const rect = track.getBoundingClientRect();
            const anchor = window.innerHeight * 0.55;
            const p = Math.min(Math.max((anchor - rect.top) / rect.height, 0), 1);
            const y = p * rect.height;
            fill.style.height = (p * 100) + "%";
            traveler.style.transform = "translateY(" + y + "px)";

            let lv = -1;
            milestones.forEach((m, i) => {
                const nodeY = m.offsetTop + 45;
                const reached = y >= nodeY;
                m.classList.toggle("active", reached);
                if (reached) lv = i;
                if (m.getBoundingClientRect().top < window.innerHeight * 0.85) m.classList.add("shown");
            });
            hudBar.style.width = (maxLevel > 0 ? Math.max(lv, 0) / maxLevel * 100 : 0) + "%";
            setLevel(lv, !firstRun);
            firstRun = false;
        }

        function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll);
        const lt = $("#langToggle");
        if (lt) lt.addEventListener("click", () => { const l = currentLevel; currentLevel = -2; setLevel(l, false); });
        update();
    })();


    /* ---------- Featured: screenshot gallery ---------- */
    (function featuredGallery() {
        const screen = $("#fgScreen");
        if (!screen) return;
        const imgs = $$("img", screen);
        const tabs = $$(".fg-tab");
        const url = $("#fgUrl");
        const bar = $("#fgProgress");
        const DURATION = 4500;
        let idx = 0, start = performance.now(), paused = false;

        function show(i) {
            idx = (i + imgs.length) % imgs.length;
            imgs.forEach((im, k) => im.classList.toggle("active", k === idx));
            tabs.forEach((t, k) => t.classList.toggle("active", k === idx));
            if (url) url.textContent = imgs[idx].dataset.key;
            start = performance.now();
        }
        tabs.forEach((t) => t.addEventListener("click", () => show(+t.dataset.idx)));
        screen.addEventListener("mouseenter", () => { paused = true; });
        screen.addEventListener("mouseleave", () => { paused = false; start = performance.now(); });
        (function loop(now) {
            if (paused) start = now - (parseFloat(bar.style.width) || 0) / 100 * DURATION;
            const p = Math.min((now - start) / DURATION, 1);
            bar.style.width = (p * 100) + "%";
            if (p >= 1) show(idx + 1);
            requestAnimationFrame(loop);
        })(performance.now());
    })();

    /* ---------- Featured: live engine + fuel simulation ---------- */
    (function liveWidget() {
        const panel = $("#livePanel");
        if (!panel) return;
        const needle = $("#gaugeNeedle"), arc = $("#gaugeArc");
        const rpmEl = $("#liveRpm"), fuelEl = $("#liveFuel"), rateEl = $("#liveRate"),
              tempEl = $("#liveTemp"), speedEl = $("#liveSpeed"), fill = $("#tankFill"), spark = $("#liveSpark");
        const MAX_RPM = 1400;
        let rpm = 0, target = 780, fuel = 78, temp = 72, hist = [];

        function tween(el, to, dec) {
            if (el._raf) cancelAnimationFrame(el._raf);
            const from = isFinite(el._val) ? el._val : 0, t0 = performance.now();
            (function f() {
                const p = Math.min(Math.max((performance.now() - t0) / 800, 0), 1);
                el._val = from + (to - from) * (1 - Math.pow(1 - p, 3));
                el.textContent = el._val.toFixed(dec);
                el._raf = p < 1 ? requestAnimationFrame(f) : 0;
            })();
        }
        function tick() {
            if (Math.random() < 0.25) target = 450 + Math.random() * 700;
            rpm += (target - rpm) * 0.45 + (Math.random() - 0.5) * 40;
            rpm = Math.max(0, Math.min(MAX_RPM, rpm));
            const r = rpm / MAX_RPM;
            needle.style.transform = "rotate(" + (-90 + r * 180) + "deg)";
            arc.style.strokeDashoffset = 100 - r * 100;
            tween(rpmEl, rpm, 0);
            const rate = 8 + r * 55;
            tween(rateEl, rate, 1);
            temp += ((65 + r * 25) - temp) * 0.2;
            tween(tempEl, temp, 1);
            tween(speedEl, r * 16, 1);
            fuel -= rate / 400;
            if (fuel < 18) fuel = 92; // refuel
            fill.style.height = fuel + "%";
            fill.classList.toggle("low", fuel < 35);
            tween(fuelEl, fuel, 0);
            hist.push(rpm); if (hist.length > 30) hist.shift();
            spark.setAttribute("points", hist.map((v, i) => (i * 300 / 29).toFixed(1) + "," + (48 - v / MAX_RPM * 44).toFixed(1)).join(" "));
        }
        let timer = 0;
        const io = new IntersectionObserver((es) => {
            es.forEach((e) => {
                if (e.isIntersecting && !timer) { tick(); timer = setInterval(tick, 1600); }
                else if (!e.isIntersecting && timer) { clearInterval(timer); timer = 0; }
            });
        });
        io.observe(panel);
    })();

    /* ---------- Lightbox for screenshots ---------- */
    (function lightbox() {
        const lb = document.createElement("div");
        lb.className = "lightbox";
        lb.innerHTML = "<img alt=''>";
        document.body.appendChild(lb);
        const big = $("img", lb);
        function open(src, alt) { big.src = src; big.alt = alt || ""; lb.classList.add("open"); }
        lb.addEventListener("click", () => lb.classList.remove("open"));
        document.addEventListener("keydown", (e) => { if (e.key === "Escape") lb.classList.remove("open"); });
        const screen = $("#fgScreen");
        if (screen) screen.addEventListener("click", () => { const a = $("img.active", screen); if (a) open(a.src, a.alt); });
        $$(".portfolio-cover").forEach((c) => c.addEventListener("click", (e) => {
            if (e.target.closest("a")) return;
            const im = $("img", c); if (im) open(im.src, im.alt);
        }));
    })();

    /* ---------- Portfolio filter ---------- */
    (function portfolioFilter() {
        const bar = $("#portfolioFilters");
        if (!bar) return;
        bar.addEventListener("click", (e) => {
            const btn = e.target.closest("[data-filter]");
            if (!btn) return;
            const f = btn.dataset.filter;
            $$(".pf-btn", bar).forEach((b) => b.classList.toggle("active", b === btn));
            $$(".portfolio-card").forEach((card, i) => {
                const show = f === "all" || card.dataset.cat === f;
                card.classList.toggle("is-hidden", !show);
                card.classList.remove("pop");
                if (show) { card.classList.add("revealed"); void card.offsetWidth; card.style.animationDelay = (i % 6) * 0.05 + "s"; card.classList.add("pop"); }
            });
        });
    })();


    /* ---------- Hero: typing code editor ---------- */
    (function codeTyper() {
        const body = $("#codeBody"), fileEl = $("#codeFile");
        if (!body) return;
        // token types: k=keyword f=function s=string n=number c=comment v=variable, plain = ""
        const files = [
            { name: "engine_monitor.py", lines: [
                [["c", "# read engine RPM & fuel from vessel"]],
                [["k", "import "], ["", "requests, time"]],
                [["k", "def "], ["f", "read_engine"], ["", "(vessel):"]],
                [["", "    rpm = sensor."], ["f", "rpm"], ["", "(gear_ratio="], ["n", "2.5"], ["", ")"]],
                [["", "    fuel = tank."], ["f", "level"], ["", "("], ["s", "\"tank_1\""], ["", ")"]],
                [["k", "    if "], ["", "fuel < "], ["n", "25"], ["", ":"]],
                [["", "        "], ["f", "send_alert"], ["", "("], ["s", "\"Low fuel!\""], ["", ")"]],
                [["k", "    return "], ["", "{"], ["s", "\"rpm\""], ["", ": rpm, "], ["s", "\"fuel\""], ["", ": fuel}"]]
            ]},
            { name: "tambak.ino", lines: [
                [["c", "// ESP32 pond sensor node"]],
                [["k", "void "], ["f", "loop"], ["", "() {"]],
                [["k", "  float "], ["v", "ph"], ["", " = "], ["f", "readPH"], ["", "();"]],
                [["k", "  float "], ["v", "doVal"], ["", " = "], ["f", "readDO"], ["", "();"]],
                [["k", "  if "], ["", "(doVal < "], ["n", "4.0"], ["", ") "], ["f", "aeratorOn"], ["", "();"]],
                [["", "  mqtt."], ["f", "publish"], ["", "("], ["s", "\"pond/1\""], ["", ", payload);"]],
                [["", "  "], ["f", "delay"], ["", "("], ["n", "5000"], ["", ");"]],
                [["", "}"]]
            ]},
            { name: "api.ts", lines: [
                [["c", "// realtime dashboard API"]],
                [["", "app."], ["f", "post"], ["", "("], ["s", "'/api/telemetry'"], ["", ", "], ["k", "async "], ["", "(req, res) => {"]],
                [["k", "  const "], ["v", "data"], ["", " = schema."], ["f", "parse"], ["", "(req.body);"]],
                [["k", "  await "], ["", "db.reading."], ["f", "create"], ["", "({ data });"]],
                [["", "  io."], ["f", "emit"], ["", "("], ["s", "'update'"], ["", ", data);"]],
                [["", "  res."], ["f", "json"], ["", "({ ok: "], ["k", "true"], ["", " });"]],
                [["", "});"]]
            ]},
            { name: "agent.py", lines: [
                [["c", "# AI agent answers customers 24/7"]],
                [["", "agent = "], ["f", "Agent"], ["", "(tools=[stock, orders])"]],
                [["k", "async def "], ["f", "on_message"], ["", "(msg):"]],
                [["", "    reply = "], ["k", "await "], ["", "agent."], ["f", "run"], ["", "(msg.text)"]],
                [["k", "    await "], ["", "whatsapp."], ["f", "send"], ["", "(msg.chat, reply)"]]
            ]}
        ];
        const MAX_LINES = 14;
        let fileIdx = 0, lineNo = 0;

        function newLine() {
            lineNo++;
            const prev = $(".code-line.current", body);
            if (prev) { prev.classList.remove("current"); const c = $(".caret", prev); if (c) c.remove(); }
            const row = document.createElement("div");
            row.className = "code-line current";
            row.innerHTML = '<span class="ln">' + lineNo + '</span><span class="tx"></span><span class="caret"></span>';
            body.appendChild(row);
            while (body.children.length > MAX_LINES) body.firstElementChild.remove();
            return $(".tx", row);
        }

        if (document.documentElement.classList.contains("reduce-motion") ||
            window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            files[0].lines.forEach((ln) => {
                const tx = newLine();
                ln.forEach(([t, txt]) => { const sp = document.createElement("span"); if (t) sp.className = "tk-" + t; sp.textContent = txt; tx.appendChild(sp); });
            });
            return;
        }

        function typeFile() {
            const file = files[fileIdx];
            fileIdx = (fileIdx + 1) % files.length;
            if (fileEl) fileEl.textContent = file.name;
            let li = 0;
            function typeLine() {
                if (li >= file.lines.length) { newLine(); setTimeout(typeFile, 1400); return; }
                const tokens = file.lines[li++], tx = newLine();
                let ti = 0, ci = 0, span = null;
                (function typeChar() {
                    if (ti >= tokens.length) { setTimeout(typeLine, 260 + Math.random() * 260); return; }
                    const [type, text] = tokens[ti];
                    if (ci === 0) { span = document.createElement("span"); if (type) span.className = "tk-" + type; tx.appendChild(span); }
                    // indentation appears at once, code is typed
                    if (ci === 0 && /^\s+$/.test(text)) { span.textContent = text; ti++; ci = 0; return typeChar(); }
                    span.textContent += text[ci++];
                    if (ci >= text.length) { ti++; ci = 0; }
                    setTimeout(typeChar, 28 + Math.random() * 55);
                })();
            }
            typeLine();
        }
        typeFile();
    })();

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