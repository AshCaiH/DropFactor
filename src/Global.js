export const settings = {
    // Board
    slots: {x: 7, y:7},

    // Coin
	coinRadius: 30,
	coinBuffer: 12,
	coinPalette: [ "#ffa600", "#ff764a", "#ef5675", "#bc5090", "#7a5195", "#5779CC", "#0073A8" ],

	// Animation
	launchSpeed: 8,
	fallSpeed: 0.1,
	fallAccel: 1.1,

	// Gameplay
	turnsInRound: 5, // Before rising phase happens
	initialTurns: 0, // 0 runs rising phase immediately on game start.
	roundMode: "rise",
};

export const global = {
	camera: null,
	dropZone: null,
	grid: Array.from({ length:settings.slots.x }, i => Array.from({ length:settings.slots.y }, i => null)),
	boardDims: {
		height: settings.slots.y * (settings.coinRadius * 2 + settings.coinBuffer),
		width: settings.slots.x * (settings.coinRadius * 2 + settings.coinBuffer),
	},
	remainingTurns: settings.initialTurns,
	coins: [],
	score: 0,
	gameOver: false,
}