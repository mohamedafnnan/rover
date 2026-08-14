/**
 * Mission Control panel — the team overview.
 * Pulls mission statement, patrons, mentors from content JSON.
 */
export function renderMissionControl(content) {
  const s = content.site;
  const patrons = content.team.patrons;
  const mentors = content.team.mentors;
  return `
    <p>${s.mission}</p>

    <h3>Built Differently</h3>
    <p>${s.builtDifferent}</p>

    <h4>Patrons</h4>
    <div class="card-grid">
      ${patrons.map(p => `
        <figure>
          <img loading="lazy" src="${p.photo}" alt="${p.name}">
          <figcaption><b>${p.name}</b><span>${p.role}</span></figcaption>
        </figure>
      `).join('')}
    </div>

    <h4>Mentors</h4>
    <div class="card-grid">
      ${mentors.map(m => `
        <figure>
          <img loading="lazy" src="${m.photo}" alt="${m.name}">
          <figcaption><b>${m.name}</b><span>${m.role}</span></figcaption>
        </figure>
      `).join('')}
    </div>

    <h4>Reach us</h4>
    <div class="pill-row">
      ${content.contact.socials.map(soc => `<a class="pill" href="${soc.url}" target="_blank" rel="noopener">${soc.label} · ${soc.handle}</a>`).join('')}
    </div>
  `;
}
