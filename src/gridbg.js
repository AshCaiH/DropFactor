import { SpriteClass } from "../node_modules/kontra/kontra.mjs";
import { settings } from "./Global.js";

export class GridBG extends SpriteClass {
    constructor() {
        super({
        render: function() {
            const {slots, coinRadius, coinBuffer} = settings;
            const ctx = this.context;
            for (let i=0; i<slots.x; i++) {
            for (let j=0; j<slots.y; j++) {
                ctx.lineWidth = 1.5;
                ctx.strokeStyle = "#345";
                ctx.beginPath();
                ctx.strokeRect(
                    i*(coinRadius * 2 + coinBuffer)-coinBuffer/2,
                    j*(coinRadius * 2 + coinBuffer)-coinBuffer/2,
                    coinRadius * 2 + coinBuffer,
                    (coinRadius * 2 + coinBuffer)
                );
                ctx.closePath();
            }}
        }});
    }
}
