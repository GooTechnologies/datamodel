/// <reference path="common.ts"/>

interface CanvasSettings {
	timestamp: int;
	data: {
		viewFilters?: {
			[listId: string]: boolean;
		};
		shadingMode?: string;
	};
}

interface ExportSettings {
	timestamp: int;
	data: {
		includeShareButtons?: boolean;
		includeLogo?: boolean;
		transparentBackground?: boolean;
	};
}

interface BinSettings {
	timestamp: int;
	data: {
		filters?: {
			[listId: string]: boolean;
		};
	};
}

interface CollapsedScriptsSettings {
	timestamp: int;
	data: {
		[listId: string]: {
			scripts: {
				[listId: string]: boolean;
			};
		};
	};
}

interface ExplodedPanelsSettings {
	timestamp: int;
	data: {
		[listId: string]: {
			panels: {
				[listId: string]: boolean;
			};
		}
	};
}

enum ShortCutMode {
	legacy,
	blender
}

enum UITheme {
	'dark-theme',
	'bright-theme'
}

interface ViewConfigSettings {
	timestamp: int;
	data: {
		leftPanelWidth?: int;
		rightPanelWidth?: int;
		binHeight?: int;
		keyboardShortcutsMode?: ShortCutMode;
		timelineHeight?: int;
		theme?: UITheme;
	}
}

interface TimelineSettings {
	timestamp: int;
	data: {
		settings?: {
			autoKey: boolean;
		};
	};
}

interface usersettings {
	bin?: BinSettings;
	canvas?: CanvasSettings;
	collapsedScripts?: CollapsedScriptsSettings;
	explodedPanels?: ExplodedPanelsSettings;
	export?: ExportSettings;
	timeline?: TimelineSettings;
	viewConfig?: ViewConfigSettings;
}
