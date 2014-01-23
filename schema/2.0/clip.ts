/// <reference path="gooobject.ts"/>


enum BlendType {
	Linear
}

enum ClipType {
	Joint,
	Transform,
	Trigger, 
	FloatLERP
}

interface ClipChannel {
	blendType: BlendType;
	jointIndex: int;
	// name is the old jointName
	name: string;

	translationSamples: BinaryPointer;
	times: BinaryPointer;
	rotationSamples: BinaryPointer;
	scaleSamples: BinaryPointer;
	type: ClipType;

	/**
	 * Type trigger only, has to match length of times
	 */
	properties?: string[];
}

interface clip extends GooObject {
	binaryRef: BinaryRef;

	channels: {
		// Generated id
		[listId: string]: ClipChannel;
	}
}