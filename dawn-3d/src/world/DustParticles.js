import * as THREE from 'three';

/**
 * DustParticles · a GPU-friendly Points cloud of low-hanging dust motes.
 *
 * Each particle drifts on a soft sinusoidal breeze; particles that leave
 * the world radius wrap around. All motion happens in the vertex shader
 * — no per-frame CPU work.
 */
const vert = /* glsl */`
  attribute float aSeed;
  uniform float uTime;
  uniform float uSize;
  uniform float uArea;
  varying float vAlpha;

  void main() {
    vec3 p = position;
    float t = uTime * 0.15;
    p.x += sin(t * 0.6 + aSeed * 12.0) * 6.0;
    p.z += cos(t * 0.7 + aSeed * 8.0)  * 6.0;
    p.y += sin(t + aSeed * 4.0) * 0.6;

    // Wrap around the world extent for infinite scroll.
    p.x = mod(p.x + uArea * 0.5, uArea) - uArea * 0.5;
    p.z = mod(p.z + uArea * 0.5, uArea) - uArea * 0.5;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * (300.0 / -mv.z);

    // Fade with distance.
    float dist = length(mv.xyz);
    vAlpha = smoothstep(220.0, 30.0, dist) * 0.55;
  }
`;
const frag = /* glsl */`
  precision mediump float;
  varying float vAlpha;
  uniform vec3 uColor;
  void main() {
    // Soft round point.
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    float a = smoothstep(0.5, 0.0, d) * vAlpha;
    if (a < 0.01) discard;
    gl_FragColor = vec4(uColor, a);
  }
`;

export class DustParticles {
  constructor({ count = 3500, area = 800 } = {}) {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const seeds     = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * area;
      positions[i * 3 + 1] = Math.random() * 12 + 0.3;
      positions[i * 3 + 2] = (Math.random() - 0.5) * area;
      seeds[i] = Math.random();
    }
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('aSeed',    new THREE.BufferAttribute(seeds, 1));

    this.uniforms = {
      uTime:  { value: 0 },
      uSize:  { value: 8.0 },
      uArea:  { value: area },
      uColor: { value: new THREE.Color(0xd9a276) },
    };
    const mat = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: vert,
      fragmentShader: frag,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    this.points = new THREE.Points(geo, mat);
    this.points.frustumCulled = false;
    this.points.name = 'dust-particles';
  }

  update(_dt, elapsed) {
    this.uniforms.uTime.value = elapsed;
  }
}
