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
	blendType: BlendType;
	jointIndex: number;
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

interface clip {
	binaryRef: BinaryRef;
	name: string;
	ref?: string;

	channels: ClipChannel[];
}