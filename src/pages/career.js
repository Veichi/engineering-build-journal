window.ECOSPages = window.ECOSPages || {};

window.ECOSPages.career = {
  title: "Career Materials",
  render(data) {
    const readyProjects = data.projects.filter((project) => project.portfolioReady);
    const repos = data.repos.filter((repo) => repo.name || repo.link);
    const internshipDone = data.internship.filter((item) => item.done).length;
    const internshipReadiness = window.ECOSUtils.percent(internshipDone, data.internship.length);

    return `
      <section class="panel hero-panel">
        <h3>Turn documented projects into proof</h3>
        <p class="muted">This page is for the career-facing side of the notebook: portfolio readiness, resume bullets, GitHub links, and internship prep. You do not need to update it every day.</p>
        <div class="quick-actions">
          <button id="generateCareerDocs" class="button primary" type="button">Generate Resume + Portfolio Files</button>
          <a class="button" href="/exports/career-packet.html" target="_blank" rel="noreferrer">Open Career Packet</a>
        </div>
        <p id="careerDocStatus" class="muted">When running with Node, generated files are saved in <code>career-os/exports</code>.</p>
      </section>
      <section class="grid three">
        ${window.ECOSUI.stat("Portfolio-ready", readyProjects.length)}
        ${window.ECOSUI.stat("GitHub repos", repos.length)}
        ${window.ECOSUI.stat("Internship prep", `${internshipReadiness}%`)}
      </section>
      <section class="grid two">
        <article class="panel">
          <h3>Portfolio Checklist</h3>
          <div class="stack">
            ${data.portfolioChecklist.map((item) => `
              <label class="check-row">
                <input data-career-portfolio="${item.id}" type="checkbox" ${item.done ? "checked" : ""} />
                <span>${item.item}</span>
              </label>
            `).join("")}
          </div>
        </article>
        <article class="panel">
          <h3>Internship Prep</h3>
          <div class="stack">
            ${data.internship.map((item) => `
              <label class="check-row">
                <input data-career-internship="${item.id}" type="checkbox" ${item.done ? "checked" : ""} />
                <span><strong>${item.item}</strong><br><span class="muted">${item.notes}</span></span>
              </label>
            `).join("")}
          </div>
        </article>
      </section>
      <section class="panel">
        <h3>Resume bullet drafts</h3>
        <div class="stack">
          ${data.projects.map((project) => `
            <div class="card">
              <strong>${project.title}</strong>
              <p>${window.ECOSPages.resume.generateBullet(project)}</p>
              <a class="quiet-link" href="#resume">Edit bullet fields</a>
            </div>
          `).join("")}
        </div>
      </section>
      <section class="panel">
        <h3>Career tools</h3>
        <div class="quick-actions">
          <a class="button" href="#portfolio">Portfolio Builder</a>
          <a class="button" href="#resume">Resume Bullets</a>
          <a class="button" href="#github">GitHub Tracker</a>
          <a class="button" href="#internship">Internship Prep</a>
        </div>
      </section>
      <section class="panel">
        <h3>Generated files</h3>
        <div class="quick-actions">
          <a class="button" href="/exports/resume-draft.doc" target="_blank" rel="noreferrer">Resume Word Doc</a>
          <a class="button" href="/exports/portfolio-draft.doc" target="_blank" rel="noreferrer">Portfolio Word Doc</a>
          <a class="button" href="/exports/resume-draft.md" target="_blank" rel="noreferrer">Resume Markdown</a>
          <a class="button" href="/exports/portfolio-draft.md" target="_blank" rel="noreferrer">Portfolio Markdown</a>
          <a class="button" href="/exports/projects/" target="_blank" rel="noreferrer">Project Docs Folder</a>
        </div>
        <p class="muted">Open the career packet in your browser and use Print to save it as a PDF.</p>
      </section>
    `;
  },
  bind() {
    document.querySelector("#generateCareerDocs")?.addEventListener("click", async () => {
      const status = document.querySelector("#careerDocStatus");
      try {
        const response = await fetch("/api/generate-career-docs", { method: "POST" });
        if (!response.ok) throw new Error("Generation failed");
        status.textContent = "Generated files in career-os/exports. You can open the links below.";
      } catch {
        status.textContent = "Could not generate project-folder files. Start the app with npm start, then try again.";
      }
    });

    document.querySelectorAll("[data-career-portfolio]").forEach((box) => {
      box.addEventListener("change", () => {
        window.ECOSStore.update((data) => {
          data.portfolioChecklist.find((item) => item.id === box.dataset.careerPortfolio).done = box.checked;
        });
      });
    });

    document.querySelectorAll("[data-career-internship]").forEach((box) => {
      box.addEventListener("change", () => {
        window.ECOSStore.update((data) => {
          data.internship.find((item) => item.id === box.dataset.careerInternship).done = box.checked;
        });
      });
    });
  }
};
