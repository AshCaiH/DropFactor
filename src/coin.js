import { Machine } from "./Machine.js";
import { Sprite, Text, randInt, SpriteClass } from "../node_modules/kontra/kontra.mjs";
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
				restart: () => machine.setStateAndRun("RESTARTING"),
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
					this.x = this.gridPos.x * (settings.coinRadius * 2 + settings.coinBuffer);
					machine.setStateAndRun("DROPPING", "start");
				}
			},
			DROPPING: {
				start: () => {					
					this.x = this.gridPos.x * (settings.coinRadius * 2 + settings.coinBuffer);
					this.dy = settings.fallSpeed;
					global.grid[this.gridPos.x][this.gridPos.y] = null;

					for (let i=this.gridPos.y; i<settings.slots.y; i++) {
						if (global.grid[this.gridPos.x][i] === null) this.gridPos.y = i;
						else break;
					}

					global.grid[this.gridPos.x][this.gridPos.y] = this;

					if (this.gridPos.y == -1) {
						global.gameOver = true;
						// machine.setState("OOB");
					}
					else machine.setState("DROPPING");

					return true;
				},
				update: () => {
					this.advance()
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
						let vCheck = this.machine.run("checkVertical");
						let hCheck = this.machine.run("checkHorizontal");
						if (vCheck.length > 0 || hCheck.length > 0 || this.doomed) {
							global.bg.lightup(vCheck.concat(hCheck));
							global.score.value += 1 * global.combo;
							global.particles.addEffect("popping",
								{
									pos: {
										x: this.x + settings.coinRadius,
										y: this.y + settings.coinRadius,
									},
									color: settings.coinPalette[this.value-1],
								}
							);
							if (!this.doomed) this.machine.run("breakSurrounding");
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
						if (adjacent) adjacent.machine.run("crumble");
					});
				},
				update: () => {
					this.fadeout -= 0.1;
					if (this.fadeout <= 0) {
						machine.setState("IDLE");
						this.kill();
					}
				}
			},
			CRUMBLING: {
				start: () => {
					global.particles.addEffect("crumbling",
						{
							pos: {
								x: this.x + settings.coinRadius,
								y: this.y + settings.coinRadius,
							},
						}
					);
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
			RESTARTING: {
				start: () => {
					global.particles.addEffect("restarting",
						{
							pos: {
								x: this.x + settings.coinRadius,
								y: this.y + settings.coinRadius,
							},
							color: settings.coinPalette[this.value-1],
						}
					);
					this.kill();
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
			fadeout: 1,
			doomed: false,
			zIndex: 10,
			update: () => machine.run("update"),
		}, ...options));
		
		this.generateCracks();
	}

	generateCracks() {
		let crackCount = randInt(3,5);
		let offset = Math.random();
		this.cracks = [];

		for (let i=0; i < crackCount; i++) {
			let angle = (((i / crackCount) + Math.random() * 0.3 - 0.15 + offset) * 360) * Math.PI / 180;
			let crack = [{x: Math.sin(angle) * (settings.coinRadius - 3), y: Math.cos(angle) * (settings.coinRadius - 3)}]

			crack.push({
				x: Math.sin(angle) * settings.coinRadius * (0.7 + Math.random() * 0.05), 
				y: Math.cos(angle)  * settings.coinRadius * (0.7 + Math.random() * 0.05)
			})
			crack.push({
				x: Math.sin(angle) * settings.coinRadius * (0.5 + Math.random() * 0.05) + Math.random() * 8 - 4, 
				y: Math.cos(angle) * settings.coinRadius * (0.5 + Math.random() * 0.05) + Math.random() * 8 - 4
			})
			crack.push({
				x: Math.sin(angle) * settings.coinRadius * (0.3 + Math.random() * 0.2), 
				y: Math.cos(angle) * settings.coinRadius * (0.3 + Math.random() * 0.2)
			})

			this.cracks.push(crack);
		}
	}

	kill() {
		global.grid[this.gridPos.x][this.gridPos.y] = null;
		this.ttl = 0;
		this.fadeout = 0;
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

export class CoinBoard extends SpriteClass {
	render() {
		let ctx = this.context;
		let dim = {
			top: -200,
			bottom: global.boardDims.height-settings.coinBuffer/2,
			left: -settings.coinBuffer/2,
			right: global.boardDims.width-settings.coinBuffer/2,
		}

		// Mask
		ctx.save()
		ctx.moveTo(dim.left, dim.top);
		ctx.lineTo(dim.right, dim.top);
		ctx.lineTo(dim.right, dim.bottom);
		ctx.lineTo(dim.left, dim.bottom);
		ctx.clip()

		const allCoins = [...global.coins, global.dropZone.coin]

		allCoins.forEach(coin => {
			if (!coin || coin.fadeout < 1) return;
			// Background
			let colour = coin.dirtLayer > 0 ? coin.dirtLayer > 1 ? "#678" : 
				"#ABC": settings.coinPalette[coin.value-1];

			ctx.globalOpacity = coin.opacity;			
			ctx.fillStyle = colour;
			ctx.lineWidth = 2.5;
			ctx.strokeStyle = colour;
			ctx.beginPath();
			ctx.arc(settings.coinRadius + coin.x, settings.coinRadius + coin.y, settings.coinRadius-3, 0, 2 * Math.PI);
			ctx.fill();
			ctx.beginPath();
			ctx.arc(settings.coinRadius + coin.x, settings.coinRadius + coin.y, settings.coinRadius, 0, 2 * Math.PI);
			ctx.stroke();

			ctx.fillStyle = coin.value >= 5 ? "#CDE" : "#311";
			ctx.font = 'bold 26px Arial';
			const coinText = coin.dirtLayer == 0 ? coin.value : "";
			const textMeas = ctx.measureText(coinText); 
			ctx.fillText(coin.dirtLayer == 0 ? coin.value : "", coin.x + settings.coinRadius - textMeas.width/2, coin.y + settings.coinRadius + 9);

			if (coin.dirtLayer == 1) {
				ctx.strokeStyle = "#222";
				ctx.lineWidth = 0.5;
				ctx.beginPath();
				coin.cracks.forEach(crack => {
					ctx.moveTo(coin.x + crack[0].x + settings.coinRadius, coin.y + crack[0].y + settings.coinRadius);
					ctx.lineTo(coin.x + crack[1].x + settings.coinRadius, coin.y + crack[1].y + settings.coinRadius);
					ctx.lineTo(coin.x + crack[2].x + settings.coinRadius, coin.y + crack[2].y + settings.coinRadius);ctx.stroke();
					ctx.beginPath();
					ctx.lineTo(coin.x + crack[3].x + settings.coinRadius, coin.y + crack[3].y + settings.coinRadius);
				})
				ctx.stroke();
			}
		})

		ctx.restore();
	}
}