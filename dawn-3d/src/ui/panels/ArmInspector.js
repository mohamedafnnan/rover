import { bus } from '../../core/EventBus.js';

/**
 * ArmInspector · interactive callouts for the robotic arm's joints.
 *
 * Each callout row is a slider that sets a joint angle via
 * `bus.emit('arm:setJoint', ...)`. App wires this to the rover arm.
 */
export function renderArm(content) {
  const arm = content.rover.armCallouts;
  const el = document.createElement('div');
  el.className = 'arm-inspector';
  el.innerHTML = `
    <p style="margin-bottom:var(--s-5)">A 5-DOF manipulator with a compliant gripper. Move each joint below — the rover parked outside will move in sync.</p>
    ${arm.map(a => `
      <div class="joint" data-joint="${a.joint}">
        <div>
          <b>${a.label}</b>
          <small>${a.note}</small>
          <input type="range" min="-1.4" max="1.4" step="0.02" value="0" style="width:100%;margin-top:6px;accent-color:var(--accent-hi);" />
        </div>
        <span class="code">${a.joint}</span>
      </div>
    `).join('')}
    <div style="margin-top:var(--s-4);display:flex;gap:var(--s-2);">
      <button class="linkbtn" id="arm-home">Home pose</button>
      <button class="linkbtn" id="arm-reach">Reach forward</button>
    </div>
  `;

  el.querySelectorAll('.joint').forEach(row => {
    const joint = row.dataset.joint;
    const slider = row.querySelector('input');
    if (joint === 'gripper') {
      slider.min = '0'; slider.max = '1'; slider.step = '0.01'; slider.value = '0.5';
    }
    slider.addEventListener('input', () => {
      row.classList.add('is-active');
      const v = parseFloat(slider.value);
      bus.emit('arm:setJoint', { joint, value: v });
    });
    slider.addEventListener('change', () => setTimeout(() => row.classList.remove('is-active'), 400));
  });

  el.querySelector('#arm-home').addEventListener('click', () => {
    const pose = { 'shoulder-yaw': 0.0, 'shoulder-pitch': -0.9, 'elbow': 1.4, 'wrist-pitch': -0.4, 'wrist-roll': 0, 'gripper': 0.5 };
    bus.emit('arm:pose', { pose });
    resetSliders(el, pose);
  });
  el.querySelector('#arm-reach').addEventListener('click', () => {
    const pose = { 'shoulder-yaw': 0.0, 'shoulder-pitch': 0.2, 'elbow': 0.3, 'wrist-pitch': 0.0, 'wrist-roll': 0.3, 'gripper': 0.9 };
    bus.emit('arm:pose', { pose });
    resetSliders(el, pose);
  });

  return el;
}

function resetSliders(root, pose) {
  root.querySelectorAll('.joint').forEach(row => {
    const j = row.dataset.joint;
    if (pose[j] !== undefined) row.querySelector('input').value = pose[j];
  });
}
