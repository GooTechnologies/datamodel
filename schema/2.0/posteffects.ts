/// <reference path="gooobject.ts"/>


/**
 * A posteffect configuration 
 * (collection of posteffects, with options)
 */
interface posteffects extends GooObject {
	posteffects: {
		[key: string]: {
			sortValue: number;

			type: string;
			options: {
				[optname: string]: any;
			}
			enabled: boolean;
		}
	}
}