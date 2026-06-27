const routes = [
  ["dashboard", "Home"],
  ["projects", "Projects"],
  ["ideas", "Ideas"],
  ["documentation", "Document"],
  ["journal", "Notebook"],
  ["portfolio", "Export Center"]
];

const nav = document.querySelector("#nav");
const view = document.querySelector("#view");
const pageTitle = document.querySelector("#pageTitle");
const saveStatus = document.querySelector("#saveStatus");

function currentRoute() {
  return location.hash.replace("#", "") || "dashboard";
}

function renderNav() {
  const route = currentRoute();
  nav.innerHTML = routes
    .map(([id, label]) => `<a class="${route === id ? "active" : ""}" href="#${id}">${label}</a>`)
    .join("");
}

function render() {
  const route = currentRoute();
  const page = window.ECOSPages[route] || window.ECOSPages.dashboard;
  const data = window.ECOSStore.get();
  pageTitle.textContent = page.title;
  saveStatus.textContent = data.lastSaved ? `Saved ${new Date(data.lastSaved).toLocaleString()}` : "Saved locally";
  renderNav();
  view.innerHTML = page.render(data);
  page.bind?.();
}

document.querySelector("#exportData").addEventListener("click", () => window.ECOSStore.exportFile());
document.querySelector("#importData").addEventListener("change", async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  try {
    await window.ECOSStore.importFile(file);
  } catch {
    alert("Could not import that JSON file.");
  } finally {
    event.target.value = "";
  }
});
document.querySelector("#resetData").addEventListener("click", () => {
  if (confirm("Reset Engineering Build Notebook data to a clean starter state? This clears saved progress in this browser.")) {
    window.ECOSStore.reset();
  }
});

window.addEventListener("hashchange", render);
window.addEventListener("ecos:data", render);
render();
