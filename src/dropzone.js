import { SpriteClass } from "../node_modules/kontra/kontra.mjs";

export class Dropzone extends SpriteClass {
	states = Object.freeze({
        HIDDEN: 0,
		WAITING: 1,
		DROPPING: 2,
	});

    constructor(b) {
        super({
            xPos: 0,
            opacity: 1,
            board: b,
        });
    }

    draw () {
        const { coinBuffer, coinRadius, height } = this.board;
        let gradient = this.context.createLinearGradient(0, 0, 0, 600);
        gradient.addColorStop(0, "#6785");
        gradient.addColorStop(1, "#6782");

        this.context.fillStyle = gradient;
        this.context.beginPath();
        this.context.fillRect(
            -coinBuffer / 2 + this.xPos * (coinRadius * 2 + coinBuffer),
            -coinBuffer / 2,
            coinRadius * 2 + coinBuffer,
            (coinRadius * 2 + coinBuffer) * height,
        );
        this.context.closePath();
    }
}