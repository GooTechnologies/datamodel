/// <reference path="common.ts"/>

/** 
 * Not used in create (only ubershader)
 */
interface shader {
	name: string; // Actually the type, change name to type
	ref?: string;

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