import { init, Text, GameLoop, Sprite, GameObject, initPointer, randInt, onPointer } from "../node_modules/kontra/kontra.mjs";
import { Coin } from "./coin.js";
import { Dropzone } from "./dropzone.js";
import { Machine } from "./Machine.js";

let { canvas } = init();

initPointer();

let size = {x: 7, y: 7}
let changes = null;
let auto = false;
let dropPos = null;

let board = {
	width: size.x,
	height: size.y,
	grid: Array.from({ length:size.x }, i => Array.from({ length:size.y }, i => null)),
	gameOver: false,
	coins: [],
	coinBuffer: 12,
	coinRadius: 30,
	coinPalette: [ "#ffa600", "#ff764a", "#ef5675", "#bc5090", "#7a5195", "#5779CC", "#0073A8" ],
	nextRise: 4,
	riseTurns: 4,
}

let machine = new Machine("INPUT", {
	INPUT: {
		start: () => {
			if (board.gameOver) {
				machine.setStateAndRun("GAMEOVER");
				return;
			}
			dropZone.machine.dispatch("unlock");
			dropPos = auto ? randInt(0,board.width-1) : dropZone.x;
			let coin = new Coin(dropPos, board)
			coin.machine.dispatch("start", [dropZone]);
			camera.addChild(coin);
		},
		drop: () => {
			console.log("drop");			
			board.nextRise--;
			dropZone.machine.dispatch("drop", [dropPos]);
			machine.setStateAndRun("DROPPING");
		},
		power: (type) => {console.log(`Ran power ${type}`)},
	},
	DROPPING: {
		start: () => {
			board.coins.map((coin) => {coin.machine.dispatch("drop")});
			changes = board.coins.filter((coin) => coin.machine.state !== "IDLE").length;
		},
		update: () => {
			if (board.gameOver) machine.setStateAndRun("GAMEOVER");
			else {
				let finished = board.coins.filter((coin) => coin.machine.state !== "IDLE").length === 0;
				if (finished) machine.setStateAndRun("POPPING");
			}
		}
	},
	POPPING: {
		start: () => {
			board.coins.map((coin) => {coin.machine.dispatch("pop")});
			changes = board.coins.filter((coin) => coin.machine.state !== "IDLE").length;
		},
		update: () => {
			board.coins = board.coins.filter((coin) => coin.isAlive());
			let finished = board.coins.filter((coin) => coin.machine.state !== "IDLE").length === 0;

			if (finished) {
				if (changes > 0) machine.setStateAndRun("DROPPING");
				else machine.setStateAndRun("RISING");
			}
		}
	},
	RISING: {
		start: () => {
			if (board.nextRise > 0) {
				machine.setStateAndRun("INPUT");
			} else {				
				board.nextRise = board.riseTurns;
				board.coins.map(coin => {
					coin.machine.setStateAndRun("RISING");
				});
				for (let i=0; i<board.width; i++) {
					let coin = new Coin(i, board, {
						gridPos: {x: i, y: board.height},
						y: board.height * (board.coinRadius * 2 + board.coinBuffer),
						dirtLayer: 2
					})
					coin.machine.setStateAndRun("RISING");
					camera.addChild(coin);
				}
			}
		},
		update: () => {
			let finished = board.coins.filter((coin) => coin.machine.state !== "IDLE").length === 0;

			if (board.gameOver) machine.setStateAndRun("GAMEOVER")
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
				i*(board.coinRadius * 2 + board.coinBuffer)-board.coinBuffer/2,
				j*(board.coinRadius * 2 + board.coinBuffer)-board.coinBuffer/2,
				board.coinRadius * 2 + board.coinBuffer,
				(board.coinRadius * 2 + board.coinBuffer)
			);
			this.context.closePath();
		}}
	}
})


let camera = GameObject({
	x: 700 / 2 - (board.coinRadius + board.coinBuffer) * (board.width - 1) + board.coinBuffer,
	y: board.coinRadius * 2 + board.coinBuffer * 2,
})

let dropZone = new Dropzone(board, camera);
camera.addChild(dropZone, gridBg);

let debugText = Text({
	y: board.height * (board.coinRadius * 2 + board.coinBuffer) + 10,
	color: "white",
	text: "hello",
	font: 'bold 12px Arial',
	update: () => {debugText.text = `${board.nextRise}\n\n${machine.state}`}
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
