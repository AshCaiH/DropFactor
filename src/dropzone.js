import { getPointer, SpriteClass } from "../node_modules/kontra/kontra.mjs";
import { global, settings } from "./Global.js";
import { Machine } from "./Machine.js";

export class Dropzone extends SpriteClass {
	constructor() {
		let machine = new Machine("INPUT", {
			INPUT: {
				update: () => {
					let cellPos = cursorToCell();
					this.xPos = Math.min(Math.max(0, cellPos.x), settings.slots.x - 1);
				},
				drop: (xPos) => {
					this.xPos = xPos;
					this.opacity = 1;
					global.coins.push(this.coin);
					this.coin = null;
					machine.setState("LOCKED")
				},
				lock: () => machine.setState("LOCKED"),
			},
			LOCKED: {unlock: () => machine.setState("INPUT")},
			HIDDEN: {},
		});

		super({
			xPos: 4,
			opacity: 1,
			machine: machine,
			coin: null,
		});
	}

	draw () {
		let gradient = this.context.createLinearGradient(0, 0, 0, 600);
		gradient.addColorStop(0, "#6785");
		gradient.addColorStop(1, "#6782");

		this.context.fillStyle = gradient;
		this.context.beginPath();
		this.context.fillRect(
			-settings.coinBuffer / 2 + this.xPos * (settings.coinRadius * 2 + settings.coinBuffer),
			-settings.coinBuffer / 2,
			settings.coinRadius * 2 + settings.coinBuffer,
			global.boardDims.height,
		);
		this.context.closePath();
	}

	update (dt) {
		super.update(dt);
		this.machine.dispatch("update");
	}
}

function cursorToCell() {
	const cPos = (({ x, y }) => ({ x, y }))(getPointer());

	Object.keys(cPos).forEach(function(k, index) {cPos[k] -= global.camera[k] - settings.coinBuffer/2});
	Object.keys(cPos).forEach(function(k, index) {cPos[k] = Math.floor(cPos[k]/(settings.coinRadius * 2 + settings.coinBuffer))});

	return cPos;
}