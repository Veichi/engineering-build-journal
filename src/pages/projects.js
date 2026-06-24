window.ECOSPages = window.ECOSPages || {};

window.ECOSPages.projects = {
  title: "Projects",
  recommendationReason(project) {
    if (!project) return "";
    if (project.difficulty <= 1) return "A low-friction starter build that gets you wiring, coding, and documenting quickly.";
    if (project.difficulty <= 3) return "A good next build because it combines hardware, code, and visible behavior without becoming too large.";
    return "A stronger portfolio build. Start it after a few smaller projects are documented.";
  },
  render(data) {
    const recommendations = window.ECOSRecommender.pick(data).slice(0, 3);
    const active = data.projects.filter((project) => project.status !== "complete");
    const finished = data.projects.filter((project) => project.status === "complete");

    return `
      <section class="panel hero-panel">
        <p class="kicker">Project suggestions</p>
        <h3>Choose one build at a time.</h3>
        <p class="muted">Suggestions are starter-kit friendly first, then gradually move toward portfolio-level engineering projects.</p>
      </section>

      <section class="grid three">
        ${recommendations.map((project) => `
          <article class="panel">
            <div class="row">
              <h3>${project.title}</h3>
              ${window.ECOSUI.pill(project.difficulty <= 1 ? "starter" : project.portfolioValue)}
            </div>
            <p>${this.recommendationReason(project)}</p>
            <p><strong>Parts:</strong> ${project.parts || "Add parts/tools"}</p>
            <div class="quick-actions">
              <button class="button primary" data-start-project="${project.id}" type="button">Start</button>
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
          <button id="toggleProjectForm" class="button" type="button">Add Custom Project</button>
        </div>
        <form id="projectForm" class="form-grid compact-form" hidden>
          <label>Title<input name="title" required /></label>
          <label>Status<select name="status"><option>planned</option><option>in progress</option><option>complete</option></select></label>
          <label>Difficulty<input name="difficulty" type="number" min="1" max="5" value="2" /></label>
          <label>Skills Used<input name="skillsUsed" placeholder="Arduino, PWM, sensors" /></label>
          <label class="wide">Parts / Tools<input name="parts" /></label>
          <label class="wide">Quick Notes<textarea name="notes"></textarea></label>
          <button class="button primary" type="submit">Add Project</button>
        </form>
      </section>

      <section class="stack">
        ${[...active, ...finished].map((project) => `
          <article class="panel project-row">
            <div>
              <div class="row">
                <h3>${project.title}</h3>
                ${window.ECOSUI.pill(project.status, window.ECOSUtils.statusClass(project.status))}
              </div>
              <p class="muted">${project.parts || "Parts/tools not added yet."}</p>
              <p>${project.skillsUsed.map((skill) => window.ECOSUI.pill(skill)).join(" ")}</p>
            </div>
            <div class="project-actions">
              <label>Status
                <select data-project-field="${project.id}:status">
                  ${["planned", "in progress", "complete"].map((status) => `<option ${project.status === status ? "selected" : ""}>${status}</option>`).join("")}
                </select>
              </label>
              <label class="check-row"><input data-project-ready="${project.id}" type="checkbox" ${project.portfolioReady ? "checked" : ""} /><span>Portfolio-ready</span></label>
              <a class="button primary" href="#documentation" data-document-project="${project.id}">Document</a>
            </div>
          </article>
        `).join("")}
      </section>
    `;
  },
  bind() {
    document.querySelector("#toggleProjectForm")?.addEventListener("click", () => {
      const form = document.querySelector("#projectForm");
      form.hidden = !form.hidden;
    });

    document.querySelector("#projectForm")?.addEventListener("submit", (event) => {
      event.preventDefault();
      const form = new FormData(event.target);
      window.ECOSStore.update((data) => {
        data.projects.unshift({
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
        });
      });
    });

    document.querySelectorAll("[data-start-project]").forEach((button) => {
      button.addEventListener("click", () => {
        window.ECOSStore.update((data) => {
          const project = data.projects.find((item) => item.id === button.dataset.startProject);
          if (!project) return;
          project.status = "in progress";
          data.selectedDocProjectId = project.id;
        });
        location.hash = "#documentation";
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
          data.selectedDocProjectId = link.dataset.documentProject;
        }, false);
      });
    });
  }
};
