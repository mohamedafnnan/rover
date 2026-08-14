export function renderAchievement(content) {
  const a = content.achievements;
  return `
    <p>Milestones that mark the season. Each is a receipt on years of work — not just this year's team, but every generation of the FISAT Rover Team stacking on top of the last.</p>
    <div class="timeline-list">
      ${a.map(item => `
        <div class="row">
          <div class="dot"></div>
          <div>
            <span>${item.year}</span>
            <b>${item.title}</b>
            <p>${item.body}</p>
            ${item.source ? `<a class="linkbtn" style="margin-top:var(--s-2)" href="${item.source}" target="_blank" rel="noopener">Source ↗</a>` : ''}
          </div>
        </div>
      `).join('')}
    </div>
  `;
}
