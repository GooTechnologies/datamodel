/// <reference path="gooobject.ts"/>

/// <reference path="components/animation.ts"/>
/// <reference path="components/camera.ts"/>
/// <reference path="components/collider.ts"/>
/// <reference path="components/dom3d.ts"/>
/// <reference path="components/html.ts"/>
/// <reference path="components/light.ts"/>
/// <reference path="components/mesh-data.ts"/>
/// <reference path="components/mesh-renderer.ts"/>
/// <reference path="components/particle-system.ts"/>
/// <reference path="components/quad.ts"/>
/// <reference path="components/rigid-body.ts"/>
/// <reference path="components/script.ts"/>
/// <reference path="components/sound.ts"/>
/// <reference path="components/state-machine.ts"/>
/// <reference path="components/text.ts"/>
/// <reference path="components/timeline.ts"/>
/// <reference path="components/transform.ts"/>

interface entity extends GooObject {
	/**
	 * @default false
	 */
	hidden?: boolean;

	/**
	 * @default false
	 */
	static: boolean;

	/**
	 * @default 1
	 */
	layer?: int;

	components: {
		animation?: AnimationComponent;
		camera?: CameraComponent;
		collider?: ColliderComponent;
		dom3d?: Dom3dComponent;
		html?: HtmlComponent;
		light?: LightComponent
		meshData?: MeshDataComponent;
		meshRenderer?: MeshRendererComponent;
		particleSystem?: ParticleSystemComponent;
		quad?: QuadComponent;
		rigidBody?: RigidBodyComponent;
		script?: ScriptComponent;
		sound?: SoundComponent;
		stateMachine?: StateMachineComponent;
		text?: TextComponent;
		timeline?: TimelineComponent;
		transform?: TransformComponent;
	}
}
