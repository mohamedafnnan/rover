export function renderComms() {
  return `
    <p>This station represents the communications layer behind rover operations. The public site confirms DAWN as a competition rover program, but detailed public documentation for radios, network topology, and operational handoff is not currently published.</p>

    <h3>Publicly safe reading</h3>
    <div class="spec-grid">
      <div class="cell"><div class="k">Purpose</div><div class="v">Ground-to-rover coordination</div></div>
      <div class="cell"><div class="k">Status</div><div class="v">Competition-critical subsystem</div></div>
      <div class="cell"><div class="k">Detail level</div><div class="v">High-level public summary only</div></div>
      <div class="cell"><div class="k">Next step</div><div class="v">Team-only technical brief for exact architecture</div></div>
    </div>
  `;
}
