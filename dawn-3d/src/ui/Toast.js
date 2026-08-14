import { bus } from '../core/EventBus.js';

/**
 * Toast · a small stack of ephemeral notifications, top-left.
 * Emit via bus:  bus.emit('toast', { text })
 */
export class Toast {
  constructor(root, { life = 3200 } = {}) {
    this.el = document.createElement('div');
    this.el.className = 'toast-stack';
    root.appendChild(this.el);
    this.life = life;
    bus.on('toast', ({ text }) => this.push(text));
  }

  push(text) {
    const t = document.createElement('div');
    t.className = 'toast';
    t.textContent = text;
    this.el.appendChild(t);
    requestAnimationFrame(() => t.classList.add('toast--visible'));
    setTimeout(() => {
      t.classList.remove('toast--visible');
      setTimeout(() => t.remove(), 300);
    }, this.life);
  }
}
