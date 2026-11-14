(() => {
  "use strict";
  const project = window.PORTFOLIO_DATA?.projects.find((item) => item.slug === document.body.dataset.slug);
  if (!project) { document.body.innerHTML = '<main class="case-header"><h1>Project not found.</h1><a href="../../">Return home</a></main>'; return; }
  const color = { lime: "#c6ff3d", cyan: "#35d6e8", violet: "#9b7bff", orange: "#ff8a3d" }[project.accent];
  document.documentElement.style.setProperty("--case-accent", color);
  document.title = `${project.title} — Jay Jaiswal`;
  document.querySelector('meta[name="description"]').content = project.description;
  const safe = (text) => String(text).replace(/[&<>'"]/g, (c) => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[c]);
  document.querySelector("main").innerHTML = `
    <section class="case-header">
      <a class="case-back" href="../../">← BACK TO INDEX</a>
      <div class="case-kicker"><span>PROJECT ${project.number} / 04</span><span>${safe(project.category)}</span></div>
      <h1>${safe(project.title)}</h1><p>${safe(project.description)}</p>
      <div class="case-actions"><a class="button primary" href="${project.github}" target="_blank" rel="noreferrer">Open GitHub ↗</a><a class="button ghost" href="../../#projects">All projects</a></div>
    </section>
    <section class="case-visual" aria-label="Project architecture overview"><div class="case-flow">${project.architecture.map((step, index) => `${index ? "<i></i>" : ""}<span>${safe(step)}</span>`).join("")}</div></section>
    <div class="case-content">
      <section class="case-block"><h2>Overview</h2><div><p>${safe(project.description)}</p><div class="stack">${project.stack.map((item) => `<span>${safe(item)}</span>`).join("")}</div></div></section>
      <section class="case-block"><h2>Objective</h2><div><p>${safe(project.objective)}</p></div></section>
      <section class="case-block"><h2>Implementation</h2><div><ul class="feature-list">${project.features.map((feature) => `<li>${safe(feature)}</li>`).join("")}</ul></div></section>
      <section class="case-block"><h2>Architecture</h2><div><p>The diagram above reflects only the components named in the supplied resume. Repository documentation remains the source for implementation-level detail.</p><div class="case-note">No unsupported performance metrics, model scores, production claims or outcomes have been added.</div></div></section>
      <section class="case-block"><h2>Source</h2><div><p>Review the code and current documentation in the public repository.</p><a class="button primary" href="${project.github}" target="_blank" rel="noreferrer">View repository ↗</a></div></section>
    </div>`;
})();
