/// <reference path="common.ts"/>


interface Transition {
	id: string;
	key: string;
	name: string;
	targetState?: string; // If this property is not present, the transition is not "attached"
}

interface Action {
	id: string;
	name: string;
	type: string;

	/**
	 * @additionalProperties true
	 */
	options: {
		transitions: {
			[key: string]: string
		} 
	}
}

interface State {
	id: string;
	name: string;

	actions: Action[];
	machineRefs: MachineRef[];
	transitions: Transition[];
}

interface machine {
	id: string;
	name: string;
	ref?: string;


	initialState: string;
	states: State[];

}