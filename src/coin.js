import { Machine } from "./Machine.js";
import { Sprite, Text, randInt, SpriteClass } from "../node_modules/kontra/kontra.mjs";
import { Particles, presets } from "./particles.js";
import { global, settings } from "./Global.js";

export class Coin extends SpriteClass {
	constructor(gridX, ...options) {
		let isBuried = 0 //randInt(1,3) === 3;
		let dropZone = null;

		let machine = new Machine("DROPZONE", {
			IDLE: {
				drop: () => machine.setStateAndRun("DROPPING", "start"),
				pop: () => machine.setStateAndRun("POPPING", "start"),
				crumble: () => {
					if (this.dirtLayer == 0) return;
					this.machine.setStateAndRun("CRUMBLING", "start");
				},
				snipe: () => {
					this.doomed = true;
				},
				changeValue: (increase = true) => machine.setStateAndRun("CHANGEVALUE", "start", [increase]),
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
					this.dy = settings.fallSpeed;
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
					if (this.dirtLayer > 0 && !this.doomed) machine.setState("IDLE");
					else {
						let vCheck = this.machine.dispatch("checkVertical");
						let hCheck = this.machine.dispatch("checkHorizontal");
						if (vCheck.length > 0 || hCheck.length > 0 || this.doomed) {
							global.bg.lightup(vCheck.concat(hCheck));
							global.score += 1 * global.combo;
							this.parent.addChild(new Particles(
								{
									preset: presets.popping,
									x: this.x + settings.coinRadius,
									y: this.y + settings.coinRadius,
								}, 
								{
									color: settings.coinPalette[self.value-1],
									v: vCheck,
									h: hCheck,
								}
							));
							if (!this.doomed) this.machine.dispatch("breakSurrounding");
							return true;
						} else machine.setState("IDLE");
					}
				},
				checkVertical: () => {
					let cells = []
					for (let y=settings.slots.y-1; y>=0; y--) {
						if (global.grid[this.gridPos.x][y] != null) cells.push(`${this.gridPos.x},${y}`);
						else break;
					}
					return cells.length === this.value ? cells : [];
				},
				checkHorizontal: () => {
					let x = this.gridPos.x - 1;
					let cells = [`${this.gridPos.x},${this.gridPos.y}`];
					while (x >= 0) {
						if (global.grid[x][this.gridPos.y] == null) break;
						else cells.push(`${x},${this.gridPos.y}`);
						x--;
					}
					x = this.gridPos.x + 1;
					while (x < settings.slots.x) {
						if (global.grid[x][this.gridPos.y] == null) break;
						else cells.push(`${x},${this.gridPos.y}`);
						x++;
					}
					return cells.length === this.value ? cells : [];
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
					this.opacity -= 0.1;
					if (this.opacity <= 0) {
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
			CHANGEVALUE: {
				start: (increase=true) => {
					if (this.dirtLayer > 0) return machine.setState("IDLE");;
					if (increase) this.value++;
					else this.value--;

					if (this.value <= 0 || this.value > global.maxCoinValue) {
						this.value = randInt(1, global.maxCoinValue);
						this.dirtLayer = 1;
					}

					machine.setState("IDLE");
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
			POWERPENDING: {},
			POWERSELECTED: {},
			OOB: {},
		});

		super (Object.assign({}, {
			gridPos: {x: gridX, y: -1},
			x: gridX * (settings.coinRadius * 2 + settings.coinBuffer),
			y: -1 * (settings.coinRadius * 2 + settings.coinBuffer),
			value: randInt(1,global.maxCoinValue),
			machine: machine,
			dirtLayer: isBuried ? 2 : 0,
			opacity: 1,
			doomed: false,
			update: function(dt) {machine.dispatch("update", [dt])},
		}, ...options));
		
		let self = this;

		let text = Text({
			text: self.value,
			color: self.value >= 5 ? "#CDE" : "#311",
			font: 'bold 24px Arial',
			width: settings.coinRadius * 2,
			textAlign: "center",
			anchor: {x: 0, y: -0.8},
			opacity: self.dirtLayer > 0 ? 0: this.opacity,
			render: function() {
				this.opacity = self.dirtLayer > 0 ? 0: parent.opacity;
				this.text = self.value;
				this.color = self.value >= 5 ? "#CDE" : "#311";
				this.draw();
			}
		})

		let bg = Sprite({			
			render: function() {
				let ctx = this.context;
				let colour = self.dirtLayer > 0 ? self.dirtLayer > 1 ? "#678" : 
					"#ABC": settings.coinPalette[self.value-1];
				this.opacity = parent.opacity;
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
		global.grid[this.gridPos.x][this.gridPos.y] = null;
		this.ttl = 0;
		this.children = [];
	}
}

export function randomCoin(xPos) {
	const {weightCoins, slots} = settings;
	const {coinWeights, maxCoinValue} = global;

	if (!weightCoins) return randInt(0,slots.x-1);
	let sumWeights = Object.values(coinWeights).reduce((sum, n) => sum + n, 0);
	let runningTotal = 0;
	let randomNumber = randInt(0,sumWeights);
	let value = null;
	for (let i = 1; i <= Object.keys(coinWeights).length; i++) {
		runningTotal += coinWeights[i]
		if (randomNumber <= runningTotal) {
			value = i;
			break;
		}
	}
	Object.keys(coinWeights).forEach(key => coinWeights[key]+=Object.keys(coinWeights).length);
	coinWeights[value] = 1;
	let buried = value > maxCoinValue;
	let coin = new Coin(xPos, {
		value: buried ? randInt(1,maxCoinValue) : value,
		dirtLayer: buried ? randInt(1,2) : 0,
	})
	return coin;
};