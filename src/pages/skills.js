window.ECOSPages = window.ECOSPages || {};

window.ECOSPages.skills = {
  title: "Skills",
  render(data) {
    const categories = [...new Set(data.skills.map((skill) => skill.category))];
    return `
      <section class="toolbar">
        <span class="pill">Skill status and progress save automatically</span>
      </section>
      <section class="grid two">
        ${categories.map((category) => `
          <article class="panel">
            <h3>${category}</h3>
            <div class="stack">
              ${data.skills.filter((skill) => skill.category === category).map((skill) => `
                <div class="card">
                  <div class="row">
                    <strong>${skill.name}</strong>
                    <button class="button" data-skill-status="${skill.id}">${skill.status}</button>
                  </div>
                  <p>${skill.description}</p>
                  ${window.ECOSUI.meter("Progress", skill.progress || 0)}
                  <label>Skill progress %
                    <input data-skill-progress="${skill.id}" type="number" min="0" max="100" value="${skill.progress || 0}" />
                  </label>
                  <p class="muted">Prerequisites: ${skill.prerequisites.join(", ") || "None"}</p>
                  <p class="muted">Difficulty: ${skill.difficulty}/5</p>
                  <p>${skill.relatedProjects.map((name) => window.ECOSUI.pill(name, "blue")).join(" ")}</p>
                </div>
              `).join("")}
            </div>
          </article>
        `).join("")}
      </section>
    `;
  },
  bind() {
    document.querySelectorAll("[data-skill-status]").forEach((button) => {
      button.addEventListener("click", () => {
        const order = ["not started", "learning", "completed"];
        window.ECOSStore.update((data) => {
          const skill = data.skills.find((item) => item.id === button.dataset.skillStatus);
          skill.status = order[(order.indexOf(skill.status) + 1) % order.length];
          skill.progress = skill.status === "completed" ? 100 : skill.status === "learning" ? Math.max(skill.progress || 0, 50) : 0;
        });
      });
    });

    document.querySelectorAll("[data-skill-progress]").forEach((field) => {
      field.addEventListener("input", () => {
        window.ECOSStore.update((data) => {
          const skill = data.skills.find((item) => item.id === field.dataset.skillProgress);
          skill.progress = Math.max(0, Math.min(100, Number(field.value)));
          if (skill.progress >= 100) skill.status = "completed";
          else if (skill.progress > 0) skill.status = "learning";
          else skill.status = "not started";
        }, false);
      });
    });
  }
};
