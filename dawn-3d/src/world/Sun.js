import * as THREE from 'three';

/**
 * Sun · a directional light + soft ambient, tied to the Sky shader.
 *
 * The direction is chosen for a golden-hour Martian look with long
 * shadows east of every rock.
 */
export class Sun {
  constructor() {
    this.group = new THREE.Group();
    this.group.name = 'sun-rig';

    this.direction = new THREE.Vector3(0.55, 0.45, -0.4).normalize();

    // Warm key light.
    this.key = new THREE.DirectionalLight(0xffb078, 2.4);
    this.key.position.copy(this.direction).multiplyScalar(200);
    this.key.castShadow = true;
    this.key.shadow.mapSize.set(2048, 2048);
    this.key.shadow.camera.near = 0.5;
    this.key.shadow.camera.far  = 500;
    const s = 120;
    this.key.shadow.camera.left = -s;
    this.key.shadow.camera.right = s;
    this.key.shadow.camera.top = s;
    this.key.shadow.camera.bottom = -s;
    this.key.shadow.bias = -0.0004;
    this.key.shadow.normalBias = 0.4;

    // Rim/fill from the opposite side, cool.
    this.rim = new THREE.DirectionalLight(0x6a86a8, 0.35);
    this.rim.position.set(-this.direction.x, this.direction.y * 0.6, -this.direction.z).multiplyScalar(200);

    // Ambient dust glow.
    this.ambient = new THREE.HemisphereLight(0xd9a97b, 0x2a140a, 0.45);

    this.group.add(this.key, this.rim, this.ambient);
  }

  /** Optional: recentre shadow camera on rover for stable shadow coverage. */
  followTarget(x, z) {
    this.key.position.set(x + this.direction.x * 200, this.direction.y * 200, z + this.direction.z * 200);
    this.key.target.position.set(x, 0, z);
    this.key.target.updateMatrixWorld();
  }
}
