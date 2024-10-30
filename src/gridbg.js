import { GameObject, SpriteClass } from "../node_modules/kontra/kontra.mjs";
import { settings } from "./Global.js";

const {slots, coinRadius, coinBuffer} = settings;

export class GridBG extends SpriteClass {
	constructor() {
		super(
			{
				cells: {},
				lightup: (cells) => {
					cells.forEach(cell => this.cells[cell].colour[3] = 0.3);},
			}
		);
		for (let i=0; i<slots.x; i++) {
		for (let j=0; j<slots.y; j++) {
			let cell = new GridBGCell({x: i, y:j})
			this.cells[`${i},${j}`] = cell;
			this.addChild(cell);
		}}
	}
}

class GridBGCell extends GameObject {
	constructor(gridPosition) {
		super({
			gridPosition: gridPosition,
			fillOpacity: 0,
			colour: [255,255,255,0],
			render: () => {
				const ctx = this.context;
				const dim = {x: gridPosition.x*(coinRadius * 2 + coinBuffer)-coinBuffer/2,
							y: gridPosition.y*(coinRadius * 2 + coinBuffer)-coinBuffer/2,
							w: coinRadius * 2 + coinBuffer,
							h: (coinRadius * 2 + coinBuffer)}
				ctx.lineWidth = 1.5;
				ctx.strokeStyle = "#345";
				let c = this.colour;
				ctx.fillStyle = `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${c[3]})`;
				ctx.fillRect(dim.x, dim.y, dim.w, dim.h);
				ctx.strokeRect(dim.x, dim.y, dim.w, dim.h);
			},
			update: () => {if (this.colour[3] > 0) this.colour[3] -= 0.01;},
		});
	}
}