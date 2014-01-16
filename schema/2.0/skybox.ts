/// <reference path="common.ts"/>


/** 
 * A skybox, with configuration
 */
interface skybox extends GooObject {
	/**
	 * Not currently used
	 */
	rotation?: number;

	/**
	 * Only the box or the sphere can be enabled.
	 * If both are enabled, box should override sphere in the loader.
	 */
	box?: {
		enabled: boolean;
		topRef?: TextureRef;
		bottomRef?: TextureRef;
		leftRef?: TextureRef;
		rightRef?: TextureRef;
		frontRef?: TextureRef;
		backRef?: TextureRef;
	}

	sphere?: {
		enabled: boolean;
		sphereRef?: TextureRef;
	}
}
