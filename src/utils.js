window.ECOSUtils = {
  uid(prefix = "id") {
    return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  },
  percent(done, total) {
    return total ? Math.round((done / total) * 100) : 0;
  },
  statusClass(status) {
    if (["complete", "completed", "done"].includes(status)) return "green";
    if (["in progress", "learning"].includes(status)) return "amber";
    return "blue";
  },
  escape(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  },
  splitList(value) {
    if (Array.isArray(value)) return value;
    return String(value || "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
};
