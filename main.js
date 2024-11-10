import { init, Text, GameLoop, GameObject, initPointer, initKeys, randInt } from "../node_modules/kontra/kontra.mjs";
import { Coin, randomCoin } from "./src/coin.js";
import { Dropzone } from "./src/dropzone.js";
import { Machine } from "./src/Machine.js";
import { settings, global, globalInit } from "./src/Global.js";
import { GridBG } from "./src/gridbg.js";
import { PowerTray } from "./src/powertoken.js";
import { cursorToCell } from "./src/controls.js";
import { PowerCursor } from "./src/powerCursor.js";
import *  as UI from "./src/UI.js";
import { Particles } from "./src/particles.js";

let { canvas } = init();

initPointer();
initKeys();

export class Game {	
	constructor() {
		globalInit();

		this.dropZone = new Dropzone();
		this.changes = null;
		this.gridBg = global.bg = new GridBG();
		this.powerCursor = global.powerCursor = new PowerCursor();
		this.machine = global.gameMachine = new Machine("NEXTROUND", {
			INPUT: {
				start: () => {
					global.combo = 1;
					if (global.gameOver) {
						machine.setStateAndRun("GAMEOVER");
						return;
					}
					dropZone.machine.run("unlock");

					if (!dropZone.coin) {
						let coin = randomCoin(dropZone.x);
						dropZone.coin = coin;
						coin.machine.run("start", [dropZone]);
						this.camera.addChild(coin);
					};

					this.zSort();
				},
				prime: () => {
					dropZone.machine.run("prime")
					this.camera.children = this.camera.children.filter((child) => child.ttl > 0);
				},
				drop: () => {
					if (!dropZone.machine.run("drop")) return;
					global.remainingTurns--;
					machine.setStateAndRun("DROPPING");
				},
				pendPower: () => {
					dropZone.machine.run("lock")
					machine.setStateAndRun("POWERPENDING")
				},
				power: (power) => {
					machine.setStateAndRun("POWER", "start", [power]);
				},
				restart: () => this.restart()
			},
			DROPPING: {
				start: () => {
					global.coins.sort((a,b) => (a.gridPos.y < b.gridPos.y) - (a.gridPos.y > b.gridPos.y)); 
					global.coins.forEach((coin) => {coin.machine.run("drop")});
					changes = global.coins.filter((coin) => !["IDLE", "DROPZONE"].includes(coin.machine.state)).length;
				},
				update: () => {
					if (global.gameOver) machine.setStateAndRun("GAMEOVER");
					else {
						let finished = global.coins.filter((coin) => coin.machine.state !== "IDLE").length === 0;
						if (finished) machine.setStateAndRun("POPPING");
					}
				}
			},
			POPPING: {
				start: () => {
					global.coins.forEach((coin) => {coin.machine.run("pop")});
					changes = global.coins.filter((coin) => coin.machine.state !== "IDLE").length;
				},
				update: () => {
					global.coins = global.coins.filter((coin) => coin.isAlive());
					let finished = global.coins.filter((coin) => !["IDLE", "DROPZONE"].includes(coin.machine.state)).length === 0;

					if (finished) {
						if (changes > 0) {
							this.machine.setStateAndRun("DROPPING");
							global.combo++;
						} else machine.setStateAndRun("NEXTROUND");
					}
				}
			},
			POWERPENDING: {
				start: () => {},
				cancel: () => {machine.setStateAndRun("INPUT")},
				activate: (power) => {machine.setStateAndRun("POWER", "start", [power])}
			},
			POWER: {
				start: (power) => {
					if (!power) return machine.setStateAndRun("INPUT")
					if (power.useTurn) global.remainingTurns--;
					power.activate(global.cursorCellPos.value);
					setTimeout(() => machine.setStateAndRun("POPPING"), power.effectDelay);
				},
			},
			NEXTROUND: {
				start: () => {
					if (global.remainingTurns > 0) machine.setStateAndRun("INPUT");
					else {
						let nextState = settings.roundMode == "rise" ? "RISING" : "DROPPING";
						global.remainingTurns = settings.turnsInRound;
						global.coins.forEach(coin => {
							coin.machine.setStateAndRun(nextState);
						});
						let prevValue = null;
						for (let i=0; i<settings.slots.x; i++) {
							let coinValue;
							do coinValue = randInt(1, global.maxCoinValue)
							while (coinValue === prevValue);
							prevValue = coinValue;
							let coin = new Coin(i, {
								gridPos: {x: i, y: settings.roundMode == "rise" ? settings.slots.y : -1},
								y: settings.roundMode == "rise" ? global.boardDims.height : -settings.coinRadius * 2 - settings.coinBuffer,
								dirtLayer: 2,
								value: coinValue,
							})
				
							global.coins.push(coin);
							coin.machine.setStateAndRun(nextState);
							this.camera.addChild(coin);
						}
					}
				},
				update: () => {
					let finished = global.coins.filter((coin) => coin.machine.state !== "IDLE").length === 0;

					if (global.gameOver) machine.setStateAndRun("GAMEOVER")
					else if (finished) machine.setStateAndRun("POPPING");
				}
			},
			GAMEOVER: {
				start: () => dropZone.machine.run("lock"),
				restart: () => this.restart()
			},
		});
		let {changes, machine, camera, dropZone} = this;

		this.camera = global.camera = GameObject({
			x: 700 / 2 - (settings.coinRadius + settings.coinBuffer) * (settings.slots.x - 1) + settings.coinBuffer / 2,
			y: settings.coinRadius * 2 + settings.coinBuffer * 2,
		})

		this.debugText = Text({
			y: global.boardDims.height + 10,
			color: "white",
			text: "hello",
			font: 'bold 12px Arial',
			update: () => {
				this.debugText.text = global.getDebugText("\n\n");
			}
		})

		this.score = Text({
			x: global.boardDims.width - settings.coinBuffer,
			y: global.boardDims.height + 10,
			color: "white",
			text: "hello",
			anchor: {x:1, y:0},
			textAlign: "right",
			font: 'bold 28px Arial',
			update: () => {this.score.text = `${global.score}`}
		})

		global.addDebugText(machine, "state", null, 3)
		this.camera.addChild(
			dropZone,
			this.gridBg,
			// this.debugText,
			this.score,
			new UI.RoundTicker(),
			new UI.RestartButton(),
			this.powerCursor,
			new Particles(),
			new PowerTray(),
		);
		machine.run("start");
	}

	update() {
		this.camera.update();
		this.machine.run("update");
		global.cursorCellPos.value = cursorToCell()
	}

	restart() {
		let dropColumn = (column) => {
			if (column == settings.slots.x) {
				setTimeout(() => game.game = new Game(), 400);
				return;}
			for (let i = 0; i < settings.slots.y; i++) {
				if (global.grid[column][i])
					global.grid[column][i].machine.run("restart");
			}

			setTimeout(() => dropColumn(column+1), 30);
		}

		dropColumn(0);
		this.zSort();
	}

	zSort() {this.camera.children.sort((a, b) => (a.zIndex > b.zIndex) - (a.zIndex < b.zIndex));}
}

export let game = {
	game: new Game()
};

let loop = GameLoop({
	update: () => {
		if (game.game != null)
			game.game.update()
	},
	render: () => game.game.camera.render(),
});

loop.start();
