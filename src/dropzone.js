import { SpriteClass } from "../node_modules/kontra/kontra.mjs";
import { global, settings } from "./Global.js";
import { Machine } from "./Machine.js";
import { cursorToCell } from "./controls.js";

export class Dropzone extends SpriteClass {
	constructor() {
		let lock = () => machine.setStateAndRun("LOCKED");
		
		let machine = new Machine("INPUT", {
			INPUT: {
				start: () => this.opacity = 0.6,
				update: () => {
					let cellPos = this.getCellPos();
					if (cellPos) this.xPos = cellPos.x;
					else machine.setStateAndRun("INACTIVE");
				},
				prime: () => machine.setStateAndRun("PRIMED"),
				lock: () => lock(),
			},
			PRIMED: {
				start: () => this.opacity = 1,
				drop: () => {
					global.coins.push(this.coin);
					this.coin = null;
					lock();
					return true;
				},
				update: () => {
					let cellPos = this.getCellPos(false);
					if (cellPos) this.xPos = cellPos.x;
					else machine.setStateAndRun("PRIMED_INACTIVE");
				},
			},
			PRIMED_INACTIVE: {
				start: () => this.opacity = 0.3,
				update: () => {
					let cellPos = this.getCellPos(false);
					if (cellPos) {
						this.xPos = cellPos.x;
						machine.setStateAndRun("PRIMED");
					}
				},
				drop: () => machine.setStateAndRun("INPUT"),
			},
			LOCKED: {
				start: () => this.opacity = 0,
				unlock: () => machine.setStateAndRun("INPUT")
			},
			INACTIVE: {
				start: () => this.opacity = 0,
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
				let dims = {x: -settings.coinBuffer / 2 + this.xPos * (settings.coinRadius * 2 + settings.coinBuffer),
							y: -settings.coinBuffer / 2,
							w: settings.coinRadius * 2 + settings.coinBuffer,
							h: global.boardDims.height}
					
				this.context.fillStyle = "#334353AA";
				this.context.beginPath();
				this.context.fillRect(dims.x, dims.y, dims.w, dims.h);
				this.context.closePath();
			},
		});
	}

	getCellPos(inGrid = true) {
		let cellPos = cursorToCell();
		if (cellPos.x < 0 || cellPos.x >= settings.slots.x || (inGrid && cellPos.y >= settings.slots.x)) return null;
		else return cellPos;
	}

	update (dt) {
		super.update(dt);
		this.machine.dispatch("update");
	}
}
