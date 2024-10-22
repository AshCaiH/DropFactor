import { Machine } from "./Machine.js";
import { Sprite, Text, randInt, SpriteClass } from "../node_modules/kontra/kontra.mjs";

export class Coin extends SpriteClass {

	constructor(gridX, board) {
		let value = randInt(1,7);
		let isBuried = randInt(1,8) === 8;
		let opacity = 1;

		let machine = new Machine("DROPZONE", {
			IDLE: {
				check: () => check(),
				drop: () => {machine.setStateAndRun("CHECKING", "checkfall")},
				pop: () => {machine.setStateAndRun("CHECKING", "checkPop")},
			},
			DROPZONE: {
				update: () => {
					
				},
				drop: () => {
					machine.setStateAndRun("CHECKING", "checkfall");
				}
			},
			DROPPING: {
				update: (dt) => {
					this.advance(dt)
					let targetPos = this.gridPos.y * (board.coinRadius * 2 + board.coinBuffer);
					if (this.y > targetPos) {
						this.y = targetPos;
						machine.setState("IDLE");
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
						machine.setState("OOB");
					}
					else machine.setState("DROPPING");

					return true;
				},

				checkPop: () => {
					if (value === 3 && !this.isBuried) {
						console.log(this);
						machine.setState("POPPING");
						return true;
					}
				}
			},
			POPPING: {
				update: (dt) => {
					opacity -= 0.03;
					if (opacity <= 0) {
						board.grid[this.gridPos.x][this.gridPos.y] = null
						board.coins.pop(this);
						this.parent.removeChild(this);
					}
				}
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
			opacity: 0.5,
			update: function(dt) {
				machine.dispatch("update", [dt]);
			},
			draw: function() {
				this.opacity = opacity;
			}
		});
		
		board.coins.push(this);

		let text = Text({
			opacity: isBuried ? 0: 1,
			text: value,
			color: value >= 5 ? "#CDE" : "#311",
			font: 'bold 24px Arial',
			width: board.coinRadius * 2,
			textAlign: "center",
			anchor: {x: 0, y: -0.8},
			render: function() {
				this.opacity = isBuried ? 0: opacity;
				this.draw();
			}
		})

		let bg = Sprite({
			color: isBuried ? "#ABC": board.coinPalette[value-1],
			render: function() {
				let ctx = this.context
				this.opacity = opacity;
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
	}
}