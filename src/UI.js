import { GameObject, initPointer, SpriteClass, track } from "../node_modules/kontra/kontra.mjs";
import { cursorToWorld } from "./controls.js";
import { global, settings } from "./Global.js";
import { Machine } from "./Machine.js";

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

export class RestartButton extends GameObject {
	constructor () {
		super({
			x: global.boardDims.width + settings.coinBuffer/2,
			y: -settings.coinBuffer/2,
			radius: 30,
			machine: new Machine("IDLE", {
				"IDLE": {},
				"PULSING": {},
				"HOVERED": {},
				"RESTARTING": {},

			}),
			collidesWithPointer: (pointer) => {
				pointer = cursorToWorld();
				let dx = pointer.x - this.x;
				let dy = pointer.y - this.y;
				return Math.sqrt(dx * dx + dy * dy) < this.radius + this.radius / 2;
			},
			onDown: () => {global.gameMachine.run("restart")},
			render: () => {
				let ctx = this.context;
				ctx.fillStyle = ctx.strokeStyle = "#678";
				ctx.scale(0.05, 0.05);
				ctx.lineWidth = 16;
				let paths = [new Path2D("M444.84 83.16c-46.804-51.108-114.077-83.16-188.84-83.16-141.385 0-256 114.615-256 256h48c0-114.875 93.125-208 208-208 61.51 0 116.771 26.709 154.848 69.153l-74.848 74.847h176v-176l-67.16 67.16z"), new Path2D("M464 256c0 114.875-93.125 208-208 208-61.51 0-116.771-26.709-154.847-69.153l74.847-74.847h-176v176l67.16-67.16c46.804 51.108 114.077 83.16 188.84 83.16 141.385 0 256-114.615 256-256h-48z")]

				paths.forEach((path) => {
					ctx.fill(path);
					ctx.stroke(path);
				})
			}
		})

		track(this);
	}
}