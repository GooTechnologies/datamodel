/// <reference path="gooobject.ts"/>

/** 
 * This datatype will be enhanced when we implement
 * scripting for real.
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

	options?: {
		[optname: string]: any;
	}
}