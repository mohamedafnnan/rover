import * as THREE from 'three';
import { MarsTerrain } from './MarsTerrain.js';
import { Sky } from './Sky.js';
import { Sun } from './Sun.js';
import { DustParticles } from './DustParticles.js';
import { DustStorm } from './DustStorm.js';
import { Rocks } from './Rocks.js';
import { POIRegistry } from './POIRegistry.js';

/**
 * World · the scene graph root and holder of every environmental system.
 *
 * A single THREE.Scene owns:
 *   sky, sun rig, terrain, rocks, POI registry, dust particles,
 *   dust-storm volume, and a fog for depth.
 *
 * Everything else (rover, camera) is added by App.
 */
export class World {
  constructor(renderer, content) {
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x2a1408, 0.005);
    this.scene.background = new THREE.Color(0x1a0d08);

    this.terrain = new MarsTerrain(800, 220);
    this.scene.add(this.terrain.mesh);

    this.sky = new Sky();
    this.scene.add(this.sky.mesh);

    this.sun = new Sun();
    this.scene.add(this.sun.group);
    this.sky.setSunDirection(this.sun.direction);

    this.rocks = new Rocks(this.terrain, { count: 1100 });
    this.scene.add(this.rocks.mesh);

    this.dust = new DustParticles({ count: 3500, area: 800 });
    this.scene.add(this.dust.points);

    this.storm = new DustStorm(renderer, this.sun);
    this.scene.add(this.storm.mesh);

    this.pois = new POIRegistry(content, this.terrain);
    this.scene.add(this.pois.group);
  }

  update(dt, elapsed, roverPos) {
    this.sky.update(dt, elapsed);
    this.dust.update(dt, elapsed);
    this.pois.update(dt, elapsed);
    this.storm.update(dt);
    if (roverPos) {
      this.sun.followTarget(roverPos.x, roverPos.z);
      this.storm.followTarget(roverPos.x, roverPos.z);
    }
  }
}
