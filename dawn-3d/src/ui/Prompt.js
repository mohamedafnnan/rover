import { bus } from '../core/EventBus.js';

/**
 * Prompt · the bottom-center "Press E to enter" hint.
 * Fades on POI proximity events.
 */
export class Prompt {
  constructor(root) {
    this.el = document.createElement('div');
    this.el.className = 'prompt';
    this.el.innerHTML = `<span class="prompt__key">E</span><span id="prompt-label">Enter</span>`;
    root.appendChild(this.el);
    this.labelEl = this.el.querySelector('#prompt-label');

    bus.on('poi:near', ({ poi }) => {
      this.labelEl.textContent = `Enter · ${poi.name}`;
      this.el.classList.add('prompt--visible');
    });
    bus.on('poi:far', () => this.el.classList.remove('prompt--visible'));
    bus.on('codex:open', () => this.el.classList.remove('prompt--visible'));
  }
}
