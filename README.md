# DropFactor

A variant of [Drop7](https://en.wikipedia.org/wiki/Drop7), using elements of its predecessor [Chain Factor](http://www.franklantz.net/chainfactor).

Built using [Kontra.js](https://straker.github.io/kontra/).

## Gameplay

### Controls

- Click/tap and release within the grid to drop coins into the specified column.
- Click/tap and drag power tokens (once they're fully charged) to the grid to activate them.
- Press R or click/tap the restart button (top right) to restart the game.

![A screenshot of the game, DropFactor](screenshot.png)

### Rules

The player can drop coins with the values 1 to 7 into any column of a grid. Coins will fall downwards until they hit the bottom of the grid or another coin.

If a coin finds itself in a continuous row or column the length of that coin's own value, it will disappear and erode any adjacent "buried" coins.

Powers will charge as score is increased. Once a power is fully charged, it can be activated by dragging its token to the desired activation point.

Each power has its own effect and range, these can be discovered through experimentation. A power's activation range is shown when dragging its token over the grid. If you decide not to use a power, release it outside of the grid.

Each round will progress as coins are dropped into the grid, or as powers are used. (Round progress is marked in the top left). After each round, a layer of buried coins will rise from the bottom of the grid, pushing everything else upwards.

If any dropped coin finds itself above the top of the grid, the game is over.

## How does DropFactor differ from its inspirations?

> Please note: Much of the planning for this project came about from playing [Drop-7 Professional](https://www.lexaloffle.com/bbs/?pid=35706), a remake of Drop7. As such, some of what is listed below may have already been present in the original games.
>
> DropFactor is not intended to be a faithful remake or replacement for Drop7/Chain Factor, and these design choices were made and tuned for personal preference.

At its core, the game mostly plays like the original Drop7 and Chain Factor. I've implemented a power system similar to Chain Factor's (unfortunately, while Chain Factor has been archived and is still playable online to an extent, its power system was gated by progress through an ARG, and the server that controlled which powers were unlocked no longer seems to be online.)

While Chain Factor allowed the player to choose from twelve different powers, I've chosen to narrow it down to the three I remember using the most in that game, with some minor alterations.

A game of DropFactor starts with buried coins already on the grid, similar to Chain Factor.

Each round of DropFactor is exactly 5 turns long. I found this allowed for the game to ramp up quickly enough to be interesting, while still leaving enough leeway in the later stages to escape a bad situation, especially in combination with the power system.

DropFactor also uses a weighted randomisation system, which makes it so coins become more likely to appear in the drop coin rotation for each turn they don't appear (making situations where you get, say, an entire round of only one type of coin vanishingly unlikely). Buried coins are also not included in the drop coin rotation.

## Future updates

This game is effectively complete outside of minor cosmetic improvements, performance optimisation and bugfixes.

However, I would at some point like to add a settings menu for players to customise the game to their liking (grid size, turns in a round, power ranges and score thresholds, the choice to put buried coins into the rotation).

## Credit

- [Frank Lantz](http://www.franklantz.net/chainfactor) - Developer of both the original games DropFactor is based on.
- [Drop-7 Professional](https://www.lexaloffle.com/bbs/?pid=35706) - A very good Pico-8 remake of Drop7, and a key inspiration behind this project.
- [Finite State Machines in JavaScript](https://www.youtube.com/watch?v=0NkfCi-hKCc) - Helped me understand a concept that became integral to the development of this game.
- [Vanilla Web - Poor Man's Signals](https://plainvanillaweb.com/blog/articles/2024-08-30-poor-mans-signals/) - Another concept used throughout DropFactor.
- [Kontra.js](https://straker.github.io/kontra/)
- [Webpack](https://webpack.js.org/)