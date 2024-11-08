export class SignalValue {
	myvalue;
	events = [];
	oneShotEvents = [];
	get value() {return this.myvalue};
	set value(value) {
		if (typeof this.myvalue == "object") {
			let match = true;
			Object.keys(this.myvalue).forEach(key => {
				if (value[key] != this.myvalue[key]) {
					this.myvalue[key] = value[key]
					match = false;
				}
			});
			if (match) return;
		} else if (this.myvalue == value) return;
		this.myvalue = value;
		[...this.events, ...this.oneShotEvents].forEach(event => event());
		this.oneShotEvents = [];
	};
	valueOf () {return this.myvalue};
    toString () {
		if (typeof this.myvalue == "object") return String(Object.values(this.myvalue));
		return String(this.myvalue)
	};

	constructor (value) {
		this.myvalue = value;
	}

	listen(event, run = true, oneShot = false) {
		if (oneShot) this.oneShotEvents.push(event);
		else this.events.push(event);
		if (run) event();
	}
};