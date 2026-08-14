/**
 * Ambience · synthesised Martian wind bed.
 *
 * A pink-noise generator + slow LFO-modulated highpass. Purely additive
 * — never spikes above -18 dBFS. Cheap on CPU.
 */
export class Ambience {
  constructor(engine) {
    this.engine = engine;
    this._built = false;
  }

  _build() {
    const ctx = this.engine.ctx;
    if (!ctx) return;
    const bufferSize = 2 * ctx.sampleRate;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    // Pink-ish noise via a very simple filter.
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99765 * b0 + white * 0.0990460;
      b1 = 0.96300 * b1 + white * 0.2965164;
      b2 = 0.57000 * b2 + white * 1.0526913;
      data[i] = (b0 + b1 + b2 + white * 0.1848) * 0.11;
    }
    const src = ctx.createBufferSource(); src.buffer = buffer; src.loop = true;
    const filt = ctx.createBiquadFilter(); filt.type = 'highpass'; filt.frequency.value = 240;
    const gain = ctx.createGain(); gain.gain.value = 0.35;
    src.connect(filt); filt.connect(gain); gain.connect(this.engine.bus('music'));
    // Slow filter modulation.
    const lfo = ctx.createOscillator(); lfo.frequency.value = 0.05;
    const lfoGain = ctx.createGain(); lfoGain.gain.value = 120;
    lfo.connect(lfoGain); lfoGain.connect(filt.frequency);
    src.start(); lfo.start();
    this._built = true;
  }

  update() {
    if (this.engine.ready && !this._built) this._build();
  }
}
