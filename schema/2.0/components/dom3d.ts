/// <reference path="../gooobject.ts"/>

interface Dom3dComponent {
	innerHtml: string;

	style?: string;

	imageRefs?: {
		[ref: string]: ImageRef
	};

	/**
	 * @default 500
	 * @minimum 0
	 */
	width: number;
	/**
	 * @default 500
	 * @minimum 0
	 */
	height: number;
}