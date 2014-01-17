/// <reference path="gooobject.ts"/>


interface project extends GooObject {

	mainScene: SceneRef;
	
	scenes: {
		[listId: string]: {
			sortValue: number;
			sceneRef: SceneRef;
		}
	}

	assets: {
		[listId: string]: {
			sortValue: number;
			assetRef: string;
		}
	}

	publishedUrl?: URI;
}