/// <reference path="gooobject.ts"/>

/**
 * A pack of objects, used in a scene
 */

interface pack extends GooObject {
	isDefault?: boolean;
	objects: {
		// listId is object id
		[listId: string]: {
			sortValue: number;
			objectRef: string;
		}
	}
}