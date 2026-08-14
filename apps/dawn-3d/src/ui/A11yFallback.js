/**
 * A11yFallback · a plain-HTML render of every piece of content JSON.
 *
 * Activated by ?a11y=1 or via the "prefers-reduced-motion + no WebGL"
 * fallback path. Keyboard-only, screen-reader-friendly, uses the same
 * content store as the 3D scene so there's exactly one source of truth.
 */
export function renderA11y(root, content) {
  const s = content.site;
  const t = content.team;
  const r = content.rover;

  root.innerHTML = `
    <section>
      <p style="color:var(--accent-hi);text-transform:uppercase;letter-spacing:.24em;font-size:.72rem;font-family:var(--font-mono)">${s.subtitle}</p>
      <h1 style="font-size:clamp(2.4rem,6vw,4rem);margin:.2em 0">${s.name} · ${s.team}</h1>
      <p>${s.mission}</p>
      <p>${s.builtDifferent}</p>
      <p><a href="${s.canonicalUrl}">Classic website</a></p>
    </section>

    <section>
      <h2>Rover · ${r.name}</h2>
      <p>${r.summary}</p>
      <ul>${r.specs.map(x => `<li><b>${x.label}:</b> ${x.value}</li>`).join('')}</ul>
    </section>

    <section>
      <h2>Departments</h2>
      ${content.departments.map(d => `
        <article>
          <h3>${d.name}</h3>
          <p>${d.summary}</p>
          <ul>${d.responsibilities.map(x => `<li>${x}</li>`).join('')}</ul>
        </article>
      `).join('')}
    </section>

    <section>
      <h2>Team (${t.members.length + t.mentors.length + t.patrons.length})</h2>
      <h3>Patrons</h3>
      <ul>${t.patrons.map(p => `<li>${p.name} — ${p.role}</li>`).join('')}</ul>
      <h3>Mentors</h3>
      <ul>${t.mentors.map(m => `<li>${m.name} — ${m.role}</li>`).join('')}</ul>
      <h3>Members</h3>
      <ul>${t.members.map(m => `<li>${m.name} — ${m.role}</li>`).join('')}</ul>
    </section>

    <section>
      <h2>Sponsors</h2>
      ${content.sponsors.tiers.map(tier => `
        <h3>${tier.name}</h3>
        <ul>${tier.sponsors.map(sp => `<li><a href="${sp.url}"><b>${sp.name}</b></a> — ${sp.blurb}</li>`).join('')}</ul>
      `).join('')}
    </section>

    <section>
      <h2>Achievements</h2>
      <ul>${content.achievements.map(a => `<li><b>${a.year} · ${a.title}:</b> ${a.body}</li>`).join('')}</ul>
    </section>

    <section>
      <h2>Timeline</h2>
      <ul>${content.timeline.map(x => `<li><b>${x.date} · ${x.title}:</b> ${x.body}</li>`).join('')}</ul>
    </section>

    <section>
      <h2>Competitions</h2>
      <p>${content.competitions.primary.summary}</p>
      <ul>${content.competitions.tasks.map(x => `<li><b>${x.name}:</b> ${x.blurb}</li>`).join('')}</ul>
    </section>

    <section>
      <h2>Recruitment</h2>
      <p>${content.recruitment.headline} — ${content.recruitment.sub}</p>
      <ol>${content.recruitment.process.map(p => `<li><b>${p.title}:</b> ${p.body}</li>`).join('')}</ol>
    </section>

    <section>
      <h2>FAQ</h2>
      <dl>${content.faq.map(f => `<dt><b>${f.q}</b></dt><dd>${f.a}</dd>`).join('')}</dl>
    </section>

    <section>
      <h2>Contact</h2>
      <p>${content.contact.primary.team} — ${content.contact.primary.institute}<br>${content.contact.primary.address}</p>
      <ul>${content.contact.socials.map(x => `<li><a href="${x.url}">${x.label} · ${x.handle}</a></li>`).join('')}</ul>
    </section>
  `;
  root.hidden = false;
}
