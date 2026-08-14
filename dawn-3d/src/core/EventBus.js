/**
 * EventBus · a 25-line pub/sub used to decouple systems.
 *
 * Systems should never import each other directly for cross-cutting events
 * (POI entered, mission completed, boot progress). They emit/subscribe here.
 */
export class EventBus {
  #map = new Map();

  on(event, handler) {
    if (!this.#map.has(event)) this.#map.set(event, new Set());
    this.#map.get(event).add(handler);
    return () => this.off(event, handler);
  }

  off(event, handler) {
    const set = this.#map.get(event);
    if (set) set.delete(handler);
  }

  emit(event, payload) {
    const set = this.#map.get(event);
    if (!set) return;
    for (const fn of set) {
      try { fn(payload); }
      catch (err) { console.error(`[bus] handler for "${event}" threw:`, err); }
    }
  }
}

export const bus = new EventBus();
