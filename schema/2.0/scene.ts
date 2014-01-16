/// <reference path="common.ts"/>



/**
 * A scene in create (what was previously called a project)
 */
interface scene extends GooObject {

	/** 
	 * _Root_ entities that are present in the scene
	 */
	entityRefs: {
		[listId: string]: {
			entityRef: EntityRef;
			sortValue: number;
		}
	}

	posteffectsRef?: PosteffectsRef;

	environment?: EnvironmentRef;

}