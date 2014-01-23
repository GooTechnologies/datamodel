/// <reference path="gooobject.ts"/>



/**
 * Will be extended with other weather properties in the future
 */
interface Weather {

	/**
	 * Particle based snow flakes
	 */
	snow?: {
		velocity: number;
		rate: number;
		enabled: boolean;
		height:number;
	}
}

/**
 * Environment settings, e.g. background and weather
 */
interface environment extends GooObject {

	backgroundColor: Color;
	globalAmbient: Color;
	skyboxRef?: SkyboxRef;
	
	fog: {
		enabled: boolean;
		color: Color;
		near: number;
		far: number;
	}

	weather?: Weather;
}