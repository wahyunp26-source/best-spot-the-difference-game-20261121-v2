// Twin Tides v2 — the game itself.
//
// Two near-identical pictures side by side. Click a difference on either
// picture and a numbered green ring appears on both. Find them all before
// the clock runs out, then move to the next scene. Five scenes, thirty
// differences, one tide to beat.
//
// Scoring: 100 points per find plus 25 per step of the current streak, so
// careful play pays more than lucky clicks. A wrong click costs 5 seconds
// and breaks the streak. A hint costs 10 seconds. Finishing a level banks
// the level score plus 10 points per second left on the clock.

import { LEVELS, TOTAL_DIFFS, CLICK_RADIUS } from './levels.js';
import { SoundBank } from './audio.js';
import { Countdown } from './timer.js';
import { Hints } from './hints.js';

const BEST_KEY = 'twin-tides-best-v2';

export class TwinTidesGame {
  constructor(refs) {
    this.refs = refs;
    this.sound = new SoundBank();
    this.hints = new Hints(3);
    this.timer = new Countdown(0, (left) => this.onTick(left), () => this.onTimeout());
    this.state = 'menu';
    this.levelIndex = 0;
    this.found = new Set();
    this.streak = 0;
    this.score = 0;
    this.banked = 0;
    this.best = Number(window.localStorage.getItem(BEST_KEY) || 0);
    this.bind();
    this.showMenu();
  }

  get level() {
    return LEVELS[this.levelIndex];
  }

  get remaining() {
    return this.level.diffs.length - this.found.size;
  }

  bind() {
    const { panelA, panelB, hintBtn, soundBtn, menuBtn } = this.refs;
    panelA.addEventListener('click', (ev) => this.onPanelClick(ev));
    panelB.addEventListener('click', (ev) => this.onPanelClick(ev));
    hintBtn.addEventListener('click', () => this.useHint());
    soundBtn.addEventListener('click', () => {
      const muted = this.sound.toggleMute();
      soundBtn.textContent = muted ? '🔇 Muted' : '🔊 Sound';
    });
    menuBtn.addEventListener('click', () => this.showMenu());
    window.addEventListener('keydown', (ev) => {
      if (ev.key === 'h' || ev.key === 'H') this.useHint();
      else if (ev.key === 'r' || ev.key === 'R') this.retryLevel();
      else if (ev.key === 'm' || ev.key === 'M') soundBtn.click();
      else if (ev.key === 'Escape') this.showMenu();
    });
  }

  // ---- flow ----

  showMenu() {
    this.state = 'menu';
    this.timer.stop();
    this.refs.menuBest.textContent = this.best > 0 ? `Best score: ${this.best}` : 'No best score yet — dive in!';
    this.showOverlay('menu');
    this.updateHud();
  }

  startGame() {
    this.banked = 0;
    this.levelIndex = 0;
    this.startLevel(0);
  }

  startLevel(index, preset = null) {
    this.levelIndex = index;
    this.found = new Set();
    this.streak = 0;
    this.score = 0;
    this.hints.reset();
    this.state = 'playing';
    this.refs.imgA.src = this.level.a;
    this.refs.imgB.src = this.level.b;
    this.clearMarks();
    this.hideOverlays();
    this.timer.total = this.level.time;
    if (preset) {
      // Screenshot mode: a frozen mid-game state, no ticking clock.
      this.score = preset.score || 0;
      this.streak = preset.streak || 0;
      for (const i of preset.found) this.markFound(i, true);
      this.timer.stop();
      this.onTick(preset.time);
      this.refs.timeBar.style.width = `${(preset.time / this.level.time) * 100}%`;
    } else {
      this.timer.start();
    }
    this.updateHud();
  }

  retryLevel() {
    if (this.state === 'playing' || this.state === 'over' || this.state === 'levelDone') {
      this.startLevel(this.levelIndex);
    }
  }

  nextLevel() {
    if (this.levelIndex + 1 >= LEVELS.length) return this.winGame();
    this.startLevel(this.levelIndex + 1);
  }

  winGame() {
    this.state = 'won';
    this.timer.stop();
    const total = this.banked;
    if (total > this.best) {
      this.best = total;
      window.localStorage.setItem(BEST_KEY, String(total));
    }
    this.refs.winScore.textContent = `${total} points — all ${TOTAL_DIFFS} differences found!`;
    this.refs.winBest.textContent = `Best score: ${this.best}`;
    this.sound.win();
    this.showOverlay('win');
  }

  // ---- clicks ----

  onPanelClick(ev) {
    if (this.state !== 'playing') return;
    const img = ev.currentTarget.querySelector('img');
    const rect = img.getBoundingClientRect();
    const fx = (ev.clientX - rect.left) / rect.width;
    const fy = (ev.clientY - rect.top) / rect.height;
    if (fx < 0 || fx > 1 || fy < 0 || fy > 1) return;
    const hit = this.nearestDiff(fx, fy);
    if (hit >= 0) this.markFound(hit, false);
    else this.wrongClick(ev.currentTarget, fx, fy);
  }

  nearestDiff(fx, fy) {
    let best = -1;
    let bestD = CLICK_RADIUS;
    this.level.diffs.forEach((d, i) => {
      if (this.found.has(i)) return;
      const dx = d.x - fx;
      const dy = (d.y - fy) * 0.625; // pictures are 1024x640: scale y to match x
      const dist = Math.hypot(dx, dy);
      if (dist < bestD) {
        bestD = dist;
        best = i;
      }
    });
    return best;
  }

  markFound(index, silent) {
    this.found.add(index);
    const diff = this.level.diffs[index];
    const n = this.found.size;
    for (const panel of [this.refs.panelA, this.refs.panelB]) {
      const mark = document.createElement('div');
      mark.className = 'mark';
      mark.style.left = `${diff.x * 100}%`;
      mark.style.top = `${diff.y * 100}%`;
      mark.textContent = n;
      panel.querySelector('.marks').appendChild(mark);
    }
    if (!silent) {
      this.score += 100 + 25 * this.streak;
      this.streak += 1;
      this.sound.find(this.streak);
    }
    this.updateHud();
    if (this.found.size === this.level.diffs.length) this.completeLevel();
  }

  wrongClick(panel, fx, fy) {
    this.streak = 0;
    this.timer.spend(5);
    this.sound.wrong();
    const cross = document.createElement('div');
    cross.className = 'mark wrong';
    cross.style.left = `${fx * 100}%`;
    cross.style.top = `${fy * 100}%`;
    cross.textContent = '✕';
    panel.querySelector('.marks').appendChild(cross);
    setTimeout(() => cross.remove(), 700);
    this.updateHud();
  }

  // ---- hints ----

  useHint() {
    if (this.state !== 'playing' || !this.hints.available) return;
    const index = this.hints.pick(this.found, this.level.diffs.length);
    if (index < 0) return;
    this.timer.spend(10);
    this.sound.hint();
    const diff = this.level.diffs[index];
    for (const panel of [this.refs.panelA, this.refs.panelB]) {
      const ring = document.createElement('div');
      ring.className = 'mark hint';
      ring.style.left = `${diff.x * 100}%`;
      ring.style.top = `${diff.y * 100}%`;
      ring.textContent = '?';
      panel.querySelector('.marks').appendChild(ring);
      setTimeout(() => ring.remove(), 2600);
    }
    this.updateHud();
  }

  // ---- level end ----

  completeLevel() {
    this.state = 'levelDone';
    const timeLeft = this.timer.left;
    this.timer.stop();
    const bonus = timeLeft * 10;
    this.banked += this.score + bonus;
    const frac = timeLeft / this.level.time;
    const stars = frac >= 0.6 ? 3 : frac >= 0.3 ? 2 : 1;
    this.refs.levelStars.textContent = '★'.repeat(stars) + '☆'.repeat(3 - stars);
    this.refs.levelSummary.textContent =
      `${this.level.name} complete — ${this.level.diffs.length} differences, ` +
      `${this.score} points + ${bonus} time bonus = ${this.score + bonus} banked.`;
    this.refs.levelFound.textContent = this.level.diffs.map((d) => `✓ ${d.label}`).join('  ·  ');
    this.refs.nextBtn.textContent =
      this.levelIndex + 1 >= LEVELS.length ? 'See the final score →' : 'Next level →';
    this.sound.complete();
    this.showOverlay('level');
  }

  onTimeout() {
    if (this.state !== 'playing') return;
    this.state = 'over';
    this.refs.overSummary.textContent =
      `Time ran out on ${this.level.name} — ${this.found.size} of ${this.level.diffs.length} found.`;
    this.showOverlay('over');
  }

  onTick(left) {
    this.refs.timeText.textContent = `${left}s`;
    const bar = this.refs.timeBar;
    bar.style.width = `${(left / this.level.time) * 100}%`;
    bar.classList.toggle('low', left <= 20);
    bar.classList.toggle('mid', left > 20 && left <= 45);
  }

  // ---- HUD and overlays ----

  clearMarks() {
    for (const panel of [this.refs.panelA, this.refs.panelB]) {
      panel.querySelector('.marks').innerHTML = '';
    }
  }

  updateHud() {
    const r = this.refs;
    r.levelName.textContent = `${this.level.name} — Level ${this.levelIndex + 1} of ${LEVELS.length}`;
    r.leftPill.textContent = `🔍 ${this.remaining} left`;
    r.leftPill.classList.toggle('done', this.remaining === 0);
    r.scoreText.textContent = `${this.score + this.banked} pts`;
    r.streakText.textContent = this.streak > 1 ? `🔥 ${this.streak} streak` : '';
    r.hintBtn.textContent = `💡 Hint (${this.hints.left})`;
    r.hintBtn.disabled = !this.hints.available || this.state !== 'playing';
    r.dots.innerHTML = LEVELS.map((_, i) =>
      `<span class="dot${i === this.levelIndex ? ' now' : ''}${i < this.levelIndex ? ' done' : ''}"></span>`,
    ).join('');
    const foundNames = [...this.found].map((i) => this.level.diffs[i].label);
    r.foundList.innerHTML =
      foundNames.map((n) => `<span class="found-item">✓ ${n}</span>`).join('') ||
      '<span class="found-none">Nothing found yet — look closely…</span>';
    r.levelTag.textContent = this.level.tagline;
  }

  showOverlay(which) {
    for (const key of ['menu', 'level', 'over', 'win']) {
      this.refs[`${key}Overlay`].classList.toggle('hidden', key !== which);
    }
  }

  hideOverlays() {
    this.showOverlay('none');
  }
}
