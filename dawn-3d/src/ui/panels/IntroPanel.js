export function renderIntro(content) {
  const s = content.site;
  return `
    <p>You have landed in the DAWN inspection world — an optional 3D layer for the FISAT Rover Team's public platform. This scene is meant to complement the main website, not replace it.</p>

    <h3>How to explore</h3>
    <ul>
      <li>Drive with <b>W A S D</b> or arrow keys. <b>Space</b> to brake.</li>
      <li>Approach a marked location and press <b>E</b> to open its dossier.</li>
      <li><b>C</b> cycles the camera through follow, orbit, inspection, and cinematic modes.</li>
    </ul>

    <h3>What is inside this build</h3>
    <ul>
      <li>Mission Control · public overview and mentors.</li>
      <li>Rover Garage · public rover brief.</li>
      <li>Robotic Arm Bay · interactive manipulator inspection.</li>
      <li>Sponsor Plaza · public partner tiers.</li>
      <li>Team Monument · official roster.</li>
    </ul>

    <div class="pill-row">
      <span class="pill pill--accent">${s.tagline}</span>
      <span class="pill">${s.institution}</span>
      <span class="pill">${s.location}</span>
    </div>
    <a class="linkbtn" href="/" target="_self">Main website ↗</a>
  `;
}
