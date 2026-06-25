const http = require("node:http");
const fs = require("node:fs/promises");
const path = require("node:path");

const rootDir = __dirname;
const dataDir = path.join(rootDir, "data");
const dataFile = path.join(dataDir, "app-data.json");
const exportsDir = path.join(rootDir, "exports");
const port = Number(process.env.PORT || 8080);
const host = "127.0.0.1";

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".doc": "application/msword",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg"
};

async function ensureDataFile() {
  await fs.mkdir(dataDir, { recursive: true });
  try {
    await fs.access(dataFile);
  } catch {
    await fs.writeFile(dataFile, "{}\n", "utf8");
  }
}

function text(value) {
  return String(value || "").trim();
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function projectDoc(data, project) {
  return project.documentation || data.projectDocs?.[project.id] || {};
}

function resumeBullet(project) {
  return `${project.actionVerb || "Built"} ${project.technicalTask || project.title} using ${project.toolsUsed || (project.skillsUsed || []).join(", ")}; ${project.measurableResult || "documented results"} to demonstrate ${project.concept || "engineering design"}.`;
}

function firstAvailable(...values) {
  return values.map(text).find(Boolean) || "";
}

function normalizeSentence(value) {
  const cleaned = text(value).replace(/\s+/g, " ");
  if (!cleaned) return "";
  return /[.!?]$/.test(cleaned) ? cleaned : `${cleaned}.`;
}

function commaList(value) {
  if (Array.isArray(value)) return value.map(text).filter(Boolean).join(", ");
  return text(value);
}

function technologiesUsed(project, doc) {
  return firstAvailable(project.technologies, doc.technologies, doc.parts, project.parts, project.toolsUsed, commaList(project.skillsUsed), "Technologies not documented");
}

function engineeringConcepts(project, doc) {
  return firstAvailable(project.engineeringConcepts, doc.concepts, project.concept, doc.skills, commaList(project.skillsUsed), "Engineering concepts not documented");
}

function projectTimeframe(project, doc) {
  return firstAvailable(project.timeline?.timeframe, doc.timeframe, project.timeframe, "Timeframe not documented");
}

function professionalProjectSummary(project, doc) {
  const objective = firstAvailable(doc.goal, doc.problem, `Build and evaluate ${project.title}.`);
  const built = firstAvailable(doc.design, project.technicalTask, project.notes, `A working ${project.title} prototype was developed.`);
  const challenge = firstAvailable(doc.problems, doc.wiring, doc.code, "Key engineering work included translating the design goal into a testable hardware/software implementation.");
  const outcome = firstAvailable(doc.results, doc.lessons, "Final outcome not documented yet.");

  return [
    normalizeSentence(`Objective: ${objective}`),
    normalizeSentence(`Implementation: ${built}`),
    normalizeSentence(`Engineering challenge: ${challenge}`),
    normalizeSentence(`Outcome: ${outcome}`)
  ].join(" ");
}

function accomplishmentBullets(project, doc) {
  const bullets = [];
  const tools = technologiesUsed(project, doc);
  const concepts = engineeringConcepts(project, doc);

  bullets.push(`Designed and built ${text(project.technicalTask) || text(project.title)} using ${tools} to demonstrate ${concepts}.`);

  if (text(doc.tests) || text(doc.results)) {
    bullets.push(`Validated system behavior through documented testing, measurements, and observed results: ${firstAvailable(doc.results, doc.tests)}.`);
  }

  if (text(doc.problems)) {
    bullets.push(`Diagnosed and resolved implementation issues involving ${text(doc.problems)}.`);
  }

  if (text(doc.wiring) || text(doc.code)) {
    bullets.push(`Integrated hardware setup and software logic while documenting wiring, code structure, and setup decisions for repeatable use.`);
  }

  if (text(doc.portfolioSummary) || text(doc.employerValue) || text(doc.lessons)) {
    bullets.push(`Converted project evidence into export-ready documentation, including technical summary, lessons learned, and next-revision notes.`);
  }

  while (bullets.length < 3) {
    bullets.push(`Documented project objective, build process, engineering decisions, and final outcome for future portfolio and interview use.`);
  }

  return bullets.slice(0, 5);
}

function professionalResumeEntry(project, doc) {
  const summary = firstAvailable(doc.professionalSummary, doc.portfolioSummary, professionalProjectSummary(project, doc));
  return `## ${project.title}

**Timeframe:** ${projectTimeframe(project, doc)}

**Technologies Used:** ${technologiesUsed(project, doc)}

**Engineering Concepts Demonstrated:** ${engineeringConcepts(project, doc)}

**Project Summary:** ${summary}

**Selected Accomplishments**
${accomplishmentBullets(project, doc).map((bullet) => `- ${bullet}`).join("\n")}
`;
}

function linkedJournalEntries(data, project) {
  const linkedIds = new Set(project.linkedJournalEntryIds || []);
  return (data.journal || []).filter((entry) => linkedIds.has(entry.id) || (entry.projectIds || []).includes(project.id));
}

function journalHistoryMarkdown(data, project) {
  const entries = linkedJournalEntries(data, project);
  if (!entries.length) return "No linked engineering notebook entries yet.";
  return entries.map((entry) => `### ${text(entry.date) || "Undated Entry"}

- Objective: ${journalField(entry, "objective", "built") || "Not documented"}
- Work Completed: ${journalField(entry, "workCompleted", "built") || "Not documented"}
- Challenges: ${journalField(entry, "challenges", "confused") || "Not documented"}
- Engineering Decisions: ${journalField(entry, "decisions", "solved") || "Not documented"}
- Lessons Learned: ${journalField(entry, "lessons", "learned") || "Not documented"}
- Next Steps: ${journalField(entry, "nextSteps", "next") || "Not documented"}
`).join("\n");
}

function markdownProject(data, project) {
  const doc = projectDoc(data, project);
  return `## ${project.title}

${professionalProjectSummary(project, doc)}

- Status: ${project.status || "planned"}
- Technologies: ${technologiesUsed(project, doc)}
- Engineering Concepts: ${engineeringConcepts(project, doc)}
- Repository: ${text(doc.repoLink) || project.github || "Not added"}

### Professional Resume Entry
${professionalResumeEntry(project, doc)}
`;
}

function fullProjectMarkdown(data, project) {
  const doc = projectDoc(data, project);
  return `# ${project.title}

## Professional Project Summary
${professionalProjectSummary(project, doc)}

## Goal
${text(doc.goal) || "Goal not documented yet."}

## Technologies Used
${technologiesUsed(project, doc)}

## Engineering Concepts Demonstrated
${engineeringConcepts(project, doc)}

## Design Notes
${text(doc.design) || "Design notes not documented yet."}

## Wiring / Circuit Notes
${text(doc.wiring) || "Wiring notes not documented yet."}

## Code Notes
${text(doc.code) || "Code notes not documented yet."}

## Test Plan and Data
${text(doc.tests) || "Test data not documented yet."}

## Problems and Debugging
${text(doc.problems) || "Debugging notes not documented yet."}

## Results
${text(doc.results) || "Results not documented yet."}

## Career Evidence

### Portfolio Summary
${text(doc.portfolioSummary) || "Portfolio summary not documented yet."}

### Why This Matters To Employers
${text(doc.employerValue) || "Employer value not documented yet."}

### Professional Resume Entry
${text(doc.resumeEvidence) || professionalResumeEntry(project, doc)}

## Lessons Learned
${text(doc.lessons) || project.lessons || "Lessons not documented yet."}

## Next Revision
${text(doc.next) || "Next revision not documented yet."}

## Linked Engineering Notebook History
${journalHistoryMarkdown(data, project)}

## Photos / Media
${text(doc.photoLinks) || "Media links not added."}

## Repository
${text(doc.repoLink) || project.github || "Repository not added."}
`;
}

function slug(value) {
  return String(value || "project").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "project";
}

function generateResumeMarkdown(data) {
  const projects = data.projects || [];
  const completedOrReady = projects.filter((project) => project.status === "complete" || project.portfolioReady);
  const source = completedOrReady.length ? completedOrReady : projects;
  return `# Professional Resume Entry

Generated from Engineering Build Notebook.

${source.map((project) => professionalResumeEntry(project, projectDoc(data, project))).join("\n\n") || "Add projects to generate professional resume entries."}
`;
}

function generatePortfolioMarkdown(data) {
  const projects = data.projects || [];
  const ready = projects.filter((project) => project.portfolioReady);
  const source = ready.length ? ready : projects;
  return `# Professional Project Summary

Generated from Engineering Build Notebook.

${source.map((project) => markdownProject(data, project)).join("\n\n") || "Add projects to generate a professional project summary."}
`;
}

function markdownToWordHtml(title, markdown) {
  const body = markdown
    .split("\n")
    .map((line) => {
      if (line.startsWith("# ")) return `<h1>${escapeHtml(line.slice(2))}</h1>`;
      if (line.startsWith("## ")) return `<h2>${escapeHtml(line.slice(3))}</h2>`;
      if (line.startsWith("### ")) return `<h3>${escapeHtml(line.slice(4))}</h3>`;
      if (line.startsWith("- ")) return `<p>&bull; ${escapeHtml(line.slice(2))}</p>`;
      return line.trim() ? `<p>${escapeHtml(line)}</p>` : "";
    })
    .join("\n");

  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>${escapeHtml(title)}</title>
  <style>
    @page { margin: 0.75in; }
    body { font-family: Aptos, Calibri, Arial, sans-serif; line-height: 1.45; color: #1f2933; }
    h1 { font-size: 22pt; margin: 0 0 18pt; padding-bottom: 8pt; border-bottom: 1.5pt solid #1f3d36; }
    h2 { font-size: 15pt; margin: 20pt 0 8pt; color: #1f3d36; }
    h3 { font-size: 12.5pt; margin: 14pt 0 6pt; color: #263a35; }
    p { font-size: 10.5pt; margin: 5pt 0; }
    strong { color: #17211f; }
  </style>
</head>
<body>${body}</body>
</html>`;
}

function journalField(entry, modernKey, legacyKey) {
  return firstAvailable(entry[modernKey], entry[legacyKey]);
}

function generateJournalMarkdown(data) {
  const entries = data.journal || [];
  return `# Engineering Notebook

Generated from Engineering Build Notebook.

${entries.map((entry) => `## ${text(entry.date) || "Undated Entry"}

**Objective:** ${journalField(entry, "objective", "built") || "Objective not documented."}

**Work Completed:** ${journalField(entry, "workCompleted", "built") || "Work completed not documented."}

**Challenges Encountered:** ${journalField(entry, "challenges", "confused") || "Challenges not documented."}

**Engineering Decisions:** ${journalField(entry, "decisions", "solved") || "Engineering decisions not documented."}

**Lessons Learned:** ${journalField(entry, "lessons", "learned") || "Lessons learned not documented."}

**Next Steps:** ${journalField(entry, "nextSteps", "next") || "Next steps not documented."}
`).join("\n\n") || "No journal entries yet."}
`;
}

function journalToWordHtml(markdown) {
  const body = markdown
    .split("\n")
    .map((line) => {
      if (line.startsWith("# ")) return `<h1>${escapeHtml(line.slice(2))}</h1>`;
      if (line.startsWith("## ")) return `<h2>${escapeHtml(line.slice(3))}</h2>`;
      if (line.startsWith("**") && line.includes(":**")) {
        const [label, ...rest] = line.split(":**");
        return `<p class="notebook-field"><strong>${escapeHtml(label.replaceAll("**", ""))}:</strong>${escapeHtml(rest.join(":**"))}</p>`;
      }
      return line.trim() ? `<p>${escapeHtml(line)}</p>` : "";
    })
    .join("\n");

  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>Engineering Notebook</title>
  <style>
    @page { margin: 0.8in; }
    body { font-family: Aptos, Calibri, Arial, sans-serif; color: #17211f; line-height: 1.45; }
    h1 { font-size: 24pt; margin: 0 0 8pt; padding-bottom: 8pt; border-bottom: 2pt solid #1f3d36; }
    h2 { font-size: 15pt; margin: 22pt 0 8pt; color: #1f3d36; page-break-after: avoid; }
    p { font-size: 10.5pt; margin: 5pt 0; }
    .notebook-field { margin: 8pt 0; }
    .footer { color: #64716d; font-size: 9pt; text-align: center; margin-top: 24pt; }
  </style>
</head>
<body>
${body}
<p class="footer">Engineering Notebook | Page <span style="mso-field-code: PAGE"></span></p>
</body>
</html>`;
}

function bodyOnly(html) {
  return html.split("<body>")[1]?.split("</body>")[0] || "";
}

function generateCareerPacketHtml(data, resumeMarkdown, portfolioMarkdown) {
  const resumeBody = bodyOnly(markdownToWordHtml("Professional Resume Entry", resumeMarkdown));
  const portfolioBody = bodyOnly(markdownToWordHtml("Professional Project Summary", portfolioMarkdown));

  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>Engineering Career Packet</title>
  <style>
    body { max-width: 860px; margin: 40px auto; font-family: Aptos, Calibri, Arial, sans-serif; line-height: 1.5; color: #17211f; }
    h1 { font-size: 30px; border-bottom: 2px solid #2d7658; padding-bottom: 10px; }
    h2 { margin-top: 28px; color: #2d7658; }
    h3 { margin-top: 18px; }
    p { margin: 8px 0; }
    @media print { body { margin: 0.5in; } a { color: inherit; } }
  </style>
</head>
<body>
${resumeBody}
<div style="page-break-before: always;"></div>
${portfolioBody}
</body>
</html>`;
}

async function writeCareerDocs(data) {
  await fs.mkdir(exportsDir, { recursive: true });
  const projectExportsDir = path.join(exportsDir, "projects");
  await fs.mkdir(projectExportsDir, { recursive: true });
  const resumeMarkdown = generateResumeMarkdown(data);
  const portfolioMarkdown = generatePortfolioMarkdown(data);
  const packetHtml = generateCareerPacketHtml(data, resumeMarkdown, portfolioMarkdown);

  await fs.writeFile(path.join(exportsDir, "professional-resume-entry.md"), resumeMarkdown, "utf8");
  await fs.writeFile(path.join(exportsDir, "professional-project-summary.md"), portfolioMarkdown, "utf8");
  await fs.writeFile(path.join(exportsDir, "professional-resume-entry.doc"), `\ufeff${markdownToWordHtml("Professional Resume Entry", resumeMarkdown)}`, "utf8");
  await fs.writeFile(path.join(exportsDir, "professional-project-summary.doc"), `\ufeff${markdownToWordHtml("Professional Project Summary", portfolioMarkdown)}`, "utf8");
  await fs.writeFile(path.join(exportsDir, "career-packet.html"), packetHtml, "utf8");
  const journalMarkdown = generateJournalMarkdown(data);
  await fs.writeFile(path.join(exportsDir, "engineering-notebook.md"), journalMarkdown, "utf8");
  await fs.writeFile(path.join(exportsDir, "engineering-notebook.doc"), `\ufeff${journalToWordHtml(journalMarkdown)}`, "utf8");

  const projectLinks = [];
  for (const project of data.projects || []) {
    if (project.status !== "complete" && !project.portfolioReady) continue;
    const projectMarkdown = fullProjectMarkdown(data, project);
    const projectSlug = slug(project.title);
    await fs.writeFile(path.join(projectExportsDir, `${projectSlug}.md`), projectMarkdown, "utf8");
    await fs.writeFile(path.join(projectExportsDir, `${projectSlug}.doc`), `\ufeff${markdownToWordHtml(project.title, projectMarkdown)}`, "utf8");
    projectLinks.push(`<li><strong>${escapeHtml(project.title)}</strong>: <a href="./${projectSlug}.md">Markdown</a> | <a href="./${projectSlug}.doc">Word Doc</a></li>`);
  }

  await fs.writeFile(path.join(projectExportsDir, "index.html"), `<!doctype html>
<html>
<head><meta charset="utf-8"><title>Engineering Project Reports</title></head>
<body>
  <h1>Engineering Project Reports</h1>
  <ul>${projectLinks.join("\n") || "<li>No completed or export-ready engineering project reports yet.</li>"}</ul>
</body>
</html>`, "utf8");
}

async function readBody(request) {
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  return Buffer.concat(chunks).toString("utf8");
}

function send(response, status, body, contentType = "text/plain; charset=utf-8") {
  response.writeHead(status, {
    "Content-Type": contentType,
    "Cache-Control": "no-store"
  });
  response.end(body);
}

async function handleApi(request, response) {
  await ensureDataFile();

  if (request.method === "GET") {
    const data = await fs.readFile(dataFile, "utf8");
    send(response, 200, data || "{}\n", "application/json; charset=utf-8");
    return;
  }

  if (request.method === "POST") {
    const body = await readBody(request);
    let parsed;
    try {
      parsed = JSON.parse(body);
    } catch {
      send(response, 400, JSON.stringify({ error: "Invalid JSON" }), "application/json; charset=utf-8");
      return;
    }
    await fs.writeFile(dataFile, `${JSON.stringify(parsed, null, 2)}\n`, "utf8");
    await writeCareerDocs(parsed);
    send(response, 200, JSON.stringify({ ok: true }), "application/json; charset=utf-8");
    return;
  }

  send(response, 405, JSON.stringify({ error: "Method not allowed" }), "application/json; charset=utf-8");
}

async function handleGenerateDocs(response) {
  await ensureDataFile();
  const raw = await fs.readFile(dataFile, "utf8");
  const data = raw.trim() ? JSON.parse(raw) : {};
  await writeCareerDocs(data);
  send(response, 200, JSON.stringify({
    ok: true,
    files: [
      "/exports/professional-resume-entry.md",
      "/exports/professional-resume-entry.doc",
      "/exports/professional-project-summary.md",
      "/exports/professional-project-summary.doc",
      "/exports/engineering-notebook.md",
      "/exports/engineering-notebook.doc",
      "/exports/career-packet.html"
    ]
  }), "application/json; charset=utf-8");
}

async function serveStatic(request, response) {
  const url = new URL(request.url, `http://${request.headers.host}`);
  const requestedPath = decodeURIComponent(url.pathname === "/" ? "/index.html" : url.pathname);
  const filePath = path.normalize(path.join(rootDir, requestedPath));

  if (!filePath.startsWith(rootDir)) {
    send(response, 403, "Forbidden");
    return;
  }

  try {
    const file = await fs.readFile(filePath);
    const contentType = mimeTypes[path.extname(filePath)] || "application/octet-stream";
    response.writeHead(200, { "Content-Type": contentType });
    response.end(file);
  } catch {
    send(response, 404, "Not found");
  }
}

const server = http.createServer((request, response) => {
  if (request.url.startsWith("/api/data")) {
    handleApi(request, response).catch((error) => {
      console.error(error);
      send(response, 500, JSON.stringify({ error: "Server error" }), "application/json; charset=utf-8");
    });
    return;
  }

  if (request.url.startsWith("/api/generate-career-docs")) {
    handleGenerateDocs(response).catch((error) => {
      console.error(error);
      send(response, 500, JSON.stringify({ error: "Server error" }), "application/json; charset=utf-8");
    });
    return;
  }

  serveStatic(request, response).catch((error) => {
    console.error(error);
    send(response, 500, "Server error");
  });
});

server.listen(port, host, () => {
  console.log(`Engineering Project Notebook running at http://${host}:${port}`);
  console.log(`Data file: ${dataFile}`);
});
