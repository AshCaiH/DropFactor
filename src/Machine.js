export class Machine {

	constructor(initialState, transitions) {
		Object.assign(this, {
			state: initialState,
			transitions: transitions,
		});
	}

	dispatch(actionName, ...payload) {
		const actions = this.transitions[this.state];
		const action = this.transitions[this.state][actionName];

		if (action) return action.apply(this, ...payload);
	}

	setState(newState) {this.state = newState};

	setStateAndRun(newState, actionName = "start", ...payload) {
		this.state = newState;
		this.dispatch(actionName, ...payload);
	}
}