/// <reference path="common.ts"/>

interface AnimationComponent {
	layersRef: LayersRef; // Reference to */Animations.animation
	poseRef: PoseRef; // Reference to */Skeleton.skeleton
}

interface CameraComponent {
	aspect?: number; // TODO: Mandatory?
	far: number;
	fov: number; 
	near: number;
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

interface LightComponent {
	type: LightType;
	angle?: number;
	
	color?: Color;
	attenuate: boolean; // To be removed
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

		fov: number; // Remove
		type: string; // Remove
		projection: string; // Remove
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
	hidden?: boolean;
	materialRefs?: MaterialRef[]; // If missing, renders a default material
	cullMode: CullMode;
	castShadows: boolean;
	receiveShadows: boolean;
	reflectable?: boolean;
}

interface ScriptComponent {
	scriptRefs: ScriptRef[];

}

interface StateMachineComponent {
	machineRefs: MachineRef[];
}

interface SoundComponent {
	soundRefs: SoundRef[];
}

interface TransformComponent {
	parentRef?: EntityRef;
	rotation: number[]; // Should be vector3
	scale?: Vector3;
	translation: Vector3;
}

interface entity {
	// Leaked from frontend
	ref?: EntityRef;
	name: string;
	hidden?: boolean;

	// Not needed
	nodeType?: string;

	components: {
		animation?: AnimationComponent;
		camera?: CameraComponent;
		light?: LightComponent;
		meshData?: MeshDataComponent;
		meshRenderer?: MeshRendererComponent;
		script?: ScriptComponent;
		stateMachine?: StateMachineComponent;
		sound?: SoundComponent;
		transform?: TransformComponent;
	}
}
