/// <reference path="common.ts"/>

interface sound {
	name: string;
	ref?: string;

	urls: URI[];
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