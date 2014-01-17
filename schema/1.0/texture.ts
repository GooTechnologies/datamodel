/// <reference path="common.ts"/>

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

interface texture {
	name: string;
	ref?: string;

	magFilter: MagFilter;
	minFilter: MinFilter;
	offset: Vector2;
	repeat: Vector2;
	url: ImageRef;

	wrapU: Wrap; // Rename to wrapS/wrapT ?
	wrapV: Wrap; 

	fileName?: string; // Remove
	realUrl?: string; // Remove

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