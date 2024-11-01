import { Sprite, Text, SpriteClass, track, getPointer, pointerPressed } from "../node_modules/kontra/kontra.mjs";
import { global } from "./Global.js";
import { Machine } from "./Machine.js";
// import * as Powers from ".powers.js";

export class PowerTray extends SpriteClass {
	constructor () {
		let powerSlots = [];

		super({
			x: (700 - 406) / 2,
			y: global.boardDims.height + 10,
			zIndex: 100,
			render: () => {
				const ctx = this.context;
				ctx.lineWidth = 4;
				ctx.strokeStyle = "#567";
				ctx.strokeRect(0, 0, 200, 70);
				powerSlots.forEach((slot, i) => {
					ctx.beginPath();
					ctx.arc(i * (50 + 10) + 15 + 25, 10 + 25, 25, 0, 2 * Math.PI);
					ctx.closePath();
					ctx.stroke();
				})
			},
		});

		for (let i=0; i<3; i++) {
			const token = new PowerToken("", {
				x: i * (50 + 10) + 15 + 25,
				y: 10 + 25,
			})
			this.addChild(token);
			powerSlots.push(token);
		}
	}
}

class PowerToken extends SpriteClass {
	constructor (power = "", options = {}) {
		let initialMousePos = {x: 0, y:0};
		let defaultPos = {x: options.x, y: options.y}
		let machine = new Machine("UNLOCKED", {
			LOCKED: {},
			UNLOCKED: {
				drag: () => {
					machine.setStateAndRun("DRAG")
				}
			},
			DRAG: {
				start: () => {
					initialMousePos.x = getPointer().x;
					initialMousePos.y = getPointer().y;
					console.log(initialMousePos);
				},
				release: () => {
					machine.setState("UNLOCKED");
					this.x = defaultPos.x;
					this.y = defaultPos.y;
					initialMousePos = {x: 0, y:0};
					console.log(defaultPos);
				},
				update: () => {
					this.x = getPointer().x - initialMousePos.x + defaultPos.x;
					this.y = getPointer().y - initialMousePos.y + defaultPos.y;
				}
			},
		});

		super(Object.assign({},{
			power: power,
			machine: machine,
			meter: 0,
			stock: 0,
			radius: 22,
			anchor: {x: 0.5, y: 0.5},
			render: () => {
				const ctx = this.context;
				ctx.lineWidth = 3;
				ctx.strokeStyle = "#567"
				ctx.fillStyle = "#333"
				ctx.beginPath();
				ctx.arc(22, 20, 25, 0, 2 * Math.PI);
				ctx.closePath();
				ctx.stroke();
				ctx.fill();
			},
			onDown: () => {
				this.machine.dispatch("drag");
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

		track(this);
	}
}