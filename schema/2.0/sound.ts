/// <reference path="common.ts"/>

interface sound {

	/**
	 * Map key is the format (mp3, wav, etc.) in lowercase
	 * TODO: what sound formats do we actually support?
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