/// <reference path="gooobject.ts"/>

enum MagFilter {
	NearestNeighbor,
	Bilinear
}

enum MinFilter {
	NearestNeighborNoMipMaps,
	NearestNeighborNearestMipMap,
	NearestNeighborLinearMipMap,
	BiliniearNoMipMaps,
	BiliniearNearestMipMap,
	Trilinear	
}

enum Wrap {
	Repeat,
	MirroredRepeat,
	EdgeClamp
}


/**
 * Migration notes: 
 * - Rename WrapU/WrapV to WrapS/WrapT to match the engine
 * - store fileName in matchFileName
 * - url renamed to imageRef
 */
interface texture extends GooObject {

	magFilter: MagFilter;
	minFilter: MinFilter;
	offset: Vector2;
	repeat: Vector2;
	
	imageRef: ImageRef;

	/**
	 * For automatic matching, only set by the converter
	 */
	matchFileName?: string; 

	wrapS: Wrap; 
	wrapT: Wrap; 

	/**
	 * Amount of anisotropic filtering (1=1x, 4=4x etc)
	 * max usually 4 or 16
	 *
	 * @minimum 1
	 * @maximum 16
	 * @multipleOf 1
	 */
	anisotropy: number;

	flipY: boolean;
}