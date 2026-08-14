export function renderSponsor(content) {
  const tiers = content.sponsors.tiers;
  const props = content.sponsors.valueProps;
  return `
    <p>DAWN exists because of the industry partners who bet on a student team. Here they are, tiered by investment — and here is the case for joining them.</p>

    ${tiers.map(t => `
      <div class="tier">
        <div class="tier__head"><span style="background:${t.accent}"></span><h4>${t.name}</h4></div>
        ${t.sponsors.map(s => `
          <a class="sponsor-card" href="${s.url}" target="_blank" rel="noopener">
            <div class="sponsor-card__logo"><img loading="lazy" src="${s.logo}" alt="${s.name}"></div>
            <div class="sponsor-card__meta">
              <b>${s.name}</b>
              <p>${s.blurb}</p>
            </div>
          </a>
        `).join('')}
      </div>
    `).join('')}

    <h3>Why sponsor us</h3>
    <ul>
      ${props.map(p => `<li><b style="color:var(--c-white)">${p.title}</b> — ${p.body}</li>`).join('')}
    </ul>
  `;
}
