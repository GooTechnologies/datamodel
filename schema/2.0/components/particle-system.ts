/// <reference path="../common.ts"/>
/// <reference path="../material.ts"/>

enum CurveType {
	'constant',
	'linear',
	'lerp'
}

enum ParticleConeEmitFrom {
	'base',
	'volume',
	'volumeshell'
}

enum ParticleSortModes {
	'none',
	'camera_distance'
}

interface ParticleCurveSegment {
	type: CurveType;
	offset: number;
	options: {
		// linear
		k?: number;
		m?: number;

		// constant
		value?: number;

		// Random between two curves
		valueA?: number;
		valueB?: number;

		// Random between two curves
		curveA?: ParticleCurveSegmentArray;
		curveB?: ParticleCurveSegmentArray;
	}
}

/**
 * @type array
 * @items.$ref ParticleCurveSegment
 * @minItems 1
 */
interface ParticleCurveSegmentArray { }

/**
 * @type array
 * @items.$ref ParticleCurveSegment
 * @minItems 4
 * @maxItems 4
 */
interface ParticleCurveSegmentArrayVector4 { }

/**
 * @type array
 * @items.$ref ParticleCurveSegment
 * @minItems 3
 * @maxItems 3
 */
interface ParticleCurveSegmentArrayVector3 { }

/**
 * @type number
 * @minimum 0
 */
interface PositiveNumber { }

enum ParticleShape {
	cone,
	box,
	sphere
}

enum ParticleTexturePreset {
	Flare,
	Splash,
	Plankton,
	Snowflake,
	Custom
}

/**
 */
interface ParticleSystemComponent {
	billboard: boolean;
	blending: Blending;

	/**
	 * @minItems 3
	 * @maxItems 3
	 */
	boxExtents: PositiveNumber[];

	colorOverLifetime: ParticleCurveSegmentArrayVector4;
	coneAngle: number;
	coneEmitFrom: ParticleConeEmitFrom;
	coneLength: number;
	coneRadius: number;
	depthTest: boolean;
	depthWrite: boolean;
	discardThreshold: number;
	duration: number;
	emissionRate: ParticleCurveSegmentArray;
	gravity: Vector3;
	localSpace: boolean;
	localVelocityOverLifetime: ParticleCurveSegmentArrayVector3;
	loop: boolean;

	/**
	 * @multipleOf 1
	 * @minimum 1
	 */
	maxParticles: number;

	preWarm: boolean;
	randomDirection: boolean;
	renderQueue: int;
	rotationSpeedOverLifetime: ParticleCurveSegmentArray;

	/**
	 * @multipleOf 1
	 * @minimum -1
	 */
	seed: number;

	shapeType: ParticleShape;
	sizeOverLifetime: ParticleCurveSegmentArray;
	sortMode: ParticleSortModes;
	sphereEmitFromShell: boolean;

	/**
	 * @minimum 0
	 */
	sphereRadius: number;

	autoPlay: boolean;

	startAngle: ParticleCurveSegmentArray;
	startColor: ParticleCurveSegmentArrayVector4;
	startLifetime: ParticleCurveSegmentArray;
	startSize: ParticleCurveSegmentArray;
	startSpeed: ParticleCurveSegmentArray;
	texturePreset: ParticleTexturePreset;
	texture?: {
		enabled: boolean;
		textureRef: TextureRef;
	};
	textureAnimationCycles: int;
	textureFrameOverLifetime: ParticleCurveSegmentArray;
	textureTilesX: int;
	textureTilesY: int;
	worldVelocityOverLifetime: ParticleCurveSegmentArrayVector3;
}