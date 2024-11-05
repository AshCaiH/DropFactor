import { init, Text, GameLoop, GameObject, initPointer, initKeys, randInt } from "../node_modules/kontra/kontra.mjs";
import { Coin, randomCoin } from "./coin.js";
import { Dropzone } from "./dropzone.js";
import { Machine } from "./Machine.js";
import { settings, global } from "./Global.js";
import { GridBG } from "./gridbg.js";
import { PowerTray } from "./powertoken.js";
import { cursorToCell } from "./controls.js";
import { PowerCursor } from "./powerCursor.js";

let { canvas } = init();

initPointer();
initKeys();

class Game {
	constructor() {		
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
				},
				prime: () => {
					dropZone.machine.run("prime")
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
					console.log(`Running power ${power.name}`)
					machine.setStateAndRun("POWER", "start", [power]);
				},
			},
			DROPPING: {
				start: () => {
					global.coins.sort((a,b) => a.gridPos.y < b.gridPos.y); 
					global.coins.map((coin) => {coin.machine.run("drop")});
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
					global.coins.map((coin) => {coin.machine.run("pop")});
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
					console.log(global.grid);
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
						global.coins.map(coin => {
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
				start: () => {
					dropZone.machine.run("lock");
				}
			},
		});
		let {changes, machine, camera} = this;

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
			this.debugText,
			this.score,
			new PowerTray(),
			this.powerCursor
		);
		machine.run("start");
	}

	update() {
		this.camera.update();
		this.camera.children.sort((a, b) => a.zIndex > b.zIndex || (a.zIndex && !b.zIndex));
		this.machine.run("update");
		global.cursorCellPos.value = cursorToCell()
	}
}

let dropZone = new Dropzone();
let game = new Game();

let loop = GameLoop({
	update: (dt) => game.update(dt),
	render: () => game.camera.render(),
});

loop.start();
