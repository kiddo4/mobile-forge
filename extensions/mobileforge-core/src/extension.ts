/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { EnvironmentHealthProvider } from './flutter/environmentHealth';
import { WelcomeViewProvider } from './ui/welcomeView';

export function activate(context: vscode.ExtensionContext) {
	console.log('MobileForge Core extension is now active!');

	// Register the welcome view
	const welcomeProvider = new WelcomeViewProvider(context.extensionUri);

	// Register commands
	context.subscriptions.push(
		vscode.commands.registerCommand('mobileforge.showWelcome', () => {
			WelcomeViewProvider.showWelcome(context);
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('mobileforge.checkEnvironment', async () => {
			await checkEnvironmentHealth();
		})
	);

	// Register environment health view
	const environmentHealthProvider = new EnvironmentHealthProvider();
	vscode.window.registerTreeDataProvider(
		'mobileforge.environmentHealth',
		environmentHealthProvider
	);

	// Show welcome on first launch
	const hasShownWelcome = context.globalState.get('mobileforge.hasShownWelcome', false);
	if (!hasShownWelcome) {
		vscode.commands.executeCommand('mobileforge.showWelcome');
		context.globalState.update('mobileforge.hasShownWelcome', true);
	}
}

async function checkEnvironmentHealth() {
	const panel = vscode.window.createWebviewPanel(
		'environmentHealth',
		'Environment Health',
		vscode.ViewColumn.One,
		{}
	);

	panel.webview.html = getEnvironmentHealthHtml();
}

function getEnvironmentHealthHtml(): string {
	return `
		<!DOCTYPE html>
		<html>
		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>Environment Health</title>
			<style>
				body { font-family: var(--vscode-font-family); padding: 20px; }
				h1 { color: var(--vscode-foreground); }
				.status { margin: 10px 0; }
				.status.ok { color: #4CAF50; }
				.status.warning { color: #FF9800; }
				.status.error { color: #F44336; }
			</style>
		</head>
		<body>
			<h1>🔧 Environment Health Check</h1>
			<div class="status ok">✓ Flutter SDK: Ready (coming soon)</div>
			<div class="status ok">✓ Dart SDK: Ready (coming soon)</div>
			<div class="status warning">⚠ Android SDK: Not configured (coming soon)</div>
			<div class="status warning">⚠ iOS Toolchain: Checking... (coming soon)</div>
		</body>
		</html>
	`;
}

export function deactivate() {
	console.log('MobileForge Core extension deactivated');
}
