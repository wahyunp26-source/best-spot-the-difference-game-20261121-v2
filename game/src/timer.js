// Twin Tides v2 — the per-level countdown.
//
// Counts down from a fixed number of seconds and reports the whole seconds
// left on every tick. Time is measured against the wall clock (not by
// counting ticks) so a busy tab cannot drift the timer, and the timer can be
// paused (menu, overlays, screenshot mode) and resumed without losing time.

export class Countdown {
  constructor(seconds, onTick, onEnd) {
    this.total = seconds;
    this.left = seconds;
    this.onTick = onTick;
    this.onEnd = onEnd;
    this.timer = null;
    this.endsAt = 0;
    this.paused = false;
  }

  start() {
    this.stop();
    this.left = this.total;
    this.endsAt = Date.now() + this.total * 1000;
    this.paused = false;
    this.timer = setInterval(() => this.tick(), 200);
    this.onTick(this.left);
  }

  tick() {
    if (this.paused) return;
    const next = Math.max(0, Math.ceil((this.endsAt - Date.now()) / 1000));
    if (next !== this.left) {
      this.left = next;
      this.onTick(this.left);
    }
    if (this.left <= 0) {
      this.stop();
      this.onEnd();
    }
  }

  pause() {
    if (this.timer && !this.paused) {
      this.left = Math.max(0, Math.ceil((this.endsAt - Date.now()) / 1000));
      this.paused = true;
    }
  }

  resume() {
    if (this.timer && this.paused) {
      this.endsAt = Date.now() + this.left * 1000;
      this.paused = false;
    }
  }

  // A wrong click costs 5 seconds; a hint costs 10. Never below zero.
  spend(seconds) {
    if (!this.timer) return;
    this.left = Math.max(0, this.left - seconds);
    this.endsAt = Date.now() + this.left * 1000;
    this.onTick(this.left);
    if (this.left <= 0) {
      this.stop();
      this.onEnd();
    }
  }

  stop() {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
    this.paused = false;
  }

  get running() {
    return this.timer !== null && !this.paused;
  }
}
