/// <reference path="gooobject.ts"/>

interface sound extends GooObject {

	/**
	 * Map key is the format (mp3, wav, etc.) in lowercase
	 * The sound can contain more versions of the different sound.
	 */
	audioRefs: {
		[format:string]: AudioRef;
	}
	loop: boolean;
	volume: number;

	/* New sound stuff */
	/** Starting offset in seconds */
	offset?: number;
	duration?: number;
	timeScale?: number;
}