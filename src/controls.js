import { getPointer, onKey, onPointer } from "../node_modules/kontra/kontra.mjs";
import { global, settings } from "./Global.js";

onPointer('down', e => global.gameMachine.run("prime"));
onPointer('up', e => global.gameMachine.run("drop"));
onKey('r', e => global.gameMachine.run("restart"));
onKey('d', e => showDebug());

export function showDebug() {global.debugInfo.opacity = 1 - global.debugInfo.opacity}
document.getElementById("debugbtn").onclick = () => showDebug();

export function cursorToWorld() {
	const cPos = (({ x, y }) => ({ x, y }))(getPointer());
	Object.keys(cPos).forEach(function(k, index) {cPos[k] -= global.camera[k] - settings.coinBuffer/2});

	return cPos;
}

export function cursorToCell() {
	let cPos = cursorToWorld();
	Object.keys(cPos).forEach(function(k, index) {cPos[k] = Math.floor(cPos[k]/(settings.coinRadius * 2 + settings.coinBuffer))});

	return cPos;
}

export function cursorInGrid() {
	const pos = global.cursorCellPos.value;
	if (pos.x >= 0 && pos.x < settings.slots.x && pos.y >= 0 && pos.y < settings.slots.y) return pos;
	else return null;
}