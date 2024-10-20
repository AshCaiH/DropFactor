import { Sprite, Text, GameObject, randInt } from "../node_modules/kontra/kontra.mjs";

export class Coin {
	states = Object.freeze({
		WAITING: 0,
		DROPPING: 1,
		IDLE: 2,
		POPPING: 3,
	});

	state = state.WAITING;

	constructor(gState, board) {
		gState.dropping = true;

		let value = randInt(1,7)
		let isBuried = randInt(1,8) === 8

		gridY = -1;

		// How many coins are already in column?
		let coinsInColumn = board.grid[gridX].filter(item => item !== null).length;
		gridY = board.height - coinsInColumn - 1;

		if (gridY === -1) gState.gameOver = true;

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
				this.context.strokeStyle = this.color;
				this.context.beginPath();
				this.context.arc(board.coinRadius, board.coinRadius, board.coinRadius-3, 0, 2 * Math.PI);
				this.context.closePath();
				this.context.fill();
				this.context.beginPath();
				this.context.arc(board.coinRadius, board.coinRadius, board.coinRadius, 0, 2 * Math.PI);
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
					gState.dropping = false;
					this.dropping = false;
					this.dy = 0;
				}
			}
		})

		coin.addChild(coinColour, text);

		board.grid[gridX][gridY] = coin;
	}
}
let i = 0;
const states = Object.freeze({
	WAITING: i++,
	DROPPING: i++,
	IDLE: i++,
	POPPING: i++,
});

export function makeCoin(board,gState,gridX,gridY) {
	let state = states.WAITING;

	gState.dropping = true;

	let value = randInt(1,7)
	let isBuried = randInt(1,8) === 8

	gridY = -1;

	// How many coins are already in column?
	let coinsInColumn = board.grid[gridX].filter(item => item !== null).length;
	gridY = board.height - coinsInColumn - 1;

	if (gridY === -1) gState.gameOver = true;

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
			this.context.strokeStyle = this.color;
			this.context.beginPath();
			this.context.arc(board.coinRadius, board.coinRadius, board.coinRadius-3, 0, 2 * Math.PI);
			this.context.closePath();
			this.context.fill();
			this.context.beginPath();
			this.context.arc(board.coinRadius, board.coinRadius, board.coinRadius, 0, 2 * Math.PI);
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
				gState.dropping = false;
				this.dropping = false;
				this.dy = 0;
			}
		}
	})

	coin.addChild(coinColour, text);

	board.grid[gridX][gridY] = coin;

	return coin;
}