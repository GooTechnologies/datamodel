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
		[ref: string]: AnimationState
	}
	transitions: {
		[ref: string]: AnimationTransition	
	}
}

interface animation {
	ref?: string;
	layers: AnimationLayer[];
}