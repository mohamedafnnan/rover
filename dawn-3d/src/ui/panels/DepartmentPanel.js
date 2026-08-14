/**
 * Department panel — reused for every department lab POI.
 * Reads the department id from the POI definition and renders its
 * summary, responsibilities, and roster from content.
 */
export function renderDepartment(content, poi) {
  const dept = content.department(poi.department);
  if (!dept) return `<p>Unknown department: ${poi.department}</p>`;
  const roster = content.membersByDept(dept.id);

  return `
    <div class="pill-row">
      <span class="pill pill--accent" style="color:${dept.color};border-color:${dept.color}">${dept.shortName}</span>
      <span class="pill">${dept.name}</span>
    </div>

    <p>${dept.summary}</p>

    <h3>Responsibilities</h3>
    <ul>
      ${dept.responsibilities.map(r => `<li>${r}</li>`).join('')}
    </ul>

    <h3>Roster (${roster.length})</h3>
    <div class="card-grid">
      ${roster.map(m => `
        <figure>
          <img loading="lazy" src="${m.photo}" alt="${m.name}">
          <figcaption><b>${m.name}</b><span>${m.role}</span></figcaption>
        </figure>
      `).join('')}
    </div>
  `;
}
