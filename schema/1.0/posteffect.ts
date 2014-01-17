/// <reference path="common.ts"/>


interface posteffect {
	name: string; // Actually the type, change name to type

	ref?: string;

	options: {
		[optname: string]: any;
	}
	enabled: boolean;
}