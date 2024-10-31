import { SpriteClass } from "../node_modules/kontra/kontra.mjs";
import { global, settings } from "./Global.js";
import { Machine } from "./Machine.js";
import { cursorToCell } from "./controls.js";

export class Dropzone extends SpriteClass {
	constructor() {
		let machine = new Machine("INPUT", {
			INPUT: {
				start: () => this.opacity = 1,
				update: () => {
					let cellPos = this.getCellPos();
					if (cellPos) this.xPos = cellPos.x;
					else machine.setStateAndRun("INACTIVE");
				},
				drop: () => {
					global.coins.push(this.coin);
					this.coin = null;
					machine.setState("LOCKED")
				},
				lock: () => machine.setState("LOCKED"),
			},
			PRIMED: {
				
			},
			LOCKED: {
				unlock: () => machine.setState("INPUT")
			},
			INACTIVE: {
				start: () => this.opacity = 0.3,
				update: () => {
					let cellPos = this.getCellPos();
					if (cellPos) {
						this.xPos = cellPos.x;
						machine.setStateAndRun("INPUT");
					}
				}
			},
		});

		super({
			xPos: 4,
			opacity: 1,
			machine: machine,
			coin: null,
			render: () => {
				const gradient = this.context.createLinearGradient(0, 0, 0, 600);
				let dims = {x: -settings.coinBuffer / 2 + this.xPos * (settings.coinRadius * 2 + settings.coinBuffer),
							y: -settings.coinBuffer / 2,
							w: settings.coinRadius * 2 + settings.coinBuffer,
							h: global.boardDims.height}
				gradient.addColorStop(0, "#6785");
				gradient.addColorStop(1, "#6782");

				if (machine.state === "LOCKED") {
					dims.x += 5;
					dims.w -= 10;
				}
		
				this.context.fillStyle = gradient;
				this.context.beginPath();
				this.context.fillRect(dims.x, dims.y, dims.w, dims.h);
				this.context.closePath();
			},
		});
	}

	getCellPos() {
		let cellPos = cursorToCell();
		if (cellPos.x < 0 || cellPos.x >= settings.slots.x || cellPos.y >= settings.slots.x) return null;
		else return cellPos;
	}

	update (dt) {
		super.update(dt);
		this.machine.dispatch("update");
	}
}
