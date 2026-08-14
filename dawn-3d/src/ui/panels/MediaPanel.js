export function renderMedia(content) {
  const socials = content.contact.socials;
  const faqs = content.faq;
  return `
    <p>Follow the team, ask a question, or dig through the frequently asked ones below.</p>

    <h4>Channels</h4>
    <div class="pill-row">
      ${socials.map(s => `<a class="linkbtn" href="${s.url}" target="_blank" rel="noopener">${s.label} · ${s.handle} ↗</a>`).join('')}
    </div>

    <h3>Frequently asked</h3>
    ${faqs.map(f => `
      <details style="border-top:1px solid var(--stroke-hair);padding:var(--s-3) 0;">
        <summary style="color:var(--c-white);cursor:pointer;">${f.q}</summary>
        <p style="margin:var(--s-2) 0 0;color:var(--text-muted)">${f.a}</p>
      </details>
    `).join('')}
  `;
}
