import { init, GameLoop, Sprite, GameObject, initPointer, getPointer, randInt } from "../node_modules/kontra/kontra.mjs";
import { makeCoin } from "./coin.js";
import { Dropzone } from "./dropzone.js";

let { canvas } = init();

initPointer();

let size = {x: 7, y: 7}

let board = {
	width: size.x,
	height: size.y,
	grid: Array.from({ length:size.x }, (item, i) => Array.from({ length:size.y }, (item, i) => null)),
	coinBuffer: 12,
	coinRadius: 30,
	coinPalette: [ "#ffa600", "#ff764a", "#ef5675", "#bc5090", "#7a5195", "#374c80", "#003f5c" ]
}

let state = {
	dropping: false,
	gameOver: false
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

let dropZone = new Dropzone(board);

let camera = GameObject({
	x: 700 / 2 - (board.coinRadius + board.coinBuffer) * (board.width - 1) + board.coinBuffer,
	y: board.coinRadius * 2 + board.coinBuffer * 2,
})

function cursorToCell() {
	const cursorPos = (({ x, y }) => ({ x, y }))(getPointer());

	Object.keys(cursorPos).forEach(function(k, index) {cursorPos[k] -= camera[k] - board.coinBuffer/2});

	Object.keys(cursorPos).forEach(function(k, index) {cursorPos[k] = Math.floor(cursorPos[k]/(board.coinRadius * 2 + board.coinBuffer))});

	return cursorPos;
}

camera.addChild(dropZone, gridBg);

function update() {
	camera.update();
    let cellPos = cursorToCell();
    dropZone.xPos = cellPos.x;
    dropZone.opacity = (cellPos.x < 0 || cellPos.x >= board.width) ? 0 : 1;
	if (!state.dropping && !state.gameOver)
		camera.addChild(makeCoin(board,state,randInt(0,board.width-1),0));
}

let loop = GameLoop({
	update: (dt) => update(dt),
	render: () => camera.render(),
});

loop.start();
