import * as THREE from 'three';
import { bus } from '../core/EventBus.js';

/**
 * ScanSystem · a lightweight rock-scan mini-interaction.
 *
 * Every rock instance is a potential scan target. On demand, we pick
 * the closest N rocks to the rover, mark them with a floating beacon,
 * and count scans as the rover drives through each beacon's radius.
 */
export class ScanSystem {
  constructor(rocks, terrain, rover, { spawn = 3 } = {}) {
    this.rocks = rocks;
    this.terrain = terrain;
    this.rover = rover;
    this.group = new THREE.Group();
    this.group.name = 'scan-beacons';
    this.targets = [];
    this._spawn = spawn;
    this._deployed = false;
    this._scanned = 0;
  }

  deploy() {
    if (this._deployed) return;
    // Spawn beacons at random spots within a mid-range disc from rover.
    for (let i = 0; i < this._spawn; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = 20 + Math.random() * 40;
      const x = this.rover.root.position.x + Math.cos(a) * r;
      const z = this.rover.root.position.z + Math.sin(a) * r;
      const y = this.terrain.heightAt(x, z);
      const beacon = new THREE.Mesh(
        new THREE.ConeGeometry(0.4, 1.6, 12),
        new THREE.MeshBasicMaterial({ color: 0x7fd0d4, transparent: true, opacity: 0.85 })
      );
      beacon.position.set(x, y + 1.2, z);
      beacon.userData.scanned = false;
      this.group.add(beacon);
      this.targets.push(beacon);
    }
    this._deployed = true;
    bus.emit('toast', { text: 'Scan beacons deployed · drive into each beacon.' });
  }

  update(_dt, elapsed) {
    if (!this._deployed) return;
    for (const b of this.targets) {
      if (b.userData.scanned) continue;
      b.rotation.y = elapsed * 1.4;
      b.position.y = this.terrain.heightAt(b.position.x, b.position.z) + 1.2 + Math.sin(elapsed * 3) * 0.08;
      const dx = b.position.x - this.rover.root.position.x;
      const dz = b.position.z - this.rover.root.position.z;
      if (Math.hypot(dx, dz) < 3.5) {
        b.userData.scanned = true;
        b.material.color.set(0xf5c96b);
        this._scanned++;
        bus.emit('toast', { text: `Sample logged (${this._scanned}/${this.targets.length}).` });
        if (this._scanned >= this.targets.length) {
          bus.emit('mission:complete', { id: 'sample-hunt' });
        }
      }
    }
  }
}
