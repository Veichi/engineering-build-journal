window.ECOSPages = window.ECOSPages || {};

window.ECOSPages.github = {
  title: "GitHub Tracker",
  render(data) {
    // Future GitHub API integration point:
    // Replace mock repo fields with fetched repository metadata such as
    // pushed_at, commit count, README presence, topics, languages, and open issues.
    return `
      <section class="panel">
        <h3>Add Repository</h3>
        <form id="repoForm" class="form-grid">
          <label>Repository name<input name="name" required /></label>
          <label>Repository link<input name="link" type="url" /></label>
          <label>Last updated<input name="lastUpdated" type="date" /></label>
          <label>Commit count<input name="commitCount" type="number" min="0" value="0" /></label>
          <label>Linked project<input name="project" /></label>
          <label>Documentation quality<select name="docQuality"><option value="0">0 - missing</option><option value="1">1 - rough</option><option value="2">2 - usable</option><option value="3">3 - strong</option></select></label>
          <button class="button primary" type="submit">Add Repository</button>
        </form>
        <p class="muted">Future GitHub API integration can replace these mock fields with live repo metadata.</p>
      </section>
      <section class="panel">
        <table class="table">
          <thead><tr><th>Repo</th><th>Project</th><th>Updated</th><th>Commits</th><th>Docs</th></tr></thead>
          <tbody>
            ${data.repos.map((repo) => `
              <tr>
                <td>
                  <label>Repository<input data-repo-field="${repo.id}:name" value="${window.ECOSUtils.escape(repo.name)}" /></label>
                  <label>Link<input data-repo-field="${repo.id}:link" type="url" value="${window.ECOSUtils.escape(repo.link)}" /></label>
                </td>
                <td><label>Project<input data-repo-field="${repo.id}:project" value="${window.ECOSUtils.escape(repo.project)}" /></label></td>
                <td><label>Updated<input data-repo-field="${repo.id}:lastUpdated" type="date" value="${window.ECOSUtils.escape(repo.lastUpdated)}" /></label></td>
                <td><label>Commits<input data-repo-field="${repo.id}:commitCount" type="number" min="0" value="${repo.commitCount}" /></label></td>
                <td><label>Docs<select data-repo-field="${repo.id}:docQuality">
                  ${[0, 1, 2, 3].map((score) => `<option value="${score}" ${repo.docQuality === score ? "selected" : ""}>${score}/3</option>`).join("")}
                </select></label></td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </section>
    `;
  },
  bind() {
    document.querySelector("#repoForm")?.addEventListener("submit", (event) => {
      event.preventDefault();
      const form = new FormData(event.target);
      window.ECOSStore.update((data) => {
        data.repos.unshift({
          id: window.ECOSUtils.uid("repo"),
          name: form.get("name"),
          link: form.get("link"),
          lastUpdated: form.get("lastUpdated"),
          commitCount: Number(form.get("commitCount")),
          project: form.get("project"),
          docQuality: Number(form.get("docQuality"))
        });
      });
    });

    document.querySelectorAll("[data-repo-field]").forEach((field) => {
      field.addEventListener("input", () => {
        const [id, prop] = field.dataset.repoField.split(":");
        window.ECOSStore.update((data) => {
          const repo = data.repos.find((item) => item.id === id);
          repo[prop] = ["commitCount", "docQuality"].includes(prop) ? Number(field.value) : field.value;
        }, false);
      });
    });
  }
};
