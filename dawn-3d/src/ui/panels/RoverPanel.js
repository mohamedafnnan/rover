/**
 * Rover Garage — DAWN spec sheet with hero photo and full callouts.
 */
export function renderRover(content) {
  const r = content.rover;
  return `
    <p>${r.summary}</p>
    <figure style="margin:0 0 var(--s-4);border-radius:var(--r-md);overflow:hidden;border:1px solid var(--stroke-hair);">
      <img loading="lazy" src="${r.heroImage}" alt="${r.name}" style="width:100%;display:block;">
    </figure>

    <h4>Callsign</h4>
    <div class="pill-row"><span class="pill pill--accent">${r.callsign}</span><span class="pill">${r.season}</span></div>

    <h4>Specification</h4>
    <div class="spec-grid">
      ${r.specs.map(s => `
        <div class="cell">
          <div class="k">${s.label}</div>
          <div class="v">${s.value}</div>
        </div>`).join('')}
    </div>

    <h4>Detail view</h4>
    <figure style="margin:0;border-radius:var(--r-md);overflow:hidden;border:1px solid var(--stroke-hair);">
      <img loading="lazy" src="${r.galleryImage}" alt="${r.name} · detail" style="width:100%;display:block;">
    </figure>
  `;
}
