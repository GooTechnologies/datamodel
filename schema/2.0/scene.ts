/// <reference path="gooobject.ts"/>
/// <reference path="entity.ts"/>



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


	timeline?: TimelineComponent;
}