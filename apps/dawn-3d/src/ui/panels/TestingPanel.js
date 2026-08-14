import { bus } from '../../core/EventBus.js';

export function renderTesting() {
  const el = document.createElement('div');
  el.innerHTML = `
    <p>The testing area is presented as the rover-validation zone. Public materials confirm that the team designs, builds, and tests DAWN for Mars-analogue competition environments, but detailed test procedures are intentionally not overstated here.</p>

    <h3>Try the scene systems</h3>
    <div class="pill-row">
      <button class="linkbtn" id="deploy-scan">Deploy scene beacons</button>
      <button class="linkbtn" id="start-storm">Trigger dust storm</button>
      <button class="linkbtn" id="end-storm">Clear weather</button>
    </div>

    <h3>What this stop communicates</h3>
    <ul>
      <li>DAWN is built for rough-terrain competition environments.</li>
      <li>The team combines mechanical, electrical, software, and testing work.</li>
      <li>Detailed performance data should come from internal team documentation, not this public scene.</li>
    </ul>
  `;
  el.querySelector('#deploy-scan').addEventListener('click', () => bus.emit('scan:deploy'));
  el.querySelector('#start-storm').addEventListener('click', () => bus.emit('storm:start'));
  el.querySelector('#end-storm').addEventListener('click', () => bus.emit('storm:end'));
  return el;
}
