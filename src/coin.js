import { Machine } from "./Machine.js";
import { Sprite, Text, randInt, SpriteClass } from "../node_modules/kontra/kontra.mjs";
import { Particles, presets } from "./particles.js";
import { global, settings } from "./Global.js";

export class Coin extends SpriteClass {
	constructor(gridX, ...options) {
		// let value = randInt(1,7);
		let isBuried = 0 //randInt(1,3) === 3;
		let opacity = 1;
		let dropZone = null;

		let machine = new Machine("DROPZONE", {
			IDLE: {
				drop: () => machine.setStateAndRun("DROPPING", "start"),
				pop: () => machine.setStateAndRun("POPPING", "start"),
				crumble: () => {
					if (this.dirtLayer == 0) return;
					this.machine.setStateAndRun("CRUMBLING", "start");
				}
			},
			DROPZONE: {
				start: (dz) => {
					dropZone = dz
					this.gridPos.x = dropZone.xPos * (settings.coinRadius * 2 + settings.coinBuffer);
					this.x = this.gridPos.x * (settings.coinRadius * 2 + settings.coinBuffer);
				},
				update: () => {
					this.gridPos.x = Math.min(Math.max(0, dropZone.xPos), settings.slots.x -1);
					this.x = this.gridPos.x * (settings.coinRadius * 2 + settings.coinBuffer);
				},
				drop: () => {
					this.x = dropZone.xPos * (settings.coinRadius * 2 + settings.coinBuffer);
					machine.setStateAndRun("DROPPING", "start");
				}
			},
			DROPPING: {
				start: () => {
					this.dy = this.firstDrop ? settings.launchSpeed : settings.fallSpeed;
					this.firstDrop = false;
					// TODO: Wipe grid from main script instead.
					global.grid[this.gridPos.x][this.gridPos.y] = null;

					for (let i=this.gridPos.y; i<settings.slots.y; i++) {
						if (global.grid[this.gridPos.x][i] === null) this.gridPos.y = i;
						else break;
					}

					global.grid[this.gridPos.x][this.gridPos.y] = this;

					if (this.gridPos.y == -1) {
						global.gameOver = true;
						machine.setState("OOB");
					}
					else machine.setState("DROPPING");

					return true;
				},
				update: (dt) => {
					this.advance(dt)
					this.dy *= settings.fallAccel;
					let targetPos = this.gridPos.y * (settings.coinRadius * 2 + settings.coinBuffer);
					if (this.y > targetPos) {
						this.y = targetPos;
						machine.setState("IDLE");
					}
				}
			},
			POPPING: {
				start: () => {
					if (this.dirtLayer > 0) machine.setState("IDLE");
					else {
						let vCheck = this.machine.dispatch("checkVertical");
						let hCheck = this.machine.dispatch("checkHorizontal");
						if (vCheck || hCheck) {
							global.score += 1 * global.combo;
							this.parent.addChild(new Particles(
								{
									preset: presets.popping,
									x: this.x + settings.coinRadius,
									y: this.y + settings.coinRadius,
								}, 
								{
									color: settings.coinPalette[value-1],
									v: vCheck,
									h: hCheck,
								}
							));
							this.machine.dispatch("breakSurrounding");
							return true;
						} else machine.setState("IDLE");
					}
				},
				checkVertical: () => {
					let inColumn = 0;
					for (let i=settings.slots.y-1; i>=0; i--) {
						if (global.grid[this.gridPos.x][i] != null) inColumn++;
						else break;
					}
					if (inColumn == value) return true;
				},
				checkHorizontal: () => {
					let inRow = 1;
					let x = this.gridPos.x - 1;
					while (x >= 0) {
						if (global.grid[x][this.gridPos.y] == null) break;
						else inRow++;
						x--;
					}
					x = this.gridPos.x + 1;
					while (x < settings.slots.x) {
						if (global.grid[x][this.gridPos.y] == null) break;
						else inRow++;
						x++;
					}
					if (inRow === value) return true;
				},
				breakSurrounding: () => {
					let surrounding = [[1,0], [-1,0], [0,1], [0,-1]]
					surrounding.forEach((s) => {
						let checkPos = {x: this.gridPos.x + s[0], y: this.gridPos.y + s[1]};
						if (checkPos.x < 0 || checkPos.x >= settings.slots.x) return;
						else if (checkPos.y < 0 || checkPos.y >= settings.slots.y) return;
						let adjacent = global.grid[checkPos.x][checkPos.y]
						if (adjacent) adjacent.machine.dispatch("crumble");
					});
				},
				update: (dt) => {
					opacity -= 0.1;
					if (opacity <= 0) {
						global.grid[this.gridPos.x][this.gridPos.y] = null				
						machine.setState("IDLE");
						this.kill();
					}
				}
			},
			CRUMBLING: {
				start: () => {
					this.parent.addChild(new Particles(
						{
							x: this.x + settings.coinRadius,
							y: this.y + settings.coinRadius,
							preset: this.dirtLayer == 2 ? presets.crumbling : presets.breaking,
						}, {color: this.dirtLayer == 2 ? "#678" : "#ABC",}
					));
					this.dirtLayer--;
					setTimeout(() => machine.setState("IDLE"), 300);
				},
			},
			RISING: {
				start: () => {
					this.gridPos.y -= 1;
					global.grid[this.gridPos.x][this.gridPos.y] = this;
					if (this.gridPos.y <= -1) global.gameOver = true;
				},
				update: () => {
					this.y -= 4;
					let target = this.gridPos.y * (settings.coinRadius * 2 + settings.coinBuffer)
					if (this.y <= target) {
						this.machine.setState("IDLE");
						this.y = target;
					}
				},
			},
			OOB: {},
		});

		super (Object.assign({}, {
			gridPos: {x: gridX, y: -1},
			x: gridX * (settings.coinRadius * 2 + settings.coinBuffer),
			y: -1 * (settings.coinRadius * 2 + settings.coinBuffer),
			value: randInt(1,7),
			machine: machine,
			dirtLayer: isBuried ? 2 : 0,
			firstDrop: false,
			update: function(dt) {machine.dispatch("update", [dt])},
			draw: function() {this.opacity = opacity},
		}, ...options));
		
		let self = this;
		let value = this.value;
		
		global.coins.push(this);

		let text = Text({
			text: value,
			color: value >= 5 ? "#CDE" : "#311",
			font: 'bold 24px Arial',
			width: settings.coinRadius * 2,
			textAlign: "center",
			anchor: {x: 0, y: -0.8},
			opacity: self.dirtLayer > 0 ? 0: opacity,
			render: function() {
				this.opacity = self.dirtLayer > 0 ? 0: opacity;
				this.draw();
			}
		})

		let bg = Sprite({			
			render: function() {
				let ctx = this.context;
				let colour = self.dirtLayer > 0 ? self.dirtLayer > 1 ? "#678" : 
					"#ABC": settings.coinPalette[value-1];
				this.opacity = opacity;
				let dim = {
					top: -this.parent.y - 200,
					bottom: -this.parent.y + global.boardDims.height - settings.coinBuffer / 2,
					left: -this.parent.x - settings.coinBuffer / 2,
					right: -this.parent.x + global.boardDims.width - settings.coinBuffer / 2,
				}
				ctx.save()
				ctx.moveTo(dim.left, dim.top);
				ctx.lineTo(dim.right, dim.top);
				ctx.lineTo(dim.right, dim.bottom);
				ctx.lineTo(dim.left, dim.bottom);
				ctx.closePath();
				ctx.clip()
				ctx.fillStyle = colour;
				ctx.lineWidth = 2.5;
				ctx.strokeStyle = colour;
				ctx.beginPath();
				ctx.arc(settings.coinRadius, settings.coinRadius, settings.coinRadius-3, 0, 2 * Math.PI);
				ctx.closePath();
				ctx.fill();
				ctx.beginPath();
				ctx.arc(settings.coinRadius, settings.coinRadius, settings.coinRadius, 0, 2 * Math.PI);
				ctx.closePath();
				ctx.stroke();
				ctx.restore();
			}
		})

		this.addChild(bg, text);
	}

	kill() {
		this.ttl = 0;
		this.children = [];
	}
}