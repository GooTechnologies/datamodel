/// <reference path="gooobject.ts"/>
/// <reference path="entity.ts"/>

enum CanvasSizingMode {
	Stretch,
	Resolution,
	AspectRatio
};


// REVIEW: use an enum, see above

/**
 * Matches types with one of 2d or 3d
 * (case sensitive, must be lowercase)
 *
 * @type string
 * @pattern (2d|3d)
 */
interface SceneType {}

interface EditorCameraSettings {
	lookAtPoint: Vector3;
	spherical: Vector3;
}

interface PhysicsSettings {

	/**
	 * Global gravity vector.
	 */
	gravity: Vector3;

	/**
	 * What layer/layer collisions are turned off?
	 */
	ignoredLayerCollisions: {
		[layer: number]: Layer
	};
}

interface TimeSettings {

	/**
	 * A framerate-independent interval that dictates when physics calculations and fixedUpdate() are performed.
	 * @min 0.0001
	 */
	fixedTimeStep: number;

	/**
	 * A framerate-independent interval that caps the worst case scenario when frame-rate is low. Physics calculations and fixedUpdate() will not be performed for longer time than specified.
	 * @min 0.0001
	 */
	maxTimeStep: number;
}

/**
 * A scene in create (what was previously called a project)
 */
interface scene extends GooObject {
	type?: SceneType;

	tags?: {
	    [tagName: string]: string;
	}

	/**
	 * The name of each entity layer.
	 */
	layers?: {
		[layer: number]: string;
	};

	defaultPackRef?: PackRef;

	packs?: {
		[listId: string]: {
			packRef: PackRef;
			sortValue: number;
		}
	}

	/**
	* All references not in scene.entities
	* DEPRECATED: use bundle storage and packs instead
	*/
	assets?: {
		[listId: string]: {
			sortValue: number;
			assetRef: string;
		}
	}

	// Contains the stable url for the latest published project.
	publishedUrl?: URI;

	// Contains the date the stable url was published
	published?: DateTime;

	/**
	*	A set with published URI with it's date of publish.
	*/
	publishedUrls?: {
		[URI: string]: DateTime

	}

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

	editorCameraSettings?: {
		camera3d?: EditorCameraSettings;
		camera2d?: EditorCameraSettings;
	}

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

	physics?: PhysicsSettings;

	time?: TimeSettings;
}
