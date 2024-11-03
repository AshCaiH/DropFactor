import { getPointer, onKey, onPointer } from "../node_modules/kontra/kontra.mjs";
import { global, settings } from "./Global.js";

onPointer('down', function(e) {global.gameMachine.dispatch("prime");});
onPointer('up', function(e) {global.gameMachine.dispatch("drop");});
onKey('p', function(e) {global.gameMachine.dispatch("power")});

export function cursorToCell() {
	const cPos = (({ x, y }) => ({ x, y }))(getPointer());

	Object.keys(cPos).forEach(function(k, index) {cPos[k] -= global.camera[k] - settings.coinBuffer/2});
	Object.keys(cPos).forEach(function(k, index) {cPos[k] = Math.floor(cPos[k]/(settings.coinRadius * 2 + settings.coinBuffer))});

	return cPos;
}

export function cursorInGrid() {
	let pos = global.cursorCellPos.value;
	if (pos.x >= 0 && pos.x < settings.slots.x && pos.y >= 0 && pos.y < settings.slots.y) return pos;
	else return null;
}