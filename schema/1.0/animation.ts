/// <reference path="common.ts"/>

enum TransitionType {
	Fade, 
	SyncFade, 
	Frozen
}

interface AnimationTransition {
	type: TransitionType;
	fadeTime: string; // Should be number
}

interface AnimationState {
	stateRef: AnimationStateRef;
	transitions?: {
		[key: string]: AnimationTransition;
	}
}

interface AnimationLayer {
	name: string;
	blendWeight: number;
	defaultState: string;
	states: {
		// Key to a state
		[ref: string]: AnimationState
	}
	transitions: {
		// Key to a state
		// '*' is special case key, catch-all
		[ref: string]: AnimationTransition	
	}
}

interface animation {
	ref?: string;
	layers: AnimationLayer[];
}