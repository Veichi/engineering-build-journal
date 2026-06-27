window.ECOSPages = window.ECOSPages || {};

window.ECOSPages.dashboard = {
  title: "Home",
  render(data) {
    const escape = window.ECOSUtils.escape;
    const projects = data.projects || [];
    const selectedProject = projects.find((project) => project.id === data.activeProjectId);
    const activeProject = selectedProject
      || projects.find((project) => project.id === data.selectedDocProjectId)
      || projects.find((project) => project.status === "in progress")
      || projects.find((project) => project.status === "planned")
      || projects[0];
    const recommendation = window.ECOSRecommender.pick(data)[0] || activeProject;
    const completed = projects.filter((project) => project.status === "complete").length;
    const documented = projects.filter((project) => {
      const doc = project.documentation || {};
      return doc.problem || doc.results || doc.portfolioSummary || project.portfolioReady;
    }).length;
    const portfolioReady = projects.filter((project) => project.portfolioReady).length;
    const doc = activeProject ? activeProject.documentation || {} : {};
    const maturity = activeProject ? window.ECOSUI.maturity(activeProject, doc) : null;

    return `
      <section class="dashboard-shell">
        <div class="journal-hero dashboard-hero">
          <div>
            <p class="kicker">Engineering journal</p>
            <h3>Plan, build, learn, repeat.</h3>
            <p class="muted">Keep projects, ideas, notebook entries, and career-ready exports in one local workspace.</p>
          </div>
          <div class="hero-card">
            <span class="sketch-mark"></span>
            <strong>${activeProject ? escape(activeProject.title) : "No active build"}</strong>
            <p>${activeProject ? escape(activeProject.parts || "Parts/tools not added yet.") : "Choose a project to begin."}</p>
            ${maturity ? window.ECOSUI.pill(maturity.label, maturity.cls) : ""}
          </div>
        </div>

        <section class="quick-grid">
          <a class="quick-card" href="#projects"><span>+</span><strong>New Project</strong><small>Start a build</small></a>
          <a class="quick-card" href="#ideas"><span>i</span><strong>New Idea</strong><small>Capture a concept</small></a>
          <a class="quick-card" href="#journal"><span>n</span><strong>New Note</strong><small>Record progress</small></a>
          <a class="quick-card" href="#portfolio"><span>e</span><strong>Export</strong><small>Prepare outputs</small></a>
        </section>
      </section>

      <section class="grid two">
        <article class="panel">
          <p class="kicker">Recommended next</p>
          <h3>${recommendation ? escape(recommendation.title) : "Add your first project"}</h3>
          <p>${recommendation ? window.ECOSPages.projects.recommendationReason(recommendation) : "Start with a small Arduino project and document it carefully."}</p>
          ${recommendation ? `<p><strong>Parts/tools:</strong> ${escape(recommendation.parts || "Add parts/tools")}</p>` : ""}
          <div class="quick-actions">
            ${recommendation ? `<button class="button primary" data-start-project="${recommendation.id}" type="button">Start This Build</button>` : ""}
            <a class="button" href="#projects">See Suggestions</a>
          </div>
        </article>

        <article class="panel">
          <p class="kicker">Current build</p>
          <div class="row">
            <h3>${activeProject ? escape(activeProject.title) : "No project selected"}</h3>
            ${maturity ? window.ECOSUI.pill(maturity.label, maturity.cls) : ""}
          </div>
          <p class="muted">${activeProject ? "This is the project the app will center on until you choose another one." : "Add a project to begin."}</p>
          <div class="quick-actions">
            ${activeProject ? `<a class="button primary" href="#documentation" data-document-project="${activeProject.id}">Open Documentation</a>` : ""}
            <a class="button" href="#portfolio">Open Export Center</a>
          </div>
        </article>
      </section>

      <section class="grid three">
        ${window.ECOSUI.stat("Built", completed)}
        ${window.ECOSUI.stat("Documented", documented)}
        ${window.ECOSUI.stat("Ready to export", portfolioReady)}
      </section>
    `;
  },
  bind() {
    document.querySelectorAll("[data-start-project]").forEach((button) => {
      button.addEventListener("click", () => {
        window.ECOSStore.update((data) => {
          const project = data.projects.find((item) => item.id === button.dataset.startProject);
          if (!project) return;
          project.status = "in progress";
          data.activeProjectId = project.id;
          data.selectedDocProjectId = project.id;
        });
        location.hash = "#documentation";
      });
    });

    document.querySelectorAll("[data-document-project]").forEach((link) => {
      link.addEventListener("click", () => {
        window.ECOSStore.update((data) => {
          data.activeProjectId = link.dataset.documentProject;
          data.selectedDocProjectId = link.dataset.documentProject;
        }, false);
      });
    });
  }
};
