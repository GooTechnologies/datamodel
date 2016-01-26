/// <reference path="gooobject.ts"/>
/// <reference path="material.ts"/>

interface AnimationComponent {

	// Reference to */Animations.animation
	layersRef?: LayersRef;

	// Reference to */Skeleton.skeleton
	poseRef?: PoseRef;
}

/*----------------------------------------------------------------------------*/

enum CameraProjectionType {
	Perspective,
	Parallel
}

interface CameraComponent {

	/**
	 * @default 1
	 */
	aspect: number;

	/**
	 * @default false
	 */
	lockedRatio: boolean;

	/**
	 * @default "Perspective"
	 */
	projectionMode: CameraProjectionType;

	far: number;
	/**
	 * Mandatory if projectionMode is 0
	 */
	fov?: number;
	near: number;
	/**
	 * Mandatory if projectionMode is 1
	 */
	size?: number;

	/**
	 * Inside Create, update this camera when the editor camera moves
	 */
	followEditorCam?:boolean;
}

/*----------------------------------------------------------------------------*/

enum ColliderShape {
	Box,
	Cylinder,
	Plane,
	Sphere
}

interface ColliderComponent {
	/**
	 * @default Box
	 */
	shape: ColliderShape;
	/**
	 * @default false
	 */
	isTrigger: boolean;
	/**
	 * @default 0.3
	 * @minimum 0
	 */
	friction: number;
	/**
	 * @default 0.0
	 * @minimum 0
	 */
	restitution: number;
	shapeOptions: {
		/**
		 * @default [1,1,1]
		 */
		halfExtents?: Vector3;
		/**
		 * @default 1
		 * @minimum 0
		 */
		height?: number;
		/**
		 * @default 0.5
		 * @minimum 0
		 */
		radius?: number;
	};
}

/*----------------------------------------------------------------------------*/

interface HtmlComponent {
	innerHtml: string;

    style?: string;

	imageRefs?: {
		[ref: string]: ImageRef
	};

	/**
	 * If this is set to true, the html element will be centered to
	 * the screenspace coordinate of the entity.
	 */
	useTransformComponent: boolean;
}

/*----------------------------------------------------------------------------*/

interface Dom3dComponent {
	innerHtml: string;

	style?: string;

	imageRefs?: {
		[ref: string]: ImageRef
	};

	/**
	 * @default 500
	 * @minimum 0
	 */
	width: number;
	/**
	 * @default 500
	 * @minimum 0
	 */
	height: number;
}

/*----------------------------------------------------------------------------*/

enum LightType {
	PointLight,
	DirectionalLight,
	SpotLight
}

enum ShadowType {
	Basic,
	PCF,
	VSM
}

/**
 * Migration notes:
 * attenuate is never used, just remove
 * same with fov, type and projection from shadowSettings
 */
interface LightComponent {
	type: LightType;
	/**
	 * Mandatory if LightType is SpotLight
	 */
	angle?: number;
	/**
	 * @default [1,1,1]
	 */
	color?: Color;

	/**
	 * @default 1
	 */
	intensity: number;

	/**
	 * @default 0.2
	 */
	specularIntensity: number;

	lightCookie?: {
		enabled: boolean;
		textureRef: TextureRef;
	};

	penumbra?: number;

	/**
	 * Mandatory if LightType is other than DirectionalLight
	 */
	range?: number;

	/**
	 * @default true
	 */
	shadowCaster: boolean;

	/**
	* Direction and exponent is used by a SpotLight
	*/
	direction?: Vector3;
	exponent?: number;

	shadowSettings?: {
		darkness: number;
		far: number;
		/**
		 * Mandatory if LightType is other than DirectionalLight
		 */
		fov?: number;
		near: number;
		/**
		 * Mandatory if LightType is DirectionalLight
		 */
		size?: number;
		resolution: Vector2;
		shadowType: ShadowType;
	}
}

/*----------------------------------------------------------------------------*/

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

/*----------------------------------------------------------------------------*/

enum CullMode {
	Dynamic,
	Never
}

interface MeshRendererComponent {
	materials?: {
		// listId is the materialRef's id
		[listId: string]: {
			sortValue: number;
			materialRef: MaterialRef;
		}
	}

	cullMode: CullMode;
	castShadows: boolean;
	receiveShadows: boolean;
	/**
	 * @default true
	 */
	reflectable: boolean;
}

/*----------------------------------------------------------------------------*/

interface QuadComponent {
	materialRef?: MaterialRef;
}

/*----------------------------------------------------------------------------*/

interface RigidBodyComponent {
	/**
	 * @minimum: 0
	 * @default: 1
	 */
	mass: number;
	isKinematic: boolean;
	/**
	 * @default [0,0,0]
	 */
	velocity: Vector3;
	/**
	 * @default [0,0,0]
	 */
	angularVelocity: Vector3;
	/**
	 * @minimum: 0
	 * @default 0
	 */
	linearDrag: number;
	/**
	 * @minimum: 0
	 * @default 0
	 */
	angularDrag: number;
}

/*----------------------------------------------------------------------------*/

interface ScriptComponent {
	scripts: {
		// listId is a generated string on the frontend side.
		// "<uuid>.scriptInstance"
		[listId: string]: {
			id?: ScriptInstanceRef;
			scriptRef: ScriptRef;
			sortValue: number;
			name?: string;
			options?: {
				[optname: string]: any;
			}
		}
	}
}

/*----------------------------------------------------------------------------*/

interface StateMachineComponent {
	machines: {
		[listId: string]: {
			machineRef: MachineRef;
			sortValue: number;
		}
	}
}

/*----------------------------------------------------------------------------*/

interface SoundComponent {
	sounds?: {
		[listId: string]: {
			soundRef: SoundRef;
			sortValue: number;
		}
	}
	volume?: number;
	reverb?: number;
}

/*----------------------------------------------------------------------------*/

interface TextComponent {
    text: string;
    font: {
        name: string;
        fontRef: FontRef;
        license: string;
    };

    /**
     * @default 0.2
     */
    extrusion: number;

    /**
     * @default 0.5
     */
    smoothness: number;
}

/*----------------------------------------------------------------------------*/

enum EasingFunction {
	'Linear.None',
	'Quadratic.In',
	'Quadratic.Out',
	'Quadratic.InOut',
	'Cubic.In',
	'Cubic.Out',
	'Cubic.InOut',
	'Exponential.In',
	'Exponential.Out',
	'Exponential.InOut',
	'Elastic.In',
	'Elastic.Out',
	'Elastic.InOut',
	'Circular.In',
	'Circular.Out',
	'Circular.InOut',
	'Back.In',
	'Back.Out',
	'Back.InOut',
	'Bounce.In',
	'Bounce.Out',
	'Bounce.InOut'
}

interface TimelineComponent {
	/**
	 * Duration in seconds
	 */
	duration: number;
	loop: {
		/**
		 * If true, loop entire timeline. Additional properties to be added in
		 * the future.
		 */
		enabled: boolean;
	}
	channels: {
		[channelId: string]: {
			id: string;
			sortValue: number;

			entityId?: EntityRef;

			/**
			 * Available values are set by the handler. Example: translationX, diffuseR, animationLayer_<id>
			 * Invalid values will fail silently (no animation)
			 */
			propertyKey?: string;

			/**
			 * Name of event to fire. Only one of eventName and propertyKey should be defined.
			 * If both are defined, propertyKey will override.
			 */
			eventName?: string;

			/**
			 * Whether the channel is enabled. When the channel is disabled, the
			 * animation specified in its keyframes will not be performed by the
			 * engine.
			 */
			enabled?: boolean;

			keyframes: {
				[keyFrameId: string]: {
					/**
					 * Position in the timeline, in seconds counted from the start.
					 */
					time: number;

					/**
					 * Value of the channel property in this particular point in time
					 * Not required for pure event channels.
					 */
					value?: any;

					/**
					 * Easing function covering the interval between this keyframe and the next.
					 * Only for property channels
					 */
					easing?: EasingFunction;
				}
			}
		}
	}
}

/*----------------------------------------------------------------------------*/

/**
 * Migration notes:
 * - rotation may need to be transformed from matrix to euler angles
 * - parentRef is now childRefs
 */
interface TransformComponent {
	rotation: Vector3;
	scale: Vector3;
	translation: Vector3;
	children?: {
		[listId: string]: {
			entityRef: EntityRef;
			sortValue: number;
		}
	};
}

/*----------------------------------------------------------------------------*/

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
	type: string;
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

	startAngle: ParticleCurveSegmentArray;
	startColor: ParticleCurveSegmentArrayVector4;
	startLifetime: ParticleCurveSegmentArray;
	startSize: ParticleCurveSegmentArray;
	startSpeed: ParticleCurveSegmentArray;
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

/*----------------------------------------------------------------------------*/

interface entity extends GooObject {
	/**
	 * @default false
	 */
	hidden?: boolean;
	/**
	 * @default false
	 */
	static: boolean;

	components: {
		animation?: AnimationComponent;
		camera?: CameraComponent;
		light?: LightComponent
		meshData?: MeshDataComponent;
		meshRenderer?: MeshRendererComponent;
		quad?: QuadComponent;
		text?: TextComponent;
		script?: ScriptComponent;
		stateMachine?: StateMachineComponent;
		sound?: SoundComponent;
		timeline?: TimelineComponent;
		transform?: TransformComponent;
		html?: HtmlComponent;
		dom3d?: Dom3dComponent;
		rigidBody?: RigidBodyComponent;
		collider?: ColliderComponent;
		particleSystem?: ParticleSystemComponent;
	}
}
