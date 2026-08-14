import * as THREE from 'three';
import { createPOI } from './pois/Structures.js';

/**
 * POIRegistry · reads content/pois.json and materialises every location.
 *
 * Content-driven: adding a new POI is one JSON entry — no code changes
 * as long as the `type` maps to an existing structure factory.
 */
export class POIRegistry {
  /**
   * @param {import('../core/ContentStore.js').ContentStore} content
   * @param {import('./MarsTerrain.js').MarsTerrain} terrain
   */
  constructor(content, terrain) {
    this.pois = [];
    this.group = new THREE.Group();
    this.group.name = 'poi-registry';

    const defs = content.pois.pois;
    const radius = content.pois.radius || 14;
    for (const def of defs) {
      const withRadius = { ...def, radius };
      const poi = createPOI(withRadius, terrain);
      this.pois.push(poi);
      this.group.add(poi.group);
    }
  }

  byId(id) { return this.pois.find(p => p.id === id); }

  update(dt, e) {
    for (const p of this.pois) p.update(dt, e);
  }

  /** Nearest POI to a world position, and its distance. */
  nearest(vec3, maxDist = Infinity) {
    let best = null;
    let bestD = maxDist;
    for (const p of this.pois) {
      const d = p.distanceTo(vec3);
      if (d < bestD) { bestD = d; best = p; }
    }
    return { poi: best, distance: bestD };
  }
}
