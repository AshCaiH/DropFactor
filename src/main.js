import { init, GameLoop, Sprite, GameObject, initPointer, randInt } from "../node_modules/kontra/kontra.mjs";
import { Coin, cStates } from "./coin.js";
import { Dropzone } from "./dropzone.js";

let { canvas } = init();

initPointer();

let states = {
	CONTROL: 0,
	DROPPING: 1,
	GAMEOVER: 2,
}

let state = states.control;

let size = {x: 7, y: 7}

let board = {
	width: size.x,
	height: size.y,
	grid: Array.from({ length:size.x }, (item, i) => Array.from({ length:size.y }, (item, i) => null)),
	gameOver: false,
	coinBuffer: 12,
	coinRadius: 30,
	coinPalette: [ "#ffa600", "#ff764a", "#ef5675", "#bc5090", "#7a5195", "#374c80", "#003f5c" ]
}

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

function update() {
	camera.update();

	let coins = board.grid.flat().filter(coin => coin != null);
	
	if (board.gameOver)
		state = states.GAMEOVER;
	else if (coins.filter(coin => coin.state === cStates.DROPPING).length > 0)
		state == states.DROPPING;
	else state = states.CONTROL;

	if (state == states.CONTROL) {
		camera.addChild(new Coin(randInt(0,board.width-1), board));
	}
}

let loop = GameLoop({
	update: (dt) => update(dt),
	render: () => camera.render(),
});

loop.start();
