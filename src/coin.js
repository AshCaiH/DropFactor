import { Machine } from "./Machine.js";
import { Sprite, Text, randInt, SpriteClass } from "../node_modules/kontra/kontra.mjs";

export class Coin extends SpriteClass {

	constructor(gridX, board) {
		let value = randInt(1,7);
		let isBuried = randInt(1,8) === 8;

		let machine = new Machine("DROPZONE", {
			IDLE: {
				check: () => check(),
			},
			DROPZONE: {
				update: () => {
					
				},
				drop: () => {
					board.coins.push(this);
					machine.changeState("CHECKING");
					machine.dispatch("checkfall");
				}
			},
			DROPPING: {
				update: (dt) => {
					this.advance(dt)
					let targetPos = this.gridPos.y * (board.coinRadius * 2 + board.coinBuffer);
					if (this.y > targetPos) {
						this.y = targetPos;
						machine.changeState("IDLE");
					}
				}
			},
			RISING: {
				update: () => {},
			},
			OOB: {},
			CHECKING: {
				checkfall: () => {
					board.grid[this.gridPos.x][this.gridPos.y] = null;

					for (let i=this.gridPos.y; i<board.height; i++) {
						if (board.grid[this.gridPos.x][i] === null) this.gridPos.y = i;
						else break;
					}

					board.grid[this.gridPos.x][this.gridPos.y] = this;

					if (this.gridPos.y == -1) {
						board.gameOver = true;
						machine.changeState("OOB");
					}
					else machine.changeState("DROPPING");

					return true;
				}
			},
			POPPING: {
				update: () => {}
			},
		});

		super ({
			gridPos: {x: gridX, y: -1},
			x: gridX * (board.coinRadius * 2 + board.coinBuffer),
			y: -1 * (board.coinRadius * 2 + board.coinBuffer),
			dy: 48,
			value: value,
			isBuried: isBuried,
			machine: machine,
			update: function(dt) {
				machine.dispatch("update", dt);
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

		machine.dispatch("drop");
	}
}