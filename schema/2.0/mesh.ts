/// <reference path="gooobject.ts"/>

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

/**
 * @type string
 * @pattern ^[A-Z_]+$
 */
interface AttributeKey {}

interface mesh extends GooObject{

	binaryRef: BinaryRef;

	/**
	 * @default "Mesh"
	 */
	type: MeshType;


	/**
	 * Normally only the first element of the array is used
	 */ 
	indexLengths: int[];
	indexModes: IndexMode[];

	/**
	 * Most commonly POSITION, NORMAL, TANGENT, etc so
	 * attributes: {
	 *  POSITION: {
	 *   value: {...}
	 *   dimensions: 3
	 *  },
	 *  NORMAL: {
	 *   value: {...}
	 *   dimensions: 3
	 *  }
	 * }
	 */
	attributes: {
		[attrKey: AttributeKey]: {
			value: BinaryPointer;
			/**
			 * @minimum 1
			 */
			dimensions: int
		}
	}
	indices: BinaryPointer;

	/**
	 * For skinned meshes
	 */
	joints?: BinaryPointer;
	weights?: BinaryPointer;
	
	vertexCount: int;

	boundingVolume: BoundingVolume
}