import { init, Text, GameLoop, Sprite, GameObject, initPointer, randInt } from "../node_modules/kontra/kontra.mjs";
import { Coin } from "./coin.js";
import { Dropzone } from "./dropzone.js";
import { Machine } from "./Machine.js";

let { canvas } = init();

initPointer();

let size = {x: 7, y: 7}

let board = {
	width: size.x,
	height: size.y,
	grid: Array.from({ length:size.x }, (item, i) => Array.from({ length:size.y }, (item, i) => null)),
	gameOver: false,
	coins: [],
	coinBuffer: 12,
	coinRadius: 30,
	coinPalette: [ "#ffa600", "#ff764a", "#ef5675", "#bc5090", "#7a5195", "#374c80", "#003f5c" ]
}

let machine = new Machine("INPUT", {
	INPUT: {
		start: () => {
			dropZone.machine.dispatch("unlock");
		},
		drop: () => {
			let dropPos = randInt(0,board.width-1);
			camera.addChild(new Coin(dropPos, board));
			dropZone.machine.dispatch("drop", [dropPos]);
			machine.changeState("DROPPING");
		},
		power: (type) => {console.log(`Ran power ${type}`)},
	},
	DROPPING: {
		check: () => {
			let changes = false;

			board.coins.map((coin) => {
				coin.machine.changeState("CHECKING");
				if (coin.machine.dispatch("checkfall"))
					changes = true;
			})

			if (changes) machine.changeState("ANIMATION");
		},
		update: () => {
			for (const coin of board.coins) {
				if (coin.machine.state == "DROPPING") return;
			}

			if (board.gameOver) machine.changeState("GAMEOVER");
			else {
				machine.changeState("INPUT");
				machine.dispatch("start");
			}
		}
	},
	POPPING: {
		check: () => {},
		update: () => {}
	},
	RISING: {
		check: () => {},
		update: () => {}
	},
	GAMEOVER: {},
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
	update: () => {debugText.text = machine.state}
})

camera.addChild(debugText);

function update() {
	camera.update();

	machine.dispatch("drop");
	machine.dispatch("update");
}

let loop = GameLoop({
	update: (dt) => update(dt),
	render: () => camera.render(),
});

loop.start();
