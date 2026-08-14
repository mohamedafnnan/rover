import { bus } from '../core/EventBus.js';
import { renderIntro }           from './panels/IntroPanel.js';
import { renderMissionControl }  from './panels/MissionControlPanel.js';
import { renderRover }           from './panels/RoverPanel.js';
import { renderArm }             from './panels/ArmInspector.js';
import { renderDepartment }      from './panels/DepartmentPanel.js';
import { renderTesting }         from './panels/TestingPanel.js';
import { renderComms }           from './panels/CommsPanel.js';
import { renderSolar }           from './panels/SolarPanel.js';
import { renderCompetition }     from './panels/CompetitionPanel.js';
import { renderSponsor }         from './panels/SponsorPanel.js';
import { renderGallery }         from './panels/GalleryPanel.js';
import { renderAchievement }     from './panels/AchievementPanel.js';
import { renderTimeline }        from './panels/TimelinePanel.js';
import { renderMedia }           from './panels/MediaPanel.js';
import { renderRecruitment }     from './panels/RecruitmentPanel.js';
import { renderTeam }            from './panels/TeamPanel.js';

/**
 * Codex · the sliding right-side content panel.
 *
 * Panel resolution is data-driven: the POI carries a `panel` string in
 * content/pois.json which maps to one of the render functions above.
 */
const PANELS = {
  IntroPanel:          renderIntro,
  MissionControlPanel: renderMissionControl,
  RoverPanel:          renderRover,
  ArmInspector:        renderArm,
  DepartmentPanel:     renderDepartment,
  TestingPanel:        renderTesting,
  CommsPanel:          renderComms,
  SolarPanel:          renderSolar,
  CompetitionPanel:    renderCompetition,
  SponsorPanel:        renderSponsor,
  GalleryPanel:        renderGallery,
  AchievementPanel:    renderAchievement,
  TimelinePanel:       renderTimeline,
  MediaPanel:          renderMedia,
  RecruitmentPanel:    renderRecruitment,
  TeamPanel:           renderTeam,
};

export class Codex {
  constructor(root, content, audio) {
    this.content = content;
    this.audio = audio;
    this.el = document.createElement('aside');
    this.el.className = 'codex';
    this.el.setAttribute('role', 'complementary');
    this.el.setAttribute('aria-label', 'Location dossier');
    this.el.innerHTML = `
      <button class="codex__close" id="codex-close" aria-label="Close">✕</button>
      <div class="codex__head">
        <div class="codex__eyebrow" id="codex-eyebrow">Landing zone</div>
        <h2 class="codex__title" id="codex-title">Welcome to Mars</h2>
      </div>
      <div class="codex__body" id="codex-body"></div>
    `;
    root.appendChild(this.el);

    this.eyebrow = this.el.querySelector('#codex-eyebrow');
    this.title   = this.el.querySelector('#codex-title');
    this.body    = this.el.querySelector('#codex-body');

    this.el.querySelector('#codex-close').addEventListener('click', () => this.close());
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.open) this.close();
    });

    bus.on('poi:enter', ({ poi }) => this.openForPOI(poi));
    bus.on('codex:openById', ({ id }) => {
      const def = this.content.poi(id);
      if (def) this.openForPOI({ ...def, distanceTo: () => 0 });
    });
  }

  openForPOI(poi) {
    if (!poi) return;
    const render = PANELS[poi.panel];
    if (!render) {
      console.warn('[codex] no panel for', poi.panel);
      return;
    }
    this.eyebrow.textContent = poi.type ? poi.type.toUpperCase() : 'DOSSIER';
    this.title.textContent = poi.name;
    this.body.innerHTML = '';
    const api = { content: this.content, audio: this.audio, close: () => this.close() };
    const rendered = render(this.content, poi, api);
    if (typeof rendered === 'string') {
      this.body.innerHTML = rendered;
    } else if (rendered instanceof HTMLElement) {
      this.body.appendChild(rendered);
    }
    this.body.scrollTop = 0;
    this.el.classList.add('codex--open');
    this.open = true;
    this.audio?.chirp?.(720);
    bus.emit('codex:open', { poi });
  }

  close() {
    if (!this.open) return;
    this.el.classList.remove('codex--open');
    this.open = false;
    this.audio?.chirp?.(340);
    bus.emit('codex:close');
  }
}
