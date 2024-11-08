import { SpriteClass } from "../node_modules/kontra/kontra.mjs";
import { settings } from "./Global.js";
import { Machine } from "./Machine.js";

export class PowerCursor extends SpriteClass {
	constructor() {
		super({
			targets: [],
			zIndex: 20,
			render: () => {
				if (this.machine.state === "HIDDEN") return;
				let ctx = this.context;
				let size = settings.coinRadius * 2 + settings.coinBuffer;
				let offset = settings.coinBuffer/2

				this.targets.forEach(target => {
					// let pos = cursorToCell();
					if (!target) return;

					ctx.strokeStyle = "#FFF";
					ctx.lineWidth = 2;
					ctx.strokeRect(target.x - offset,target.y - offset,size,size);
				});
			}
		})

		this.machine = new Machine("VISIBLE", {
			HIDDEN: {
				start: () => {},
				show: () => {},
			},
			VISIBLE: {
				start: () => {},
				hide: () => {},
			},
		});
	};
}