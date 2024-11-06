import { SpriteClass } from "../node_modules/kontra/kontra.mjs";
import { global, settings } from "./Global.js";
import { Machine } from "./Machine.js";

export class Dropzone extends SpriteClass {
	constructor() {
		let lock = () => machine.setStateAndRun("LOCKED");
		
		let machine = new Machine("ACTIVE", {
			ACTIVE: {
				start: () => {
					if (global.isInGrid(global.cursorCellPos.value, true)) {
						this.opacity = 0.6;
						this.xPos = global.cursorCellPos.value.x;
					} else machine.run("inactive");
				},
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
				active: () => machine.setStateAndRun("PRIMED_ACTIVE"),
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
			zIndex: -1,
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
			if (global.isInGrid(global.cursorCellPos.value, true)) {
				this.machine.run("active");
				if (this.machine.state != "LOCKED")
					this.xPos = global.cursorCellPos.value.x;
			} else this.machine.run("inactive")	
		})
		global.addDebugText(machine, "state", "DropZoneState", 2);
	}
}