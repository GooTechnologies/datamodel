/// <reference path="../common.ts"/>

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

	freezePositionX?: boolean;
	freezePositionY?: boolean;
	freezePositionZ?: boolean;
	freezeRotationX?: boolean;
	freezeRotationY?: boolean;
	freezeRotationZ?: boolean;
}