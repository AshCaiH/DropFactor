import { Sprite, Text, SpriteClass, track, getPointer, pointerPressed, lerp } from "../node_modules/kontra/kontra.mjs";
import { cursorInGrid, cursorToWorld } from "./controls.js";
import { global, settings } from "./Global.js";
import { Machine } from "./Machine.js";
import * as powers from "./powers.js";

export class PowerTray extends SpriteClass {
	constructor () {		
		super({
			x: (700 - 406) / 2,
			y: global.boardDims.height + 10,
			zIndex: 50,
			powerSlots: [],
			render: () => {
				const ctx = this.context;
				ctx.lineWidth = 4;
				ctx.strokeStyle = "#567";
				ctx.strokeRect(0, 0, 200, 70);
				this.powerSlots.forEach((slot, i) => {
					ctx.beginPath();
					ctx.arc(i * (50 + 10) + 15 + 25, 10 + 25, 25, 0, 2 * Math.PI);
					ctx.closePath();
					ctx.stroke();
				})
			},
		});

		let powerList = [powers.Dig, powers.Snipe, powers.Increase];

		for (let i=0; i<3; i++) {
			let p = powerList[i];
			const token = new PowerToken(new p(), {
				x: i * (50 + 10) + 15 + 25,
				y: 10 + 25
			})
			this.addChild(token);
			this.powerSlots.push(token);
		}
	}
}

class PowerToken extends SpriteClass {
	constructor (power = null, options = {}) {
		let initialMousePos = {x: 0, y:0};
		let defaultPos = {x: options.x, y: options.y}
		let isEnabled = false;
		let machine = new Machine("LOCKED", {
			LOCKED: {
				drag: () => console.log(this.meter, this.parent),
			},
			UNLOCKED: {
				start: () => {
					global.coins.map((coin) => coin.opacity = 1);					
				},
				drag: () => machine.setStateAndRun("SELECT"),
			},
			SELECT: {
				start: () => {
					initialMousePos.x = getPointer().x;
					initialMousePos.y = getPointer().y;
					this.parent.children.sort((a,b) => a === this ? 1 : -1)
					this.power.highlightTargets();
					global.gameMachine.run("pendPower");
				},
				release: () => {
					this.x = defaultPos.x;
					this.y = defaultPos.y;
					initialMousePos = {x: 0, y:0};
					global.gameMachine.run("cancel");
					machine.setStateAndRun("UNLOCKED");
				},
				update: () => {
					let target = {};
					target.x = getPointer().x - initialMousePos.x + defaultPos.x
					target.y = getPointer().y - initialMousePos.y + defaultPos.y;
					this.x = lerp(defaultPos.x, target.x, 0.3);
					this.y = lerp(defaultPos.y, target.y, 0.3);
					let dist = Math.sqrt((this.x - defaultPos.x)**2 + (this.y - defaultPos.y)**2)
					if (dist > 15) machine.setState("DRAG");
				}
			},
			DRAG: {
				release: () => {
					machine.setStateAndRun("SNAPBACK");
					initialMousePos = {x: 0, y:0};

					if (this.valid) global.gameMachine.run("activate", [this.power]);
					else global.gameMachine.run("cancel");

					this.valid = false;
				},
				update: () => {
					this.x = getPointer().x - initialMousePos.x + defaultPos.x;
					this.y = getPointer().y - initialMousePos.y + defaultPos.y;

					
					this.valid = cursorInGrid() != null;
					if (this.valid) global.powerCursor.targets = this.power.range(global.cursorCellPos.value)
					else global.powerCursor.targets = [];
				}
			},
			SNAPBACK: {
				start: () => {
					global.powerCursor.targets = [];
					if (this.valid) {
						this.x = defaultPos.x;
						this.y = defaultPos.y;
						this.prevScore = global.score.value;
						this.meter = 0;
						this.isEnabled = false;
						machine.setStateAndRun("LOCKED");
					}
					this.lerpPos = 0.01
				},
				update: () => {
					this.x = lerp(this.x, defaultPos.x, this.lerpPos);
					this.y = lerp(this.y, defaultPos.y, this.lerpPos);
					if (Math.abs(this.x - defaultPos.x) < 1 && Math.abs(this.y - defaultPos.y) < 1) {
						this.x = defaultPos.x;
						this.y = defaultPos.y;
						machine.setStateAndRun("UNLOCKED")
					}
					this.lerpPos = lerp(this.lerpPos, 1, 0.2);
				}
			},
		});

		super(Object.assign({},{
			power: power,
			machine: machine,
			meter: 1,
			prevScore: 0,
			stock: 0,
			radius: 22,
			anchor: {x: 0.5, y: 0.5},
			valid: false,
			render: () => {
				const ctx = this.context;
				ctx.lineWidth = 2.5;
				ctx.strokeStyle = this.valid ? "#FFF" : "#CCC";
				ctx.fillStyle = "#333"
				ctx.beginPath();
				ctx.arc(22, 20, 25, 0, 2 * Math.PI);
				ctx.closePath();
				ctx.fill();
				ctx.beginPath();
				ctx.arc(22, 20, 25, (2 * Math.PI) * -.25, (2 * Math.PI) * (this.meter - .25));
				if (this.meter !== 1) ctx.lineTo(22,20);
				ctx.closePath();
				ctx.fillStyle = this.valid ? "#888" : "#555"
				ctx.fill();
				if (this.meter === 1) ctx.stroke();
			},
			collidesWithPointer: (pointer) => {
				let p = global.getWorldPos(this);
				let wp = {x: pointer.x - p.x, y: pointer.y - p.y}
				return Math.sqrt(wp.x**2 + wp.y**2) < this.radius;
			},
			onDown: () => {
				if (global.gameMachine.state == "INPUT") this.machine.run("drag");
			},
			onOver: () => {},
			onOut: () => {},
			update: () => {
				this.advance();
				this.machine.run("update");
				if (!pointerPressed('left')){
					this.machine.run("release");
				}
			},
		}, options));

		global.addDebugText(this, "meter", power.name, 5, true);

		this.addChild(new Text({
			color: "white",
			text: this.power.name,
			font: 'bold 10px Arial',
			textAlign: "center",
			width: 40,
			x: -20,
			y: -5,
		}))

		global.score.listen(() => {
			if (settings.freePowers) this.meter = 1;
			else this.meter = Math.min(1, (global.score - this.prevScore) / power.pointsRequired);
			if (this.meter === 1 && !this.isEnabled) {
				this.isEnabled = true;
				global.particles.addEffect("eyeCatch",
					{
						pos: {
							x: defaultPos.x + this.parent.x,
							y: defaultPos.y + this.parent.y,
						},
					}
				);
				machine.setStateAndRun("UNLOCKED");
			}
		})

		track(this);
	}
}