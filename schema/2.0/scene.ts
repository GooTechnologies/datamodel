/// <reference path="gooobject.ts"/>



/**
 * A scene in create (what was previously called a project)
 */
interface scene extends GooObject {

	/** 
	 * _Root_ entities that are present in the scene
	 */
	entityRefs: {
		// listId is enities' id
		[listId: string]: EntityRef;
	}

	posteffectsRef?: PosteffectsRef;

	environmentRef?: EnvironmentRef;

}