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
	includeDuplicateButton?: boolean;
	includeMaximizeButton?: boolean;
	includeLogo?: boolean;
	includeBottomBar?: boolean;
	transparentBackground?: boolean;
	transientUrl?: boolean;
	useDevicePixelRatio?: boolean;
	templateId?: string;
	customCSS?: string;
	customJS?: string;
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

	uniformScale?: boolean;
}

interface OnboardingSettings {
	tours?: {
		[tourName: string]: boolean
	};
}

interface PublishWarningDialogSettings {
	dismissed?: boolean;
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

interface usersettings {
	announcements?: {
		[announcementId: string]: boolean;
	};
	bin?: BinSettings;
	canvas?: CanvasSettings;
	export?: ExportSettings;
	inspector?: InspectorSettings;
	onboarding?: OnboardingSettings;
	publishWarningDialog?: PublishWarningDialogSettings;
	timeline?: TimelineSettings;
	viewConfig?: ViewConfigSettings;
	welcomeDialog?: WelcomeDialogSettings;
}
