/// <reference path="../common.ts"/>

interface ScriptComponent {
	scripts: {
		// listId is a generated string on the frontend side.
		// "<uuid>.scriptInstance"
		[listId: string]: {
			id?: ScriptInstanceRef;
			scriptRef: ScriptRef;
			sortValue: number;
			name?: string;
			options?: {
				[optname: string]: any;
			}
		}
	}
}