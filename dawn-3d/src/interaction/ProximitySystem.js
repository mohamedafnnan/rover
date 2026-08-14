import { bus } from '../core/EventBus.js';
import { flags } from '../core/Debug.js';

/**
 * ProximitySystem · watches the rover's position and emits POI events.
 *
 * Emits:
 *   'poi:near'    { poi }           — rover entered the interact radius
 *   'poi:far'     { poi }           — rover left the interact radius
 *   'poi:enter'   { poi }           — user pressed action key while near
 *
 * The nearest POI is recomputed every tick (cheap for ~21 POIs).
 */
export class ProximitySystem {
  constructor(rover, registry, input) {
    this.rover = rover;
    this.registry = registry;
    this.input = input;
    this._current = null;
  }

  update() {
    const pos = this.rover.root.position;
    // Use each POI's own radius as the maximum look distance.
    const { poi } = this.registry.nearest(pos, Infinity);
    let near = null;
    if (poi) {
      const dist = poi.distanceTo(pos);
      if (dist <= poi.radius) near = poi;
    }

    if (near !== this._current) {
      if (this._current) bus.emit('poi:far',  { poi: this._current });
      if (near)          bus.emit('poi:near', { poi: near });
      this._current = near;
    }

    // Action key → enter.
    if (this.input.pressed.action) {
      if (near || flags.free) bus.emit('poi:enter', { poi: near });
    }
  }

  get currentPOI() { return this._current; }
}
