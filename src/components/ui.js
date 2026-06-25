window.ECOSUI = {
  stat(label, value, detail = "") {
    return `<article class="panel stat"><span>${label}</span><strong>${value}</strong>${detail ? `<p class="muted">${detail}</p>` : ""}</article>`;
  },
  meter(label, value) {
    return `
      <div class="bar-row">
        <strong>${label}</strong>
        <div class="meter"><div style="width:${value}%"></div></div>
        <span class="muted">${value}%</span>
      </div>
    `;
  },
  pill(text, cls = "") {
    return `<span class="pill ${cls}">${window.ECOSUtils.escape(text)}</span>`;
  },
  maturity(project, doc = {}) {
    const writtenFields = ["problem", "goal", "design", "tests", "results", "lessons", "portfolioSummary"];
    const writtenCount = writtenFields.filter((field) => String(doc[field] || "").trim()).length;
    const checkedCount = Object.values(doc.checklist || {}).filter(Boolean).length;

    if (project?.portfolioReady) return { label: "Ready to export", cls: "green" };
    if (writtenCount >= 3 || checkedCount >= 3 || project?.status === "complete") return { label: "Documented", cls: "blue" };
    if (project?.status === "in progress" || writtenCount > 0 || checkedCount > 0) return { label: "Building", cls: "amber" };
    return { label: "Idea", cls: "" };
  },
  maturityPill(project, doc = {}) {
    const maturity = this.maturity(project, doc);
    return this.pill(maturity.label, maturity.cls);
  },
  card(title, body, meta = "") {
    return `<article class="card"><div class="row"><h3>${title}</h3>${meta}</div>${body}</article>`;
  },
  list(items) {
    return `<ul>${items.map((item) => `<li>${window.ECOSUtils.escape(item)}</li>`).join("")}</ul>`;
  }
};
