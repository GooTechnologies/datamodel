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

/**
 * @type array
 * @items.$ref CurveSegment
 * @minItems 1
 */
interface Curve { }

interface CurveSegment {
	type: CurveType;
	offset: number;

	// linear
	k?: number;
	m?: number;

	// constant
	value?: number;

	// Random between two curves
	valueA?: number;
	valueB?: number;

	// Random between two curves
	curveA?: Curve;
	curveB?: Curve;
}

/**
 * @type array
 * @items.$ref Curve
 * @minItems 4
 * @maxItems 4
 */
interface CurveVector4 { }

/**
 * @type array
 * @items.$ref Curve
 * @minItems 3
 * @maxItems 3
 */
interface CurveVector3 { }

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

	colorOverLifetime: CurveVector4;
	coneAngle: number;
	coneEmitFrom: ParticleConeEmitFrom;
	coneLength: number;
	coneRadius: number;
	depthTest: boolean;
	depthWrite: boolean;
	discardThreshold: number;
	duration: number;
	emissionRate: Curve;
	gravity: Vector3;
	localSpace: boolean;
	localVelocityOverLifetime: CurveVector3;
	loop: boolean;

	/**
	 * @multipleOf 1
	 * @minimum 1
	 */
	maxParticles: number;

	preWarm: boolean;
	randomDirection: boolean;
	renderQueue: int;
	rotationSpeedOverLifetime: Curve;

	/**
	 * @multipleOf 1
	 * @minimum -1
	 */
	seed: number;

	shapeType: ParticleShape;
	sizeOverLifetime: Curve;
	sortMode: ParticleSortModes;
	sphereEmitFromShell: boolean;

	/**
	 * @minimum 0
	 */
	sphereRadius: number;

	autoPlay: boolean;

	startAngle: Curve;
	startColor: CurveVector4;
	startLifetime: Curve;
	startSize: Curve;
	startSpeed: Curve;
	texturePreset: ParticleTexturePreset;
	texture?: {
		enabled: boolean;
		textureRef: TextureRef;
	};
	textureAnimationCycles: int;
	textureFrameOverLifetime: Curve;
	textureTilesX: int;
	textureTilesY: int;
	worldVelocityOverLifetime: CurveVector3;
}