/// <reference path="common.ts"/>


/**
 * Migration note: 
 * - transform scale, rotation and translation into a 4x4 matrix in inverseBindPose
 */
interface Joint {
	index: int;
	parentIndex: int;
	name: string;
	inverseBindPose: {
		matrix?: Matrix4x4;
	}
}

// TODO: ordering of joints is not important, right (they have index already)
// TODO: Is a skeleton potentially reusable?
interface skeleton extends GooObject {
	joints: {
		[listId: string]: Joint;
	}
	ref?: string;
	name: string
}