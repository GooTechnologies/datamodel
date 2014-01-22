/// <reference path="common.ts"/>

enum LicenseType {
	'CC0', 
	'CC BY',
	'CC BY-SA',
	'CC BY-NC',
	'CC BY-NC-SA',
	'PRIVATE'
}

interface GooObject {
	id: string;
	name: string;
	license: LicenseType;
	originalLicense: LicenseType;

	created: DateTime;
	modified: DateTime;

	public: boolean;
	owner: string;
	editors?: {
		[listId: string]: string;
	}

	/**
	 * Ignored if public is true
	 */
	viewers?: {
		[listId: string]: string;
	}

	description?: string;
	thumbnailRef?: ImageRef;

	deleted: boolean; 

	/**
	 * @default 2
	 */
	dataModelVersion: number;
}
