window.ECOSPages = window.ECOSPages || {};

window.ECOSPages.steps = {
  title: "Step-by-Step Tracker",
  render(data) {
    const checks = data.stepChecks || {};
    const notes = data.stepNotes || {};
    const allTasks = data.stepRoadmap.flatMap((stage) => stage.tasks.map((task) => `${stage.id}:${task.id}`));
    const doneCount = allTasks.filter((key) => checks[key]).length;
    const currentStage = data.stepRoadmap.find((stage) => stage.tasks.some((task) => !checks[`${stage.id}:${task.id}`])) || data.stepRoadmap[0];
    const selectedKey = data.selectedStepKey || `${currentStage.id}:${currentStage.tasks[0].id}`;
    const [selectedStageId, selectedTaskId] = selectedKey.split(":");
    const selectedStage = data.stepRoadmap.find((stage) => stage.id === selectedStageId) || currentStage;
    const selectedTask = selectedStage.tasks.find((task) => task.id === selectedTaskId) || selectedStage.tasks[0];

    return `
      <section class="grid four">
        ${window.ECOSUI.stat("Step Progress", `${window.ECOSUtils.percent(doneCount, allTasks.length)}%`, `${doneCount}/${allTasks.length} tasks complete`)}
        ${window.ECOSUI.stat("Current Stage", `${currentStage.number} ${currentStage.title}`, currentStage.time)}
        ${window.ECOSUI.stat("Next Task", selectedTask.title)}
        ${window.ECOSUI.stat("Saved Notes", Object.values(notes).filter(Boolean).length)}
      </section>
      <section class="grid two">
        <article class="panel">
          <h3>Chronological Tasks</h3>
          <div class="stack">
            ${data.stepRoadmap.map((stage) => {
              const stageDone = stage.tasks.filter((task) => checks[`${stage.id}:${task.id}`]).length;
              return `
                <div class="card">
                  <div class="row">
                    <strong>${stage.number} ${stage.title}</strong>
                    ${window.ECOSUI.pill(`${stageDone}/${stage.tasks.length}`)}
                  </div>
                  ${window.ECOSUI.meter("Stage progress", window.ECOSUtils.percent(stageDone, stage.tasks.length))}
                  <div class="stack">
                    ${stage.tasks.map((task) => {
                      const key = `${stage.id}:${task.id}`;
                      return `
                        <label class="check-row">
                          <input data-step-check="${key}" type="checkbox" ${checks[key] ? "checked" : ""} />
                          <span>
                            <button class="button" data-step-select="${key}" type="button">${task.title}</button>
                            <br><span class="muted">${task.summary}</span>
                          </span>
                        </label>
                      `;
                    }).join("")}
                  </div>
                </div>
              `;
            }).join("")}
          </div>
        </article>
        <article class="panel">
          <div class="row">
            <h3>${selectedTask.title}</h3>
            ${window.ECOSUI.pill(selectedTask.tag)}
          </div>
          <p class="muted">${selectedStage.number} ${selectedStage.title} · ${selectedStage.time}</p>
          <h4>How to do it</h4>
          ${window.ECOSUI.list(selectedTask.how)}
          <h4>Evidence to save</h4>
          ${window.ECOSUI.list(selectedTask.evidence)}
          <h4>Resources</h4>
          <ul>
            ${selectedTask.resources.map(([label, url]) => `<li><a href="${url}" target="_blank" rel="noreferrer">${label}</a></li>`).join("")}
          </ul>
          <label>Task notes<textarea data-step-note="${selectedKey}">${window.ECOSUtils.escape(notes[selectedKey] || "")}</textarea></label>
        </article>
      </section>
    `;
  },
  bind() {
    document.querySelectorAll("[data-step-check]").forEach((box) => {
      box.addEventListener("change", () => {
        window.ECOSStore.update((data) => {
          data.stepChecks = data.stepChecks || {};
          data.stepChecks[box.dataset.stepCheck] = box.checked;
        });
      });
    });

    document.querySelectorAll("[data-step-select]").forEach((button) => {
      button.addEventListener("click", () => {
        window.ECOSStore.update((data) => {
          data.selectedStepKey = button.dataset.stepSelect;
        });
      });
    });

    document.querySelector("[data-step-note]")?.addEventListener("input", (event) => {
      window.ECOSStore.update((data) => {
        data.stepNotes = data.stepNotes || {};
        data.stepNotes[event.target.dataset.stepNote] = event.target.value;
      }, false);
    });
  }
};
