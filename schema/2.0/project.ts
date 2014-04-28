/// <reference path="gooobject.ts"/>



// REVIEW: use an enum, see e.g. CameraProjectionType in entity.ts
/**
 * Matches types with one of 2d or 3d
 * (case sensitive, must be lowercase)
 *
 * @type string
 * @pattern (2d|3d)
 */
interface ProjectType {}

interface project extends GooObject {

	type?: ProjectType;

	/**
	 * Should always be in scenes as well
	 */
	mainSceneRef: SceneRef;

	scenes: {
		// listID is id to scerenref
		[listId: string]: {
			sortValue: number;
			sceneRef: SceneRef;
		}
	}

	/**
	* All references not in the scenes' entityRefs.
	*/
	assets?: {
		[listId: string]: {
			sortValue: number;
			assetRef: string;
		}
	}

	// TO BE REMOVED 
	publishedUrl?: URI;

	/**
	*	A set with published URI with it's date of publish.
	*/
	publishedUrls?: {
		URI: DateTime
	}
}
