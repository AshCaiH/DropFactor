import { getPointer, SpriteClass } from "../node_modules/kontra/kontra.mjs";
import { Machine } from "./Machine.js";

export class Dropzone extends SpriteClass {
    constructor(board, camera) {
        let machine = new Machine("INPUT", {
            INPUT: {
                update: () => {
                    let cellPos = cursorToCell(this.board, this.camera);
                    this.xPos = cellPos.x;
                    this.opacity = (cellPos.x < 0 || cellPos.x >= this.board.width) ? 0 : 1;
                },
                drop: (xPos) => {
                    this.xPos = xPos;
                    this.opacity = 1;
                    machine.changeState("LOCKED")
                }
            },
            LOCKED: {
                unlock: () => {machine.changeState("INPUT")}
            },
            HIDDEN: {},
        });

        super({
            xPos: 0,
            opacity: 1,
            board: board,
            camera: camera,
            machine: machine,
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

    update (dt) {
        super.update(dt);
        this.machine.dispatch("update");
    }
}

function cursorToCell(board, camera) {
    const { coinBuffer, coinRadius } = board;
	const cPos = (({ x, y }) => ({ x, y }))(getPointer());

	Object.keys(cPos).forEach(function(k, index) {cPos[k] -= camera[k] - coinBuffer/2});
    Object.keys(cPos).forEach(function(k, index) {cPos[k] = Math.floor(cPos[k]/(coinRadius * 2 + coinBuffer))});

	return cPos;
}