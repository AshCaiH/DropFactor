export const settings = {
    // Board
    slots: {x: 7, y:7},

    // Coin
	coinRadius: 30,
	coinBuffer: 12,
	coinPalette: [ "#ffa600", "#ff764a", "#ef5675", "#bc5090", "#7a5195", "#5779CC", "#0073A8" ],

	// Animation
	fallSpeed: 12,
	fallAccel: 1.1,

	// Gameplay
	turnsInRound: 5, // Before rising phase happens
	initialTurns: 0, // 0 runs rising phase immediately on game start.
	roundMode: "rise",

	comboStyle: 1, // 0: No combo, 1: Points x Combo, 2: Points x Combo² (Unused)
	weightCoins: true,
	dirtCoins: false,
};

export const global = {
	gameMachine: null,
	camera: null,
	grid: Array.from({ length:settings.slots.x }, i => Array.from({ length:settings.slots.y }, i => null)),
	boardDims: {
		height: settings.slots.y * (settings.coinRadius * 2 + settings.coinBuffer),
		width: settings.slots.x * (settings.coinRadius * 2 + settings.coinBuffer),
	},
	maxCoinValue: Math.max(settings.slots.x, settings.slots.y),
	coinWeights: null,
	remainingTurns: settings.initialTurns,
	coins: [],
	score: 0,
	combo: 1,
	gameOver: false,
}

global.coinWeights = Object.fromEntries(Array.from({ length:global.maxCoinValue + (settings.dirtCoins ? 1 : 0) }, (i,k) => [k+1,1]));
