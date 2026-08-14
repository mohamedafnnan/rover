import * as THREE from 'three';
import { bus } from '../core/EventBus.js';

/**
 * DustStorm · a triggerable planet-scale event.
 *
 * The storm is a translucent radial fog layer + a temporarily reduced
 * sun exposure. Bus events `storm:start` / `storm:end` toggle it.
 * The visual is intentionally cinematic, not physically simulated.
 */
export class DustStorm {
  constructor(renderer, sun) {
    this.renderer = renderer;
    this.sun = sun;
    this.active = false;
    this.intensity = 0;
    this.target = 0;

    // Big translucent sphere around the rover.
    const geo = new THREE.SphereGeometry(300, 32, 24);
    const mat = new THREE.MeshBasicMaterial({
      color: 0xc8845a,
      transparent: true,
      opacity: 0,
      side: THREE.BackSide,
      depthWrite: false,
      fog: false,
    });
    this.mesh = new THREE.Mesh(geo, mat);
    this.mesh.name = 'dust-storm-vol';
    this.mesh.frustumCulled = false;

    bus.on('storm:start', () => this.start());
    bus.on('storm:end',   () => this.end());
  }

  start() { this.active = true;  this.target = 1; }
  end()   { this.active = false; this.target = 0; }

  followTarget(x, z) {
    this.mesh.position.set(x, 0, z);
  }

  update(dt) {
    // Ease intensity toward target.
    this.intensity += (this.target - this.intensity) * Math.min(1, dt * 0.6);
    this.mesh.material.opacity = this.intensity * 0.62;
    if (this.sun) {
      // Dim the key light while the storm is thick.
      this.sun.key.intensity = THREE.MathUtils.lerp(2.4, 0.7, this.intensity);
      this.sun.rim.intensity = THREE.MathUtils.lerp(0.35, 0.15, this.intensity);
    }
    this.renderer.gl.toneMappingExposure = THREE.MathUtils.lerp(1.05, 0.75, this.intensity);
  }
}
