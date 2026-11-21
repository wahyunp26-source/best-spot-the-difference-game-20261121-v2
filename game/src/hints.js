// Twin Tides v2 — hints.
//
// Three hints per level. A hint costs 10 seconds and pulses a gold ring
// around one difference the player has not found yet. It never points at
// the same difference twice in a row, so spamming hints walks the player
// through the level instead of flashing one spot forever.

export class Hints {
  constructor(perLevel = 3) {
    this.perLevel = perLevel;
    this.left = perLevel;
    this.last = -1;
  }

  reset() {
    this.left = this.perLevel;
    this.last = -1;
  }

  get available() {
    return this.left > 0;
  }

  // Returns the index of a still-hidden difference, or -1 when there is
  // nothing left to hint at (or no hints left).
  pick(found, count) {
    if (this.left <= 0) return -1;
    const hidden = [];
    for (let i = 0; i < count; i++) {
      if (!found.has(i) && i !== this.last) hidden.push(i);
    }
    if (hidden.length === 0) {
      // Only the last-hinted one is left: allow it rather than nothing.
      for (let i = 0; i < count; i++) {
        if (!found.has(i)) hidden.push(i);
      }
    }
    if (hidden.length === 0) return -1;
    const choice = hidden[Math.floor(Math.random() * hidden.length)];
    this.left -= 1;
    this.last = choice;
    return choice;
  }
}
