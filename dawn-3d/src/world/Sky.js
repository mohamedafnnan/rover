import * as THREE from 'three';

/**
 * Sky · a bespoke Mars sky dome.
 *
 * Real Mars daytime sky is a butterscotch/salmon (high suspended dust
 * particles scatter longer wavelengths); sunsets famously go blue near
 * the sun. Our fragment shader interpolates between three anchor colors
 * along the height ramp and adds a subtle sun disk + halo.
 */
const vertShader = /* glsl */`
  varying vec3 vWorldDir;
  void main() {
    vWorldDir = normalize((modelMatrix * vec4(position, 0.0)).xyz);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const fragShader = /* glsl */`
  precision highp float;
  varying vec3 vWorldDir;
  uniform vec3 uHorizon;
  uniform vec3 uZenith;
  uniform vec3 uNadir;
  uniform vec3 uSun;
  uniform vec3 uSunColor;
  uniform float uTime;

  void main() {
    vec3 dir = normalize(vWorldDir);
    float h = clamp(dir.y * 0.5 + 0.5, 0.0, 1.0);
    // Height ramp: nadir -> horizon -> zenith
    vec3 lower = mix(uNadir, uHorizon, smoothstep(0.0, 0.5, h));
    vec3 upper = mix(uHorizon, uZenith, smoothstep(0.45, 1.0, h));
    vec3 col   = mix(lower, upper, step(0.5, h));

    // Sun disk + halo — Mars famously has a blue-tinted halo around the sun.
    float sun = max(dot(dir, normalize(uSun)), 0.0);
    float halo = pow(sun, 12.0) * 0.45;
    float disk = smoothstep(0.9985, 0.9997, sun);
    col += uSunColor * disk * 4.0;
    col += vec3(0.55, 0.7, 0.9) * halo * 0.35;   // blue halo characteristic of Mars

    // Subtle atmospheric grain to avoid banding.
    float grain = fract(sin(dot(dir.xy, vec2(12.9898, 78.233))) * 43758.5453);
    col += (grain - 0.5) * 0.008;

    gl_FragColor = vec4(col, 1.0);
  }
`;

export class Sky {
  constructor() {
    const geo = new THREE.SphereGeometry(4000, 48, 32);
    this.uniforms = {
      uHorizon:  { value: new THREE.Color(0xe89a5c) },   // dusty peach
      uZenith:   { value: new THREE.Color(0x3a1e12) },   // deep brown-red vault
      uNadir:    { value: new THREE.Color(0x1b0a05) },   // ground haze
      uSun:      { value: new THREE.Vector3(0.6, 0.45, -0.4) },
      uSunColor: { value: new THREE.Color(0xffd28a) },
      uTime:     { value: 0 },
    };
    const mat = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: vertShader,
      fragmentShader: fragShader,
      side: THREE.BackSide,
      depthWrite: false,
    });
    this.mesh = new THREE.Mesh(geo, mat);
    this.mesh.name = 'sky';
  }

  setSunDirection(dir) {
    this.uniforms.uSun.value.copy(dir).normalize();
  }

  update(_dt, elapsed) {
    this.uniforms.uTime.value = elapsed;
  }
}
