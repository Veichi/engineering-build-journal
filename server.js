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
  return data.projectDocs?.[project.id] || {};
}

function resumeBullet(project) {
  return `${project.actionVerb || "Built"} ${project.technicalTask || project.title} using ${project.toolsUsed || (project.skillsUsed || []).join(", ")}; ${project.measurableResult || "documented results"} to demonstrate ${project.concept || "engineering design"}.`;
}

function markdownProject(data, project) {
  const doc = projectDoc(data, project);
  return `## ${project.title}

${text(doc.portfolioSummary) || text(doc.problem) || "Project summary not written yet."}

- Status: ${project.status || "planned"}
- Skills: ${(project.skillsUsed || []).join(", ") || text(doc.skills) || "Not listed"}
- Tools/Parts: ${text(doc.parts) || project.parts || "Not listed"}
- Repository: ${text(doc.repoLink) || project.github || "Not added"}

### Results
${text(doc.results) || "Results not documented yet."}

### Employer Value
${text(doc.employerValue) || "Employer value not documented yet."}

### Lessons Learned
${text(doc.lessons) || project.lessons || "Lessons not documented yet."}
`;
}

function fullProjectMarkdown(data, project) {
  const doc = projectDoc(data, project);
  return `# ${project.title}

## Project Summary
${text(doc.portfolioSummary) || text(doc.problem) || project.notes || "Project summary not written yet."}

## Goal
${text(doc.goal) || "Goal not documented yet."}

## Parts and Tools
${text(doc.parts) || project.parts || "Not listed"}

## Skills Practiced
${text(doc.skills) || (project.skillsUsed || []).join(", ") || "Not listed"}

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

### Resume Bullet Raw Material
${text(doc.resumeEvidence) || resumeBullet(project)}

## Lessons Learned
${text(doc.lessons) || project.lessons || "Lessons not documented yet."}

## Next Revision
${text(doc.next) || "Next revision not documented yet."}

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
  return `# Resume Project Bullet Drafts

Generated from Engineering Project Notebook.

## Project Bullets

${source.map((project) => `- ${resumeBullet(project)}`).join("\n") || "- Add projects to generate bullets."}

## Skills Evidence

${(data.skills || [])
  .filter((skill) => skill.status === "learning" || skill.status === "completed" || skill.progress > 0)
  .map((skill) => `- ${skill.name}: ${skill.status}, ${skill.progress || 0}%`)
  .join("\n") || "- Mark skills as learning or completed to show evidence."}
`;
}

function generatePortfolioMarkdown(data) {
  const projects = data.projects || [];
  const ready = projects.filter((project) => project.portfolioReady);
  const source = ready.length ? ready : projects;
  return `# Portfolio Draft

Generated from Engineering Project Notebook.

${source.map((project) => markdownProject(data, project)).join("\n\n") || "Add projects to generate a portfolio draft."}
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
    body { font-family: Aptos, Calibri, Arial, sans-serif; line-height: 1.45; color: #1f2933; }
    h1 { font-size: 24pt; }
    h2 { font-size: 16pt; margin-top: 20pt; }
    h3 { font-size: 13pt; margin-top: 14pt; }
    p { font-size: 11pt; }
  </style>
</head>
<body>${body}</body>
</html>`;
}

function bodyOnly(html) {
  return html.split("<body>")[1]?.split("</body>")[0] || "";
}

function generateCareerPacketHtml(data, resumeMarkdown, portfolioMarkdown) {
  const resumeBody = bodyOnly(markdownToWordHtml("Resume Draft", resumeMarkdown));
  const portfolioBody = bodyOnly(markdownToWordHtml("Portfolio Draft", portfolioMarkdown));

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

  await fs.writeFile(path.join(exportsDir, "resume-draft.md"), resumeMarkdown, "utf8");
  await fs.writeFile(path.join(exportsDir, "portfolio-draft.md"), portfolioMarkdown, "utf8");
  await fs.writeFile(path.join(exportsDir, "resume-draft.doc"), `\ufeff${markdownToWordHtml("Resume Draft", resumeMarkdown)}`, "utf8");
  await fs.writeFile(path.join(exportsDir, "portfolio-draft.doc"), `\ufeff${markdownToWordHtml("Portfolio Draft", portfolioMarkdown)}`, "utf8");
  await fs.writeFile(path.join(exportsDir, "career-packet.html"), packetHtml, "utf8");

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
<head><meta charset="utf-8"><title>Project Documentation Exports</title></head>
<body>
  <h1>Project Documentation Exports</h1>
  <ul>${projectLinks.join("\n") || "<li>No completed or portfolio-ready project docs yet.</li>"}</ul>
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
      "/exports/resume-draft.md",
      "/exports/resume-draft.doc",
      "/exports/portfolio-draft.md",
      "/exports/portfolio-draft.doc",
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
