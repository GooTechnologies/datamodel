/// <reference path="common.ts"/>


interface BinSettings {
	filters?: {
		[listId: string]: boolean;
	};
	collapsedPacks?: {
		[packId: string]: boolean;
	};
}

interface CanvasSettings {
	grid?: {
		gridColor?: {
			value: Vector4;
			enabled: boolean;
		};
		surfaceColor?: {
			value: Vector4;
			enabled: boolean;
		};
		opacity?: number;
	};
	viewFilters?: {
		environment?: boolean;
		grid?: boolean;
		postfx?: boolean;
	};
	shadingMode?: string;
}

interface ExportSettings {
	antialias?: boolean;
	includeShareButtons?: boolean;
	includeLogo?: boolean;
	transparentBackground?: boolean;
	transientUrl?: boolean;
	useDevicePixelRatio?: boolean;
}

interface InspectorSettings {
	collapsed?: {
		[id: string]: {
			scripts?: {
				[scriptId: string]: boolean;
			};
			panels?: {
				[panelId: string]: boolean;
			};
		};
	};

	collapsedPanels?: {
		[panelId: string]: boolean;
	};
}

interface TimelineSettings {
	autoKey?: boolean;
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
	leftPanelWidth?: int;
	rightPanelWidth?: int;
	binHeight?: int;
	keyboardShortcutsMode?: ShortCutMode;
	timelineHeight?: int;
	theme?: UITheme;
}

interface WelcomeDialogSettings {
	dismissed?: boolean;
}

interface PublishWarningDialogSettings {
	dismissed?: boolean;
}

interface usersettings {
	announcements?: {
		[announcementId: string]: boolean;
	};
	bin?: BinSettings;
	canvas?: CanvasSettings;
	export?: ExportSettings;
	inspector?: InspectorSettings;
	timeline?: TimelineSettings;
	viewConfig?: ViewConfigSettings;
	welcomeDialog?: WelcomeDialogSettings;
	publishWarningDialog?: PublishWarningDialogSettings;
}
