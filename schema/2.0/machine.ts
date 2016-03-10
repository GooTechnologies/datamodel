/// <reference path="gooobject.ts"/>


interface Transition {
	id: string;
	key?: string;
	name?: string;
	sortValue: number;

	/**
	 * If this property is not present, the transition is not connected
	 * to another state.
	 */
	targetState?: string;
}

interface Action {
	id: string;
	name?: string;
	sortValue: number;

	type: string;

	/**
	 * @additionalProperties true
	 */
	options?: {
		transitions?: {
			[key: string]: string
		}
	}
}

interface State {
	id: string;
	name?: string;
	sortValue: number;

	// The position of the state in the graph.
	position?: Vector2;

	actions?: {
		// listId is Action's id
		[listId: string]: Action;
	}

	transitions?: {
		// listid is Transition's id
		[listId: string]: Transition;
	}

	childMachines?: {
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

	/**
	 * Maximum transition recursion/loop depth during a single frame
	 * @default 100
	 */
	maxLoopDepth?: number;
	/**
	 * True means using the old async way, False the new synchronized transition model
	 * @default false
	 */
	asyncMode?: boolean;

	position?: Vector2;
	zoom?: number;

	states: {
		// listId is id from State
		[listId: string]: State;
	}

}