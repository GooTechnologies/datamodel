/// <reference path="gooobject.ts"/>


enum ClipType {
	Clip, 
	Managed, 
	Lerp,
	Frozen
}

enum ClipFilter {
	Exclude,
	Include
}

enum TransitionType {
	Fade, 
	SyncFade, 
	Frozen
}

interface AnimationTransition {
	type: TransitionType;
	fadeTime: number; 
}


interface ClipSource {
	type: ClipType;
	/**
	 * Type Lerp only
	 * @minValue: 0
	 * @maxValue: 1
	 */
	blendWeight?: number;

	/**
	 * For type Clip or Managed
	 */
	clipRef?: ClipRef;

	/**
	 * For type Frozen
	 */
	clipSource?: ClipSource;

	/**
	 * For type Lerp
	 */
	clipSourceA?: ClipSource;
	clipSourceB?: ClipSource;

	/**
	 * Type Frozen only
	 */
	frozenTime?:number;

	/**
	 * Type clip
	 */
	filter?: ClipFilter;

	/**
	 * Names of channels(joints) to use
	 * Use with types Clip and Managed and filter to include or exclude specific joints
	 */
	channels?: string[];

	/**
	 * -1 means loop infinitely
	 * @default -1
	 */
	loopCount: int;

	/**
	 * Higher means faster
	 * @default 1
	 */
	timeScale: number;
}

interface animstate extends GooObject {
	clipSource: ClipSource;
	
	transitions?: {
		// ref is id to a stateRef
		// '*' is special case for catch-all
		[ref: string]: AnimationTransition
	}	
}