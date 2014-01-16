/// <reference path="common.ts"/>

/** 
 * This datatype will be enhanced when we implement
 * scripting for real.
 */
interface script extends GooObject {

	className: string;

	options?: {
		[optname: string]: any;
	} 
}