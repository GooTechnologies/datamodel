/// <reference path="../common.ts"/>

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