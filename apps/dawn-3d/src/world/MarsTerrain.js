import * as THREE from 'three';

/**
 * MarsTerrain · a procedural heightfield.
 *
 * We author a single-precision Float32Array height map with fBm-style
 * layered noise + a shallow bowl bias so the Landing Zone is naturally
 * lower and rims rise around the world edge. The mesh is a PlaneGeometry
 * whose vertices are displaced from this height map; the same array is
 * reused at runtime by RoverPhysics for bilinear-sampled wheel raycasts.
 *
 * The material is a customised MeshStandardMaterial patched via
 * onBeforeCompile to add slope-based rock darkening and vertical dust
 * banding — no textures needed.
 */
export class MarsTerrain {
  /**
   * @param {number} size    world size in units (e.g. 800)
   * @param {number} segs    tesselation resolution (e.g. 220)
   */
  constructor(size = 800, segs = 220) {
    this.size = size;
    this.segs = segs;
    this.half = size / 2;

    // -------- height field --------
    const N = segs + 1;
    this.heights = new Float32Array(N * N);
    this._buildHeights();

    // -------- geometry --------
    const geo = new THREE.PlaneGeometry(size, size, segs, segs);
    geo.rotateX(-Math.PI / 2);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      // The row-major index in `heights` matches PlaneGeometry vertex order.
      pos.setY(i, this.heights[i]);
    }
    geo.computeVertexNormals();
    this.geometry = geo;

    // -------- material --------
    this.material = new THREE.MeshStandardMaterial({
      color: 0xa85a2c,
      roughness: 1.0,
      metalness: 0.0,
      flatShading: false,
    });
    // Slope + altitude shading via a lightweight vertex-color trick.
    this._paintVertexColors();

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.receiveShadow = true;
    this.mesh.name = 'mars-terrain';
  }

  _buildHeights() {
    const N = this.segs + 1;
    // Simple deterministic value-noise fBm — no third-party libs.
    const seed = 1337;
    const noise = (x, y) => {
      // Hash-based pseudo-random.
      const s = Math.sin(x * 127.1 + y * 311.7 + seed) * 43758.5453;
      return s - Math.floor(s);
    };
    const smoothNoise = (x, y) => {
      const xi = Math.floor(x), yi = Math.floor(y);
      const xf = x - xi,        yf = y - yi;
      const a = noise(xi, yi),     b = noise(xi + 1, yi);
      const c = noise(xi, yi + 1), d = noise(xi + 1, yi + 1);
      const u = xf * xf * (3 - 2 * xf);
      const v = yf * yf * (3 - 2 * yf);
      return a * (1 - u) * (1 - v) + b * u * (1 - v) + c * (1 - u) * v + d * u * v;
    };
    const fbm = (x, y) => {
      let amp = 1, freq = 1, sum = 0, norm = 0;
      for (let o = 0; o < 5; o++) {
        sum += smoothNoise(x * freq, y * freq) * amp;
        norm += amp;
        amp *= 0.5;
        freq *= 2.02;
      }
      return sum / norm;
    };

    for (let j = 0; j < N; j++) {
      for (let i = 0; i < N; i++) {
        const u = (i / (N - 1)) * 2 - 1;   // -1 .. 1
        const v = (j / (N - 1)) * 2 - 1;
        // Big soft dunes.
        const dunes = (fbm(u * 2.4, v * 2.4) - 0.5) * 14;
        // Medium roughness.
        const rough = (fbm(u * 6.5 + 11, v * 6.5 - 7) - 0.5) * 5;
        // High-frequency pebble noise.
        const grain = (fbm(u * 22 + 33, v * 22 + 5) - 0.5) * 1.2;

        // Distance-from-center bowl bias: rim rises, landing zone is flat.
        const r = Math.min(1, Math.hypot(u, v));
        const bowl = Math.pow(r, 2.1) * 10;
        const centerFlatten = Math.exp(-r * r * 6) * -0.9; // slight dip

        // Landing pad — flatten a small disc around origin.
        const padR = 0.04;
        const pad = Math.exp(-(r * r) / (padR * padR)) * 1;
        const h = (dunes + rough + grain + bowl + centerFlatten) * (1 - pad) + pad * 0.0;

        this.heights[j * N + i] = h;
      }
    }
  }

  _paintVertexColors() {
    const N = this.segs + 1;
    const colors = new Float32Array(N * N * 3);
    const base   = new THREE.Color(0xa85a2c);
    const dark   = new THREE.Color(0x5d2d14);
    const highlight = new THREE.Color(0xd68f52);
    const rim    = new THREE.Color(0x743214);

    for (let j = 0; j < N; j++) {
      for (let i = 0; i < N; i++) {
        const idx = j * N + i;
        const h = this.heights[idx];
        // approx slope via neighbours
        const hL = this.heights[j * N + Math.max(0, i - 1)];
        const hR = this.heights[j * N + Math.min(N - 1, i + 1)];
        const hU = this.heights[Math.max(0, j - 1) * N + i];
        const hD = this.heights[Math.min(N - 1, j + 1) * N + i];
        const slope = Math.min(1, Math.hypot(hR - hL, hD - hU) * 0.6);

        const u = (i / (N - 1)) * 2 - 1;
        const v = (j / (N - 1)) * 2 - 1;
        const r = Math.hypot(u, v);

        const c = base.clone();
        c.lerp(dark, slope * 0.6);
        c.lerp(highlight, THREE.MathUtils.clamp((h + 2) * 0.06, 0, 0.45));
        c.lerp(rim, THREE.MathUtils.clamp((r - 0.7) * 2, 0, 0.7));

        colors[idx * 3]     = c.r;
        colors[idx * 3 + 1] = c.g;
        colors[idx * 3 + 2] = c.b;
      }
    }
    this.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    this.material.vertexColors = true;
  }

  /**
   * Bilinear height sample in world space.
   * Called every physics tick by RoverPhysics; must be fast.
   */
  heightAt(x, z) {
    const N = this.segs + 1;
    const s = this.size;
    const fx = (x + this.half) / s * (N - 1);
    const fz = (z + this.half) / s * (N - 1);
    if (fx < 0 || fz < 0 || fx > N - 1 || fz > N - 1) return 0;

    const ix = Math.floor(fx), iz = Math.floor(fz);
    const tx = fx - ix, tz = fz - iz;
    const h00 = this.heights[iz * N + ix];
    const h10 = this.heights[iz * N + Math.min(N - 1, ix + 1)];
    const h01 = this.heights[Math.min(N - 1, iz + 1) * N + ix];
    const h11 = this.heights[Math.min(N - 1, iz + 1) * N + Math.min(N - 1, ix + 1)];
    const h0 = h00 * (1 - tx) + h10 * tx;
    const h1 = h01 * (1 - tx) + h11 * tx;
    return h0 * (1 - tz) + h1 * tz;
  }

  /** Approximate surface normal — useful for aligning rover suspension. */
  normalAt(x, z, eps = 1.0) {
    const hL = this.heightAt(x - eps, z);
    const hR = this.heightAt(x + eps, z);
    const hD = this.heightAt(x, z - eps);
    const hU = this.heightAt(x, z + eps);
    const n = new THREE.Vector3(hL - hR, 2 * eps, hD - hU);
    return n.normalize();
  }
}
