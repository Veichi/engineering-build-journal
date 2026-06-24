window.ECOSPages = window.ECOSPages || {};

window.ECOSPages.journal = {
  title: "Build Log",
  exportWord(data) {
    const entries = data.journal.map((entry) => `
      <h2>${window.ECOSUtils.escape(entry.date)} - ${window.ECOSUtils.escape(entry.type)}</h2>
      <p><strong>What did I build?</strong><br>${window.ECOSUtils.escape(entry.built)}</p>
      <p><strong>What did I learn?</strong><br>${window.ECOSUtils.escape(entry.learned)}</p>
      <p><strong>What problem did I solve?</strong><br>${window.ECOSUtils.escape(entry.solved)}</p>
      <p><strong>What confused me?</strong><br>${window.ECOSUtils.escape(entry.confused)}</p>
      <p><strong>What should I do next?</strong><br>${window.ECOSUtils.escape(entry.next)}</p>
      <hr>
    `).join("");
    const documentHtml = `
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Engineering Build Log</title>
          <style>
            body { font-family: Aptos, Calibri, Arial, sans-serif; line-height: 1.45; color: #1f2933; }
            h1 { font-size: 24pt; }
            h2 { font-size: 16pt; margin-top: 24pt; }
            p { font-size: 11pt; }
            hr { border: 0; border-top: 1px solid #cbd5df; margin: 18pt 0; }
          </style>
        </head>
        <body>
          <h1>Engineering Build Log</h1>
          <p>Exported from Engineering Project Notebook on ${new Date().toLocaleString()}.</p>
          ${entries || "<p>No journal entries yet.</p>"}
        </body>
      </html>
    `;
    const blob = new Blob(["\ufeff", documentHtml], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "engineering-build-log.doc";
    link.click();
    URL.revokeObjectURL(url);
  },
  render(data) {
    return `
      <section class="panel">
        <div class="row">
          <h3>New Build Log Entry</h3>
          <button id="exportJournalWord" class="button" type="button">Export Word Doc</button>
        </div>
        <form id="journalForm" class="form-grid">
          <label>Date<input name="date" type="date" required /></label>
          <label>Type<select name="type"><option>daily</option><option>weekly</option></select></label>
          <label class="wide">What did I build?<textarea name="built"></textarea></label>
          <label class="wide">What did I learn?<textarea name="learned"></textarea></label>
          <label class="wide">What problem did I solve?<textarea name="solved"></textarea></label>
          <label class="wide">What confused me?<textarea name="confused"></textarea></label>
          <label class="wide">What should I do next?<textarea name="next"></textarea></label>
          <button class="button primary" type="submit">Save Entry</button>
        </form>
      </section>
      <section class="stack">
        ${data.journal.map((entry) => `
          <article class="panel journal-entry">
            <div class="row"><h3>${entry.date}</h3>${window.ECOSUI.pill(entry.type)}</div>
            <p><strong>Built:</strong> ${entry.built}</p>
            <p><strong>Learned:</strong> ${entry.learned}</p>
            <p><strong>Solved:</strong> ${entry.solved}</p>
            <p><strong>Confused:</strong> ${entry.confused}</p>
            <p><strong>Next:</strong> ${entry.next}</p>
          </article>
        `).join("")}
      </section>
    `;
  },
  bind() {
    document.querySelector("#exportJournalWord")?.addEventListener("click", () => {
      window.ECOSPages.journal.exportWord(window.ECOSStore.get());
    });

    document.querySelector("#journalForm")?.addEventListener("submit", (event) => {
      event.preventDefault();
      const form = new FormData(event.target);
      window.ECOSStore.update((data) => {
        data.journal.unshift({
          id: window.ECOSUtils.uid("journal"),
          date: form.get("date"),
          type: form.get("type"),
          built: form.get("built"),
          learned: form.get("learned"),
          solved: form.get("solved"),
          confused: form.get("confused"),
          next: form.get("next")
        });
      });
    });
  }
};
