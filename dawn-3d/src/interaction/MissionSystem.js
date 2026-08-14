import { bus } from '../core/EventBus.js';

/**
 * MissionSystem · listens on the bus and tracks mission progress.
 *
 * Missions are defined in content/missions.json. The system does not
 * force the user to complete anything — they are optional side quests
 * whose reward is UI unlocks (arm inspector, cinematic camera, etc.).
 */
export class MissionSystem {
  constructor(content) {
    this.missions = content.missions;
    this.status = new Map();
    for (const m of this.missions) this.status.set(m.id, { done: false, progress: 0 });

    bus.on('poi:enter', ({ poi }) => this._onEnter(poi));
    bus.on('mission:complete', ({ id }) => this._complete(id));
  }

  _onEnter(poi) {
    if (!poi) return;

    // Simple single-target missions.
    for (const m of this.missions) {
      const s = this.status.get(m.id);
      if (s.done) continue;
      if (m.target && m.target === poi.id) {
        this._complete(m.id);
      }
      if (Array.isArray(m.targets) && m.targets.includes(poi.id)) {
        s.progress += 1;
        if (s.progress >= m.targets.length) this._complete(m.id);
        else bus.emit('toast', { text: `${m.title} · ${s.progress}/${m.targets.length}` });
      }
    }
  }

  _complete(id) {
    const s = this.status.get(id);
    if (!s || s.done) return;
    s.done = true;
    const m = this.missions.find(x => x.id === id);
    bus.emit('toast', { text: `MISSION · ${m?.title} · complete.` });
    bus.emit('mission:done', { id });
  }

  isDone(id) { return this.status.get(id)?.done; }
}
