window.ECOSUI = {
  stat(label, value, detail = "") {
    return `<article class="panel stat"><span>${label}</span><strong>${value}</strong>${detail ? `<p class="muted">${detail}</p>` : ""}</article>`;
  },
  meter(label, value) {
    return `
      <div class="bar-row">
        <strong>${label}</strong>
        <div class="meter"><div style="width:${value}%"></div></div>
        <span class="muted">${value}%</span>
      </div>
    `;
  },
  pill(text, cls = "") {
    return `<span class="pill ${cls}">${window.ECOSUtils.escape(text)}</span>`;
  },
  card(title, body, meta = "") {
    return `<article class="card"><div class="row"><h3>${title}</h3>${meta}</div>${body}</article>`;
  },
  list(items) {
    return `<ul>${items.map((item) => `<li>${window.ECOSUtils.escape(item)}</li>`).join("")}</ul>`;
  }
};
