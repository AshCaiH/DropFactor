import { GameObject, SpriteClass } from "../node_modules/kontra/kontra.mjs";
import { global, settings } from "./Global.js";

export class RoundTicker extends GameObject{
	constructor () {
		super({
			x: -40,
			y: -settings.coinBuffer / 2,
			render: () => {
				let ctx = this.context;
				for (let i = 0; i < settings.turnsInRound; i++) {
					ctx.fillStyle = ctx.strokeStyle = "#678";
					if (global.remainingTurns > i) ctx.fillRect(0,i * 30,20,20);
					ctx.strokeRect(0,i * 30,20,20)
				}
			}
		});
	}
}