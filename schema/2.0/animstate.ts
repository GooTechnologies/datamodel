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

interface ClipSource {
	type: ClipType;
	/**
	 * Type Lerp only
	 * @minValue: 0
	 * @maxValue: 1
	 */
	blendWeight?: number;

	clipRef: ClipRef;

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
	 */
	loopCount: int;

	/**
	 * Higher means faster
	 */
	timeScale: number;
}

interface animstate {
	ref?:string;
	name: string;
	clipSource: ClipSource;
}