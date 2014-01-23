/// <reference path="gooobject.ts"/>

/** 
 * Not used in create (only ubershader), 
 * but we may want to add it back in the future
 */
interface shader extends GooObject {

	type: string

	attributes: {
		[attrname: string]: any;
	}
	defines: {
		[defname: string]: any;
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