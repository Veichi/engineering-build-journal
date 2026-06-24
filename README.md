# Engineering Project Notebook

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

- Dashboard
- Next Steps
- Project Tracker
- Documentation Builder
- Skills
- Build Log
- Career Materials
- Portfolio Builder, GitHub Tracker, Resume Bullet Generator, and Internship Prep are available from Career Materials when needed.
- Project Recommender
- Engineering Balance View

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
      skills.js
      projects.js
      documentation.js
      career.js
      portfolio.js
      github.js
      resume.js
      journal.js
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

The app uses clean starter templates, not fake completed progress. Project ideas and skill names are included so you do not have to start from an empty database, but they begin as planned or not started. If you had an older version with example progress, use Reset to rebuild a clean starter state.

Saved data includes:

- Completed skills, skill status, and skill progress percentages.
- Step-by-step task completion and notes.
- Project status, GitHub links, portfolio readiness, notes, lessons learned, and resume draft fields.
- Living project documentation fields, documentation checklists, and career evidence notes.
- Roadmap phase checklist progress.
- Journal entries.
- Internship readiness checklist and notes.
- Portfolio readiness checklist.
- GitHub tracker entries and documentation ratings.
- Resume bullet generator inputs.

The app saves after edits and keeps your data after refresh, closing the browser, and reopening the app. Export JSON regularly if you want a portable backup.

## Generated Career Files

When the app is running with `npm start`, every save also updates practical career documents in:

```text
career-os/exports/
```

Generated files:

- `resume-draft.md`
- `resume-draft.doc`
- `portfolio-draft.md`
- `portfolio-draft.doc`
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
