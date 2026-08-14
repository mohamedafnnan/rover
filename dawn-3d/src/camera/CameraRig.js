import * as THREE from 'three';
import { bus } from '../core/EventBus.js';

/**
 * CameraRig · four cinematic camera modes with smooth blending.
 *
 *   FOLLOW      — chase camera behind the rover, subtle spring damping
 *   ORBIT       — free orbit around the rover, mouse-drag on desktop
 *   INSPECTION  — locked onto a POI, slow orbit + gentle bob
 *   CINEMATIC   — sweeping crane shot, used at intro & panorama mission
 *
 * All modes drive a single PerspectiveCamera. Mode switches interpolate
 * position + look-at over 700ms with an ease-in-out curve.
 */
const TMP  = new THREE.Vector3();
const TMP2 = new THREE.Vector3();

export class CameraRig {
  constructor() {
    this.camera = new THREE.PerspectiveCamera(58, window.innerWidth / window.innerHeight, 0.1, 3000);
    this.camera.position.set(-8, 4, 8);
    this.camera.lookAt(0, 1, 0);

    this.mode = 'follow';
    this.target = null;          // rover root
    this.inspectionTarget = null;

    // Transition bookkeeping.
    this._blendT = 1;             // 1 = settled
    this._blendDur = 0.7;
    this._fromPos = new THREE.Vector3();
    this._fromLook = new THREE.Vector3();
    this._toPos = new THREE.Vector3();
    this._toLook = new THREE.Vector3();

    // Orbit state.
    this._orbit = { yaw: 0.6, pitch: 0.42, dist: 9 };
    this._orbitDragging = false;
    this._orbitLastX = 0; this._orbitLastY = 0;

    window.addEventListener('mousedown', (e) => { if (this.mode === 'orbit' && e.button === 0) { this._orbitDragging = true; this._orbitLastX = e.clientX; this._orbitLastY = e.clientY; } });
    window.addEventListener('mousemove', (e) => {
      if (!this._orbitDragging) return;
      const dx = e.clientX - this._orbitLastX;
      const dy = e.clientY - this._orbitLastY;
      this._orbitLastX = e.clientX; this._orbitLastY = e.clientY;
      this._orbit.yaw   -= dx * 0.005;
      this._orbit.pitch = THREE.MathUtils.clamp(this._orbit.pitch - dy * 0.005, 0.1, 1.2);
    });
    window.addEventListener('mouseup', () => { this._orbitDragging = false; });
    window.addEventListener('wheel', (e) => {
      if (this.mode !== 'orbit') return;
      this._orbit.dist = THREE.MathUtils.clamp(this._orbit.dist + e.deltaY * 0.01, 3.5, 22);
    }, { passive: true });
  }

  attachTarget(root) { this.target = root; }

  setMode(mode, opts = {}) {
    if (mode === this.mode && !opts.force) return;
    this._fromPos.copy(this.camera.position);
    // Store current look-at as a small point in front.
    this.camera.getWorldDirection(TMP);
    this._fromLook.copy(this.camera.position).add(TMP.multiplyScalar(5));

    this.mode = mode;
    this.inspectionTarget = opts.target || null;
    this._blendT = 0;
    this._blendDur = opts.duration ?? 0.7;
    bus.emit('camera:mode', { mode });
  }

  cycleMode() {
    const order = ['follow', 'orbit', 'inspection', 'cinematic'];
    const next = order[(order.indexOf(this.mode) + 1) % order.length];
    // Inspection needs a target; skip if none.
    if (next === 'inspection' && !this.inspectionTarget) {
      this.setMode('cinematic');
    } else {
      this.setMode(next);
    }
  }

  update(dt) {
    if (!this.target) return;

    // Compute desired pose for the current mode.
    switch (this.mode) {
      case 'follow':      this._computeFollow(this._toPos, this._toLook); break;
      case 'orbit':       this._computeOrbit(this._toPos, this._toLook); break;
      case 'inspection':  this._computeInspection(this._toPos, this._toLook); break;
      case 'cinematic':   this._computeCinematic(this._toPos, this._toLook); break;
    }

    // Blend from stored start pose toward target.
    if (this._blendT < 1) {
      this._blendT = Math.min(1, this._blendT + dt / this._blendDur);
      const k = easeInOut(this._blendT);
      TMP.copy(this._fromPos).lerp(this._toPos, k);
      TMP2.copy(this._fromLook).lerp(this._toLook, k);
      this.camera.position.copy(TMP);
      this.camera.lookAt(TMP2);
    } else {
      // Simple critically-damped follow for FOLLOW mode; snap for others.
      if (this.mode === 'follow') {
        const alpha = 1 - Math.exp(-dt * 6);
        this.camera.position.lerp(this._toPos, alpha);
        TMP.copy(this.camera.position).add(this._toLook.clone().sub(this.camera.position).multiplyScalar(1));
        this.camera.lookAt(this._toLook);
      } else {
        this.camera.position.copy(this._toPos);
        this.camera.lookAt(this._toLook);
      }
    }
  }

  _computeFollow(outPos, outLook) {
    const r = this.target;
    const heading = -r.rotation.y;                // stored yaw
    const back = new THREE.Vector3(-Math.cos(heading), 0, -Math.sin(heading));
    const up = 3.4;
    outPos.copy(r.position).addScaledVector(back, 7.5).setY(r.position.y + up);
    outLook.copy(r.position).setY(r.position.y + 1.2);
  }

  _computeOrbit(outPos, outLook) {
    const r = this.target;
    const { yaw, pitch, dist } = this._orbit;
    const x = Math.cos(pitch) * Math.cos(yaw) * dist;
    const y = Math.sin(pitch) * dist;
    const z = Math.cos(pitch) * Math.sin(yaw) * dist;
    outPos.set(r.position.x + x, r.position.y + y + 1, r.position.z + z);
    outLook.copy(r.position).setY(r.position.y + 1);
  }

  _computeInspection(outPos, outLook) {
    const t = this.inspectionTarget;
    if (!t) return this._computeFollow(outPos, outLook);
    const time = performance.now() / 1000;
    const a = time * 0.18;
    const dist = 9;
    const height = 3.6;
    outPos.set(t.x + Math.cos(a) * dist, t.y + height + Math.sin(a * 0.6) * 0.4, t.z + Math.sin(a) * dist);
    outLook.copy(t).setY(t.y + 1.5);
  }

  _computeCinematic(outPos, outLook) {
    const r = this.target;
    const time = performance.now() / 1000;
    const a = time * 0.08;
    outPos.set(r.position.x + Math.cos(a) * 22, r.position.y + 12, r.position.z + Math.sin(a) * 22);
    outLook.copy(r.position).setY(r.position.y + 1);
  }
}

function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}
