// Twin Tides v2 — deterministic screenshot states.
//
// The screenshots in screenshots/ must show the game itself, mid-play:
// two pictures side by side, markers on the differences already found,
// several still unfound, and a counter of how many remain. Loading the game
// with ?shot=1..4 puts it in exactly that state, frozen, so a screenshot
// is a real render of the game's own code and never a composite.
//
// Each shot plays in one of the four prettiest levels, with a few
// differences already found (numbered rings on both pictures) and the rest
// still hiding. The timer is frozen at the stated seconds so the shot is
// identical every time it is taken.

export const SHOTS = {
  // Coral Reef, 3 found, 3 left, 64s on the clock.
  1: { level: 2, found: [0, 1, 2], time: 64, score: 1240, streak: 3 },
  // Night Market, 2 found, 4 left, 71s on the clock.
  2: { level: 1, found: [0, 1], time: 71, score: 860, streak: 2 },
  // Sunny Harbor, 2 found, 3 left, 87s on the clock.
  3: { level: 0, found: [0, 1], time: 87, score: 940, streak: 2 },
  // Mountain Camp, 3 found, 3 left, 58s on the clock.
  4: { level: 3, found: [0, 1, 2], time: 58, score: 1310, streak: 3 },
};

export function shotFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const n = Number(params.get('shot'));
  return SHOTS[n] || null;
}
