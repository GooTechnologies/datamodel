/// <reference path="common.ts"/>

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
	stateRef: AnimationStateRef;
	transitions?: {
		[key: string]: AnimationTransition;
	}
}

interface AnimationLayer {
	sortValue: number;
	name: string;

	blendWeight: number;
	defaultState: string;
	states: {
		[ref: string]: AnimationState
	}
	transitions: {
		[ref: string]: AnimationTransition	
	}
}


interface animation extends GooObject {
	ref?: string;
	layers: {
		[listId: string]: AnimationLayer;
	}
}