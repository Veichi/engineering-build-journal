window.ECOSPages = window.ECOSPages || {};

window.ECOSPages.journal = {
  title: "Engineering Notebook",
  field(entry, modernKey, legacyKey) {
    return String(entry[modernKey] || entry[legacyKey] || "").trim();
  },
  linkedProjectNames(data, entry) {
    const ids = entry.projectIds || [];
    if (!ids.length) return "None";
    return ids
      .map((id) => data.projects.find((project) => project.id === id)?.title)
      .filter(Boolean)
      .join(", ") || "None";
  },
  exportWord(data) {
    const entries = data.journal.map((entry) => `
      <section class="entry">
        <h2>${window.ECOSUtils.escape(entry.date || "Undated Entry")}</h2>
        <p><strong>Objective:</strong> ${window.ECOSUtils.escape(this.field(entry, "objective", "built") || "Objective not documented.")}</p>
        <p><strong>Work Completed:</strong> ${window.ECOSUtils.escape(this.field(entry, "workCompleted", "built") || "Work completed not documented.")}</p>
        <p><strong>Challenges Encountered:</strong> ${window.ECOSUtils.escape(this.field(entry, "challenges", "confused") || "Challenges not documented.")}</p>
        <p><strong>Engineering Decisions:</strong> ${window.ECOSUtils.escape(this.field(entry, "decisions", "solved") || "Engineering decisions not documented.")}</p>
        <p><strong>Lessons Learned:</strong> ${window.ECOSUtils.escape(this.field(entry, "lessons", "learned") || "Lessons learned not documented.")}</p>
        <p><strong>Next Steps:</strong> ${window.ECOSUtils.escape(this.field(entry, "nextSteps", "next") || "Next steps not documented.")}</p>
      </section>
    `).join("");
    const documentHtml = `
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Engineering Notebook</title>
          <style>
            @page { margin: 0.8in; }
            body { font-family: Aptos, Calibri, Arial, sans-serif; line-height: 1.45; color: #17211f; }
            h1 { font-size: 24pt; margin: 0 0 8pt; padding-bottom: 8pt; border-bottom: 2pt solid #1f3d36; }
            h2 { font-size: 15pt; color: #1f3d36; margin: 22pt 0 8pt; page-break-after: avoid; }
            p { font-size: 10.5pt; margin: 7pt 0; }
            .meta { color: #64716d; margin-bottom: 18pt; }
            .entry { page-break-inside: avoid; border-bottom: 1pt solid #d8e1dd; padding-bottom: 12pt; margin-bottom: 12pt; }
            .footer { color: #64716d; font-size: 9pt; text-align: center; margin-top: 24pt; }
          </style>
        </head>
        <body>
          <h1>Engineering Notebook</h1>
          <p class="meta">Exported from Engineering Build Notebook on ${new Date().toLocaleString()}.</p>
          ${entries || "<p>No journal entries yet.</p>"}
          <p class="footer">Engineering Notebook | Page <span style="mso-field-code: PAGE"></span></p>
        </body>
      </html>
    `;
    const blob = new Blob(["\ufeff", documentHtml], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "engineering-notebook.doc";
    link.click();
    URL.revokeObjectURL(url);
  },
  render(data) {
    return `
      <section class="panel">
        <div class="row">
          <div>
            <p class="kicker">Engineering notebook</p>
            <h3>Capture a work session</h3>
            <p class="muted">Use this for dated engineering notes that should stand on their own outside a single project writeup.</p>
          </div>
          <button id="exportJournalWord" class="button" type="button">Export Word Doc</button>
        </div>
        <form id="journalForm" class="form-grid">
          <label>Date<input name="date" type="date" required /></label>
          <label>Linked project
            <select name="projectIds">
              <option value="">No linked project</option>
              ${data.projects.map((project) => `<option value="${project.id}" ${project.id === data.activeProjectId ? "selected" : ""}>${project.title}</option>`).join("")}
            </select>
          </label>
          <label>Objective<textarea name="objective" placeholder="What was the technical goal for this work session?"></textarea></label>
          <label class="wide">Work Completed<textarea name="workCompleted"></textarea></label>
          <label class="wide">Challenges Encountered<textarea name="challenges"></textarea></label>
          <label class="wide">Engineering Decisions<textarea name="decisions" placeholder="What tradeoffs, design choices, debugging decisions, or test decisions did you make?"></textarea></label>
          <label class="wide">Lessons Learned<textarea name="lessons"></textarea></label>
          <label class="wide">Next Steps<textarea name="nextSteps"></textarea></label>
          <button class="button primary" type="submit">Save Entry</button>
        </form>
      </section>
      <section class="panel">
        <h3>What this export uses</h3>
        <p class="muted">The Engineering Notebook Word document is generated from the entries below. Each entry is organized into Objective, Work Completed, Challenges, Engineering Decisions, Lessons Learned, and Next Steps.</p>
        <div class="quick-actions">
          <a class="button" href="#documentation">Document Active Project</a>
          <a class="button" href="#portfolio">Open Export Center</a>
        </div>
      </section>
      <section class="stack">
        ${data.journal.map((entry) => `
          <article class="panel journal-entry">
            <div class="row"><h3>${entry.date || "Undated Entry"}</h3>${window.ECOSUI.pill("notebook")}</div>
            <p class="muted"><strong>Linked Project:</strong> ${this.linkedProjectNames(data, entry)}</p>
            <p><strong>Objective:</strong> ${this.field(entry, "objective", "built")}</p>
            <p><strong>Work Completed:</strong> ${this.field(entry, "workCompleted", "built")}</p>
            <p><strong>Challenges:</strong> ${this.field(entry, "challenges", "confused")}</p>
            <p><strong>Engineering Decisions:</strong> ${this.field(entry, "decisions", "solved")}</p>
            <p><strong>Lessons Learned:</strong> ${this.field(entry, "lessons", "learned")}</p>
            <p><strong>Next Steps:</strong> ${this.field(entry, "nextSteps", "next")}</p>
          </article>
        `).join("") || "<section class='panel'><h3>No notebook entries yet</h3><p class='muted'>Add your first work-session entry above. It will appear here and feed the Engineering Notebook export.</p></section>"}
      </section>
    `;
  },
  bind() {
    document.querySelector("#exportJournalWord")?.addEventListener("click", () => {
      window.ECOSPages.journal.exportWord(window.ECOSStore.get());
    });

    document.querySelector("#journalForm")?.addEventListener("submit", (event) => {
      event.preventDefault();
      const form = new FormData(event.target);
      window.ECOSStore.update((data) => {
        data.journal.unshift({
          id: window.ECOSUtils.uid("journal"),
          date: form.get("date"),
          projectIds: form.get("projectIds") ? [form.get("projectIds")] : [],
          objective: form.get("objective"),
          workCompleted: form.get("workCompleted"),
          challenges: form.get("challenges"),
          decisions: form.get("decisions"),
          lessons: form.get("lessons"),
          nextSteps: form.get("nextSteps")
        });
        const project = data.projects.find((item) => item.id === form.get("projectIds"));
        if (project) {
          project.linkedJournalEntryIds = project.linkedJournalEntryIds || [];
          project.linkedJournalEntryIds.unshift(data.journal[0].id);
        }
      });
    });
  }
};
