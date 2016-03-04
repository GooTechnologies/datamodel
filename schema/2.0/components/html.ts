/// <reference path="../common.ts"/>

interface HtmlComponent {
	innerHtml: string;

    style?: string;

	imageRefs?: {
		[ref: string]: ImageRef
	};

	/**
	 * If this is set to true, the html element will be centered to
	 * the screenspace coordinate of the entity.
	 */
	useTransformComponent: boolean;

	/**
	 * If true, the screen positioning will be rounded to pixels. Default is true to be backwards compatible
	 * @default true
	 */
	pixelPerfect?: boolean;
}