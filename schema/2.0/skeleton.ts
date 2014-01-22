/// <reference path="gooobject.ts"/>


/**
 * Migration note: 
 * - transform scale, rotation and translation into a 4x4 matrix in inverseBindPose
 */
interface Joint {
	index: int;
	parentIndex: int;
	name: string;
	inverseBindPose: Matrix4x4;
}

interface skeleton extends GooObject {
	joints: {
		[listId: string]: Joint;
	}
	ref?: string;
	name: string
}