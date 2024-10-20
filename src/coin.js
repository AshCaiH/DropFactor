import { Sprite, Text, GameObject, randInt, SpriteClass } from "../node_modules/kontra/kontra.mjs";

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
		let value = randInt(1,7);
		let isBuried = randInt(1,8) === 8;
		let state = cStates.DROPPING;

		super ({
			gridPos: {x: gridX, y: -1},
			state: state,
			x: gridX * (board.coinRadius * 2 + board.coinBuffer),
			y: -1 * (board.coinRadius * 2 + board.coinBuffer),
			dy: 48,
			value: value,
			isBuried: isBuried,
			update: function(dt) {
				if (this.gridPos.y == -1) {this.state = cStates.OOB; board.gameOver = true; return}
				this.advance(dt)
				if (state === cStates.DROPPING && this.y > this.gridPos.y * (board.coinRadius * 2 + board.coinBuffer)) {
					this.y = this.gridPos.y * (board.coinRadius * 2 + board.coinBuffer);					
					this.state = cStates.IDLE;
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

		let coinsInColumn = board.grid[gridX].filter(item => item !== null).length;
		this.gridPos.y = board.height - coinsInColumn - 1;

		board.grid[this.gridPos.x][this.gridPos.y] = this;
	}
}