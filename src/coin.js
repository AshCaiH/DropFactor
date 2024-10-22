import { Machine } from "./Machine.js";
import { Sprite, Text, randInt, SpriteClass } from "../node_modules/kontra/kontra.mjs";

export class Coin extends SpriteClass {

	constructor(gridX, board) {
		let value = randInt(1,7);
		let isBuried = randInt(1,8) === 8;
		let opacity = 1;

		let machine = new Machine("DROPZONE", {
			IDLE: {
				drop: () => {machine.setStateAndRun("DROPPING", "start")},
				pop: () => {machine.setStateAndRun("POPPING", "start")},
			},
			DROPZONE: {
				update: () => {
					
				},
				drop: () => {
					machine.setStateAndRun("DROPPING", "start");
				}
			},
			DROPPING: {
				start: () => {
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
				update: (dt) => {
					this.advance(dt)
					let targetPos = this.gridPos.y * (board.coinRadius * 2 + board.coinBuffer);
					if (this.y > targetPos) {
						this.y = targetPos;
						machine.setState("IDLE");
					}
				}
			},
			POPPING: {
				start: () => {
					if (this.isBuried) machine.setState("IDLE");
					else {
						let inColumn = 0;
						for (let i=board.height-1; i>=0; i--) {
							if (board.grid[this.gridPos.x][i] != null) inColumn++;
							else break;
						}
						if (inColumn == value) return true;
						let inRow = 1;
						let x = this.gridPos.x - 1;
						while (x >= 0) {
							if (board.grid[x][this.gridPos.y] == null) break;
							else inRow++;
							x--;
						}
						x = this.gridPos.x + 1;
						while (x < board.width) {
							if (board.grid[x][this.gridPos.y] == null) break;
							else inRow++;
							x++;
						}
						if (inRow == value) return true;
						machine.setState("IDLE");
					}
				},
				update: (dt) => {
					opacity -= 0.03;
					if (opacity <= 0) {
						board.grid[this.gridPos.x][this.gridPos.y] = null				
						this.ttl = 0;
						machine.setState("IDLE");
					}
				}
			},
			RISING: {
				update: () => {},
			},
			OOB: {},
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
				// this.text = machine.state;
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