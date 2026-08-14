/**
 * ContentStore · loads every /content/*.json file exactly once and hands
 * out immutable views. Every system reads from here; the JSON files are
 * the sole source of truth for the experience's content.
 */
const FILES = [
  'site',
  'departments',
  'team',
  'rover',
  'sponsors',
  'competitions',
  'achievements',
  'timeline',
  'gallery',
  'faq',
  'recruitment',
  'pois',
  'missions',
  'contact',
];

const CONTENT_MODULES = import.meta.glob('../../content/*.json', { as: 'json' });

export class ContentStore {
  #data = {};
  #ready = false;

  async load(onProgress = () => {}) {
    const total = FILES.length;
    let done = 0;
    await Promise.all(
      FILES.map(async (name) => {
        const loader = CONTENT_MODULES[`../../content/${name}.json`];
        if (!loader) throw new Error(`Failed to resolve content/${name}.json`);
        this.#data[name] = await loader();
        done += 1;
        onProgress(done / total, name);
      })
    );
    this.#ready = true;
  }

  get ready() { return this.#ready; }
  get all()   { return this.#data; }

  get site()          { return this.#data.site; }
  get departments()   { return this.#data.departments.departments; }
  department(id)      { return this.departments.find(d => d.id === id); }
  get team()          { return this.#data.team; }
  membersByDept(id)   { return this.team.members.filter(m => m.department === id); }
  get rover()         { return this.#data.rover; }
  get sponsors()      { return this.#data.sponsors; }
  get competitions()  { return this.#data.competitions; }
  get achievements()  { return this.#data.achievements.achievements; }
  get timeline()      { return this.#data.timeline.events; }
  get gallery()       { return this.#data.gallery.items; }
  get faq()           { return this.#data.faq.items; }
  get recruitment()   { return this.#data.recruitment; }
  get pois()          { return this.#data.pois; }
  poi(id)             { return this.pois.pois.find(p => p.id === id); }
  get missions()      { return this.#data.missions.missions; }
  get contact()       { return this.#data.contact; }
}

export const content = new ContentStore();
