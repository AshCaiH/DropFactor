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

let dropZone = new Dropzone();
let changes = null;

let machine = global.gameMachine = new Machine("NEXTROUND", {
	INPUT: {
		start: () => {
			global.combo = 1;
			if (global.gameOver) {
				machine.setStateAndRun("GAMEOVER");
				return;
			}
			dropZone.machine.dispatch("unlock");

			if (!dropZone.coin) {
				let coin = randomCoin(dropZone.x);
				dropZone.coin = coin;
				coin.machine.dispatch("start", [dropZone]);
				camera.addChild(coin);
			};
		},
		prime: () => {
			dropZone.machine.dispatch("prime")
		},
		drop: () => {
			if (!dropZone.machine.dispatch("drop")) return;
			global.remainingTurns--;
			machine.setStateAndRun("DROPPING");
		},
		pendPower: () => {
			dropZone.machine.dispatch("lock")
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
			global.coins.map((coin) => {coin.machine.dispatch("drop")});
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
			global.coins.map((coin) => {coin.machine.dispatch("pop")});
			changes = global.coins.filter((coin) => coin.machine.state !== "IDLE").length;
		},
		update: () => {
			global.coins = global.coins.filter((coin) => coin.isAlive());
			let finished = global.coins.filter((coin) => !["IDLE", "DROPZONE"].includes(coin.machine.state)).length === 0;

			if (finished) {
				if (changes > 0) {
					machine.setStateAndRun("DROPPING");
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
					camera.addChild(coin);
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
			dropZone.machine.dispatch("lock");
		}
	},
});

let camera = global.camera = GameObject({
	x: 700 / 2 - (settings.coinRadius + settings.coinBuffer) * (settings.slots.x - 1) + settings.coinBuffer / 2,
	y: settings.coinRadius * 2 + settings.coinBuffer * 2,
})

let gridBg = global.bg = new GridBG();
camera.addChild(dropZone, gridBg);

let debugText = Text({
	y: global.boardDims.height + 10,
	color: "white",
	text: "hello",
	font: 'bold 12px Arial',
	update: () => {
		debugText.text = global.getDebugText("\n\n");
	}
})

let score = Text({
	x: global.boardDims.width - settings.coinBuffer,
	y: global.boardDims.height + 10,
	color: "white",
	text: "hello",
	anchor: {x:1, y:0},
	textAlign: "right",
	font: 'bold 28px Arial',
	update: () => {score.text = `${global.score}`}
})

let powerCursor = global.powerCursor = new PowerCursor();

global.addDebugText(machine, "state", null, 3)
camera.addChild(debugText, score, new PowerTray(), powerCursor);
machine.dispatch("start");

function update() {
	camera.update();
	camera.children.sort((a, b) => a.zIndex > b.zIndex || (a.zIndex && !b.zIndex));
	machine.dispatch("update");
	global.cursorCellPos.value = cursorToCell()
}

let loop = GameLoop({
	update: (dt) => update(dt),
	render: () => camera.render(),
});

loop.start();
