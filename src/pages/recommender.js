window.ECOSPages = window.ECOSPages || {};

window.ECOSRecommender = {
  pick(data) {
    const completedSkills = new Set(data.skills.filter((skill) => skill.status === "completed" || skill.status === "learning").map((skill) => skill.name));
    return data.projects
      .filter((project) => project.status !== "complete")
      .map((project) => {
        const missingSkills = project.skillsUsed.filter((skill) => !completedSkills.has(skill));
        const portfolioValue = project.difficulty >= 4 ? "very high" : project.difficulty >= 2 ? "medium" : "starter";
        const score = 10 - project.difficulty + (project.portfolioReady ? -10 : 0) - missingSkills.length;
        return { ...project, missingSkills, portfolioValue, score };
      })
      .sort((a, b) => b.score - a.score);
  }
};

window.ECOSPages.recommender = {
  title: "Project Recommender",
  render(data) {
    const recommendations = window.ECOSRecommender.pick(data);
    return `
      <section class="panel">
        <h3>Recommended Next Projects</h3>
        <p class="muted">Recommendations use mock local logic: current skills, missing skills, difficulty, available beginner tools, and portfolio value.</p>
      </section>
      <section class="grid two">
        ${recommendations.map((project) => `
          <article class="panel">
            <div class="row"><h3>${project.title}</h3>${window.ECOSUI.pill(project.portfolioValue)}</div>
            <p><strong>Difficulty:</strong> ${project.difficulty}/5</p>
            <p><strong>Skills used:</strong> ${project.skillsUsed.map((skill) => window.ECOSUI.pill(skill)).join(" ")}</p>
            <p><strong>Missing skills:</strong> ${project.missingSkills.map((skill) => window.ECOSUI.pill(skill, "amber")).join(" ") || "You are ready to attempt this."}</p>
            <p><strong>Parts/tools:</strong> ${project.parts}</p>
          </article>
        `).join("")}
      </section>
    `;
  }
};
