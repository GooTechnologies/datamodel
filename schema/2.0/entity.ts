/// <reference path="gooobject.ts"/>

interface AnimationComponent {

	// Reference to */Animations.animation
	layersRef?: LayersRef;

	// Reference to */Skeleton.skeleton
	poseRef?: PoseRef;
}

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


interface HTMLComponent {
	innerHTML: string;
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

interface QuadComponent {
	materialRef?: MaterialRef;
}

interface ScriptComponent {
	scripts: {
		// listId is the ScriptRef's id
		[listId: string]: {
			scriptRef: ScriptRef;
			sortValue: number;
		}
	}
}

interface StateMachineComponent {
	machines: {
		[listId: string]: {
			machineRef: MachineRef;
			sortValue: number;
		}
	}
}

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
	}
}


interface entity extends GooObject {

	/**
	* @default false
	*/
	hidden: boolean;
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
		script?: ScriptComponent;
		stateMachine?: StateMachineComponent;
		sound?: SoundComponent;
		timeline?: TimelineComponent;
		transform?: TransformComponent;
		html?: HTMLComponent;
	}
}
