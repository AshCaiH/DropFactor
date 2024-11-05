import { Sprite, Text, SpriteClass, track, getPointer, pointerPressed, lerp } from "../node_modules/kontra/kontra.mjs";
import { cursorInGrid } from "./controls.js";
import { global, settings } from "./Global.js";
import { Machine } from "./Machine.js";
import * as powers from "./powers.js";

export class PowerTray extends SpriteClass {
	constructor () {		
		super({
			x: (700 - 406) / 2,
			y: global.boardDims.height + 10,
			zIndex: 100,
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
			update: () => {
				this.children.sort((a,b) => {return a.zIndex > b.zIndex}); 
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
		let machine = new Machine("LOCKED", {
			LOCKED: {
				drag: () => console.log(this.meter),
			},
			UNLOCKED: {
				start: () => {
					this.zIndex = 0;
					global.coins.map((coin) => coin.opacity = 1);
				},
				drag: () => machine.setStateAndRun("SELECT"),
			},
			SELECT: {
				start: () => {
					initialMousePos.x = getPointer().x;
					initialMousePos.y = getPointer().y;
					this.zIndex = 1;
					this.power.highlightTargets();
					global.gameMachine.dispatch("pendPower");
				},
				release: () => {
					this.x = defaultPos.x;
					this.y = defaultPos.y;
					initialMousePos = {x: 0, y:0};
					global.gameMachine.dispatch("cancel");
					machine.setStateAndRun("UNLOCKED");
				},
				update: () => {
					let target = {};
					target.x = getPointer().x - initialMousePos.x + defaultPos.x
					target.y = getPointer().y - initialMousePos.y + defaultPos.y;
					this.x = lerp(defaultPos.x, target.x, 0.3);
					this.y = lerp(defaultPos.y, target.y, 0.3);
					let dist = Math.sqrt(Math.pow((this.x - defaultPos.x),2) + Math.pow((this.y - defaultPos.y),2))
					if (dist > 10) machine.setState("DRAG");
				}
			},
			DRAG: {
				release: () => {
					machine.setStateAndRun("SNAPBACK");
					initialMousePos = {x: 0, y:0};

					if (this.valid) global.gameMachine.dispatch("activate", [this.power]);
					else global.gameMachine.dispatch("cancel");

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
			zIndex: 0,
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
			onDown: () => {
				if (global.gameMachine.state == "INPUT") this.machine.dispatch("drag");
			},
			onOver: () => {},
			onOut: () => {},
			update: () => {
				this.advance();
				this.machine.dispatch("update");
				if (!pointerPressed('left')){
					this.machine.dispatch("release");
				}
			},
		}, options));

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
			if (this.meter === 1) machine.setStateAndRun("UNLOCKED");
		})

		// global.addDebugText(this.machine, "state", false, -2);

		track(this);
	}
}