# Engineering Build Notebook

A local-first digital engineering notebook for learning by building real projects, documenting progress, tracking skills, and turning project work into portfolio and resume material.

## Run The App With Project-Folder Saving

Run the app with Node.js from this folder:

```bash
cd career-os
npm start
```

Then open:

```text
http://localhost:8080
```

When run this way, app data is saved to:

```text
career-os/data/app-data.json
```

## Run Without Node

You can still open the app directly:

```text
career-os/index.html
```

Direct browser mode only uses browser `localStorage`; it cannot write to the project folder.

## What Is Included

- Home: active build, suggested next action, and current project focus.
- Projects: starter-kit friendly project suggestions and project status.
- Document: project-owned evidence, build notes, professional project summary, and resume-entry source fields.
- Notebook: dated engineering notebook entries for work sessions and technical reflection.
- Export Center: generated resume entries, project summaries, engineering notebooks, and project reports.

## Project Structure

```text
career-os/
  index.html
  styles.css
  README.md
  src/
    app.js
    state.js
    utils.js
    data/
      mockData.js
    components/
      ui.js
    pages/
      dashboard.js
      projects.js
      documentation.js
      journal.js
      portfolio.js
      career.js
      skills.js
      github.js
      resume.js
      internship.js
      recommender.js
      balance.js
```

## Data

The app starts from mock data in:

```text
src/data/mockData.js
```

When served with `npm start`, progress is saved to `data/app-data.json` in this project folder. The browser also keeps a `localStorage` copy as a fallback. Use the export/import buttons to back up or move your data.

The primary source of truth is each project in `projects[]`. Project documentation is stored directly on the project as `project.documentation`, so metadata, technical notes, timeline, export settings, and professional output source fields stay together.

The engineering notebook remains separate in `journal[]` because notebook entries are chronological work-session logs. Notebook entries can link back to one or more projects through `projectIds`, and projects keep `linkedJournalEntryIds` for report generation.

The app uses clean starter templates, not fake completed progress. Project ideas and skill names are included so you do not have to start from an empty database, but they begin as planned or not started. If you had an older version with example progress, use Reset to rebuild a clean starter state.

Saved data includes:

- Completed skills, skill status, and skill progress percentages.
- Step-by-step task completion and notes.
- Project status, GitHub links, portfolio readiness, notes, lessons learned, timeline, progress, linked notebook entries, export settings, and professional resume-entry fields.
- Project-owned documentation fields, documentation checklists, and career evidence notes.
- Roadmap phase checklist progress.
- Engineering notebook entries.
- Internship readiness checklist and notes.
- Portfolio readiness checklist.
- GitHub tracker entries and documentation ratings.
- Professional resume-entry inputs.

The app saves after edits and keeps your data after refresh, closing the browser, and reopening the app. Export JSON regularly if you want a portable backup.

## Generated Career Files

When the app is running with `npm start`, every save also updates practical career documents in:

```text
career-os/exports/
```

Generated files:

- `professional-resume-entry.md`
- `professional-resume-entry.doc`
- `professional-project-summary.md`
- `professional-project-summary.doc`
- `engineering-notebook.md`
- `engineering-notebook.doc`
- `career-packet.html`

Open `career-packet.html` in the browser and use Print to save it as a PDF.

## Future Improvement Roadmap

- Add real GitHub API integration for repo updates, commit counts, and README quality checks.
- Add AI-assisted resume bullet generation using project fields.
- Add charts for weekly hours and skill velocity.
- Add photo upload and local image previews.
- Add true `.docx` export for build logs and project documentation. The current MVP exports Word-openable `.doc` files from the browser.
- Add CSV export for internship applications.
- Add a real database or file-backed local storage option.
- Add project templates for Arduino, ESP32, KiCad, controls, and robotics.
- Add calendar planning and project work-session reminders.

## Notes For Future Integrations

The GitHub page contains mock fields now. API integration can be added near the comment in `src/pages/github.js`.

The resume page generates bullets locally from structured fields. AI generation can be added near the comment in `src/pages/resume.js`.
