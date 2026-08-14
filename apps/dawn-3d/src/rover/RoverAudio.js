/**
 * RoverAudio · a motor-whine oscillator tied to rover speed.
 *
 * We synthesise a subtle low sawtooth + a highpass filter and modulate
 * pitch + gain by the rover's speed. No audio files needed.
 *
 * Muted by default until the user interacts (browsers require a gesture).
 */
export class RoverAudio {
  constructor(audioEngine) {
    this.engine = audioEngine;
    this._built = false;
  }

  _build() {
    const ctx = this.engine.ctx;
    if (!ctx) return;
    const osc = ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.value = 60;

    const sub = ctx.createOscillator();
    sub.type = 'sine';
    sub.frequency.value = 30;

    const gain = ctx.createGain();
    gain.gain.value = 0;

    const filt = ctx.createBiquadFilter();
    filt.type = 'lowpass';
    filt.frequency.value = 380;
    filt.Q.value = 0.7;

    osc.connect(filt);
    sub.connect(filt);
    filt.connect(gain);
    gain.connect(this.engine.bus('sfx'));

    osc.start();
    sub.start();

    this.osc = osc;
    this.sub = sub;
    this.gain = gain;
    this.filt = filt;
    this._built = true;
  }

  update(_dt, speed) {
    if (!this.engine.ready) return;
    if (!this._built) this._build();
    if (!this._built) return;
    const s = Math.min(1, Math.abs(speed) / 8);
    const targetGain = 0.12 * s;
    const targetFreq = 55 + s * 140;
    const targetCut  = 320 + s * 900;
    const t = this.engine.ctx.currentTime;
    this.gain.gain.setTargetAtTime(targetGain, t, 0.15);
    this.osc.frequency.setTargetAtTime(targetFreq, t, 0.2);
    this.filt.frequency.setTargetAtTime(targetCut, t, 0.2);
  }
}
