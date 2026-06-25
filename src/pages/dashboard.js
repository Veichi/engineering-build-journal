window.ECOSPages = window.ECOSPages || {};

window.ECOSPages.dashboard = {
  title: "Home",
  render(data) {
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
      <section class="panel hero-panel">
        <p class="kicker">Engineering project notebook</p>
        <h3>Pick a build. Record the work. Generate professional outputs.</h3>
        <p class="muted">This app is now centered on the project loop, not maintaining a dozen trackers.</p>
        <div class="quick-actions">
          <a class="button primary" href="#projects">Choose a Project</a>
          <a class="button" href="#documentation">Document Current Build</a>
          <a class="button" href="#portfolio">Open Export Center</a>
        </div>
      </section>

      <section class="grid three">
        ${window.ECOSUI.stat("Built", completed)}
        ${window.ECOSUI.stat("Documented", documented)}
        ${window.ECOSUI.stat("Ready to export", portfolioReady)}
      </section>

      <section class="grid two">
        <article class="panel">
          <p class="kicker">Recommended next</p>
          <h3>${recommendation ? recommendation.title : "Add your first project"}</h3>
          <p>${recommendation ? window.ECOSPages.projects.recommendationReason(recommendation) : "Start with a small Arduino project and document it carefully."}</p>
          ${recommendation ? `<p><strong>Parts/tools:</strong> ${recommendation.parts || "Add parts/tools"}</p>` : ""}
          <div class="quick-actions">
            ${recommendation ? `<button class="button primary" data-start-project="${recommendation.id}" type="button">Start This Build</button>` : ""}
            <a class="button" href="#projects">See Suggestions</a>
          </div>
        </article>

        <article class="panel">
          <p class="kicker">Current build</p>
          <div class="row">
            <h3>${activeProject ? activeProject.title : "No project selected"}</h3>
            ${maturity ? window.ECOSUI.pill(maturity.label, maturity.cls) : ""}
          </div>
          <p class="muted">${activeProject ? "This is the project the app will center on until you choose another one." : "Add a project to begin."}</p>
          <div class="quick-actions">
            ${activeProject ? `<a class="button primary" href="#documentation" data-document-project="${activeProject.id}">Open Documentation</a>` : ""}
            <a class="button" href="#portfolio">Open Export Center</a>
          </div>
        </article>
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
