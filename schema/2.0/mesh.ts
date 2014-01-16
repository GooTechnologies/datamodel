/// <reference path="common.ts"/>

enum IndexMode {
	Lines, 
	LineLoop, 
	LineStrip, 
	Points,
	TriangleFan, 
	Triangles, 
	TriangleStrip
}

enum MeshType {
	Mesh,
	SkinnedMesh
}

enum BoundingVolumeType {
	BoundingBox
	// BoundingSphere not currently supported
}

interface BoundingVolume {
	type: BoundingVolumeType;
	center?: Vector3;
	min?: Vector3;
	max?: Vector3;
}


interface mesh extends GooObject{

	binaryRef: BinaryRef;
	type: MeshType;


	/**
	 * Normally only the first element of the array is used
	 * TODO: Why have an array?
	 */ 
	indexLengths: int[];
	indexModes: IndexMode[];

	/** 
	 * Vertex colors, very rarely used
	 */
	colors?: BinaryPointer;
	indices: BinaryPointer;

	normals: BinaryPointer;
	tangents: BinaryPointer;
	textureCoords: BinaryPointer[];
	vertices: BinaryPointer;

	/**
	 * For skinned meshes
	 */
	joints?: BinaryPointer;
	weights?: BinaryPointer;
	
	vertexCount: int;

	boundingVolume: BoundingVolume
}