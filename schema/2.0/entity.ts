/// <reference path="common.ts"/>

interface AnimationComponent {
	layersRef: LayersRef;
	poseRef: PoseRef
}

interface CameraComponent {
	aspect?: number; // TODO: Mandatory?
	far: number;
	fov: number; 
	near: number
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
	angle?: number;
	
	color?: Color;
	direction?: Vector3;
	exponent?: number;
	intensity: number;
	lightCookie?: {
		enabled: boolean;
		textureRef: TextureRef;
	};
	penumbra?: number;
	range?: number;
	shadowCaster: boolean;
	
	shadowSettings?: {
		darkness: number;
		upVector: Vector3;
		far: number;

		near: number;
		size: number;
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

	// TODO: Should we have hidden both here and on the entity?
	hidden?: boolean;
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
	scale?: Vector3;
	translation: Vector3;
	childRefs: {
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
