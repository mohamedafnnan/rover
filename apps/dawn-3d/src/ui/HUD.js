import * as THREE from 'three';
import { bus } from '../core/EventBus.js';

/**
 * HUD · lightweight HTML overlay above the WebGL canvas.
 *
 * Composed of four corners + a top-center compass + a right-side minimap.
 * Everything is styled from hud.css and updated once per frame.
 */
export class HUD {
  constructor(root, rover, registry, terrain, sitename = 'DAWN') {
    this.rover = rover;
    this.registry = registry;
    this.terrain = terrain;

    this.el = document.createElement('div');
    this.el.className = 'hud';
    this.el.innerHTML = `
      <div class="hud__corner hud__corner--tl">
        <div class="hud__brand"><strong>${sitename}</strong><span>· FISAT Rover Team</span></div>
        <div class="hud__pill" id="hud-mode-pill">follow camera</div>
      </div>
      <div class="compass"><div class="compass__strip" id="compass-strip"></div><div class="compass__needle"></div></div>
      <div class="hud__corner hud__corner--tr">
        <div class="minimap">
          <div class="minimap__title">Terrain Map</div>
          <canvas class="minimap__canvas" id="minimap" width="336" height="336"></canvas>
        </div>
      </div>
      <div class="hud__corner hud__corner--bl">
        <div class="telem">
          <div class="telem__cell"><div class="telem__label">Speed</div><div class="telem__value" id="telem-speed">0.0</div><div class="telem__unit">m/s</div></div>
          <div class="telem__cell"><div class="telem__label">Heading</div><div class="telem__value" id="telem-heading">000</div><div class="telem__unit">deg</div></div>
          <div class="telem__cell"><div class="telem__label">Coord</div><div class="telem__value" id="telem-coord">0 · 0</div><div class="telem__unit">world</div></div>
        </div>
      </div>
      <div class="hud__corner hud__corner--br">
        <div class="hud__pill" id="hud-poi-pill" style="display:none">nearby</div>
      </div>
    `;
    root.appendChild(this.el);

    this.speedEl   = this.el.querySelector('#telem-speed');
    this.headEl    = this.el.querySelector('#telem-heading');
    this.coordEl   = this.el.querySelector('#telem-coord');
    this.modePill  = this.el.querySelector('#hud-mode-pill');
    this.poiPill   = this.el.querySelector('#hud-poi-pill');
    this.strip     = this.el.querySelector('#compass-strip');
    this.minimap   = this.el.querySelector('#minimap');
    this.mmCtx     = this.minimap.getContext('2d');

    // Compass strip content: repeating N/E/S/W with degrees between.
    this._buildCompass();

    // Bus wiring.
    bus.on('camera:mode', ({ mode }) => { this.modePill.textContent = `${mode} camera`; });
    bus.on('poi:near', ({ poi }) => {
      this.poiPill.style.display = '';
      this.poiPill.textContent = `nearby · ${poi.name}`;
    });
    bus.on('poi:far', () => {
      this.poiPill.style.display = 'none';
      this.poiPill.textContent = '';
    });

    this._paintMinimapBase();
  }

  _buildCompass() {
    const marks = ['N', '30', '60', 'E', '120', '150', 'S', '210', '240', 'W', '300', '330'];
    let html = '';
    // Repeat 3× so we can shift continuously.
    for (let rep = 0; rep < 3; rep++) {
      for (const m of marks) {
        const isCard = ['N','E','S','W'].includes(m);
        html += `<span class="${isCard ? 'card' : ''}">${m}</span>`;
      }
    }
    this.strip.innerHTML = html;
    // Measure once.
    requestAnimationFrame(() => {
      this._stripWidth = this.strip.scrollWidth / 3;
    });
  }

  _paintMinimapBase() {
    // Pre-bake terrain background at low res.
    const ctx = this.mmCtx;
    const W = this.minimap.width, H = this.minimap.height;
    const N = this.terrain.segs + 1;
    const img = ctx.createImageData(W, H);
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const u = (x / W) * (N - 1) | 0;
        const v = (y / H) * (N - 1) | 0;
        const h = this.terrain.heights[v * N + u];
        // Ramp: low = dark, high = pale.
        const t = Math.max(0, Math.min(1, (h + 6) / 20));
        const r = 60 + t * 140, g = 30 + t * 60, b = 20 + t * 30;
        const idx = (y * W + x) * 4;
        img.data[idx]     = r;
        img.data[idx + 1] = g;
        img.data[idx + 2] = b;
        img.data[idx + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
    // Vignette.
    const grd = ctx.createRadialGradient(W/2, H/2, W*0.2, W/2, H/2, W*0.55);
    grd.addColorStop(0, 'rgba(0,0,0,0)');
    grd.addColorStop(1, 'rgba(0,0,0,0.6)');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, W, H);

    // Cache the base for compositing per-frame overlays.
    this._minimapBase = ctx.getImageData(0, 0, W, H);
  }

  update() {
    const r = this.rover;
    // Telemetry
    this.speedEl.textContent = Math.abs(r.speed).toFixed(1);
    const headDeg = ((-r.heading * 180 / Math.PI) % 360 + 360) % 360;
    this.headEl.textContent = String(Math.round(headDeg)).padStart(3, '0');
    this.coordEl.textContent = `${Math.round(r.root.position.x)} · ${Math.round(r.root.position.z)}`;

    // Compass strip: shift so needle points to headDeg.
    if (this._stripWidth) {
      const t = (headDeg / 360) * this._stripWidth;
      this.strip.style.transform = `translate(calc(-${t}px + 50%), -50%)`;
    }

    // Minimap update.
    const ctx = this.mmCtx;
    ctx.putImageData(this._minimapBase, 0, 0);
    const W = this.minimap.width, H = this.minimap.height;
    const half = this.terrain.half;

    // POIs.
    for (const poi of this.registry.pois) {
      const mx = ((poi.position.x + half) / this.terrain.size) * W;
      const my = ((poi.position.z + half) / this.terrain.size) * H;
      ctx.fillStyle = '#f2a35d';
      ctx.beginPath(); ctx.arc(mx, my, 3, 0, Math.PI * 2); ctx.fill();
    }
    // Rover.
    const rx = ((r.root.position.x + half) / this.terrain.size) * W;
    const ry = ((r.root.position.z + half) / this.terrain.size) * H;
    ctx.save();
    ctx.translate(rx, ry);
    ctx.rotate(r.heading);
    ctx.fillStyle = '#7fd0d4';
    ctx.beginPath();
    ctx.moveTo(6, 0); ctx.lineTo(-4, 4); ctx.lineTo(-4, -4); ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
}
