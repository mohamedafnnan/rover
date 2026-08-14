export function renderTeam(content) {
  const t = content.team;
  const depts = content.departments;
  const total = t.members.length + t.mentors.length + t.patrons.length;

  return `
    <p>Every human behind DAWN. Roles map to the departments you can visit around the world; each portrait lists the sub-team the person contributes to.</p>

    <div class="pill-row">
      <span class="pill pill--accent">${total} people</span>
      <span class="pill">${depts.length} departments</span>
      <span class="pill">1 mission</span>
    </div>

    <h3>Patrons</h3>
    <div class="card-grid">
      ${t.patrons.map(p => `
        <figure>
          <img loading="lazy" src="${p.photo}" alt="${p.name}">
          <figcaption><b>${p.name}</b><span>${p.role}</span></figcaption>
        </figure>`).join('')}
    </div>

    <h3>Mentors</h3>
    <div class="card-grid">
      ${t.mentors.map(m => `
        <figure>
          <img loading="lazy" src="${m.photo}" alt="${m.name}">
          <figcaption><b>${m.name}</b><span>${m.role}</span></figcaption>
        </figure>`).join('')}
    </div>

    <h3>Team</h3>
    <div class="card-grid">
      ${t.members.map(m => `
        <figure>
          <img loading="lazy" src="${m.photo}" alt="${m.name}">
          <figcaption><b>${m.name}</b><span>${m.role}</span></figcaption>
        </figure>`).join('')}
    </div>
  `;
}
