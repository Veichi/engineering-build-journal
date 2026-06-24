window.ECOSPages = window.ECOSPages || {};

window.ECOSPages.balance = {
  title: "Engineering Balance",
  balanceMetrics(data) {
    const map = {
      Programming: ["Programming", "Embedded Systems"],
      Electronics: ["Electronics", "Arduino"],
      Mechanics: ["CAD / Mechanical Design"],
      Controls: ["Control Systems"],
      CAD: ["CAD / Mechanical Design"],
      Manufacturing: ["Manufacturing / 3D Printing"],
      Robotics: ["Robotics"]
    };
    return Object.entries(map).map(([label, categories]) => {
      const skills = data.skills.filter((skill) => categories.includes(skill.category));
      const score = skills.reduce((total, skill) => total + (skill.status === "completed" ? 1 : skill.status === "learning" ? 0.5 : 0), 0);
      return [label, window.ECOSUtils.percent(score, skills.length || 1)];
    });
  },
  render(data) {
    const metrics = this.balanceMetrics(data);
    return `
      <section class="panel">
        <h3>Balance Across Engineering Domains</h3>
        <p class="muted">A strong project portfolio grows across software, electronics, mechanics, controls, CAD, manufacturing, and robotics.</p>
      </section>
      <section class="panel stack">
        ${metrics.map(([label, value]) => window.ECOSUI.meter(label, value)).join("")}
      </section>
    `;
  }
};
