(() => {
  "use strict";

  const data = window.PORTFOLIO_DATA;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const qs = (selector, scope = document) => scope.querySelector(selector);
  const qsa = (selector, scope = document) => [...scope.querySelectorAll(selector)];

  const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
  })[character]);

  function projectCard(project) {
    const nodes = Array.from({ length: 12 }, () => "<i></i>").join("");
    return `
      <article class="project-card" data-category="${escapeHtml(project.category)}" data-roles="${project.roles.join(" ")}" data-accent="${project.accent}" data-cursor="VIEW PROJECT">
        <a class="project-visual" href="projects/${project.slug}/" aria-label="View ${escapeHtml(project.title)} case study">
          <span class="visual-label">${escapeHtml(project.glyph)}</span><span class="visual-code">PRJ—${project.number}</span><div class="visual-nodes" aria-hidden="true">${nodes}</div>
        </a>
        <div class="project-info">
          <div class="project-kicker"><span>${project.number} / 04</span><span>${escapeHtml(project.category)}</span></div>
          <h3>${escapeHtml(project.title)}</h3><p>${escapeHtml(project.description)}</p>
          <div class="project-footer"><div class="stack">${project.stack.map((item) => `<span>${escapeHtml(item)}</span>`).join("")}</div><div class="project-links"><a href="projects/${project.slug}/" aria-label="Open ${escapeHtml(project.title)} case study">↘</a><a href="${project.github}" target="_blank" rel="noreferrer" aria-label="Open ${escapeHtml(project.title)} on GitHub">↗</a></div></div>
        </div>
      </article>`;
  }

  const projectGrid = qs("#project-grid");
  if (projectGrid && data) projectGrid.innerHTML = data.projects.map(projectCard).join("");

  const skillGroups = qs("#skill-groups");
  if (skillGroups && data) {
    skillGroups.innerHTML = data.skills.map((group) => `<article class="skill-group"><h3>${escapeHtml(group.title)}</h3><div class="skill-list">${group.items.map((item) => `<span>${escapeHtml(item)}</span>`).join("")}</div></article>`).join("");
  }

  function setFilter(category) {
    qsa(".filter").forEach((button) => {
      const selected = button.dataset.filter === category;
      button.classList.toggle("active", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
    qsa(".project-card").forEach((card) => card.classList.toggle("hidden", category !== "All" && card.dataset.category !== category));
  }

  qsa(".filter").forEach((button) => button.addEventListener("click", () => setFilter(button.dataset.filter)));
  qsa("[data-filter-link]").forEach((link) => link.addEventListener("click", () => setFilter(link.dataset.filterLink)));

  qsa(".role-btn").forEach((button) => button.addEventListener("click", () => {
    const role = button.dataset.role;
    qsa(".role-btn").forEach((item) => {
      const selected = item === button;
      item.classList.toggle("active", selected);
      item.setAttribute("aria-pressed", String(selected));
    });
    qsa(".domain-row").forEach((row) => row.classList.toggle("dimmed", role !== "all" && !row.dataset.roleTags.split(" ").includes(role)));
    qsa(".project-card").forEach((card) => card.classList.toggle("role-dimmed", role !== "all" && !card.dataset.roles.split(" ").includes(role)));
    const resumeTarget = role === "software" ? "resumes/Jay_Jaiswal_Software_Developer_Resume.pdf" : "resumes/Jay_Jaiswal_AI_ML_Resume.pdf";
    const toggle = qs(".resume-toggle");
    if (toggle) {
      toggle.dataset.preferredResume = resumeTarget;
      toggle.childNodes[0].textContent = role === "software" ? "Download software resume " : role === "all" ? "Download resume " : "Download AI/ML resume ";
      const preferred = qsa(".resume-menu a").find((link) => link.getAttribute("href") === resumeTarget);
      qsa(".resume-menu a").forEach((link) => link.classList.toggle("preferred", link === preferred && role !== "all"));
      if (preferred && role !== "all") resumeMenu.prepend(preferred);
    }
  }));

  const menuButton = qs(".menu-toggle");
  const mobileMenu = qs(".mobile-menu");
  function closeMenu() {
    document.body.classList.remove("menu-open");
    mobileMenu?.classList.remove("open");
    mobileMenu?.setAttribute("aria-hidden", "true");
    menuButton?.setAttribute("aria-expanded", "false");
  }
  menuButton?.addEventListener("click", () => {
    const open = !mobileMenu.classList.contains("open");
    document.body.classList.toggle("menu-open", open);
    mobileMenu.classList.toggle("open", open);
    mobileMenu.setAttribute("aria-hidden", String(!open));
    menuButton.setAttribute("aria-expanded", String(open));
  });
  qsa(".mobile-menu a").forEach((link) => link.addEventListener("click", closeMenu));

  const resumeToggle = qs(".resume-toggle");
  const resumeMenu = qs(".resume-menu");
  resumeToggle?.addEventListener("click", () => {
    const open = !resumeMenu.classList.contains("open");
    resumeMenu.classList.toggle("open", open);
    resumeMenu.setAttribute("aria-hidden", String(!open));
    resumeToggle.setAttribute("aria-expanded", String(open));
  });
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".resume-wrap")) {
      resumeMenu?.classList.remove("open");
      resumeMenu?.setAttribute("aria-hidden", "true");
      resumeToggle?.setAttribute("aria-expanded", "false");
    }
  });

  const commands = {
    help: "Commands: about · projects · skills · contact · github · resume · clear",
    about: "Jay Jaiswal — Computer Science Engineering student working across AI/ML, data science and software development.",
    projects: () => data.projects.map((project) => `<a href="projects/${project.slug}/">${project.number}. ${escapeHtml(project.title)}</a>`).join(" · "),
    skills: () => data.skills.map((group) => `${group.title}: ${group.items.join(", ")}`).join("<br>"),
    contact: '<a href="mailto:jaiswaljay010@gmail.com">jaiswaljay010@gmail.com</a> · Vadodara, India',
    github: '<a href="https://github.com/Jay-Jaiswal" target="_blank" rel="noreferrer">github.com/Jay-Jaiswal ↗</a>',
    resume: '<a href="resumes/Jay_Jaiswal_AI_ML_Resume.pdf" download>AI/ML resume ↓</a> · <a href="resumes/Jay_Jaiswal_Software_Developer_Resume.pdf" download>Software resume ↓</a>'
  };
  const terminalForm = qs("#terminal-form");
  const terminalOutput = qs("#terminal-output");
  terminalForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = qs("#terminal-input");
    const command = input.value.trim().toLowerCase();
    input.value = "";
    if (!command) return;
    if (command === "clear") { terminalOutput.innerHTML = ""; return; }
    const result = commands[command];
    terminalOutput.insertAdjacentHTML("beforeend", `<p><strong>visitor@portfolio:~$</strong> ${escapeHtml(command)}</p><p>${result ? (typeof result === "function" ? result() : result) : `Command not found: ${escapeHtml(command)}. Try <strong>help</strong>.`}</p>`);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
  });

  const copyEmail = qs(".email-copy");
  copyEmail?.addEventListener("click", async (event) => {
    if (!navigator.clipboard) return;
    event.preventDefault();
    try {
      await navigator.clipboard.writeText(copyEmail.dataset.copy);
      const label = qs("span", copyEmail);
      label.textContent = "COPIED";
      window.setTimeout(() => { label.textContent = "COPY"; }, 1800);
    } catch { window.location.href = copyEmail.href; }
  });

  const contactForm = qs("#contact-form");
  contactForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    let valid = true;
    qsa("[required]", contactForm).forEach((field) => {
      const error = field.parentElement.querySelector("small");
      const emailInvalid = field.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value);
      const invalid = !field.value.trim() || emailInvalid;
      if (error) error.textContent = invalid ? (emailInvalid ? "Enter a valid email address." : "This field is required.") : "";
      field.setAttribute("aria-invalid", String(invalid));
      valid = valid && !invalid;
    });
    if (!valid) { qs("#form-status").textContent = "Please review the highlighted fields."; return; }
    const form = new FormData(contactForm);
    const subject = encodeURIComponent(`[${form.get("opportunity")}] ${form.get("subject")}`);
    const body = encodeURIComponent(`Hi Jay,\n\n${form.get("message")}\n\nFrom: ${form.get("name")}\nEmail: ${form.get("email")}`);
    qs("#form-status").textContent = "Opening your email app. Your message has not been sent yet.";
    window.location.href = `mailto:jaiswaljay010@gmail.com?subject=${subject}&body=${body}`;
  });

  const progress = qs(".page-progress span");
  function updateProgress() {
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${max ? scrollY / max : 0})`;
  }
  addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();
  qs("#year").textContent = new Date().getFullYear();

  function initCanvas() {
    const canvas = qs("#neural-canvas");
    if (!canvas || reducedMotion) return;
    const context = canvas.getContext("2d");
    let points = [];
    let pointer = { x: innerWidth * .7, y: innerHeight * .35 };
    function resize() {
      const ratio = Math.min(devicePixelRatio, 2);
      canvas.width = canvas.clientWidth * ratio;
      canvas.height = canvas.clientHeight * ratio;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      const count = innerWidth < 720 ? 28 : 58;
      points = Array.from({ length: count }, () => ({ x: Math.random() * canvas.clientWidth, y: Math.random() * canvas.clientHeight, vx: (Math.random() - .5) * .18, vy: (Math.random() - .5) * .18 }));
    }
    function draw() {
      context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
      points.forEach((point, index) => {
        point.x += point.vx; point.y += point.vy;
        if (point.x < 0 || point.x > canvas.clientWidth) point.vx *= -1;
        if (point.y < 0 || point.y > canvas.clientHeight) point.vy *= -1;
        const pd = Math.hypot(point.x - pointer.x, point.y - pointer.y);
        if (pd < 160) { point.x += (pointer.x - point.x) * .0007; point.y += (pointer.y - point.y) * .0007; }
        context.fillStyle = index % 7 === 0 ? "#ffc857" : "rgba(246,241,232,.42)";
        context.beginPath(); context.arc(point.x, point.y, index % 7 === 0 ? 2 : 1, 0, Math.PI * 2); context.fill();
        points.slice(index + 1).forEach((other) => {
          const distance = Math.hypot(point.x - other.x, point.y - other.y);
          if (distance < 115) { context.strokeStyle = `rgba(85,214,190,${(1 - distance / 115) * .15})`; context.beginPath(); context.moveTo(point.x, point.y); context.lineTo(other.x, other.y); context.stroke(); }
        });
      });
      requestAnimationFrame(draw);
    }
    canvas.parentElement.addEventListener("pointermove", (event) => { pointer = { x: event.clientX, y: event.clientY }; });
    addEventListener("resize", resize); resize(); draw();
  }

  function initMotion() {
    if (reducedMotion) return;
    if (window.gsap && window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
      gsap.from(".headline-line", { yPercent: 110, opacity: 0, duration: 1.1, stagger: .1, ease: "power4.out", delay: .15 });
      gsap.from(".hero .reveal-up", { y: 28, opacity: 0, duration: .8, stagger: .12, delay: .55 });
      qsa(".reveal-up").filter((element) => !element.closest(".hero")).forEach((element) => gsap.from(element, { scrollTrigger: { trigger: element, start: "top 88%" }, y: 45, opacity: 0, duration: .8, ease: "power3.out" }));
      qsa(".reveal-text").forEach((element) => gsap.from(element, { scrollTrigger: { trigger: element, start: "top 90%" }, clipPath: "inset(0 0 100% 0)", y: 30, duration: 1, ease: "power4.out" }));
      gsap.to(".hero-grid", { scrollTrigger: { trigger: ".hero", scrub: true, start: "top top", end: "bottom top" }, yPercent: 25 });
      qsa(".project-visual").forEach((element) => gsap.from(element, { scrollTrigger: { trigger: element, start: "top 88%" }, clipPath: "inset(0 0 100% 0)", duration: 1, ease: "power3.inOut" }));
    } else {
      const observer = new IntersectionObserver((entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("is-visible")), { threshold: .1 });
      qsa(".reveal-up,.reveal-text,.project-card").forEach((element) => observer.observe(element));
    }
  }

  function initCursor() {
    if (matchMedia("(pointer: coarse)").matches) return;
    const cursor = qs(".cursor");
    const label = qs(".cursor span");
    addEventListener("pointermove", (event) => { cursor.style.left = `${event.clientX}px`; cursor.style.top = `${event.clientY}px`; });
    qsa("[data-cursor]").forEach((element) => {
      element.addEventListener("pointerenter", () => { cursor.classList.add("label"); label.textContent = element.dataset.cursor; });
      element.addEventListener("pointerleave", () => cursor.classList.remove("label"));
    });
    qsa(".magnetic").forEach((element) => {
      element.addEventListener("pointermove", (event) => { const rect = element.getBoundingClientRect(); element.style.transform = `translate(${(event.clientX - rect.left - rect.width / 2) * .1}px, ${(event.clientY - rect.top - rect.height / 2) * .1}px)`; });
      element.addEventListener("pointerleave", () => { element.style.transform = ""; });
    });
  }

  initCanvas(); initMotion(); initCursor();
})();
