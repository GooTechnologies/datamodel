/// <reference path="gooobject.ts"/>
/// <reference path="entity.ts"/>

enum CanvasSizingMode {
	Stretch,
	Resolution,
	AspectRatio
};

/**
 * A scene in create (what was previously called a project)
 */
interface scene extends GooObject {

	/**
	 * _Root_ entities that are present in the scene
	 */
	entities: {
		// listId is enities' id
		[listId: string]: {
			entityRef: EntityRef;
			sortValue: number;
		}
	}
	initialCameraRef: EntityRef;

	posteffectsRef?: PosteffectsRef;

	environmentRef?: EnvironmentRef;

	canvas?: {
		mode?: CanvasSizingMode;
		resolution?: {
			width: number;
			height: number;
		}
		aspect?: {
			width: number;
			height: number;
		}
	}

	timeline?: TimelineComponent;
}