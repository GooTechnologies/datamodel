/// <reference path="gooobject.ts"/>


interface Transition {
	id: string;
	name: string;
	sortValue: number;

	eventName: string;

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
		// listId is Action's id
		[listId: string]: Action;
	}

	transitions: {
		// listid is Transition's id
		[listId: string]: Transition;
	}

	childMachines: {
		// list id is machineRef id
		[listId: string]: {
			machineRef: MachineRef;
			sortValue: number;
		}
	}

}

interface machine extends GooObject {

	// id to State
	initialState: string;

	states: {
		// listId is id from State
		[listId: string]: State;
	}

}