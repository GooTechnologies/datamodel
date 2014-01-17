/// <reference path="gooobject.ts"/>


interface Transition {
	id: string;
	name: string;
	sortValue: number;

	key: string;

	/**
	 * If this property is not present, the transition is not connected 
	 * to another state. 
	 */
	targetState?: string; 
}

interface Action {
	id: string;
	name: string;
	sortValue: number;

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
	sortValue: number;

	actions: {
		[listId: string]: Action;
	}

	transitions: {
		[listId: string]: Transition;
	}

	childMachines: {
		[listId: string]: {
			machineRef: MachineRef;
			sortValue: number;
		}
	}

}

interface machine extends GooObject {

	initialState: string;
	states: {
		[listId: string]: State;
	}

}