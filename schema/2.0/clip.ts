/// <reference path="common.ts"/>


enum BlendType {
	Linear
}

enum ClipType {
	Joint,
	Trigger, 
	FloatLERP
}

interface ClipChannel {
	sortValue: number;
	
	blendType: BlendType;
	jointIndex: int;
	jointName: string;
	name: string;

	translationSamples: BinaryPointer;
	times: BinaryPointer;
	rotationSamples: BinaryPointer;
	scaleSamples: BinaryPointer;
	type: ClipType;

	/**
	 * Type trigger only, has to match length of times
	 */
	properties?: {
		[propname: string]: any;
	}
}

interface clip extends GooObject {
	binaryRef: BinaryRef;
	name: string;
	ref?: string;

	channels: {
		[listId: string]: ClipChannel;
	}
}