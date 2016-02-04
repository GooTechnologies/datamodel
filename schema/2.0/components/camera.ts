/// <reference path="../common.ts"/>

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
	followEditorCam?: boolean;
}