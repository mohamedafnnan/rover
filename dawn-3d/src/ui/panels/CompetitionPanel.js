export function renderCompetition(content) {
  const c = content.competitions.primary;
  const tasks = content.competitions.tasks;
  return `
    <p>${c.summary}</p>

    <h4>Current campaign</h4>
    <div class="pill-row">
      <span class="pill pill--accent">${c.acronym}</span>
      <span class="pill">${c.role}</span>
    </div>

    <h4>Task categories</h4>
    <ul>
      ${tasks.map(t => `<li><b style="color:var(--c-white)">${t.name}</b> — ${t.blurb}</li>`).join('')}
    </ul>

    <h4>Progress log</h4>
    <div class="timeline-list">
      ${c.milestones.map(m => `
        <div class="row">
          <div class="dot"></div>
          <div>
            <span>${m.day}</span>
            <b>${m.title}</b>
            <p>${m.note}</p>
          </div>
        </div>
      `).join('')}
    </div>

    <a class="linkbtn" href="${c.referenceUrl}" target="_blank" rel="noopener">Full progress log ↗</a>
  `;
}
