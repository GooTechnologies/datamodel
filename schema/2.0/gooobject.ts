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
	originalLicense?: LicenseType;

	created: DateTime;
	modified: DateTime;

	readOnly?: boolean;

	description?: string;
	thumbnailRef?: ImageRef;

	originalAsset?: {
		id: string;
		version: string;
	};

	deleted: boolean;

	/**
	 * @default 2
	 */
	dataModelVersion: number;
}
