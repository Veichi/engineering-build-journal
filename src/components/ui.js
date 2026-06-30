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
  docCompletion(doc = {}) {
    const fields = ["problem", "goal", "design", "tests", "results", "lessons", "portfolioSummary"];
    const checked = Object.values(doc.checklist || {}).filter(Boolean).length;
    const complete = fields.filter((field) => String(doc[field] || "").trim()).length + Math.min(checked, 3);
    return window.ECOSUtils.percent(complete, fields.length + 3);
  },
  proofStatus(doc = {}) {
    const checklist = doc.checklist || {};
    const items = [
      ["photos", "photo"],
      ["code", "code notes"],
      ["testData", "test result"],
      ["lessons", "lesson"],
      ["demo", "demo"]
    ];
    const done = items.filter(([key]) => checklist[key]).length;
    const next = items.find(([key]) => !checklist[key])?.[1] || "export";
    return { done, total: items.length, next };
  },
  docProgress(doc = {}) {
    const value = this.docCompletion(doc);
    return `
      <div class="doc-progress" aria-label="Documentation ${value}% complete">
        <div class="doc-progress-head">
          <span>Documentation</span>
          <strong>${value}%</strong>
        </div>
        <div class="meter"><div style="width:${value}%"></div></div>
      </div>
    `;
  },
  card(title, body, meta = "") {
    return `<article class="card"><div class="row"><h3>${title}</h3>${meta}</div>${body}</article>`;
  },
  list(items) {
    return `<ul>${items.map((item) => `<li>${window.ECOSUtils.escape(item)}</li>`).join("")}</ul>`;
  }
};
