export class SignalValue {
	myvalue;
	events = [];
	oneShotEvents = [];
	get value() {return this.myvalue};
	set value(value) {
		if (this.myvalue === value) return;
		this.myvalue = value;
		[...this.events, ...this.oneShotEvents].forEach(event => event());
		this.oneShotEvents = [];
	};
	valueOf () {return this.myvalue};
    toString () {return String(this.myvalue)};

	constructor (value) {
		this.myvalue = value;
	}

	listen(event, run = true, oneShot = false) {
		if (oneShot) this.oneShotEvents.push(event);
		else this.events.push(event);
		if (run) event();
	}
};