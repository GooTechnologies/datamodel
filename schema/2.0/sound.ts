/// <reference path="gooobject.ts"/>

interface sound {

	/**
	 * Map key is the format (mp3, wav, etc.) in lowercase
	 * The sound can contain more versions of the different sound.
	 */
	audioRefs: {
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