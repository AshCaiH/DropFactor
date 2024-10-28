import { init, Text, GameLoop, Sprite, GameObject, initPointer, randInt, onPointer, initKeys, onKey } from "../node_modules/kontra/kontra.mjs";
import { Coin } from "./coin.js";
import { Dropzone } from "./dropzone.js";
import { Machine } from "./Machine.js";
import { settings, global } from "./Global.js";

let { canvas } = init();

initPointer();
initKeys();

let changes = null;
let dropPos = null;

function randomCoin() {
	if (!settings.weightCoins) return randInt(0,settings.slots.x-1);
	let sumWeights = Object.values(global.coinWeights).reduce((sum, n) => sum + n, 0);
	let runningTotal = 0;
	let randomNumber = randInt(0,sumWeights);
	let value = null;
	console.log("random", sumWeights);
	console.log("weights", Object.keys(global.coinWeights).length);
	for (let i = 1; i <= Object.keys(global.coinWeights).length; i++) {
		console.log(i, randomNumber, runningTotal);
		runningTotal += global.coinWeights[i]
		if (randomNumber <= runningTotal) {
			value = i;
			break;
		}
	}
	Object.keys(global.coinWeights).forEach(key => global.coinWeights[key]++);
	global.coinWeights[value] = 1;
	return value;
};

let machine = new Machine("NEXTROUND", {
	INPUT: {
		start: () => {
			console.log(global.coinWeights);
			global.combo = 1;
			if (global.gameOver) {
				machine.setStateAndRun("GAMEOVER");
				return;
			}
			dropZone.machine.dispatch("unlock");

			if (!dropZone.coin) {
				dropPos = dropZone.x;
				let coin = new Coin(dropPos, {
					value: randomCoin(),
					firstDrop: true
				})
				dropZone.coin = coin;
				coin.machine.dispatch("start", [dropZone]);
				camera.addChild(coin);
			};
		},
		drop: () => {		
			global.remainingTurns--;
			dropZone.machine.dispatch("drop");
			machine.setStateAndRun("DROPPING");
		},
		power: (type = null) => {
			console.log(`Ran power ${type}`)
			machine.setStateAndRun("POWER");
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
			console.log(global.coins.filter((coin) => coin.machine.state !== "IDLE").length);

			if (finished) {
				if (changes > 0) {
					machine.setStateAndRun("DROPPING");
					global.combo++;
				} else machine.setStateAndRun("NEXTROUND");
			}
		}
	},	
	POWER: {
		start: () => {
			global.remainingTurns--;
			global.coins.forEach(coin => {
			coin.machine.dispatch("crumble");
			setTimeout(() => machine.setStateAndRun("POPPING"), 300);
		})},
	},
	NEXTROUND: {
		start: () => {
			console.log(global.remainingTurns);
			if (global.remainingTurns > 0) machine.setStateAndRun("INPUT");
			else {
				let nextState = settings.roundMode == "rise" ? "RISING" : "DROPPING";
				console.log(nextState);
				global.remainingTurns = settings.turnsInRound;
				global.coins.map(coin => {
					coin.machine.setStateAndRun(nextState);
				});
				for (let i=0; i<settings.slots.x; i++) {
					let coin = new Coin(i, {
						gridPos: {x: i, y: settings.roundMode == "rise" ? settings.slots.y : -1},
						y: settings.roundMode == "rise" ? global.boardDims.height : -settings.coinRadius * 2 - settings.coinBuffer,
						dirtLayer: 2
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
		start: () => {}
	},
});

let gridBg = Sprite({
	render: function() {
		for (let i=0; i<settings.slots.x; i++) {
		for (let j=0; j<settings.slots.y; j++) {
			this.context.lineWidth = 1.5;
			this.context.strokeStyle = "#345";
			this.context.beginPath();
			this.context.strokeRect(
				i*(settings.coinRadius * 2 + settings.coinBuffer)-settings.coinBuffer/2,
				j*(settings.coinRadius * 2 + settings.coinBuffer)-settings.coinBuffer/2,
				settings.coinRadius * 2 + settings.coinBuffer,
				(settings.coinRadius * 2 + settings.coinBuffer)
			);
			this.context.closePath();
		}}
	}
})


let camera = GameObject({
	x: 700 / 2 - (settings.coinRadius + settings.coinBuffer) * (settings.slots.x - 1) + settings.coinBuffer,
	y: settings.coinRadius * 2 + settings.coinBuffer * 2,
})
global.camera = camera;

let dropZone = new Dropzone();
camera.addChild(dropZone, gridBg);

let debugText = Text({
	y: global.boardDims.height + 10,
	color: "white",
	text: "hello",
	font: 'bold 12px Arial',
	update: () => {debugText.text = `Turns: ${global.remainingTurns}\n\nMulti: x${global.combo}\n\n${Object.values(global.coinWeights)}\n\n${machine.state}`}
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

camera.addChild(debugText, score);
machine.dispatch("start");

onPointer('up', function(e) {machine.dispatch("drop");});

function update() {
	onKey('p', function(e) {machine.dispatch("power")});

	camera.update();
	machine.dispatch("update");
}

let loop = GameLoop({
	update: (dt) => update(dt),
	render: () => camera.render(),
});

loop.start();
