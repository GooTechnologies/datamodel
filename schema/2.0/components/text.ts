/// <reference path="../common.ts"/>

interface TextComponent {
	text: string;
	font: {
		name: string;
		fontRef: FontRef;
		license: string;
	};

	/**
	 * @default 0.2
	 */
	extrusion: number;

	/**
	 * @default 0.5
	 */
	smoothness: number;
}