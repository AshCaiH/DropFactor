import { init, GameLoop, Sprite, Text, GameObject, randInt } from "../node_modules/kontra/kontra.mjs";

let { canvas } = init();

// let gridSize = {width: 7, height: 7};
// let coinBuffer = 12;
// let coinRadius = 30;

// let palette = [ "#ffa600", "#ff764a", "#ef5675", "#bc5090", "#7a5195", "#374c80", "#003f5c" ]

// let dropping = false;
// let gameOver = false;

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

// let grid = Array.from({ length:gridSize.width }, (item, i) => Array.from({ length:gridSize.height }, (item, i) => null))

function makeCoin(gridX,gridY) {
	state.dropping = true;

	let value = randInt(1,7)
	let isBuried = randInt(1,8) === 8

	gridY = -1;

	// How many coins are already in column?
	let coinsInColumn = board.grid[gridX].filter(item => item !== null).length;
	gridY = board.height - coinsInColumn - 1;

	if (gridY === -1) state.gameOver = true;

	let text = Text({
		opacity: isBuried ? 0: 1,
		text: value,
		color: value >= 5 ? "#CDE" : "#311",
		font: 'bold 24px Arial',
		width: board.coinRadius * 2,
		textAlign: "center",
		anchor: {x: 0, y: -0.8},
	});

	let coinColour = Sprite({
		color: isBuried ? "#ABC": board.coinPalette[value-1],
		render: function() {
			this.context.fillStyle = this.color;
			this.context.lineWidth = 2.5;
			this.context.strokeStyle = "#456";
			this.context.beginPath();
			this.context.arc(board.coinRadius, board.coinRadius, board.coinRadius, 0, 2 * Math.PI);
			this.context.closePath();
			this.context.fill();
			this.context.beginPath();
			this.context.arc(board.coinRadius, board.coinRadius, board.coinRadius - 3, 0, 2 * Math.PI);
			this.context.closePath();
			this.context.stroke();
		}
	})

	let coin = GameObject({
		gridPos: {x: gridX, y: gridY},
		x: gridX * (board.coinRadius * 2 + board.coinBuffer),
		y: -1 * (board.coinRadius * 2 + board.coinBuffer),
		dy: 48,
		bg: coinColour,
		text: text,
		dropping: true,
		update: function(dt) {
			this.advance()
			if (this.dropping && this.y >= this.gridPos.y * (board.coinRadius * 2 + board.coinBuffer)) {
				this.y = this.gridPos.y * (board.coinRadius * 2 + board.coinBuffer);
				state.dropping = false;
				this.dropping = false;
				this.dy = 0;
			}
		}
	})

	coin.addChild(coinColour, text);

	board.grid[gridX][gridY] = coin;

	return coin;
}

let gridBg = Sprite({
	render: function() {
		for (let i=0; i<7; i++) {
		for (let j=0; j<7; j++) {
			this.context.lineWidth = 1.5;
			this.context.strokeStyle = "#345";
			this.context.stroke();
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
	y: board.coinRadius + board.coinBuffer * 2,
})

camera.addChild(gridBg);

function update() {
	camera.update()
	if (!state.dropping && !state.gameOver)
		camera.addChild(makeCoin(randInt(0,board.width-1),0));
}

let loop = GameLoop({
	update: (dt) => update(dt),
	render: () => camera.render(),
});

loop.start();
