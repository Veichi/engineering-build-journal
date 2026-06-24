window.ECOSPages = window.ECOSPages || {};

window.ECOSPages.resume = {
  title: "Resume Bullet Generator",
  generateBullet(project) {
    // Future AI integration point:
    // Send structured project fields, lessons learned, and measured results
    // to a resume-bullet generator while keeping the user in control of edits.
    return `${project.actionVerb || "Built"} ${project.technicalTask || project.title} using ${project.toolsUsed || project.skillsUsed.join(", ")}; ${project.measurableResult || "documented results"} to demonstrate ${project.concept || "engineering design"}.`;
  },
  render(data) {
    return `
      <section class="panel">
        <h3>Generated Resume Bullets</h3>
        <p class="muted">These are local template-based drafts. Future AI integration can improve wording using project notes, lessons, and measured results.</p>
      </section>
      <section class="stack">
        ${data.projects.map((project) => `
          <article class="panel">
            <div class="row">
              <h3>${project.title}</h3>
              ${window.ECOSUI.pill(project.status, window.ECOSUtils.statusClass(project.status))}
            </div>
            <p>${this.generateBullet(project)}</p>
            <div class="form-grid">
              <label>Action verb<input data-resume="${project.id}:actionVerb" value="${window.ECOSUtils.escape(project.actionVerb || "")}" /></label>
              <label>Technical task<input data-resume="${project.id}:technicalTask" value="${window.ECOSUtils.escape(project.technicalTask || "")}" /></label>
              <label>Tools used<input data-resume="${project.id}:toolsUsed" value="${window.ECOSUtils.escape(project.toolsUsed || "")}" /></label>
              <label>Measurable result<input data-resume="${project.id}:measurableResult" value="${window.ECOSUtils.escape(project.measurableResult || "")}" /></label>
              <label class="wide">Engineering concept demonstrated<input data-resume="${project.id}:concept" value="${window.ECOSUtils.escape(project.concept || "")}" /></label>
            </div>
          </article>
        `).join("")}
      </section>
    `;
  },
  bind() {
    document.querySelectorAll("[data-resume]").forEach((field) => {
      field.addEventListener("input", () => {
        const [id, prop] = field.dataset.resume.split(":");
        window.ECOSStore.update((data) => {
          data.projects.find((project) => project.id === id)[prop] = field.value;
        }, false);
      });
    });
  }
};
