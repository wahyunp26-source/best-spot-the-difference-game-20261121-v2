// Twin Tides v2 — level data.
//
// Five hand-painted scenes. Each scene ships as two near-identical pictures
// (a = left panel, b = right panel) and a list of planted differences.
// Coordinates are fractions of the picture (0..1), found by scanning the
// two pictures pixel by pixel and clustering the regions that differ:
// every difference below is the centroid of one real differing region.
//
// The game never trusts these numbers blindly: the playtest clicks every
// one of them in a real browser and each must register as a find.

export const CLICK_RADIUS = 0.045; // fraction of panel width; generous, diffs are far apart

export const LEVELS = [
  {
    name: 'Sunny Harbor',
    tagline: 'Gulls over the fishing boats — 5 differences, 120 seconds.',
    time: 120,
    a: 'assets/level1.png',
    b: 'assets/level1-b.png',
    diffs: [
      { x: 0.634, y: 0.224, label: 'Cloud' },
      { x: 0.536, y: 0.689, label: 'Boat hull' },
      { x: 0.823, y: 0.359, label: 'Seagull' },
      { x: 0.195, y: 0.171, label: 'Lighthouse stripe' },
      { x: 0.140, y: 0.790, label: 'Beach umbrella' },
    ],
  },
  {
    name: 'Night Market',
    tagline: 'Lanterns, cats and apples after dark — 6 differences, 110 seconds.',
    time: 110,
    a: 'assets/level2.png',
    b: 'assets/level2-b.png',
    diffs: [
      { x: 0.319, y: 0.049, label: 'Star' },
      { x: 0.209, y: 0.125, label: 'Star' },
      { x: 0.110, y: 0.879, label: 'Market cat' },
      { x: 0.410, y: 0.430, label: 'Awning' },
      { x: 0.577, y: 0.552, label: 'Lantern' },
      { x: 0.876, y: 0.698, label: 'Apples' },
    ],
  },
  {
    name: 'Coral Reef',
    tagline: 'Down where the clownfish hide — 6 differences, 100 seconds.',
    time: 100,
    a: 'assets/level3.png',
    b: 'assets/level3-b.png',
    diffs: [
      { x: 0.146, y: 0.832, label: 'Seaweed' },
      { x: 0.890, y: 0.872, label: 'Anemone' },
      { x: 0.392, y: 0.904, label: 'Starfish' },
      { x: 0.943, y: 0.504, label: 'Bubble' },
      { x: 0.253, y: 0.662, label: 'Tang tail' },
      { x: 0.179, y: 0.383, label: 'Clownfish stripe' },
    ],
  },
  {
    name: 'Mountain Camp',
    tagline: 'Tents under a cold moon — 6 differences, 90 seconds.',
    time: 90,
    a: 'assets/level4.png',
    b: 'assets/level4-b.png',
    diffs: [
      { x: 0.105, y: 0.131, label: 'Moon' },
      { x: 0.442, y: 0.717, label: 'Tent' },
      { x: 0.150, y: 0.582, label: 'Pine tree' },
      { x: 0.098, y: 0.514, label: 'Backpack' },
      { x: 0.868, y: 0.680, label: 'Camp lantern' },
      { x: 0.465, y: 0.861, label: 'Fire stone' },
    ],
  },
  {
    name: 'Moon Base',
    tagline: 'One small step for a spotter — 7 differences, 80 seconds.',
    time: 80,
    a: 'assets/level5.png',
    b: 'assets/level5-b.png',
    diffs: [
      { x: 0.661, y: 0.316, label: 'Earth' },
      { x: 0.823, y: 0.340, label: 'Flag' },
      { x: 0.326, y: 0.649, label: 'Rover wheel' },
      { x: 0.333, y: 0.891, label: 'Crater' },
      { x: 0.787, y: 0.653, label: 'Dish' },
      { x: 0.149, y: 0.577, label: 'Spacesuit' },
      { x: 0.203, y: 0.680, label: 'Base window' },
    ],
  },
];

export const TOTAL_DIFFS = LEVELS.reduce((n, level) => n + level.diffs.length, 0);
