import { Sprite, Text, SpriteClass } from "../node_modules/kontra/kontra.mjs";
import { Machine } from "./Machine.js";
import * as Powers from ".powers.js";

export class PowerToken extends SpriteClass {
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
			render: () => {

			},
		}, ...options));
	}
}