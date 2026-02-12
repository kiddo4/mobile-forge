/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';

export interface HealthCheckItem {
	label: string;
	status: 'ok' | 'warning' | 'error' | 'checking';
	description?: string;
	action?: string;
}

export class EnvironmentHealthProvider implements vscode.TreeDataProvider<HealthCheckItem> {
	private _onDidChangeTreeData: vscode.EventEmitter<HealthCheckItem | undefined | null | void> = new vscode.EventEmitter<HealthCheckItem | undefined | null | void>();
	readonly onDidChangeTreeData: vscode.Event<HealthCheckItem | undefined | null | void> = this._onDidChangeTreeData.event;

	private healthItems: HealthCheckItem[] = [];

	constructor() {
		this.performHealthCheck();
	}

	refresh(): void {
		this.performHealthCheck();
		this._onDidChangeTreeData.fire();
	}

	getTreeItem(element: HealthCheckItem): vscode.TreeItem {
		const treeItem = new vscode.TreeItem(element.label, vscode.TreeItemCollapsibleState.None);

		// Set icon based on status
		switch (element.status) {
			case 'ok':
				treeItem.iconPath = new vscode.ThemeIcon('pass', new vscode.ThemeColor('testing.iconPassed'));
				break;
			case 'warning':
				treeItem.iconPath = new vscode.ThemeIcon('warning', new vscode.ThemeColor('testing.iconQueued'));
				break;
			case 'error':
				treeItem.iconPath = new vscode.ThemeIcon('error', new vscode.ThemeColor('testing.iconFailed'));
				break;
			case 'checking':
				treeItem.iconPath = new vscode.ThemeIcon('sync~spin');
				break;
		}

		if (element.description) {
			treeItem.description = element.description;
		}

		if (element.action) {
			treeItem.command = {
				command: element.action,
				title: 'Fix',
				arguments: [element]
			};
		}

		return treeItem;
	}

	getChildren(element?: HealthCheckItem): Thenable<HealthCheckItem[]> {
		if (element) {
			return Promise.resolve([]);
		} else {
			return Promise.resolve(this.healthItems);
		}
	}

	private async performHealthCheck(): Promise<void> {
		// TODO: Implement actual health checks
		// For now, showing placeholder data
		this.healthItems = [
			{
				label: 'Flutter SDK',
				status: 'warning',
				description: 'Not configured yet',
				action: 'mobileforge.installFlutter'
			},
			{
				label: 'Dart SDK',
				status: 'warning',
				description: 'Not configured yet'
			},
			{
				label: 'Android SDK',
				status: 'warning',
				description: 'Not configured yet',
				action: 'mobileforge.installAndroidSDK'
			},
			{
				label: 'iOS Toolchain',
				status: 'checking',
				description: 'Checking Xcode...'
			}
		];
	}
}
