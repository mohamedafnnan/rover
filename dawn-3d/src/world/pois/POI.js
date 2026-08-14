import * as THREE from 'three';

/**
 * POI · base class for every point of interest in the world.
 *
 * All POIs share the same silhouette contract:
 *   · a slim vertical holo pillar (visible at long range)
 *   · a proximity halo ring on the ground
 *   · an optional "structure" child provided by subclasses
 *   · an interact radius used by the ProximitySystem
 *
 * Subclasses override `_buildStructure()` to draw their unique geometry.
 */
export class POI {
  constructor(def, terrain) {
    this.id = def.id;
    this.name = def.name;
    this.type = def.type;
    this.panel = def.panel;
    this.department = def.department || null;
    this.color = new THREE.Color(def.color || '#f2a35d');
    this.radius = def.radius || 14;
    this.def = def;

    const [x, z] = def.position;
    const y = terrain.heightAt(x, z);
    this.position = new THREE.Vector3(x, y, z);

    this.group = new THREE.Group();
    this.group.name = `poi:${this.id}`;
    this.group.position.copy(this.position);

    // Ground halo — a translucent ring.
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(this.radius - 0.5, this.radius, 64, 1),
      new THREE.MeshBasicMaterial({
        color: this.color, transparent: true, opacity: 0.25, side: THREE.DoubleSide, depthWrite: false,
      })
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.05;
    this.group.add(ring);
    this.halo = ring;

    // Holo pillar — a tall additive-blended prism visible for miles.
    const pillarHeight = 10;
    const pillar = new THREE.Mesh(
      new THREE.CylinderGeometry(0.15, 0.15, pillarHeight, 6, 1, true),
      new THREE.MeshBasicMaterial({
        color: this.color, transparent: true, opacity: 0.55, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending,
      })
    );
    pillar.position.y = pillarHeight / 2;
    this.group.add(pillar);
    this.pillar = pillar;

    // Sprite label — created lazily by HUD (drawn as CSS in world space).
    this.labelWorldPos = new THREE.Vector3();

    // Subclass-defined body.
    const body = this._buildStructure();
    if (body) this.group.add(body);
  }

  _buildStructure() { return null; }

  /** Called each frame to breathe the pillar/ring. */
  update(_dt, elapsed) {
    const pulse = 0.85 + 0.15 * Math.sin(elapsed * 1.4 + this.position.x);
    this.pillar.material.opacity = 0.4 * pulse + 0.15;
    this.halo.material.opacity = 0.18 * pulse + 0.08;
  }

  /** Distance from a point to the POI on the horizontal plane. */
  distanceTo(vec3) {
    const dx = vec3.x - this.position.x;
    const dz = vec3.z - this.position.z;
    return Math.hypot(dx, dz);
  }
}
