import { SpriteClass } from "../node_modules/kontra/kontra.mjs";
import { global, settings } from "./Global.js";
import { Machine } from "./Machine.js";

export class Dropzone extends SpriteClass {
	constructor() {
		let lock = () => machine.setStateAndRun("LOCKED");
		
		let machine = new Machine("ACTIVE", {
			ACTIVE: {
				start: () => this.opacity = 0.6,
				prime: () => machine.setStateAndRun("PRIMED_ACTIVE"),
				lock: () => lock(),
				inactive: () => machine.setStateAndRun("INACTIVE"),
			},
			INACTIVE: {
				start: () => this.opacity = 0,
				lock: () => lock(machine.setStateAndRun("LOCKED")),
				active: () => machine.setStateAndRun("ACTIVE"),
			},
			PRIMED_ACTIVE: {
				start: () => this.opacity = 1,
				drop: () => {
					global.coins.push(this.coin);
					this.coin = null;
					lock();
					return true;
				},
				inactive: () => machine.setStateAndRun("PRIMED_INACTIVE"),
			},
			PRIMED_INACTIVE: {
				start: () => this.opacity = 0.3,
				drop: () => machine.setStateAndRun("ACTIVE"),
				active: () => machine.setStateAndRun("ACTIVE"),
			},
			LOCKED: {
				start: () => this.opacity = 0,
				unlock: () => machine.setStateAndRun("ACTIVE")
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

		global.cursorCellPos.listen(() => {
			let cellPos = global.cursorCellPos.value;
			if (cellPos.x < 0 || cellPos.x >= settings.slots.x || cellPos.y >= settings.slots.y)
				this.machine.dispatch("inactive");
			else {
				this.machine.dispatch("active");
				this.xPos = cellPos.x;
			}
		})
		global.addDebugText(machine, "state", "DropZoneState", 2);
	}
}