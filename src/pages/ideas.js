window.ECOSPages = window.ECOSPages || {};

window.ECOSPages.ideas = {
  title: "Project Ideas",
  tags(idea) {
    return window.ECOSUtils.splitList(idea.tags).map((tag) => window.ECOSUI.pill(tag)).join(" ");
  },
  ideaForm(idea = {}) {
    const isEditing = Boolean(idea.id);
    return `
      <form class="form-grid compact-form idea-form" data-idea-form="${idea.id || "new"}">
        <label>Title<input name="title" required value="${window.ECOSUtils.escape(idea.title || "")}" /></label>
        <label>Tags / Categories<input name="tags" placeholder="Arduino, sensors, robotics" value="${window.ECOSUtils.escape(window.ECOSUtils.splitList(idea.tags).join(", "))}" /></label>
        <label class="wide">Notes / Description<textarea name="notes" placeholder="What would you build? What parts, skills, or questions are involved?">${window.ECOSUtils.escape(idea.notes || "")}</textarea></label>
        <div class="wide quick-actions">
          <button class="button primary" type="submit">${isEditing ? "Save Changes" : "Save Idea"}</button>
          ${isEditing ? `<button class="button" data-cancel-edit="${idea.id}" type="button">Cancel</button>` : ""}
        </div>
      </form>
    `;
  },
  render(data) {
    const ideas = data.ideas || [];

    return `
      <section class="journal-hero">
        <div>
          <p class="kicker">Idea bank</p>
          <h3>Capture rough builds before they become projects.</h3>
          <p class="muted">Use this page for half-formed concepts, parts lists, categories, and questions.</p>
        </div>
        <div class="hero-card">
          <span class="sketch-mark"></span>
          <strong>${ideas.length} saved</strong>
          <p>Promote the best ones into full projects when you are ready to build.</p>
        </div>
      </section>

      <section class="panel add-panel">
        <div class="row">
          <div>
            <p class="kicker">New idea</p>
            <h3>Save possible future builds</h3>
          </div>
        </div>
        ${this.ideaForm()}
      </section>

      <section class="stack">
        ${ideas.map((idea) => `
          <article class="panel idea-row">
            <div>
              <div class="row">
                <h3>${window.ECOSUtils.escape(idea.title || "Untitled idea")}</h3>
                <span class="muted">${idea.updatedAt ? `Updated ${new Date(idea.updatedAt).toLocaleDateString()}` : ""}</span>
              </div>
              <p>${window.ECOSUtils.escape(idea.notes || "No notes added yet.")}</p>
              <p>${this.tags(idea)}</p>
            </div>
            <div class="idea-actions">
              <button class="button" data-edit-idea="${idea.id}" type="button">Edit</button>
              <button class="button danger" data-delete-idea="${idea.id}" type="button">Delete</button>
            </div>
            <div class="idea-edit" data-edit-area="${idea.id}" hidden>
              ${this.ideaForm(idea)}
            </div>
          </article>
        `).join("") || "<section class='panel'><h3>No ideas yet</h3><p class='muted'>Add a title and notes above to save your first project idea.</p></section>"}
      </section>
    `;
  },
  bind() {
    document.querySelectorAll("[data-idea-form]").forEach((formElement) => {
      formElement.addEventListener("submit", (event) => {
        event.preventDefault();
        const form = new FormData(formElement);
        const id = formElement.dataset.ideaForm;
        const now = new Date().toISOString();

        window.ECOSStore.update((data) => {
          data.ideas = data.ideas || [];
          if (id === "new") {
            data.ideas.unshift({
              id: window.ECOSUtils.uid("idea"),
              title: form.get("title"),
              notes: form.get("notes"),
              tags: window.ECOSUtils.splitList(form.get("tags")),
              createdAt: now,
              updatedAt: now
            });
            return;
          }

          const idea = data.ideas.find((item) => item.id === id);
          if (!idea) return;
          idea.title = form.get("title");
          idea.notes = form.get("notes");
          idea.tags = window.ECOSUtils.splitList(form.get("tags"));
          idea.updatedAt = now;
        });
      });
    });

    document.querySelectorAll("[data-edit-idea]").forEach((button) => {
      button.addEventListener("click", () => {
        const editArea = document.querySelector(`[data-edit-area="${button.dataset.editIdea}"]`);
        if (editArea) editArea.hidden = false;
      });
    });

    document.querySelectorAll("[data-cancel-edit]").forEach((button) => {
      button.addEventListener("click", () => {
        const editArea = document.querySelector(`[data-edit-area="${button.dataset.cancelEdit}"]`);
        if (editArea) editArea.hidden = true;
      });
    });

    document.querySelectorAll("[data-delete-idea]").forEach((button) => {
      button.addEventListener("click", () => {
        if (!confirm("Delete this idea?")) return;
        window.ECOSStore.update((data) => {
          data.ideas = (data.ideas || []).filter((idea) => idea.id !== button.dataset.deleteIdea);
        });
      });
    });
  }
};
