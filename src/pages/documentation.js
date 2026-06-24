window.ECOSPages = window.ECOSPages || {};

window.ECOSPages.documentation = {
  title: "Document",
  docFor(data, projectId) {
    const project = data.projects.find((item) => item.id === projectId) || data.projects[0];
    data.projectDocs = data.projectDocs || {};
    if (!data.projectDocs[project.id]) {
      data.projectDocs[project.id] = {
        projectId: project.id,
        problem: "",
        goal: "",
        parts: project.parts || "",
        skills: (project.skillsUsed || []).join(", "),
        design: "",
        wiring: "",
        code: "",
        tests: "",
        problems: "",
        results: "",
        portfolioSummary: "",
        employerValue: "",
        resumeEvidence: "",
        lessons: project.lessons || "",
        next: "",
        photoLinks: "",
        repoLink: project.github || "",
        checklist: {}
      };
    }
    return data.projectDocs[project.id];
  },
  completion(doc) {
    const fields = ["problem", "goal", "parts", "design", "tests", "results", "lessons", "portfolioSummary"];
    const complete = fields.filter((field) => String(doc?.[field] || "").trim()).length;
    return window.ECOSUtils.percent(complete, fields.length);
  },
  markdown(project, doc) {
    return `# ${project.title}

## Purpose
${doc.problem || ""}

## Goal
${doc.goal || ""}

## Parts, Tools, and Skills
${doc.parts || ""}

Skills practiced: ${doc.skills || ""}

## Build Notes
${doc.design || ""}

## Wiring, Code, and Setup
${doc.wiring || ""}

${doc.code || ""}

## Tests and Results
${doc.tests || ""}

${doc.results || ""}

## Problems and Fixes
${doc.problems || ""}

## Career Summary
${doc.portfolioSummary || ""}

Employer value: ${doc.employerValue || ""}

Resume bullet: ${doc.resumeEvidence || window.ECOSPages.resume.generateBullet(project)}

## Lessons Learned
${doc.lessons || ""}

## Next Revision
${doc.next || ""}

## Photos / Media / Repository
${doc.photoLinks || ""}

${doc.repoLink || project.github || ""}
`;
  },
  exportMarkdown(project, doc) {
    const blob = new Blob([this.markdown(project, doc)], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${project.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "project"}-documentation.md`;
    link.click();
    URL.revokeObjectURL(url);
  },
  exportWord(project, doc) {
    const html = `
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>${window.ECOSUtils.escape(project.title)} Documentation</title>
          <style>
            body { font-family: Aptos, Calibri, Arial, sans-serif; line-height: 1.45; color: #1f2933; }
            h1 { font-size: 24pt; }
            h2 { font-size: 15pt; margin-top: 20pt; }
            p { font-size: 11pt; white-space: pre-wrap; }
          </style>
        </head>
        <body>
          ${this.markdown(project, doc)
            .split("\n")
            .map((line) => {
              if (line.startsWith("# ")) return `<h1>${window.ECOSUtils.escape(line.replace("# ", ""))}</h1>`;
              if (line.startsWith("## ")) return `<h2>${window.ECOSUtils.escape(line.replace("## ", ""))}</h2>`;
              return line.trim() ? `<p>${window.ECOSUtils.escape(line)}</p>` : "";
            })
            .join("")}
        </body>
      </html>
    `;
    const blob = new Blob(["\ufeff", html], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${project.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "project"}-documentation.doc`;
    link.click();
    URL.revokeObjectURL(url);
  },
  render(data) {
    const selectedId = data.selectedDocProjectId || data.projects.find((project) => project.status === "in progress")?.id || data.projects[0]?.id;
    const project = data.projects.find((item) => item.id === selectedId) || data.projects[0];
    if (!project) {
      return `<section class="panel"><h3>No projects yet</h3><p>Add a project first, then come back to document it.</p></section>`;
    }
    const doc = this.docFor(data, project.id);
    const progress = this.completion(doc);

    return `
      <section class="panel hero-panel">
        <div class="row">
          <div>
            <p class="kicker">Current writeup</p>
            <h3>${project.title}</h3>
            <p class="muted">Capture the proof as you build. The Portfolio page turns this into career material.</p>
          </div>
          <div class="top-actions">
            <button id="exportProjectMarkdown" class="button" type="button">Markdown</button>
            <button id="exportProjectWord" class="button" type="button">Word Doc</button>
          </div>
        </div>
        ${window.ECOSUI.meter("Writeup", progress)}
        <label>Project
          <select id="docProjectSelect">
            ${data.projects.map((item) => `<option value="${item.id}" ${item.id === project.id ? "selected" : ""}>${item.title}</option>`).join("")}
          </select>
        </label>
      </section>

      <section class="grid two">
        <article class="panel">
          <h3>Build Evidence</h3>
          <div class="form-grid">
            <label class="wide">What are you building, and why?
              <textarea data-doc-field="problem" placeholder="Example: A button-controlled LED circuit to practice digital input/output and pull-up behavior.">${window.ECOSUtils.escape(doc.problem || "")}</textarea>
            </label>
            <label class="wide">What does success look like?
              <textarea data-doc-field="goal" placeholder="Example: Pressing the button reliably turns the LED on, with no flicker from switch bounce.">${window.ECOSUtils.escape(doc.goal || "")}</textarea>
            </label>
            <label>Parts and tools
              <textarea data-doc-field="parts">${window.ECOSUtils.escape(doc.parts || "")}</textarea>
            </label>
            <label>Skills practiced
              <textarea data-doc-field="skills">${window.ECOSUtils.escape(doc.skills || "")}</textarea>
            </label>
          </div>
        </article>

        <article class="panel">
          <h3>Proof Checklist</h3>
          <div class="stack">
            ${[
              ["photos", "Photo or screenshot saved"],
              ["code", "Code/setup notes captured"],
              ["testData", "Measurement, test, or demo result saved"],
              ["lessons", "Lesson learned written"],
              ["demo", "Demo video or GIF linked"]
            ].map(([key, label]) => `
              <label class="check-row">
                <input data-doc-check="${key}" type="checkbox" ${doc.checklist?.[key] ? "checked" : ""} />
                <span>${label}</span>
              </label>
            `).join("")}
          </div>
          <label>Photo, video, or repo links
            <textarea data-doc-field="photoLinks" placeholder="Paste links or file notes here.">${window.ECOSUtils.escape(doc.photoLinks || "")}</textarea>
          </label>
          <label>Repository link
            <textarea data-doc-field="repoLink">${window.ECOSUtils.escape(doc.repoLink || project.github || "")}</textarea>
          </label>
        </article>
      </section>

      <section class="panel">
        <h3>Build Log</h3>
        <div class="form-grid">
          <label class="wide">Design and build notes
            <textarea data-doc-field="design" placeholder="What did you wire, code, assemble, change, or decide?">${window.ECOSUtils.escape(doc.design || "")}</textarea>
          </label>
          <label>Wiring / circuit / setup notes
            <textarea data-doc-field="wiring">${window.ECOSUtils.escape(doc.wiring || "")}</textarea>
          </label>
          <label>Code notes
            <textarea data-doc-field="code">${window.ECOSUtils.escape(doc.code || "")}</textarea>
          </label>
          <label>Tests and measurements
            <textarea data-doc-field="tests">${window.ECOSUtils.escape(doc.tests || "")}</textarea>
          </label>
          <label>Results
            <textarea data-doc-field="results">${window.ECOSUtils.escape(doc.results || "")}</textarea>
          </label>
          <label>Problems and fixes
            <textarea data-doc-field="problems">${window.ECOSUtils.escape(doc.problems || "")}</textarea>
          </label>
          <label>Lessons learned
            <textarea data-doc-field="lessons">${window.ECOSUtils.escape(doc.lessons || "")}</textarea>
          </label>
        </div>
      </section>

      <section class="panel">
        <h3>Portfolio Material</h3>
        <p class="muted">Write this once here, then generate portfolio and resume drafts from it.</p>
        <div class="form-grid">
          <label class="wide">Portfolio summary
            <textarea data-doc-field="portfolioSummary" placeholder="Short, employer-readable summary of what you built and what it proves.">${window.ECOSUtils.escape(doc.portfolioSummary || "")}</textarea>
          </label>
          <label class="wide">Why this matters to employers
            <textarea data-doc-field="employerValue">${window.ECOSUtils.escape(doc.employerValue || "")}</textarea>
          </label>
          <label class="wide">Resume bullet draft
            <textarea data-doc-field="resumeEvidence">${window.ECOSUtils.escape(doc.resumeEvidence || window.ECOSPages.resume.generateBullet(project))}</textarea>
          </label>
          <label class="wide">Next revision
            <textarea data-doc-field="next">${window.ECOSUtils.escape(doc.next || "")}</textarea>
          </label>
        </div>
        <div class="quick-actions">
          <button class="button primary" data-finish-project="${project.id}" type="button">Mark Portfolio-ready</button>
          <a class="button" href="#portfolio">Go to Portfolio</a>
        </div>
      </section>
    `;
  },
  bind() {
    document.querySelector("#docProjectSelect")?.addEventListener("change", (event) => {
      window.ECOSStore.update((data) => {
        data.selectedDocProjectId = event.target.value;
      });
    });

    document.querySelectorAll("[data-doc-field]").forEach((field) => {
      field.addEventListener("input", () => {
        window.ECOSStore.update((data) => {
          const selectedProjectId = document.querySelector("#docProjectSelect")?.value || data.selectedDocProjectId || data.projects[0].id;
          const doc = this.docFor(data, selectedProjectId);
          doc[field.dataset.docField] = field.value;
        }, false);
      });
    });

    document.querySelectorAll("[data-doc-check]").forEach((box) => {
      box.addEventListener("change", () => {
        window.ECOSStore.update((data) => {
          const selectedProjectId = document.querySelector("#docProjectSelect")?.value || data.selectedDocProjectId || data.projects[0].id;
          const doc = this.docFor(data, selectedProjectId);
          doc.checklist = doc.checklist || {};
          doc.checklist[box.dataset.docCheck] = box.checked;
        });
      });
    });

    document.querySelector("[data-finish-project]")?.addEventListener("click", (event) => {
      window.ECOSStore.update((data) => {
        const project = data.projects.find((item) => item.id === event.target.dataset.finishProject);
        if (!project) return;
        const doc = this.docFor(data, project.id);
        project.status = "complete";
        project.portfolioReady = true;
        project.github = doc.repoLink || project.github;
        project.lessons = doc.lessons || project.lessons;
      });
      location.hash = "#portfolio";
    });

    document.querySelector("#exportProjectMarkdown")?.addEventListener("click", () => {
      const data = window.ECOSStore.get();
      const project = data.projects.find((item) => item.id === (data.selectedDocProjectId || data.projects[0].id));
      this.exportMarkdown(project, this.docFor(data, project.id));
    });

    document.querySelector("#exportProjectWord")?.addEventListener("click", () => {
      const data = window.ECOSStore.get();
      const project = data.projects.find((item) => item.id === (data.selectedDocProjectId || data.projects[0].id));
      this.exportWord(project, this.docFor(data, project.id));
    });
  }
};
