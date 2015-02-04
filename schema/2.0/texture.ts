/// <reference path="gooobject.ts"/>

enum MagFilter {
	NearestNeighbor,
	Bilinear
}

enum MinFilter {
	NearestNeighborNoMipMaps,
	NearestNeighborNearestMipMap,
	NearestNeighborLinearMipMap,
	BilinearNoMipMaps,
	BilinearNearestMipMap,
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
	lodBias?: number;
	loop?: boolean;
	lazy?: boolean;
	generateMipmaps?: boolean;

	imageRef?: ImageRef;

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

	/**
	 * @default true
	 */
	flipY: boolean;

	// REVIEW This should probably be power of two

	/**
	 * Rendering size for vector graphics.
	 *
	 * @minimum 1
	 * @multipleOf 1
	 */
	renderSize?: number;

	/**
	 * SVG xml-data.
	 */
	svgData?: string;
}
