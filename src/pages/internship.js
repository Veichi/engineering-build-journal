window.ECOSPages = window.ECOSPages || {};

window.ECOSPages.internship = {
  title: "Internship Readiness",
  render(data) {
    const done = data.internship.filter((item) => item.done).length;
    const pct = window.ECOSUtils.percent(done, data.internship.length);
    return `
      <section class="panel">
        <h3>Readiness Score</h3>
        ${window.ECOSUI.meter("Internship readiness", pct)}
      </section>
      <section class="grid two">
        ${data.internship.map((item) => `
          <article class="panel">
            <label class="check-row">
              <input data-internship-done="${item.id}" type="checkbox" ${item.done ? "checked" : ""} />
              <span><strong>${item.item}</strong><br><span class="muted">${item.notes}</span></span>
            </label>
            <label>Notes<textarea data-internship-notes="${item.id}">${window.ECOSUtils.escape(item.notes)}</textarea></label>
          </article>
        `).join("")}
      </section>
    `;
  },
  bind() {
    document.querySelectorAll("[data-internship-done]").forEach((box) => {
      box.addEventListener("change", () => {
        window.ECOSStore.update((data) => {
          data.internship.find((item) => item.id === box.dataset.internshipDone).done = box.checked;
        });
      });
    });
    document.querySelectorAll("[data-internship-notes]").forEach((field) => {
      field.addEventListener("input", () => {
        window.ECOSStore.update((data) => {
          data.internship.find((item) => item.id === field.dataset.internshipNotes).notes = field.value;
        }, false);
      });
    });
  }
};
