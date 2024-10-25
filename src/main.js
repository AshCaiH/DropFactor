import { init, Text, GameLoop, Sprite, GameObject, initPointer, randInt, onPointer } from "../node_modules/kontra/kontra.mjs";
import { Coin } from "./coin.js";
import { Dropzone } from "./dropzone.js";
import { Machine } from "./Machine.js";
import { settings, global } from "./Global.js";

let { canvas } = init();

initPointer();

let changes = null;
let auto = false;
let dropPos = null;

let machine = new Machine("NEXTROUND", {
	INPUT: {
		start: () => {
			if (global.gameOver) {
				machine.setStateAndRun("GAMEOVER");
				return;
			}
			dropZone.machine.dispatch("unlock");
			dropPos = auto ? randInt(0,settings.slots.x-1) : dropZone.x;
			let coin = new Coin(dropPos, {firstDrop: true})
			coin.machine.dispatch("start", [dropZone]);
			camera.addChild(coin);
		},
		drop: () => {		
			global.remainingTurns--;
			dropZone.machine.dispatch("drop", [dropPos]);
			machine.setStateAndRun("DROPPING");
		},
		power: (type) => {console.log(`Ran power ${type}`)},
	},
	DROPPING: {
		start: () => {
			global.coins.sort((a,b) => a.gridPos.y < b.gridPos.y); 
			global.coins.map((coin) => {coin.machine.dispatch("drop")});
			changes = global.coins.filter((coin) => coin.machine.state !== "IDLE").length;
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
			let finished = global.coins.filter((coin) => coin.machine.state !== "IDLE").length === 0;

			if (finished) {
				if (changes > 0) machine.setStateAndRun("DROPPING");
				else machine.setStateAndRun("NEXTROUND");
			}
		}
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
						y: settings.roundMode == "rise" ? global.boardDims.height : -settings.coinRadius - settings.coinBuffer,
						dirtLayer: 2
					})
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
		for (let i=0; i<7; i++) {
		for (let j=0; j<7; j++) {
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
	update: () => {debugText.text = `${global.remainingTurns}\n\n${machine.state}`}
})

camera.addChild(debugText);
machine.dispatch("start");

onPointer('down', function(e, object) {
	dropPos = dropZone.xPos;
	machine.dispatch("drop");
});

function update() {
	camera.update();

	machine.dispatch("update");
}

let loop = GameLoop({
	update: (dt) => update(dt),
	render: () => camera.render(),
});

loop.start();
