import { GameObject, SpriteClass } from "../node_modules/kontra/kontra.mjs";
import { settings } from "./Global.js";

const {slots, coinRadius, coinBuffer} = settings;

export class GridBG extends SpriteClass {
	constructor() {
		super();
		for (let i=0; i<slots.x; i++) {
		for (let j=0; j<slots.y; j++) {
			this.addChild(new GridBGCell({x: i, y:j}));
		}}
	}
}

class GridBGCell extends GameObject {
	constructor(gridPosition) {
		super({
			gridPosition: gridPosition,
			render: () => {
				const ctx = this.context;
				ctx.lineWidth = 1.5;
				ctx.strokeStyle = "#345";
				ctx.beginPath();
				ctx.strokeRect(
					gridPosition.x*(coinRadius * 2 + coinBuffer)-coinBuffer/2,
					gridPosition.y*(coinRadius * 2 + coinBuffer)-coinBuffer/2,
					coinRadius * 2 + coinBuffer,
					(coinRadius * 2 + coinBuffer)
				);
				ctx.closePath();
			},
			update: () => {

			},
		});
	}
}