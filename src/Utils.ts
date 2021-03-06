'use strict';

import * as editorconfig from 'editorconfig';
import {
	window,
	TextDocument,
	TextEditor,
	TextEditorOptions
} from 'vscode';

/**
 * Convert .editorconfig values to vscode editor options
 */
export function fromEditorConfig(
	config: editorconfig.knownProps,
	defaults: TextEditorOptions
): TextEditorOptions {
	return {
		insertSpaces: config.indent_style
			? config.indent_style !== 'tab'
			: defaults.insertSpaces,
		tabSize: config.tab_width
			|| config.indent_size
			|| defaults.tabSize
	};
}

/**
 * Convert vscode editor options to .editorconfig values
 */
export function toEditorConfig(options: TextEditorOptions) {
	const result: editorconfig.knownProps = {};

	switch (options.insertSpaces) {
		case true:
			result.indent_style = 'space';
			result.indent_size = resolveTabSize(options.tabSize);
			break;
		case false:
		case 'auto':
			result.indent_style = 'tab';
			result.tab_width = resolveTabSize(options.tabSize);
			break;
	}

	return result;
}

/**
 * Convert vscode tabSize option into numeric value
 */
export function resolveTabSize(tabSize: number|string) {
	return (tabSize === 'auto') ? 4 : parseInt(String(tabSize), 10);
}

/**
 * Retrieve the current active text editor.
 */
export function findEditor(textDocument: TextDocument): TextEditor {
	for (const editor of window.visibleTextEditors) {
		if (editor.document === textDocument) {
			return editor;
		}
	}

	return null;
}
