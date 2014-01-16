/// <reference path="common.ts"/>

/** 
 * Not used in create (only ubershader), 
 * but we may want to add it back in the future
 */
interface shader extends GooObject {

	attributes: {
		[attrname: string]: any;
	}

	fshaderRef: string;
	vshaderRef: string;

	processors: string[];
	
	uniforms: {
		[key: string]: any;
	}

	options: {
		[optname: string]: any;
	}
	
	enabled: boolean;
}