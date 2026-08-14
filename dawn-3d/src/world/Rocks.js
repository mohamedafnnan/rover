import * as THREE from 'three';

/**
 * Rocks · instanced rock scatter with Poisson-ish jitter.
 *
 * A single InstancedMesh renders ~1200 rocks with per-instance color
 * variation. Each rock is placed on the terrain via the heightmap
 * accessor supplied by MarsTerrain.
 */
export class Rocks {
  constructor(terrain, { count = 1200 } = {}) {
    // Base geometry: an icosahedron with per-vertex jitter for organic silhouettes.
    const proto = new THREE.IcosahedronGeometry(0.5, 0);
    const pos = proto.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const j = (Math.random() - 0.5) * 0.25;
      pos.setXYZ(
        i,
        pos.getX(i) * (1 + j),
        pos.getY(i) * (1 + j * 0.6),
        pos.getZ(i) * (1 + j),
      );
    }
    proto.computeVertexNormals();

    const mat = new THREE.MeshStandardMaterial({
      color: 0x8a4a26,
      roughness: 0.95,
      metalness: 0.02,
      flatShading: true,
    });
    const mesh = new THREE.InstancedMesh(proto, mat, count);
    mesh.castShadow = true;
    mesh.receiveShadow = false;
    mesh.name = 'rock-field';

    const dummy = new THREE.Object3D();
    const colorAttr = new THREE.InstancedBufferAttribute(new Float32Array(count * 3), 3);
    const base = new THREE.Color(0x8a4a26);
    const dark = new THREE.Color(0x3a1a0c);
    const highlight = new THREE.Color(0xc98051);

    // Radial band placement — dense mid, sparse near landing pad.
    const half = terrain.size / 2 - 12;
    let placed = 0, tries = 0;
    while (placed < count && tries < count * 6) {
      tries++;
      const x = (Math.random() * 2 - 1) * half;
      const z = (Math.random() * 2 - 1) * half;
      // Skip a disc around the landing zone.
      if (Math.hypot(x, z) < 14) continue;
      const y = terrain.heightAt(x, z);

      const s = 0.4 + Math.random() * (Math.random() < 0.06 ? 4.2 : 1.4);
      dummy.position.set(x, y + s * 0.35, z);
      dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      dummy.scale.set(s, s * (0.6 + Math.random() * 0.6), s);
      dummy.updateMatrix();
      mesh.setMatrixAt(placed, dummy.matrix);

      const c = base.clone().lerp(dark, Math.random() * 0.6).lerp(highlight, Math.random() * 0.25);
      colorAttr.setXYZ(placed, c.r, c.g, c.b);
      placed++;
    }
    mesh.count = placed;

    // Hook per-instance color into the standard material via onBeforeCompile.
    proto.setAttribute('instanceColor', colorAttr);
    mat.onBeforeCompile = (shader) => {
      shader.vertexShader = 'attribute vec3 instanceColor;\nvarying vec3 vInstanceColor;\n' + shader.vertexShader;
      shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        '#include <begin_vertex>\nvInstanceColor = instanceColor;'
      );
      shader.fragmentShader = 'varying vec3 vInstanceColor;\n' + shader.fragmentShader;
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <color_fragment>',
        '#include <color_fragment>\ndiffuseColor.rgb *= vInstanceColor;'
      );
    };

    this.mesh = mesh;
    this.count = placed;
    this.terrain = terrain;
  }
}
