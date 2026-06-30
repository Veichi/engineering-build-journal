window.ECOSPages = window.ECOSPages || {};

window.ECOSPages.projects = {
  title: "Projects",
  recommendationReason(project) {
    if (!project) return "";
    if (project.difficulty <= 1) return "A low-friction starter build that gets you wiring, coding, and documenting quickly.";
    if (project.difficulty <= 3) return "A good next build because it combines hardware, code, and visible behavior without becoming too large.";
    return "A stronger portfolio build. Start it after a few smaller projects are documented.";
  },
  projectSummary(project) {
    const doc = project.documentation || {};
    return window.ECOSPages.documentation.firstAvailable(
      doc.portfolioSummary,
      doc.goal,
      doc.problem,
      project.notes,
      "No documentation summary yet."
    );
  },
  render(data) {
    const escape = window.ECOSUtils.escape;
    const recommendations = window.ECOSRecommender.pick(data).slice(0, 3);
    const active = data.projects.filter((project) => project.status !== "complete");
    const finished = data.projects.filter((project) => project.status === "complete");
    const activeProject = data.projects.find((project) => project.id === data.activeProjectId)
      || data.projects.find((project) => project.status === "in progress")
      || data.projects[0];
    const activeDoc = activeProject?.documentation || {};
    const activeProof = window.ECOSUI.proofStatus(activeDoc);
    const averageDocCompletion = data.projects.length
      ? Math.round(data.projects.reduce((sum, project) => sum + window.ECOSUI.docCompletion(project.documentation || {}), 0) / data.projects.length)
      : 0;

    return `
      <section class="hero-panel journal-hero">
        <div>
          <p class="kicker">Active build</p>
          <h3>${activeProject ? escape(activeProject.title) : "Choose one build at a time."}</h3>
          <p class="muted">${activeProject ? escape(this.projectSummary(activeProject)) : "Start small, keep the notes close to the build, and turn finished work into portfolio proof."}</p>
          <div class="quick-actions">
            <button id="toggleProjectForm" class="button primary" type="button">New Project</button>
            <a class="button" href="#ideas">Open Ideas</a>
            ${activeProject ? `<a class="button" href="#documentation" data-document-project="${activeProject.id}">Continue Documentation</a>` : ""}
          </div>
        </div>
        <div class="hero-card project-brief">
          <div class="row">
            <strong>${activeProject ? escape(activeProject.status) : "planned"}</strong>
            ${activeProject ? window.ECOSUI.maturityPill(activeProject, activeDoc) : ""}
          </div>
          ${activeProject ? window.ECOSUI.docProgress(activeDoc) : ""}
          <dl class="meta-list">
            <div><dt>Parts</dt><dd>${activeProject ? escape(activeDoc.parts || activeProject.parts || "Not added") : "Add a project"}</dd></div>
            <div><dt>Proof</dt><dd>${activeProof.done}/${activeProof.total} captured</dd></div>
            <div><dt>Next</dt><dd>${escape(activeProof.next)}</dd></div>
          </dl>
        </div>
      </section>

      <section class="grid three project-stats">
        ${window.ECOSUI.stat("Active builds", active.length, "Planned or in progress")}
        ${window.ECOSUI.stat("Ready to export", data.projects.filter((project) => project.portfolioReady).length, "Portfolio-ready projects")}
        ${window.ECOSUI.stat("Average docs", `${averageDocCompletion}%`, "Across saved projects")}
      </section>

      <section class="panel project-workbench">
        <div>
          <p class="kicker">Project + documentation</p>
          <h3>One workspace for each build</h3>
          <p class="muted">Project fields and documentation fields stay linked. Updating technologies, concepts, repo links, lessons, and timeframe in Document updates the project record used by portfolio exports.</p>
        </div>
        <a class="button primary" href="#documentation" ${activeProject ? `data-document-project="${activeProject.id}"` : ""}>Open Documentation Workspace</a>
      </section>

      <section id="projectFormPanel" class="panel add-panel" hidden>
        <div class="row">
          <div>
            <p class="kicker">New build</p>
            <h3>Add a custom project</h3>
          </div>
          <button id="closeProjectForm" class="button" type="button">Close</button>
        </div>
        <form id="projectForm" class="form-grid compact-form">
          <label>Title<input name="title" required /></label>
          <label>Status<select name="status"><option>planned</option><option>in progress</option><option>complete</option></select></label>
          <label>Difficulty<input name="difficulty" type="number" min="1" max="5" value="2" /></label>
          <label>Skills Used<input name="skillsUsed" placeholder="Arduino, PWM, sensors" /></label>
          <label class="wide">Parts / Tools<input name="parts" /></label>
          <label class="wide">Quick Notes<textarea name="notes"></textarea></label>
          <button class="button primary" type="submit">Save Project</button>
        </form>
      </section>

      <section class="grid three">
        ${recommendations.map((project) => `
          <article class="panel project-card">
            <span class="project-thumb">${escape(project.title.slice(0, 2).toUpperCase())}</span>
            <div class="row">
              <h3>${escape(project.title)}</h3>
              ${window.ECOSUI.maturityPill(project, project.documentation || {})}
            </div>
            <p>${this.recommendationReason(project)}</p>
            ${window.ECOSUI.docProgress(project.documentation || {})}
            <p><strong>Next proof:</strong> ${escape(window.ECOSUI.proofStatus(project.documentation || {}).next)}</p>
            <div class="quick-actions">
              <button class="button primary" data-start-project="${project.id}" type="button">Make Active</button>
              <a class="button" href="#documentation" data-document-project="${project.id}">Document</a>
            </div>
          </article>
        `).join("")}
      </section>

      <section class="panel">
        <div class="row">
          <div>
            <p class="kicker">Your builds</p>
            <h3>Project List</h3>
          </div>
          <span class="muted">${data.projects.length} saved</span>
        </div>
      </section>

      <section class="stack">
        ${[...active, ...finished].map((project) => `
          <article class="panel project-row">
            <div>
              <div class="row">
                <h3>${escape(project.title)}</h3>
                ${window.ECOSUI.maturityPill(project, project.documentation || {})}
              </div>
              <p class="muted">${escape(this.projectSummary(project))}</p>
              <div class="project-row-grid">
                ${window.ECOSUI.docProgress(project.documentation || {})}
                <dl class="meta-list compact">
                  <div><dt>Parts</dt><dd>${escape(project.documentation?.parts || project.parts || "Not added")}</dd></div>
                  <div><dt>Repo</dt><dd>${escape(project.documentation?.repoLink || project.github || "Not linked")}</dd></div>
                  <div><dt>Next proof</dt><dd>${escape(window.ECOSUI.proofStatus(project.documentation || {}).next)}</dd></div>
                </dl>
              </div>
              <p>${(project.skillsUsed || []).map((skill) => window.ECOSUI.pill(skill)).join(" ")}</p>
            </div>
            <div class="project-actions">
              <label>Status
                <select data-project-field="${project.id}:status">
                  ${["planned", "in progress", "complete"].map((status) => `<option ${project.status === status ? "selected" : ""}>${status}</option>`).join("")}
                </select>
              </label>
              <label class="check-row"><input data-project-ready="${project.id}" type="checkbox" ${project.portfolioReady ? "checked" : ""} /><span>Ready to export</span></label>
              <button class="button" data-make-active="${project.id}" type="button">${project.id === data.activeProjectId ? "Active Build" : "Make Active"}</button>
              <a class="button primary" href="#documentation" data-document-project="${project.id}">Continue Docs</a>
              <button class="button danger" data-delete-project="${project.id}" type="button">Delete</button>
            </div>
          </article>
        `).join("")}
      </section>
    `;
  },
  bind() {
    document.querySelector("#toggleProjectForm")?.addEventListener("click", () => {
      const panel = document.querySelector("#projectFormPanel");
      panel.hidden = !panel.hidden;
      if (!panel.hidden) panel.querySelector("input[name='title']")?.focus();
    });

    document.querySelector("#closeProjectForm")?.addEventListener("click", () => {
      document.querySelector("#projectFormPanel").hidden = true;
    });

    document.querySelector("#projectForm")?.addEventListener("submit", (event) => {
      event.preventDefault();
      const form = new FormData(event.target);
      window.ECOSStore.update((data) => {
        const project = {
          id: window.ECOSUtils.uid("project"),
          title: form.get("title"),
          status: form.get("status"),
          difficulty: Number(form.get("difficulty")),
          skillsUsed: window.ECOSUtils.splitList(form.get("skillsUsed")),
          parts: form.get("parts"),
          notes: form.get("notes"),
          github: "",
          portfolioReady: false,
          lessons: "",
          actionVerb: "Built",
          technicalTask: form.get("title"),
          toolsUsed: form.get("skillsUsed"),
          measurableResult: "documented project results",
          concept: "engineering design"
        };
        project.documentation = window.ECOSPages.documentation.docFor({ projects: [project] }, project.id);
        data.projects.unshift(project);
        data.activeProjectId = project.id;
        data.selectedDocProjectId = project.id;
      });
    });

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

    document.querySelectorAll("[data-make-active]").forEach((button) => {
      button.addEventListener("click", () => {
        window.ECOSStore.update((data) => {
          const project = data.projects.find((item) => item.id === button.dataset.makeActive);
          if (!project) return;
          if (project.status === "planned") project.status = "in progress";
          data.activeProjectId = project.id;
          data.selectedDocProjectId = project.id;
        });
      });
    });

    document.querySelectorAll("[data-project-field]").forEach((field) => {
      field.addEventListener("input", () => {
        const [id, prop] = field.dataset.projectField.split(":");
        window.ECOSStore.update((data) => {
          const project = data.projects.find((item) => item.id === id);
          if (project) project[prop] = field.value;
        });
      });
    });

    document.querySelectorAll("[data-project-ready]").forEach((box) => {
      box.addEventListener("change", () => {
        window.ECOSStore.update((data) => {
          const project = data.projects.find((item) => item.id === box.dataset.projectReady);
          if (project) project.portfolioReady = box.checked;
        });
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

    document.querySelectorAll("[data-delete-project]").forEach((button) => {
      button.addEventListener("click", () => {
        if (!confirm("Delete this project and its project documentation? Linked notebook entries will stay, but the project link will be removed.")) return;
        window.ECOSStore.update((data) => {
          const id = button.dataset.deleteProject;
          data.projects = data.projects.filter((project) => project.id !== id);
          data.journal = (data.journal || []).map((entry) => ({
            ...entry,
            projectIds: (entry.projectIds || []).filter((projectId) => projectId !== id)
          }));
          if (data.activeProjectId === id) data.activeProjectId = data.projects[0]?.id || "";
          if (data.selectedDocProjectId === id) data.selectedDocProjectId = data.activeProjectId;
        });
      });
    });
  }
};
