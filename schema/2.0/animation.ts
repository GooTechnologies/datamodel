/// <reference path="gooobject.ts"/>
/// <reference path="animstate.ts"/>


interface AnimationLayer {
	sortValue: number;
	id: string;
	name: string;
	blendWeight: number;
	initialStateRef?: string;
	states: {
		// ref is id to a stateRef
		[ref: string]: {
			sortValue: number;
			stateRef: AnimationStateRef;
		}
	}
	transitions: {
		// ref is id to a stateRef
		// '*' is special case for catch-all
		[ref: string]: AnimationTransition
	}
}


interface animation extends GooObject {
	layers: {
		// Generated id
		[listId: string]: AnimationLayer;
	}
}