/// <reference path="common.ts"/>

enum ShortCutMode {
	legacy,
	blender
}

enum UITheme {
	brightTheme,
	darkTheme,
}

interface LookAndFeelSettings {
	leftPanelWidth?: int;
	rightPanelWidth?: int;
	binHeight?: int;
	timelineHeight?: int;
	theme?: UITheme;
	keyboardShortcutsMode?: ShortCutMode;
}

interface ExportSettings {
	includeShareButtons?: boolean;
}

interface usersettings {
	export?: ExportSettings;
	lookAndFeel?: LookAndFeelSettings;
}
