import * as THREE from 'three';

/**
 * AssetLoader · a thin cache in front of THREE.TextureLoader.
 *
 * DAWN is procedural first — we only use externally-hosted images for
 * team portraits, sponsor logos and rover photos, all sourced from
 * fisatrover.in and referenced in content JSON. Those go through HTML
 * <img> tags (not Three), so this loader is intentionally small.
 */
export class AssetLoader {
  #textureCache = new Map();
  #imgCache = new Map();
  #texLoader = new THREE.TextureLoader();

  loadTexture(url) {
    if (this.#textureCache.has(url)) return this.#textureCache.get(url);
    const tex = this.#texLoader.load(url);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
    this.#textureCache.set(url, tex);
    return tex;
  }

  // Preload HTML images used by the Codex so panels open without flicker.
  preloadImage(url) {
    if (this.#imgCache.has(url)) return this.#imgCache.get(url);
    const p = new Promise((res) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => res(img);
      img.onerror = () => res(null);
      img.src = url;
    });
    this.#imgCache.set(url, p);
    return p;
  }
}

export const assets = new AssetLoader();
