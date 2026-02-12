/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';

export class WelcomeViewProvider {
	constructor(private readonly extensionUri: vscode.Uri) {}

	static showWelcome(context: vscode.ExtensionContext) {
		const panel = vscode.window.createWebviewPanel(
			'mobileforgeWelcome',
			'Welcome to MobileForge IDE',
			vscode.ViewColumn.One,
			{
				enableScripts: true
			}
		);

		panel.webview.html = getWelcomeHtml();
	}
}

function getWelcomeHtml(): string {
	return `
		<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>Welcome to MobileForge IDE</title>
			<style>
				* {
					margin: 0;
					padding: 0;
					box-sizing: border-box;
				}

				body {
					font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
					background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
					color: white;
					min-height: 100vh;
					padding: 40px 20px;
				}

				.container {
					max-width: 800px;
					margin: 0 auto;
				}

				h1 {
					font-size: 48px;
					font-weight: 700;
					margin-bottom: 16px;
					text-align: center;
				}

				.tagline {
					font-size: 20px;
					text-align: center;
					margin-bottom: 48px;
					opacity: 0.9;
				}

				.features {
					display: grid;
					grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
					gap: 24px;
					margin-bottom: 48px;
				}

				.feature-card {
					background: rgba(255, 255, 255, 0.1);
					backdrop-filter: blur(10px);
					border-radius: 12px;
					padding: 24px;
					border: 1px solid rgba(255, 255, 255, 0.2);
				}

				.feature-card h3 {
					font-size: 20px;
					margin-bottom: 12px;
				}

				.feature-card p {
					font-size: 14px;
					line-height: 1.6;
					opacity: 0.9;
				}

				.quick-start {
					background: rgba(255, 255, 255, 0.15);
					backdrop-filter: blur(10px);
					border-radius: 12px;
					padding: 32px;
					text-align: center;
				}

				.quick-start h2 {
					font-size: 28px;
					margin-bottom: 20px;
				}

				.action-buttons {
					display: flex;
					gap: 16px;
					justify-content: center;
					flex-wrap: wrap;
				}

				.btn {
					padding: 12px 24px;
					border-radius: 8px;
					border: none;
					font-size: 16px;
					font-weight: 600;
					cursor: pointer;
					transition: all 0.2s;
				}

				.btn-primary {
					background: white;
					color: #667eea;
				}

				.btn-primary:hover {
					transform: translateY(-2px);
					box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
				}

				.btn-secondary {
					background: rgba(255, 255, 255, 0.2);
					color: white;
					border: 1px solid rgba(255, 255, 255, 0.3);
				}

				.btn-secondary:hover {
					background: rgba(255, 255, 255, 0.3);
				}

				.icon {
					font-size: 32px;
					margin-bottom: 12px;
				}
			</style>
		</head>
		<body>
			<div class="container">
				<h1>🚀 Welcome to MobileForge IDE</h1>
				<p class="tagline">Your AI-powered Flutter development environment</p>

				<div class="features">
					<div class="feature-card">
						<div class="icon">⚡</div>
						<h3>Zero-Config Flutter</h3>
						<p>Flutter SDK bundled and ready. No environment setup needed.</p>
					</div>

					<div class="feature-card">
						<div class="icon">🤖</div>
						<h3>AI Code Assistant</h3>
						<p>Flutter-specialized AI that understands widgets, state management, and mobile patterns.</p>
					</div>

					<div class="feature-card">
						<div class="icon">🎨</div>
						<h3>Figma to Flutter</h3>
						<p>Convert designs directly into clean Flutter code with one click.</p>
					</div>

					<div class="feature-card">
						<div class="icon">🔧</div>
						<h3>Smart Debugging</h3>
						<p>Integrated DevTools, widget inspector, and platform channel debugging.</p>
					</div>

					<div class="feature-card">
						<div class="icon">📦</div>
						<h3>Deploy Wizard</h3>
						<p>Guided deployment to App Store and Play Store with one click.</p>
					</div>

					<div class="feature-card">
						<div class="icon">⚙️</div>
						<h3>Environment Health</h3>
						<p>Real-time monitoring of Flutter, Dart, Android SDK, and iOS toolchain.</p>
					</div>
				</div>

				<div class="quick-start">
					<h2>Get Started</h2>
					<p style="margin-bottom: 24px; opacity: 0.9;">
						Choose how you want to begin your Flutter journey
					</p>
					<div class="action-buttons">
						<button class="btn btn-primary" onclick="createNewProject()">
							Create New Flutter App
						</button>
						<button class="btn btn-secondary" onclick="openExisting()">
							Open Existing Project
						</button>
						<button class="btn btn-secondary" onclick="checkEnvironment()">
							Check Environment
						</button>
					</div>
				</div>
			</div>

			<script>
				const vscode = acquireVsCodeApi();

				function createNewProject() {
					vscode.postMessage({ command: 'createProject' });
				}

				function openExisting() {
					vscode.postMessage({ command: 'openFolder' });
				}

				function checkEnvironment() {
					vscode.postMessage({ command: 'checkEnvironment' });
				}
			</script>
		</body>
		</html>
	`;
}
