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

interface ScriptComponent {
	scriptRefs: {
		// listId is the ScriptRef's id
		[listId: string]: ScriptRef;
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
	soundRefs?: {
		[listId: string]: SoundRef;
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
	childRefs?: {
		[listId: string]: EntityRef;
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
		script?: ScriptComponent;
		stateMachine?: StateMachineComponent;
		sound?: SoundComponent
		transform?: TransformComponent;
	}
}
