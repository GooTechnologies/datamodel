/// <reference path="gooobject.ts"/>

/**
 */
interface script extends GooObject {

	className?: string;

	body?: string;
	dependencies?: {
		[ref: string]: {
			url: URI;
			sortValue: number;
		}
	}

	/**
	 * Deprecated, the script options should go on the script component
	 */
	options?: {
		[optname: string]: any;
	}
}