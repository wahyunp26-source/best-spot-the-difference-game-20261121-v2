// Twin Tides v2 — sounds, synthesized with WebAudio. No audio files.
//
// Every sound is a few oscillators with a short gain envelope, so the game
// stays a handful of static files and plays with no network request.
// The AudioContext is created lazily on the first user gesture (browsers
// block audio before that) and every call is a no-op while muted.

export class SoundBank {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  ensure() {
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      this.ctx = new AC();
    }
    if (this.ctx.state === 'suspended') void this.ctx.resume();
    return this.ctx;
  }

  tone(freq, at, dur, type = 'sine', vol = 0.12) {
    const ctx = this.ensure();
    if (!ctx || this.muted) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    const t0 = ctx.currentTime + at;
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(vol, t0 + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.05);
  }

  click() {
    this.tone(660, 0, 0.06, 'triangle', 0.06);
  }

  // A found difference: a bright two-note chime, higher with the streak.
  find(streak = 0) {
    const base = 520 + Math.min(streak, 8) * 30;
    this.tone(base, 0, 0.12, 'sine', 0.14);
    this.tone(base * 1.5, 0.07, 0.18, 'sine', 0.12);
  }

  // A wrong click: one low dull thud.
  wrong() {
    this.tone(140, 0, 0.18, 'sawtooth', 0.08);
  }

  // A hint: a soft high ping.
  hint() {
    this.tone(880, 0, 0.1, 'sine', 0.1);
    this.tone(1174, 0.08, 0.14, 'sine', 0.08);
  }

  // Level complete: a rising arpeggio.
  complete() {
    [523, 659, 784, 1046].forEach((f, i) => this.tone(f, i * 0.09, 0.22, 'triangle', 0.12));
  }

  // All five levels done: a little fanfare.
  win() {
    [523, 659, 784, 1046, 1318, 1568].forEach((f, i) => this.tone(f, i * 0.11, 0.3, 'triangle', 0.12));
  }

  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }
}
