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
	indices: BinaryPointer;

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
		/**
		 * @type string
		 * @pattern ^[A-Z_]+$
		 */
		[attrKey: string]: {
			value: BinaryPointer;
			/**
			 * @minimum 1
			 */
			dimensions: int
		}
	}

	vertexCount: int;

	boundingVolume: BoundingVolume
}