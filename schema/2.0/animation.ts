/// <reference path="gooobject.ts"/>

enum TransitionType {
	Fade, 
	SyncFade, 
	Frozen
}

interface AnimationTransition {
	type: TransitionType;
	fadeTime: number; 
}

interface AnimationState {
	sortValue: number;
	stateRef: AnimationStateRef;
	transitions?: {
		// key is id to a stateRef
		[key: string]: AnimationTransition;
	}
}

interface AnimationLayer {
	sortValue: number;
	id: string;
	name: string;
	blendWeight: number;
	initialState?: string;
	states: {
		// ref is id to a stateRef
		[ref: string]: AnimationState
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