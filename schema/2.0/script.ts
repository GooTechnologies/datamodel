/// <reference path="gooobject.ts"/>

/** 
 * This datatype will be enhanced when we implement
 * scripting for real.
 */
interface script extends GooObject {



	className?: string;

	body?: string; 

	options?: {
		[optname: string]: any;
	}
}