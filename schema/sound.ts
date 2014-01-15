/// <reference path="common.ts"/>

interface sound {
	name: string;
	ref?: string;

	urls: AudioRef[];
	loop: boolean;
	volume: number;

	// Currently not used
	sprite?: {
		spriteKey: {
			offset: number;
			duration: number;
		}
	}
}