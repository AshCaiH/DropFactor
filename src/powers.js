import { global, settings } from "./Global.js";

const ranges = Object.freeze({
	board: (cellPos) => global.coins,
	row: (cellPos) => {
		let targets = [];
		for (let i=0; i<settings.slots.x; i++) {
			let target = global.grid[i][cellPos.y];
			if (target) targets.push(target);
		}
		return targets;
	},
	column: (cellPos) => {
		console.log(cellPos);
		let targets = [];
		for (let i=0; i<settings.slots.y; i++) {
			let target = global.grid[cellPos.x][i];
			if (target) targets.push(target);
		}
		return targets;
	},
	cell: (cellPos) => {
		let target = global.grid[cellPos.x][cellPos.y];
		if (target) return [target] 
		else return [];
	},
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
		targets.forEach(coin => {
			coin.machine.dispatch("snipe");
		});
	},
	increase: (targets) => {
		targets.forEach(coin => {
			coin.machine.dispatch("changeValue", [true]);
		});
	},
	decrease: (targets) => {
		targets.forEach(coin => {
			coin.machine.dispatch("changeValue", [false]);
		});
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
		this.effectDelay = 300;
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
	constructor () {
		super();
		this.description = "Destroys coin with tactical precision."
		this.range = ranges.cell;
		this.effect = effects.destroy;
		this.effectDelay = 0;
		this.pointsRequired = 50;
	}
};

export class Increase extends PowerBase {
	constructor () {
		super();
		this.description = "Increases value of coins in range by one (7s become buried coins and their values are randomised)."
		this.range = ranges.row;
		this.effect = effects.increase;
		this.filter = (coin) => coin.dirtLayer === 0;
		this.pointsRequired = 80;
	}
};