window.ECOSStore = (() => {
  const key = "engineeringCareerOS.v1";
  const apiPath = "/api/data";
  const clone = (value) => JSON.parse(JSON.stringify(value));

  let data = load();
  let remoteAvailable = false;
  let remoteSaveTimer = null;

  function load() {
    try {
      const saved = localStorage.getItem(key);
      return saved ? migrate(JSON.parse(saved)) : migrate(clone(window.ECOS_MOCK_DATA));
    } catch {
      return migrate(clone(window.ECOS_MOCK_DATA));
    }
  }

  function mergeById(defaultItems, savedItems) {
    const savedMap = new Map((savedItems || []).map((item) => [item.id, item]));
    const merged = (defaultItems || []).map((item) => ({ ...item, ...(savedMap.get(item.id) || {}) }));
    const defaultIds = new Set((defaultItems || []).map((item) => item.id));
    return [...merged, ...(savedItems || []).filter((item) => !defaultIds.has(item.id))];
  }

  function progressFromStatus(status) {
    if (status === "completed" || status === "complete") return 100;
    if (status === "learning" || status === "in progress") return 50;
    return 0;
  }

  function migrate(saved) {
    const base = clone(window.ECOS_MOCK_DATA);
    const next = { ...base, ...saved };
    next.skills = mergeById(base.skills, saved.skills).map((skill) => ({
      ...skill,
      progress: Number.isFinite(Number(skill.progress)) ? Number(skill.progress) : progressFromStatus(skill.status)
    }));
    next.projects = mergeById(base.projects, saved.projects);
    next.repos = mergeById(base.repos, saved.repos);
    next.journal = mergeById(base.journal, saved.journal);
    next.internship = mergeById(base.internship, saved.internship);
    next.portfolioChecklist = mergeById(base.portfolioChecklist, saved.portfolioChecklist);
    next.stepChecks = saved.stepChecks || {};
    next.stepNotes = saved.stepNotes || {};
    next.selectedStepKey = saved.selectedStepKey || "";
    next.activeProjectId = saved.activeProjectId || saved.selectedDocProjectId || next.projects.find((project) => project.status === "in progress")?.id || next.projects.find((project) => project.status === "planned")?.id || next.projects[0]?.id || "";
    next.selectedDocProjectId = saved.selectedDocProjectId || next.activeProjectId;
    next.lastSaved = saved.lastSaved || "";
    if ((saved.schemaVersion || 0) < 3) cleanOldMockProgress(next);
    if ((saved.schemaVersion || 0) < 4) refreshStarterSteps(next, base);
    ensureProjectDocumentation(next, saved.projectDocs || {});
    delete next.projectDocs;
    next.schemaVersion = base.schemaVersion;
    return next;
  }

  function blankProjectDocumentation(project) {
    return {
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
      timeframe: "",
      technologies: "",
      concepts: "",
      professionalSummary: "",
      lessons: project.lessons || "",
      next: "",
      photoLinks: "",
      repoLink: project.github || "",
      checklist: {
        problem: false,
        parts: false,
        schematic: false,
        photos: false,
        code: false,
        testData: false,
        demo: false,
        lessons: false
      }
    };
  }

  function ensureProjectDocumentation(next, legacyDocs = {}) {
    next.projects.forEach((project) => {
      project.timeline = project.timeline || {};
      project.progress = project.progress || {
        stage: project.portfolioReady ? "Ready to export" : project.status === "complete" ? "Documented" : project.status === "in progress" ? "Building" : "Idea"
      };
      project.linkedJournalEntryIds = project.linkedJournalEntryIds || [];
      project.exportSettings = project.exportSettings || {
        includeInResume: true,
        includeInPortfolio: true,
        includeInReports: true
      };
      project.attachments = project.attachments || [];
      project.documentation = {
        ...blankProjectDocumentation(project),
        ...(legacyDocs[project.id] || {}),
        ...(project.documentation || {})
      };
      project.technologies = project.technologies || project.documentation.technologies || project.documentation.parts || project.parts || "";
      project.engineeringConcepts = project.engineeringConcepts || project.documentation.concepts || project.documentation.skills || (project.skillsUsed || []).join(", ");
      project.timeline.timeframe = project.timeline.timeframe || project.documentation.timeframe || project.timeframe || "";
    });
  }

  function cleanOldMockProgress(next) {
    const clean = clone(window.ECOS_MOCK_DATA);
    const cleanSkillIds = new Set(clean.skills.map((item) => item.id));
    next.skills = next.skills.map((skill) => cleanSkillIds.has(skill.id) ? { ...skill, status: "not started", progress: 0 } : skill);
    const cleanProjectIds = new Set(clean.projects.map((item) => item.id));
    next.projects = next.projects.map((project) => cleanProjectIds.has(project.id) ? { ...project, status: "planned", portfolioReady: false, notes: "", lessons: "" } : project);
    next.repos = [];
    next.journal = [];
    next.stepChecks = {};
    next.stepNotes = {};
  }

  function refreshStarterSteps(next, base) {
    next.stepRoadmap = clone(base.stepRoadmap);
    next.stepChecks = {};
    next.stepNotes = {};
    next.selectedStepKey = "";
  }

  function save() {
    data.lastSaved = new Date().toISOString();
    localStorage.setItem(key, JSON.stringify(data, null, 2));
    scheduleRemoteSave();
  }

  function saveLocalOnly() {
    localStorage.setItem(key, JSON.stringify(data, null, 2));
  }

  function canUseRemoteStorage() {
    return window.location.protocol === "http:" || window.location.protocol === "https:";
  }

  function scheduleRemoteSave() {
    if (!canUseRemoteStorage()) return;
    clearTimeout(remoteSaveTimer);
    remoteSaveTimer = setTimeout(saveRemote, 250);
  }

  async function saveRemote() {
    if (!canUseRemoteStorage()) return;
    try {
      const response = await fetch(apiPath, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      remoteAvailable = response.ok;
    } catch {
      remoteAvailable = false;
    }
  }

  async function loadRemote() {
    if (!canUseRemoteStorage()) return;
    try {
      const response = await fetch(apiPath);
      if (!response.ok) return;
      remoteAvailable = true;
      const remoteData = await response.json();
      if (remoteData && Object.keys(remoteData).length > 0) {
        data = migrate(remoteData);
        saveLocalOnly();
        window.dispatchEvent(new CustomEvent("ecos:data"));
      } else {
        save();
      }
    } catch {
      remoteAvailable = false;
    }
  }

  function get() {
    return data;
  }

  function set(next, notify = true) {
    data = next;
    save();
    if (notify) window.dispatchEvent(new CustomEvent("ecos:data"));
  }

  function update(mutator, notify = true) {
    const next = clone(data);
    mutator(next);
    set(next, notify);
  }

  function reset() {
    set(migrate(clone(window.ECOS_MOCK_DATA)));
  }

  function exportFile() {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "engineering-career-os-data.json";
    link.click();
    URL.revokeObjectURL(url);
  }

  async function importFile(file) {
    const imported = JSON.parse(await file.text());
    set(migrate(imported));
  }

  loadRemote();

  return { get, update, reset, exportFile, importFile };
})();
