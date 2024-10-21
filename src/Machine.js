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

        if (action) action.apply(this, ...payload);
    }

    changeState(newState) {this.state = newState};
}