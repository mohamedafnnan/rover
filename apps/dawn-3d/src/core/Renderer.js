import * as THREE from 'three';

/**
 * Renderer · the ONE and ONLY WebGLRenderer in the app.
 *
 * Also owns the tone-mapping, output color space, shadow config, and
 * viewport resizing. Everything else is instantiated once and reused.
 */
export class Renderer {
  constructor(canvas) {
    // Adaptive DPR: we cap at 1.75 on high-DPI screens and drop to 1 on
    // integrated GPUs to hit the 60fps floor.
    this.canvas = canvas;
    const gl = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      powerPreference: 'high-performance',
      alpha: false,
      stencil: false,
    });

    gl.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    gl.setSize(window.innerWidth, window.innerHeight, false);
    gl.outputColorSpace = THREE.SRGBColorSpace;
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = 1.05;
    gl.shadowMap.enabled = true;
    gl.shadowMap.type = THREE.PCFSoftShadowMap;
    gl.setClearColor(0x0a0605, 1);

    this.gl = gl;
    this._onResize = this.resize.bind(this);
    window.addEventListener('resize', this._onResize);
    window.addEventListener('orientationchange', this._onResize);
  }

  resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.gl.setSize(w, h, false);
    if (this.camera) {
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
    }
  }

  attachCamera(camera) {
    this.camera = camera;
    this.resize();
  }

  render(scene, camera) {
    this.gl.render(scene, camera);
  }

  dispose() {
    window.removeEventListener('resize', this._onResize);
    window.removeEventListener('orientationchange', this._onResize);
    this.gl.dispose();
  }
}
