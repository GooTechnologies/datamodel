/// <reference path="../common.ts"/>

enum ShapeName {
	Box,
	Quad,
	Sphere,
	Cylinder,
	Torus,
	Disk,
	Cone
};

interface MeshDataComponent {
	meshRef?: MeshRef;
	poseRef?: PoseRef;
	shape?: ShapeName;
	shapeOptions?: {
		[optName: string]: any;
	}
}