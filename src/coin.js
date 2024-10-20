import { Sprite, Text, GameObject, randInt, SpriteClass } from "../node_modules/kontra/kontra.mjs";

// export class Dropzone extends SpriteClass {
//     constructor(b) {
//         super({
//             xPos: 0,
//             opacity: 1,
//             board: b,
//         });
//     }

//     draw () {
//         const { coinBuffer, coinRadius, height } = this.board;
//         let gradient = this.context.createLinearGradient(0, 0, 0, 600);
//         gradient.addColorStop(0, "#6785");
//         gradient.addColorStop(1, "#6782");

//         this.context.fillStyle = gradient;
//         this.context.beginPath();
//         this.context.fillRect(
//             -coinBuffer / 2 + this.xPos * (coinRadius * 2 + coinBuffer),
//             -coinBuffer / 2,
//             coinRadius * 2 + coinBuffer,
//             (coinRadius * 2 + coinBuffer) * height,
//         );
//         this.context.closePath();
//     }
// }

export const cStates = Object.freeze({
	WAITING: 0,
	DROPPING: 1,
	IDLE: 2,
	POPPING: 3,
	OOB: 4,
	RISING: 5,
});

export class Coin extends SpriteClass {

	constructor(gridX, board) {
		super ({
			gridPos: {x: gridX, y: -1},
			state: cStates.DROPPING,
			x: gridX * (board.coinRadius * 2 + board.coinBuffer),
			y: -1 * (board.coinRadius * 2 + board.coinBuffer),
			dy: 48,
			value: randInt(1,7),
			isBuried: randInt(1,8) === 8,			
			update: function(dt) {
				this.advance(dt)
				if (this.dropping && this.y >= this.gridPos.y * (board.coinRadius * 2 + board.coinBuffer)) {
					this.y = this.gridPos.y * (board.coinRadius * 2 + board.coinBuffer);
					gState.dropping = false;
					this.dropping = false;
					this.dy = 0;
				}
			},
		});

		let text = Text({
			opacity: this.isBuried ? 0: 1,
			text: value,
			color: value >= 5 ? "#CDE" : "#311",
			font: 'bold 24px Arial',
			width: board.coinRadius * 2,
			textAlign: "center",
			anchor: {x: 0, y: -0.8},
		})

		let bg = Sprite({
			color: isBuried ? "#ABC": board.coinPalette[value-1],
			render: function() {
				let ctx = this.context
				ctx.fillStyle = this.color;
				ctx.lineWidth = 2.5;
				ctx.strokeStyle = this.color;
				ctx.beginPath();
				ctx.arc(board.coinRadius, board.coinRadius, board.coinRadius-3, 0, 2 * Math.PI);
				ctx.closePath();
				ctx.fill();
				ctx.beginPath();
				ctx.arc(board.coinRadius, board.coinRadius, board.coinRadius, 0, 2 * Math.PI);
				ctx.closePath();
				ctx.stroke();
			}
		})

		this.addChild(bg, text);

		board.grid[gridX][gridY] = this;
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