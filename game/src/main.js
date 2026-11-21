// Twin Tides v2 — bootstrap.
//
// Wires the page together: builds the game, connects the buttons, and
// either drops the player on the menu or, with ?shot=1..4, into one of the
// frozen mid-game states the screenshots are taken from.

import { TwinTidesGame } from './game.js';
import { shotFromUrl } from './shots.js';

const $ = (id) => document.getElementById(id);

const game = new TwinTidesGame({
  panelA: $('panel-a'),
  panelB: $('panel-b'),
  imgA: $('img-a'),
  imgB: $('img-b'),
  levelName: $('level-name'),
  levelTag: $('level-tag'),
  timeText: $('time-text'),
  timeBar: $('time-bar'),
  leftPill: $('left-pill'),
  scoreText: $('score-text'),
  streakText: $('streak-text'),
  hintBtn: $('hint-btn'),
  soundBtn: $('sound-btn'),
  menuBtn: $('menu-btn'),
  dots: $('dots'),
  foundList: $('found-list'),
  menuOverlay: $('menu-overlay'),
  levelOverlay: $('level-overlay'),
  overOverlay: $('over-overlay'),
  winOverlay: $('win-overlay'),
  menuBest: $('menu-best'),
  levelStars: $('level-stars'),
  levelSummary: $('level-summary'),
  levelFound: $('level-found'),
  nextBtn: $('next-btn'),
  overSummary: $('over-summary'),
  winScore: $('win-score'),
  winBest: $('win-best'),
});

$('start-btn').addEventListener('click', () => {
  game.sound.click();
  game.startGame();
});
$('next-btn').addEventListener('click', () => {
  game.sound.click();
  game.nextLevel();
});
$('retry-btn').addEventListener('click', () => {
  game.sound.click();
  game.retryLevel();
});
$('again-btn').addEventListener('click', () => {
  game.sound.click();
  game.startGame();
});
// Level picker on the menu: jump straight into any scene.
import { LEVELS } from './levels.js';
const pick = $('level-pick');
LEVELS.forEach((level, i) => {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.textContent = `${i + 1} · ${level.name}`;
  btn.addEventListener('click', () => {
    game.sound.click();
    game.banked = 0;
    game.startLevel(i);
  });
  pick.appendChild(btn);
});

// Screenshot mode: a frozen mid-game state, no ticking clock.
const shot = shotFromUrl();
if (shot) {
  document.body.classList.add('shot');
  game.startLevel(shot.level, shot);
}

// Exposed for the automated playtest: window.__game.
window.__game = game;
