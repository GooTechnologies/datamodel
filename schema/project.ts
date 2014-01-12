
enum LicenseType {
	'CC0', 
	'CC BY',
	'CC BY-SA',
	'CC BY-NC',
	'CC BY-NC-SA',
	'PRIVATE'
}

enum SkyboxShape {
	Sphere,
	Box
};

interface SkyBox {
	ref?: string;

	/**
	 * @additionalProperties true
	 */
	attribution: {
		name: string;
		link: URI;
	};
	environmentType: number;
	shape: SkyboxShape;
	rotation: number;

	imageUrls: string[];
}

interface Weather {
	snow?: {
		velocity: number;
		rate: number;
		enabled: boolean;
		height:number;
	}
}



interface project {

	id: string;
	
	licenseType: LicenseType;
	originalLicenseType?: LicenseType;

	name: string;
	public: boolean;
	description: string;
	deleted: boolean;

	created: DateTime;
	modified: DateTime;

	// Ref to project id
	parent?:string;



	// Array of user ids to users who own this project
	own: string[];
	edit: string[];
	view: string[];

	entityRefs: EntityRef[];
	posteffectRefs: PosteffectRef[];
	groupRefs: GroupRef[];

	backgroundColor: Color;
	globalAmbient: Color;
	skybox: SkyBox;
	screenshot: ImageRef;
	
	useFog: boolean;
	fogColor: Color;
	fogNear: number;
	fogFar:number;

	ref?: string;

	weather: Weather;

	publishedURL?: URI;
}