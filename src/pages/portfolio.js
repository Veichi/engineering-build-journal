window.ECOSPages = window.ECOSPages || {};

window.ECOSPages.portfolio = {
  title: "Portfolio",
  render(data) {
    const projects = data.projects || [];
    const ready = projects.filter((project) => project.portfolioReady);
    const documented = projects.filter((project) => {
      const doc = data.projectDocs?.[project.id] || {};
      return doc.portfolioSummary || doc.results || doc.lessons || project.portfolioReady;
    });
    const nextProject = window.ECOSRecommender.pick(data)[0];
    const readySource = ready.length ? ready : documented;

    return `
      <section class="panel hero-panel">
        <p class="kicker">Portfolio output</p>
        <h3>Turn project notes into career material.</h3>
        <p class="muted">Your documentation feeds the portfolio draft, resume bullet draft, and individual project writeups.</p>
        <div class="quick-actions">
          <button id="generateCareerDocs" class="button primary" type="button">Generate Files</button>
          <a class="button" href="/exports/career-packet.html" target="_blank" rel="noreferrer">Open Career Packet</a>
        </div>
        <p id="careerDocStatus" class="muted">When running with Node, generated files are saved in <code>career-os/exports</code>.</p>
      </section>

      <section class="grid three">
        ${window.ECOSUI.stat("Ready projects", ready.length)}
        ${window.ECOSUI.stat("Documented projects", documented.length)}
        ${window.ECOSUI.stat("Total builds", projects.length)}
      </section>

      <section class="grid two">
        <article class="panel">
          <h3>Ready for portfolio</h3>
          <div class="stack">
            ${readySource.map((project) => {
              const doc = data.projectDocs?.[project.id] || {};
              return `
                <div class="card">
                  <div class="row">
                    <strong>${project.title}</strong>
                    ${window.ECOSUI.pill(project.portfolioReady ? "ready" : "draft", project.portfolioReady ? "green" : "amber")}
                  </div>
                  <p>${doc.portfolioSummary || doc.problem || project.notes || "Add a portfolio summary in Documentation."}</p>
                  <a class="quiet-link" href="#documentation" data-document-project="${project.id}">Edit writeup</a>
                </div>
              `;
            }).join("") || "<p class='muted'>Document one project, then mark it portfolio-ready.</p>"}
          </div>
        </article>

        <article class="panel">
          <h3>Make the next project useful</h3>
          <p>${nextProject ? `<strong>${nextProject.title}</strong> is the next useful build to document.` : "Polish one completed project with photos, measured results, and a clean writeup."}</p>
          ${nextProject ? `<p class="muted">${window.ECOSPages.projects.recommendationReason(nextProject)}</p>` : ""}
          <h4>Portfolio proof to collect</h4>
          <ul>
            <li>Clear problem or purpose</li>
            <li>Photo, screenshot, or short demo</li>
            <li>Code notes or repository link</li>
            <li>Measured result, test, or observed behavior</li>
            <li>Lesson learned and next revision</li>
          </ul>
          <div class="quick-actions">
            <a class="button primary" href="#documentation">Document Project</a>
            <a class="button" href="#projects">Choose Another Build</a>
          </div>
        </article>
      </section>

      <section class="panel">
        <h3>Generated files</h3>
        <div class="quick-actions">
          <a class="button" href="/exports/portfolio-draft.doc" target="_blank" rel="noreferrer">Portfolio Word Doc</a>
          <a class="button" href="/exports/resume-draft.doc" target="_blank" rel="noreferrer">Resume Word Doc</a>
          <a class="button" href="/exports/portfolio-draft.md" target="_blank" rel="noreferrer">Portfolio Markdown</a>
          <a class="button" href="/exports/resume-draft.md" target="_blank" rel="noreferrer">Resume Markdown</a>
          <a class="button" href="/exports/projects/" target="_blank" rel="noreferrer">Project Writeups</a>
        </div>
        <p class="muted">For PDF, open the career packet and use your browser's Print option.</p>
      </section>
    `;
  },
  bind() {
    document.querySelector("#generateCareerDocs")?.addEventListener("click", async () => {
      const status = document.querySelector("#careerDocStatus");
      try {
        const response = await fetch("/api/generate-career-docs", { method: "POST" });
        if (!response.ok) throw new Error("Generation failed");
        status.textContent = "Generated files in career-os/exports. Open the links below.";
      } catch {
        status.textContent = "Could not generate files. Start the app with npm start, then try again.";
      }
    });

    document.querySelectorAll("[data-document-project]").forEach((link) => {
      link.addEventListener("click", () => {
        window.ECOSStore.update((data) => {
          data.selectedDocProjectId = link.dataset.documentProject;
        }, false);
      });
    });
  }
};
