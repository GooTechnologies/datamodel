/// <reference path="common.ts"/>



/**
 * A scene in create (what was previously called a project)
 */
interface scene extends GooObject {

	/** 
	 * _Root_ entities that are present in the scene
	 */
	entities: {
		[listId: string]: {
			entityRef: EntityRef;
			sortValue: number;
		}
	}

	posteffectsRef?: PosteffectsRef;

	environment?: EnvironmentRef;

}