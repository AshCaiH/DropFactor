import { global } from "./Global.js";

const ranges = Object.freeze({
	board: (cellPos) => {
		return global.coins;
	},
	row: (cellPos) => {},
	column: (cellPos) => {},
	cell: (cellPos) => {},
	adjacent: (cellPos) => {},
	surrounding: (cellPos) => {},
})

const effects = Object.freeze({
	blank: (targets) => {console.log("Power does nothing")},
	dig: (targets) => {
		targets.forEach(coin => {
			coin.machine.dispatch("crumble");
		});
	},
	destroy: (targets) => {
		targets.forEach(coin => {});
	},
	raise: (targets) => {
		targets.forEach(coin => {});
	},
	lower: (targets) => {
		targets.forEach(coin => {});
	},
});

class PowerBase {
	constructor () {
		this.name = this.constructor.name;
		this.description = "A power";
		this.range = ranges.board;
		this.effect = effects.blank;
		this.useTurn = true;
		this.pointsRequired = 100;
		this.filter = (coin) => true;
	}

	highlightTargets = () => global.coins.map((coin) => {
		if (!this.filter(coin)) coin.opacity = 0.3;
	});
	activate = (cellPos) => {
		global.coins.map((coin) => coin.opacity = 1);
		this.effect(this.range(cellPos));
	}
}

export class Dig extends PowerBase {
	constructor () {
		super();
		this.description = "Remove one layer of dirt from all buried coins."
		this.range = ranges.board;
		this.effect = effects.dig;
		this.filter = (coin) => coin.dirtLayer > 0;
	}
};

export class Snipe extends PowerBase {
	// name = "Blank power";
	// description = "A power";
	// range = ranges.cell;
	// effect = effects.blank;
};

export class Increase extends PowerBase {
	// name = "Blank power";
	// description = "A power";
	// range = ranges.cell;
	// effect = effects.blank;
};