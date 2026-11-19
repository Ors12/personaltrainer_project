document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("year").textContent = new Date().getFullYear();

  const nav = document.querySelector(".navbar-collapse");
  document.querySelectorAll(".navbar-nav .nav-link, .navbar-nav .btn").forEach(link => {
    link.addEventListener("click", () => {
      if (nav.classList.contains("show")) {
        bootstrap.Collapse.getOrCreateInstance(nav).hide();
      }
    });
  });


  /* ===== Fix menü: görgetéskor kompakt mód, haladásjelző, aktív menüpont ===== */
  const navbar = document.querySelector(".navbar");
  const progress = document.createElement("div");
  progress.className = "scroll-progress";
  navbar.appendChild(progress);

  const sections = [...document.querySelectorAll("header[id], section[id]")];
  const navLinks = [...document.querySelectorAll(".navbar-nav .nav-link")];
  const hero = document.querySelector(".hero");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let ticking = false;
  const onScroll = () => {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    navbar.classList.toggle("scrolled", y > 40);
    progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;

    let current = "";
    sections.forEach(sec => { if (y >= sec.offsetTop - 120) current = sec.id; });
    navLinks.forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + current));

    if (!reduceMotion && y < window.innerHeight * 1.2) {
      hero.style.backgroundPositionY = `calc(50% + ${y * 0.35}px)`;
    }
    ticking = false;
  };
  window.addEventListener("scroll", () => {
    if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  onScroll();

  /* ===== Görgetéses megjelenési animációk ===== */
  const revealGroups = [
    [".hero .eyebrow, .hero h1, .hero-copy, .hero .btn, .hero-proof > div", "up"],
    [".photo-frame", "left"],
    ["section .eyebrow, .section-title, .lead-copy, .muted-copy, .muted-on-dark, .checks > div, .text-link", "up"],
    [".service-card", "up"],
    [".stats-band .col-6", "zoom"],
    [".quote-mark, .testimonial-section blockquote, .quote-author", "up"],
    [".contact-detail", "up"],
    [".contact-form", "right"]
  ];
  const revealEls = [];
  revealGroups.forEach(([sel, type]) => {
    document.querySelectorAll(sel).forEach(el => {
      if (el.dataset.reveal) return;
      el.dataset.reveal = type;
      revealEls.push(el);
    });
  });

  // Egymás után érkező elemek (lépcsőzetes késleltetés szülőnként)
  const counters = new Map();
  revealEls.forEach(el => {
    const parent = el.closest(".row, .hero-proof, .d-flex, .col-lg-5, .col-lg-6, .col-lg-7, .col-lg-8") || el.parentElement;
    const i = counters.get(parent) || 0;
    counters.set(parent, i + 1);
    el.style.setProperty("--reveal-delay", `${Math.min(i, 6) * 90}ms`);
  });

  const countUp = el => {
    const strong = el.querySelector("strong");
    if (!strong || strong.dataset.counted) return;
    const node = strong.firstChild;
    const target = parseInt(node && node.textContent, 10);
    if (!node || isNaN(target)) return;
    strong.dataset.counted = "1";
    if (reduceMotion) return;
    const start = performance.now(), dur = 1400;
    const step = now => {
      const t = Math.min((now - start) / dur, 1);
      node.textContent = Math.round(target * (1 - Math.pow(1 - t, 3)));
      if (t < 1) requestAnimationFrame(step);
    };
    node.textContent = "0";
    requestAnimationFrame(step);
  };

  if ("IntersectionObserver" in window && !reduceMotion) {
    document.documentElement.classList.add("js-reveal");
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        if (entry.target.matches(".stats-band .col-6")) countUp(entry.target);
        io.unobserve(entry.target);
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(el => io.observe(el));
  }

  const form = document.getElementById("contactForm");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const data = new FormData(form);
    const subject = encodeURIComponent("Személyi edzés érdeklődés – " + data.get("name"));
    const body = encodeURIComponent(
      `Név: ${data.get("name")}\nEmail: ${data.get("email")}\nCél: ${data.get("goal")}\n\nÜzenet:\n${data.get("message") || "Nincs megadva."}`
    );
    document.getElementById("formStatus").textContent = "Megnyitjuk az email alkalmazásodat az előkészített üzenettel.";
    window.location.href = `mailto:hello@boldizsartraining.hu?subject=${subject}&body=${body}`;
  });
});
