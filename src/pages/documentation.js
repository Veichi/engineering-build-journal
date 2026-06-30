window.ECOSPages = window.ECOSPages || {};

window.ECOSPages.documentation = {
  title: "Document",
  docFor(data, projectId) {
    const project = data.projects.find((item) => item.id === projectId) || data.projects[0];
    if (!project.documentation) {
      project.documentation = {
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
        timeframe: "",
        technologies: "",
        concepts: "",
        professionalSummary: "",
        checklist: {}
      };
    }
    return project.documentation;
  },
  completion(doc) {
    return window.ECOSUI.docCompletion(doc);
  },
  text(value) {
    return String(value || "").trim();
  },
  firstAvailable(...values) {
    return values.map((value) => this.text(value)).find(Boolean) || "";
  },
  sentence(value) {
    const cleaned = this.text(value).replace(/\s+/g, " ");
    if (!cleaned) return "";
    return /[.!?]$/.test(cleaned) ? cleaned : `${cleaned}.`;
  },
  technologies(project, doc) {
    return this.firstAvailable(project.technologies, doc.technologies, doc.parts, project.parts, project.toolsUsed, (project.skillsUsed || []).join(", "), "Technologies not documented");
  },
  concepts(project, doc) {
    return this.firstAvailable(project.engineeringConcepts, doc.concepts, project.concept, doc.skills, (project.skillsUsed || []).join(", "), "Engineering concepts not documented");
  },
  timeframe(project, doc) {
    return this.firstAvailable(project.timeline?.timeframe, doc.timeframe, project.timeframe, "Timeframe not documented");
  },
  professionalProjectSummary(project, doc) {
    const objective = this.firstAvailable(doc.goal, doc.problem, `Build and evaluate ${project.title}.`);
    const built = this.firstAvailable(doc.design, project.technicalTask, project.notes, `A working ${project.title} prototype was developed.`);
    const challenge = this.firstAvailable(doc.problems, doc.wiring, doc.code, "Key engineering work included translating the design goal into a testable hardware/software implementation.");
    const outcome = this.firstAvailable(doc.results, doc.lessons, "Final outcome not documented yet.");
    return [
      this.sentence(`Objective: ${objective}`),
      this.sentence(`Implementation: ${built}`),
      this.sentence(`Engineering challenge: ${challenge}`),
      this.sentence(`Outcome: ${outcome}`)
    ].join(" ");
  },
  accomplishmentBullets(project, doc) {
    const bullets = [
      `Designed and built ${this.text(project.technicalTask) || this.text(project.title)} using ${this.technologies(project, doc)} to demonstrate ${this.concepts(project, doc)}.`
    ];
    if (this.text(doc.tests) || this.text(doc.results)) {
      bullets.push(`Validated system behavior through documented testing, measurements, and observed results: ${this.firstAvailable(doc.results, doc.tests)}.`);
    }
    if (this.text(doc.problems)) {
      bullets.push(`Diagnosed and resolved implementation issues involving ${this.text(doc.problems)}.`);
    }
    if (this.text(doc.wiring) || this.text(doc.code)) {
      bullets.push("Integrated hardware setup and software logic while documenting wiring, code structure, and setup decisions for repeatable use.");
    }
    if (this.text(doc.portfolioSummary) || this.text(doc.employerValue) || this.text(doc.lessons)) {
      bullets.push("Converted project evidence into export-ready documentation, including technical summary, lessons learned, and next-revision notes.");
    }
    while (bullets.length < 3) {
      bullets.push("Documented project objective, build process, engineering decisions, and final outcome for future portfolio and interview use.");
    }
    return bullets.slice(0, 5);
  },
  professionalResumeEntry(project, doc) {
    return `## ${project.title}

**Timeframe:** ${this.timeframe(project, doc)}

**Technologies Used:** ${this.technologies(project, doc)}

**Engineering Concepts Demonstrated:** ${this.concepts(project, doc)}

**Project Summary:** ${this.firstAvailable(doc.professionalSummary, doc.portfolioSummary, this.professionalProjectSummary(project, doc))}

**Selected Accomplishments**
${this.accomplishmentBullets(project, doc).map((bullet) => `- ${bullet}`).join("\n")}
`;
  },
  documentationGaps(doc) {
    const fieldLabels = [
      ["problem", "problem"],
      ["goal", "success goal"],
      ["design", "build notes"],
      ["tests", "test notes"],
      ["results", "results"],
      ["lessons", "lesson"],
      ["portfolioSummary", "professional summary"]
    ];
    const proof = window.ECOSUI.proofStatus(doc);
    const gaps = fieldLabels
      .filter(([field]) => !this.text(doc[field]))
      .map(([, label]) => label);
    if (proof.done < proof.total) gaps.push(proof.next);
    return gaps.slice(0, 4);
  },
  markdown(project, doc) {
    return `# ${project.title}

## Professional Project Summary
${this.professionalProjectSummary(project, doc)}

## Professional Resume Entry
${doc.resumeEvidence || this.professionalResumeEntry(project, doc)}

## Project Objective
${doc.goal || doc.problem || ""}

## Technologies Used
${this.technologies(project, doc)}

## Engineering Concepts Demonstrated
${this.concepts(project, doc)}

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
    const escape = window.ECOSUtils.escape;
    const selectedId = data.activeProjectId || data.selectedDocProjectId || data.projects.find((project) => project.status === "in progress")?.id || data.projects[0]?.id;
    const project = data.projects.find((item) => item.id === selectedId) || data.projects[0];
    if (!project) {
      return `<section class="panel"><h3>No projects yet</h3><p>Add a project first, then come back to document it.</p></section>`;
    }
    const doc = this.docFor(data, project.id);
    const maturity = window.ECOSUI.maturity(project, doc);
    const proof = window.ECOSUI.proofStatus(doc);
    const gaps = this.documentationGaps(doc);

    return `
      <section class="panel hero-panel doc-hero">
        <div class="row">
          <div>
            <p class="kicker">Current writeup</p>
            <div class="row">
              <h3>${escape(project.title)}</h3>
              ${window.ECOSUI.pill(maturity.label, maturity.cls)}
            </div>
            <p class="muted">This project owns its documentation. The Export Center turns this information into professional files.</p>
          </div>
          <div class="top-actions">
            <a class="button" href="#projects">Back to Projects</a>
            <button id="exportProjectMarkdown" class="button" type="button">Markdown</button>
            <button id="exportProjectWord" class="button" type="button">Word Doc</button>
          </div>
        </div>
        <label>Project
          <select id="docProjectSelect">
            ${data.projects.map((item) => `<option value="${item.id}" ${item.id === project.id ? "selected" : ""}>${escape(item.title)}</option>`).join("")}
          </select>
        </label>
      </section>

      <section class="doc-workspace">
        <aside class="panel doc-sidebar">
          <div>
            <p class="kicker">Readiness</p>
            ${window.ECOSUI.docProgress(doc)}
          </div>
          <dl class="meta-list">
            <div><dt>Status</dt><dd>${escape(project.status)}</dd></div>
            <div><dt>Proof</dt><dd>${proof.done}/${proof.total} captured</dd></div>
            <div><dt>Timeframe</dt><dd>${escape(project.timeline?.timeframe || doc.timeframe || "Not set")}</dd></div>
            <div><dt>Repository</dt><dd>${escape(doc.repoLink || project.github || "Not linked")}</dd></div>
          </dl>
          <div>
            <h3>Next best fields</h3>
            <div class="gap-list">
              ${(gaps.length ? gaps : ["ready for export"]).map((gap) => `<span>${escape(gap)}</span>`).join("")}
            </div>
          </div>
          <div class="quick-actions vertical">
            <button class="button primary" data-finish-project="${project.id}" type="button">Mark Ready</button>
            <a class="button" href="#portfolio">Export Center</a>
          </div>
        </aside>
        <div class="doc-main">

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
            <label>Timeframe
              <textarea data-doc-field="timeframe" placeholder="Example: Jan 2026 - Feb 2026">${window.ECOSUtils.escape(doc.timeframe || "")}</textarea>
            </label>
            <label>Technologies used
              <textarea data-doc-field="technologies" placeholder="Arduino Uno, C++, breadboard, HC-SR04 sensor">${window.ECOSUtils.escape(doc.technologies || "")}</textarea>
            </label>
            <label class="wide">Engineering concepts demonstrated
              <textarea data-doc-field="concepts" placeholder="Digital I/O, PWM, sensor calibration, feedback control, circuit debugging">${window.ECOSUtils.escape(doc.concepts || "")}</textarea>
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
        <h3>Professional Output Material</h3>
        <p class="muted">Write this once here, then generate resume entries, project summaries, and engineering reports from the project.</p>
        <div class="form-grid">
          <label class="wide">Professional project summary notes
            <textarea data-doc-field="portfolioSummary" placeholder="Short, employer-readable summary of what you built and what it proves.">${window.ECOSUtils.escape(doc.portfolioSummary || "")}</textarea>
          </label>
          <label class="wide">Final professional summary
            <textarea data-doc-field="professionalSummary" placeholder="Optional polished 2-3 sentence version. If blank, the app builds one from your documentation.">${window.ECOSUtils.escape(doc.professionalSummary || "")}</textarea>
          </label>
          <label class="wide">Why this matters to employers
            <textarea data-doc-field="employerValue">${window.ECOSUtils.escape(doc.employerValue || "")}</textarea>
          </label>
          <label class="wide">Professional resume entry override
            <textarea data-doc-field="resumeEvidence" placeholder="Optional. If blank, the app generates a structured professional resume entry.">${window.ECOSUtils.escape(doc.resumeEvidence || "")}</textarea>
          </label>
          <label class="wide">Next revision
            <textarea data-doc-field="next">${window.ECOSUtils.escape(doc.next || "")}</textarea>
          </label>
        </div>
        <div class="quick-actions">
          <button class="button primary" data-finish-project="${project.id}" type="button">Mark Ready to Export</button>
          <a class="button" href="#portfolio">Go to Export Center</a>
        </div>
      </section>
        </div>
      </section>
    `;
  },
  bind() {
    document.querySelector("#docProjectSelect")?.addEventListener("change", (event) => {
      window.ECOSStore.update((data) => {
        data.activeProjectId = event.target.value;
        data.selectedDocProjectId = event.target.value;
        const project = data.projects.find((item) => item.id === event.target.value);
        if (project && project.status === "planned") project.status = "in progress";
      });
    });

    document.querySelectorAll("[data-doc-field]").forEach((field) => {
      field.addEventListener("input", () => {
        window.ECOSStore.update((data) => {
          const selectedProjectId = document.querySelector("#docProjectSelect")?.value || data.selectedDocProjectId || data.projects[0].id;
          const doc = this.docFor(data, selectedProjectId);
          doc[field.dataset.docField] = field.value;
          const project = data.projects.find((item) => item.id === selectedProjectId);
          if (project) {
            if (field.dataset.docField === "parts") project.parts = field.value;
            if (field.dataset.docField === "skills") project.skillsUsed = window.ECOSUtils.splitList(field.value);
            if (field.dataset.docField === "technologies") project.technologies = field.value;
            if (field.dataset.docField === "concepts") project.engineeringConcepts = field.value;
            if (field.dataset.docField === "timeframe") project.timeline = { ...(project.timeline || {}), timeframe: field.value };
            if (field.dataset.docField === "repoLink") project.github = field.value;
            if (field.dataset.docField === "lessons") project.lessons = field.value;
            if (project.status === "planned") project.status = "in progress";
          }
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

    document.querySelectorAll("[data-finish-project]").forEach((button) => {
      button.addEventListener("click", (event) => {
        window.ECOSStore.update((data) => {
          const project = data.projects.find((item) => item.id === event.currentTarget.dataset.finishProject);
          if (!project) return;
          const doc = this.docFor(data, project.id);
          project.status = "complete";
          project.portfolioReady = true;
          data.activeProjectId = project.id;
          data.selectedDocProjectId = project.id;
          project.github = doc.repoLink || project.github;
          project.lessons = doc.lessons || project.lessons;
        });
        location.hash = "#portfolio";
      });
    });

    document.querySelector("#exportProjectMarkdown")?.addEventListener("click", () => {
      const data = window.ECOSStore.get();
      const project = data.projects.find((item) => item.id === (data.activeProjectId || data.selectedDocProjectId || data.projects[0].id));
      this.exportMarkdown(project, this.docFor(data, project.id));
    });

    document.querySelector("#exportProjectWord")?.addEventListener("click", () => {
      const data = window.ECOSStore.get();
      const project = data.projects.find((item) => item.id === (data.activeProjectId || data.selectedDocProjectId || data.projects[0].id));
      this.exportWord(project, this.docFor(data, project.id));
    });
  }
};
