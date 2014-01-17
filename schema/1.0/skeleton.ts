/// <reference path="common.ts"/>


interface Joint {
	index: int;
	parentIndex: int;
	name: string;
	inverseBindPose: {
		matrix?: Matrix4x4;

		// Deprecated alternative to matrix
		rotation?: Vector4; 
		scale?: Vector3; 
		translation?: Vector3;
	}
}

interface skeleton {
	joints: Joint[];
	ref?: string;
	name: string
}