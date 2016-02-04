/// <reference path="../common.ts"/>

interface SoundComponent {
	sounds?: {
		[listId: string]: {
			soundRef: SoundRef;
			sortValue: number;
		}
	}
	volume?: number;
	reverb?: number;
}