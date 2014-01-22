/// <reference path="gooobject.ts"/>

interface AnimationComponent {
	layersRef: LayersRef;
	poseRef: PoseRef
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
	 * @minimum 0
	 * @maximum 1
	 */
	projectionMode: number

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
	intensity: number;
	lightCookie?: {
		enabled: boolean;
		textureRef: TextureRef;
	};
	penumbra?: number;
	/**
	 * Mandatory if LightType is other than DirectionalLight
	 */
	range?: number;
	shadowCaster: boolean;
	
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
	specularIntensity: number;
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
	materialRefs?: {
		[listId: string]: MaterialRef;
	}

	cullMode: CullMode;
	castShadows: boolean;
	receiveShadows: boolean;
	reflectable?: boolean;
}

interface ScriptComponent {
	scriptRefs: {
		[listId: string]: ScriptRef;
	}
}

interface StateMachineComponent {
	machineRefs: {
		[listId: string]: MachineRef;
	}
}

interface SoundComponent {
	soundRefs: {
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

	hidden?: boolean;

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
