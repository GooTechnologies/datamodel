/// <reference path="gooobject.ts"/>



/**
 * Will be extended with other weather properties in the future
 */
interface Weather {

	/**
	 * Particle based snow flakes
	 */
	snow?: {

		/**
		* @default 10
		*/
		velocity: number;
		/**
		* @default 10
		*/
		rate: number;
		/**
		* @default true
		*/
		enabled: boolean;
		/**
		* @default 25
		*/
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
	sound?: {
		dopplerFactor?: number;
		rolloffFactor?: number;
		maxDistance?: number;
		volume?: number;
		reverb?: number;
		reverbRef?: SoundRef;
	}
}