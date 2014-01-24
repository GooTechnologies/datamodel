/// <reference path="gooobject.ts"/>

interface sound {

	/**
	 * Map key is the format (mp3, wav, etc.) in lowercase
	 */
	audioRefs: {
		// format is made up of audio ref id + extension
		[format:string]: AudioRef;
	}
	loop: boolean;
	volume: number;

	/**
	 * Currently not used
	 */
	sprite?: {
		spriteKey: {
			offset: number;
			duration: number;
		}
	}
}