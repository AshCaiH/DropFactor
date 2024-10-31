import { Sprite, Text, SpriteClass } from "../node_modules/kontra/kontra.mjs";
import { global } from "./Global.js";
import { Machine } from "./Machine.js";
// import * as Powers from ".powers.js";

export class PowerTray extends SpriteClass {
	constructor () {
		let powerSlots = [];

		super({
			x: (700 - 406) / 2,
			y: global.boardDims.height + 10,
			render: () => {
				const ctx = this.context;
				ctx.lineWidth = 1.5;
				ctx.strokeStyle = "#345";
				ctx.strokeRect(0, 0, 200, 70);
				powerSlots.forEach(slot => {
					ctx.beginPath();
					ctx.arc(slot.x + 25, slot.y + 25, 25, 0, 2 * Math.PI);
					ctx.closePath();
					ctx.stroke();
				})
			},
		});

		for (let i=0; i<3; i++) {
			powerSlots.push({
				x: i * (50 + 10) + 12,
				y: 10,
			});
		}

		console.log(powerSlots);
	}
}

class PowerToken extends SpriteClass {
	constructor (power, options) {
		let machine = new Machine("LOCKED", {
			LOCKED: {},
			UNLOCKED: {},
			DRAGGED: {},
		});

		super(Object.assign({},{
			power: power,
			machine: machine,
			meter: 0,
			stock: 0,
			render: () => {},
		}, ...options));
	}
}