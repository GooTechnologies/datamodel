/// <reference path="common.ts"/>

interface script {
	className: string;
	name: string;
	ref?: string;

	options?: {
		[optname: string]: any;
	} 
}