![Twin Tides](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)
![Rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/wahyunp26-source/best-spot-the-difference-game-20261121-v2/rank.svg)
![Reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/wahyunp26-source/best-spot-the-difference-game-20261121-v2/reward.svg)

# Twin Tides — Spot the Difference (v2)

Two near-identical pictures, side by side. Thirty differences hiding across
five hand-painted scenes. Find them all before the tide — and the clock —
runs out.

[Bounty on make.fun](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)

## The game

- **5 scenes**: Sunny Harbor, Night Market, Coral Reef, Mountain Camp, Moon Base
- **30 planted differences**, each verified by pixel scan against the art
- **Click either picture** to mark a find — numbered green rings appear on both
- **Streak scoring**: 100 points a find, +25 for every find in a row
- **Hints** (3 per level, −10s, gold pulse, never repeats the last one)
- **Wrong click** costs 5 seconds and breaks the streak
- **Time bonus**: 10 points per second left when a level is cleared, 1–3 stars
- **Sounds** synthesized with WebAudio — no audio files, no network
- **Keyboard**: H hint, R retry level, M mute, Esc menu
- **Screenshots**: all four are live mid-game play in the four prettiest scenes,
  with found markers, differences still hiding, and the counter showing how
  many remain

## Play it

Serve the `game/` folder with any static server and open `game/index.html`
in desktop Chrome. No build step, no network request.

## v2 changes

- All four screenshots are now live gameplay (v1 showed a menu and a win
  screen for two of them) — Coral Reef, Night Market, Sunny Harbor and
  Mountain Camp, each mid-game with found rings and the counter visible
- Polished HUD: a big "N left" pill, a timer bar that turns amber then red,
  level progress dots, and a live list of the differences found so far
- Level picker on the menu, so any scene can be jumped into directly
- The whole game rewritten from scratch for this version
