/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from '../../../../base/common/lifecycle.js';
import { IStorageService, StorageScope } from '../../../../platform/storage/common/storage.js';
import { INotificationService, Severity } from '../../../../platform/notification/common/notification.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { URI } from '../../../../base/common/uri.js';
import { ConfigurationTarget, IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { INativeEnvironmentService } from '../../../../platform/environment/common/environment.js';
import { isWindows, isMacintosh } from '../../../../base/common/platform.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { IWorkbenchThemeService } from '../../../services/themes/common/workbenchThemeService.js';

/**
 * Service responsible for importing settings from other IDEs
 */
export class MobileForgeSettingsImporterService extends Disposable {

	constructor(
		@IStorageService private readonly storageService: IStorageService,
		@INotificationService private readonly notificationService: INotificationService,
		@IFileService private readonly fileService: IFileService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@INativeEnvironmentService private readonly environmentService: INativeEnvironmentService,
		@ICommandService private readonly commandService: ICommandService,
		@IWorkbenchThemeService private readonly themeService: IWorkbenchThemeService
	) {
		super();
		this.checkForPendingImport();
	}

	/**
	 * Check if there's a pending import from onboarding
	 */
	private async checkForPendingImport(): Promise<void> {
		const importSource = this.storageService.get('mobileforge.importSource', StorageScope.APPLICATION);
		const importConfigDir = this.storageService.get('mobileforge.importConfigDir', StorageScope.APPLICATION);

		if (importSource && importConfigDir && importSource !== 'fresh') {
			console.log('[MobileForge] Found pending import from:', importSource);
			await this.performImport(importSource, importConfigDir);
		}
	}

	/**
	 * Import settings from the specified IDE
	 */
	private async performImport(source: string, sourceDir: string): Promise<void> {
		console.log('[MobileForge] performImport called with source:', source, 'sourceDir:', sourceDir);
		try {
			const ideName = this.getIDEName(source);
			console.log('[MobileForge] IDE name resolved to:', ideName);
			this.notificationService.info(`Importing settings from ${ideName}...`);

			// Import settings.json (includes theme settings)
			await this.importSettings(sourceDir);

			// Import keybindings
			await this.importKeybindings(sourceDir);

			// Import snippets (if any)
			await this.importSnippets(sourceDir);

			// Import extensions list
			const extensionsList = await this.getExtensionsList(source);
			if (extensionsList.length > 0) {
				await this.importExtensions(extensionsList);
			}

			// Clear the pending import flags
			this.storageService.remove('mobileforge.importSource', StorageScope.APPLICATION);
			this.storageService.remove('mobileforge.importConfigDir', StorageScope.APPLICATION);

			this.notificationService.info(`✅ Successfully imported settings from ${this.getIDEName(source)}! Extensions will be installed in the background.`);
		} catch (error) {
			console.error('[MobileForge] Import failed:', error);
			this.notificationService.error(`Failed to import settings from ${this.getIDEName(source)}. ${error}`);
		}
	}

	/**
	 * Import user settings
	 */
	private async importSettings(sourceDir: string): Promise<void> {
		const settingsPath = URI.file(`${sourceDir}/settings.json`);

		try {
			const exists = await this.fileService.exists(settingsPath);
			if (!exists) {
				console.log('[MobileForge] No settings.json found at:', settingsPath.fsPath);
				return;
			}

			const content = await this.fileService.readFile(settingsPath);
			const settingsText = content.value.toString();
			const settings = JSON.parse(settingsText);

			console.log('[MobileForge] Importing settings:', Object.keys(settings).length, 'keys');

			// Settings that should be skipped (path-specific or problematic)
			const skipSettings = [
				'mobileforge.',
				'dart.flutterSdkPath',
				'dart.sdkPath',
				'java.home',
				'python.pythonPath',
				'python.defaultInterpreterPath',
				'remote.',
				'sync.',
				'settingsSync.',
			];

			let importedCount = 0;
			let skippedCount = 0;
			let importedTheme: string | null = null;

			// Apply each setting
			for (const [key, value] of Object.entries(settings)) {
				try {
					// Skip settings that shouldn't be imported
					const shouldSkip = skipSettings.some(prefix => key.startsWith(prefix));
					if (shouldSkip) {
						skippedCount++;
						continue;
					}

					// Capture theme for special handling
					if (key === 'workbench.colorTheme' && typeof value === 'string') {
						importedTheme = value;
						console.log('[MobileForge] Found theme to import:', importedTheme);
					}

					await this.configurationService.updateValue(key, value);
					importedCount++;
				} catch (error) {
					console.warn('[MobileForge] Failed to import setting:', key, error);
					skippedCount++;
				}
			}

			// Apply theme directly using theme service for immediate effect
			if (importedTheme) {
				try {
					console.log('[MobileForge] Applying theme via theme service:', importedTheme);
					await this.themeService.setColorTheme(importedTheme, ConfigurationTarget.USER);
					console.log('[MobileForge] Theme applied successfully:', importedTheme);
				} catch (error) {
					console.warn('[MobileForge] Failed to apply theme:', importedTheme, error);
				}
			} else {
				// No theme found in imported settings - apply MobileForge Dark as default
				console.log('[MobileForge] No theme in imported settings, applying MobileForge Dark default');
				try {
					await this.themeService.setColorTheme('MobileForge Dark', ConfigurationTarget.USER);
					console.log('[MobileForge] Default theme applied successfully');
				} catch (error) {
					console.warn('[MobileForge] Failed to apply default theme:', error);
				}
			}

			console.log(`[MobileForge] Settings imported: ${importedCount}, skipped: ${skippedCount}`);
		} catch (error) {
			console.error('[MobileForge] Failed to read settings:', error);
			throw error;
		}
	}

	/**
	 * Import keybindings
	 */
	private async importKeybindings(sourceDir: string): Promise<void> {
		const keybindingsPath = URI.file(`${sourceDir}/keybindings.json`);

		try {
			const exists = await this.fileService.exists(keybindingsPath);
			if (!exists) {
				console.log('[MobileForge] No keybindings.json found');
				return;
			}

			// Read source keybindings
			const content = await this.fileService.readFile(keybindingsPath);
			const keybindingsText = content.value.toString();
			const keybindings = JSON.parse(keybindingsText);

			console.log('[MobileForge] Importing keybindings:', keybindings.length, 'bindings');

			// Get current user keybindings path from environment service
			const userKeybindingsPath = URI.joinPath(this.environmentService.userRoamingDataHome, 'keybindings.json');

			// Write keybindings to user folder
			await this.fileService.writeFile(userKeybindingsPath, content.value);
			console.log('[MobileForge] Keybindings imported successfully to:', userKeybindingsPath.fsPath);
		} catch (error) {
			console.error('[MobileForge] Failed to import keybindings:', error);
		}
	}

	/**
	 * Import code snippets
	 */
	private async importSnippets(sourceDir: string): Promise<void> {
		const snippetsDir = URI.file(`${sourceDir}/snippets`);

		try {
			const exists = await this.fileService.exists(snippetsDir);
			if (!exists) {
				console.log('[MobileForge] No snippets directory found');
				return;
			}

			// Get current user snippets path from environment service
			const userSnippetsDir = URI.joinPath(this.environmentService.userRoamingDataHome, 'snippets');

			// Ensure snippets directory exists
			await this.fileService.createFolder(userSnippetsDir);

			// Copy the entire snippets directory
			const snippetFiles = await this.fileService.resolve(snippetsDir);
			if (snippetFiles.children) {
				for (const child of snippetFiles.children) {
					if (!child.isDirectory) {
						const targetPath = URI.joinPath(userSnippetsDir, child.name);
						await this.fileService.copy(child.resource, targetPath, true);
					}
				}
			}

			console.log('[MobileForge] Snippets imported successfully to:', userSnippetsDir.fsPath);
		} catch (error) {
			console.error('[MobileForge] Failed to import snippets:', error);
		}
	}

	/**
	 * Get list of installed extensions from source IDE
	 */
	private async getExtensionsList(source: string): Promise<string[]> {
		const homeDir = this.environmentService.userHome.fsPath;
		let extensionsDir = '';

		// Get extensions directory for source IDE
		if (isMacintosh) {
			switch (source) {
				case 'vscode':
					extensionsDir = `${homeDir}/.vscode/extensions`;
					break;
				case 'cursor':
					extensionsDir = `${homeDir}/.cursor/extensions`;
					break;
				case 'trae':
					extensionsDir = `${homeDir}/.trae/extensions`;
					break;
			}
		} else if (isWindows) {
			switch (source) {
				case 'vscode':
					extensionsDir = `${homeDir}\\.vscode\\extensions`;
					break;
				case 'cursor':
					extensionsDir = `${homeDir}\\.cursor\\extensions`;
					break;
				case 'trae':
					extensionsDir = `${homeDir}\\.trae\\extensions`;
					break;
			}
		} else {
			// Linux
			switch (source) {
				case 'vscode':
					extensionsDir = `${homeDir}/.vscode/extensions`;
					break;
				case 'cursor':
					extensionsDir = `${homeDir}/.cursor/extensions`;
					break;
				case 'trae':
					extensionsDir = `${homeDir}/.trae/extensions`;
					break;
			}
		}

		if (!extensionsDir) {
			return [];
		}

		try {
			const extensionsDirUri = URI.file(extensionsDir);
			const exists = await this.fileService.exists(extensionsDirUri);
			if (!exists) {
				console.log('[MobileForge] Extensions directory not found:', extensionsDir);
				return [];
			}

			const extensionFolders = await this.fileService.resolve(extensionsDirUri);
			const extensionIds: string[] = [];

			if (extensionFolders.children) {
				for (const child of extensionFolders.children) {
					if (child.isDirectory) {
						// Extension folder names are typically: publisher.name-version
						// We need to extract publisher.name
						const folderName = child.name;
						// Remove version suffix (e.g., "ms-python.python-2023.1.0" -> "ms-python.python")
						const match = folderName.match(/^(.+?)-\d+\.\d+\.\d+/);
						if (match) {
							extensionIds.push(match[1]);
						} else if (folderName.includes('.')) {
							// Fallback: just use the folder name if it looks like an extension ID
							extensionIds.push(folderName);
						}
					}
				}
			}

			// Remove duplicates
			const uniqueExtensions = [...new Set(extensionIds)];
			console.log('[MobileForge] Found extensions to import:', uniqueExtensions.length);
			return uniqueExtensions;
		} catch (error) {
			console.error('[MobileForge] Failed to get extensions list:', error);
			return [];
		}
	}

	/**
	 * Import extensions by triggering installation
	 */
	private async importExtensions(extensionIds: string[]): Promise<void> {
		if (extensionIds.length === 0) {
			return;
		}

		console.log('[MobileForge] Installing extensions:', extensionIds);

		// Show notification about extensions
		this.notificationService.info(`📦 Installing ${extensionIds.length} extensions from your previous IDE...`);

		let installedCount = 0;
		let failedCount = 0;

		// Install each extension using the VS Code command
		for (const extensionId of extensionIds) {
			try {
				console.log('[MobileForge] Installing extension:', extensionId);
				await this.commandService.executeCommand('workbench.extensions.installExtension', extensionId, {
					donotSync: true // Don't sync these to settings sync
				});
				installedCount++;
			} catch (error) {
				console.warn('[MobileForge] Failed to install extension:', extensionId, error);
				failedCount++;
			}
		}

		// Show completion notification
		if (failedCount === 0) {
			this.notificationService.info(`✅ Successfully installed ${installedCount} extensions!`);
		} else {
			this.notificationService.info(`📦 Installed ${installedCount} extensions. ${failedCount} failed (may not be available in marketplace).`);
		}
	}

	/**
	 * Get friendly IDE name
	 */
	private getIDEName(source: string): string {
		switch (source) {
			case 'vscode': return 'VS Code';
			case 'cursor': return 'Cursor';
			case 'trae': return 'Trae IDE';
			default: return source;
		}
	}

	/**
	 * Get the config directory path for a specific IDE
	 */
	private getIDEConfigDir(ide: string): string {
		const homeDir = this.environmentService.userHome.fsPath;

		const idePaths: Record<string, { mac: string; win: string; linux: string }> = {
			'vscode': {
				mac: `${homeDir}/Library/Application Support/Code/User`,
				win: `${homeDir}\\AppData\\Roaming\\Code\\User`,
				linux: `${homeDir}/.config/Code/User`
			},
			'cursor': {
				mac: `${homeDir}/Library/Application Support/Cursor/User`,
				win: `${homeDir}\\AppData\\Roaming\\Cursor\\User`,
				linux: `${homeDir}/.config/Cursor/User`
			},
			'trae': {
				mac: `${homeDir}/Library/Application Support/Trae/User`,
				win: `${homeDir}\\AppData\\Roaming\\Trae\\User`,
				linux: `${homeDir}/.config/Trae/User`
			}
		};

		const paths = idePaths[ide];
		if (!paths) {
			return '';
		}

		if (isMacintosh) {
			return paths.mac;
		} else if (isWindows) {
			return paths.win;
		} else {
			return paths.linux;
		}
	}

	/**
	 * Public method to trigger import from a specific IDE
	 */
	public async importFromIDE(source: string): Promise<void> {
		const sourceConfigDir = this.getIDEConfigDir(source);

		if (!sourceConfigDir) {
			console.log('[MobileForge] Unknown IDE source:', source);
			return;
		}

		// Check if the source directory exists
		const sourceDirUri = URI.file(sourceConfigDir);
		const exists = await this.fileService.exists(sourceDirUri);

		if (!exists) {
			this.notificationService.notify({
				severity: Severity.Warning,
				message: `Could not find ${this.getIDEName(source)} settings at ${sourceConfigDir}. Make sure ${this.getIDEName(source)} is installed.`
			});
			console.log('[MobileForge] Source directory does not exist:', sourceConfigDir);
			return;
		}

		await this.performImport(source, sourceConfigDir);
	}
}
