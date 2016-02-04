/// <reference path="../common.ts"/>

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