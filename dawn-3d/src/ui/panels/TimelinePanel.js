export function renderTimeline(content) {
  const t = content.timeline;
  return `
    <p>The season, from kickoff to finals.</p>
    <div class="timeline-list">
      ${t.map(item => `
        <div class="row">
          <div class="dot"></div>
          <div>
            <span>${item.date}</span>
            <b>${item.title}</b>
            <p>${item.body}</p>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}
