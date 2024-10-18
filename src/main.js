import { init, GameLoop, Sprite, Text, GameObject, randInt } from "../node_modules/kontra/kontra.mjs";

let { canvas } = init();

let gridSize = {width: 7, height: 7};
let coinBuffer = 12;
let coinRadius = 30;

let palette = [ "#ffa600", "#ff764a", "#ef5675", "#bc5090", "#7a5195", "#374c80", "#003f5c" ]

let dropping = false;
let gameOver = false;

let grid = Array.from({ length:gridSize.width }, (item, i) => Array.from({ length:gridSize.height }, (item, i) => null))

function makeCoin(gridX,gridY) {
	dropping = true;

	let value = randInt(1,7)
	let isBuried = randInt(1,8) === 8

	gridY = -1;

	// How many coins are already in column?
	let coinsInColumn = grid[gridX].filter(item => item !== null).length;
	gridY = gridSize.height - coinsInColumn - 1;
	console.log(gridY);

	if (gridY === -1) gameOver = true;

	let text = Text({
		opacity: isBuried ? 0: 1,
		text: value,
		color: value >= 5 ? "#CDE" : "#311",
		font: 'bold 24px Arial',
		width: coinRadius * 2,
		textAlign: "center",
		anchor: {x: 0, y: -0.8},
	});

	let coinColour = Sprite({
		color: isBuried ? "#ABC": palette[value-1],
		render: function() {
			this.context.fillStyle = this.color;
			this.context.lineWidth = 2.5;
			this.context.strokeStyle = "#456";
			this.context.beginPath();
			this.context.arc(coinRadius, coinRadius, coinRadius, 0, 2 * Math.PI);
			this.context.closePath();
			this.context.fill();
			this.context.beginPath();
			this.context.arc(coinRadius, coinRadius, coinRadius - 3, 0, 2 * Math.PI);
			this.context.closePath();
			this.context.stroke();
		}
	})

	let coin = GameObject({
		gridPos: {x: gridX, y: gridY},
		x: gridX * (coinRadius * 2 + coinBuffer),
		y: -1 * (coinRadius * 2 + coinBuffer),
		dy: 48,
		bg: coinColour,
		text: text,
		dropping: true,
		update: function(dt) {
			this.advance()
			if (this.dropping && this.y >= this.gridPos.y * (coinRadius * 2 + coinBuffer)) {
				this.y = this.gridPos.y * (coinRadius * 2 + coinBuffer);
				dropping = false;
				this.dropping = false;
				this.dy = 0;
			}
		}
	})

	coin.addChild(coinColour, text);

	grid[gridX][gridY] = coin;

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
				i*(coinRadius * 2 + coinBuffer)-coinBuffer/2,
				j*(coinRadius * 2 + coinBuffer)-coinBuffer/2,
				coinRadius * 2 + coinBuffer,
				(coinRadius * 2 + coinBuffer)
			);
			this.context.closePath();
		}}
	}
})
		
let camera = GameObject({
	x: 700 / 2 - (coinRadius + coinBuffer) * (gridSize.width - 1) + coinBuffer,
	y: coinRadius + coinBuffer * 2,
})

camera.addChild(gridBg);

function update() {
	camera.update()
	if (!dropping && !gameOver)
		camera.addChild(makeCoin(randInt(0,gridSize.width-1),0));
}

let loop = GameLoop({
	update: (dt) => update(dt),
	render: () => camera.render(),
});

loop.start();
