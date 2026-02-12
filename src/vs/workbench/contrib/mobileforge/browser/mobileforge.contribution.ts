/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from '../../../../base/common/lifecycle.js';
import { IWorkbenchContributionsRegistry, Extensions as WorkbenchExtensions, IWorkbenchContribution } from '../../../common/contributions.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { LifecyclePhase } from '../../../services/lifecycle/common/lifecycle.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { INotificationService, Severity } from '../../../../platform/notification/common/notification.js';
import { Action2, registerAction2 } from '../../../../platform/actions/common/actions.js';
import { ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { IWorkspaceContextService, WorkbenchState } from '../../../../platform/workspace/common/workspace.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { INativeEnvironmentService } from '../../../../platform/environment/common/environment.js';
import { IWorkbenchThemeService } from '../../../services/themes/common/workbenchThemeService.js';
import { MobileForgeFullScreenOnboardingContribution } from './mobileforgeFullScreenOnboarding.js';
import { MobileForgeUICustomizerContribution } from './mobileforgeUICustomizer.js';
import { MobileForgeSettingsImporterService } from './mobileforgeSettingsImporter.js';
import { MobileForgeFlutterDiagnosticsService } from './mobileforgeFlutterDiagnostics.js';

/**
 * MobileForge Workbench Contribution
 *
 * This is the core of MobileForge IDE - it integrates Flutter-first
 * development features directly into the workbench.
 */
class MobileForgeWorkbenchContribution extends Disposable implements IWorkbenchContribution {

	static readonly ID = 'workbench.contrib.mobileforge';
	private static readonly DEFAULTS_APPLIED_KEY = 'mobileforge.defaultsApplied';
	private static readonly SHOWN_WELCOME_KEY = 'mobileforge.welcomeShown';

	constructor(
		@IStorageService private readonly storageService: IStorageService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@ICommandService private readonly commandService: ICommandService,
		@IWorkspaceContextService private readonly workspaceService: IWorkspaceContextService,
		@INotificationService private readonly notificationService: INotificationService
	) {
		super();

		this.applyInitialDefaults().catch(() => { /* noop */ });

		// Show welcome on first launch and when opening an empty window
		this.showWelcomeIfNeeded();
		this.showWelcomeOnEmptyWorkbench();

		// Initialize MobileForge features
		this.initializeFlutterEnvironment();
	}

	private showWelcomeIfNeeded(): void {
		const hasShownWelcome = this.storageService.getBoolean(
			MobileForgeWorkbenchContribution.SHOWN_WELCOME_KEY,
			StorageScope.APPLICATION,
			false
		);

		if (!hasShownWelcome) {
			// Mark as shown
			this.storageService.store(
				MobileForgeWorkbenchContribution.SHOWN_WELCOME_KEY,
				true,
				StorageScope.APPLICATION,
				StorageTarget.USER
			);

			// Show welcome notification with actions
			this.notificationService.prompt(
				Severity.Info,
				'Welcome to MobileForge IDE - Your Flutter-First Development Environment! 🚀',
				[
					{
						label: 'Open Flutter Project',
						run: () => {
							this.commandService.executeCommand('workbench.action.files.openFolder');
						}
					},
					{
						label: 'Check Environment',
						run: () => {
							this.commandService.executeCommand('mobileforge.checkEnvironment');
						}
					},
					{
						label: 'Learn More',
						run: () => {
							this.notificationService.info('MobileForge IDE v0.1.0\n\n✅ Flutter-First Development\n✅ AI-Powered Assistance\n✅ Figma to Flutter\n✅ One-Click Deployment\n\nPress Cmd+Shift+P to see all MobileForge commands!');
						}
					}
				]
			);
		}
	}

	private async applyInitialDefaults(): Promise<void> {
		const defaultsApplied = this.storageService.getBoolean(
			MobileForgeWorkbenchContribution.DEFAULTS_APPLIED_KEY,
			StorageScope.APPLICATION,
			false
		);

		if (defaultsApplied) {
			return;
		}

		await this.setIfNotCustomized('workbench.startupEditor', 'none');
		await this.setIfNotCustomized('workbench.colorTheme', 'MobileForge Dark');
		await this.setIfNotCustomized('editor.formatOnSave', true);
		await this.setIfNotCustomized('editor.minimap.enabled', true);

		this.storageService.store(
			MobileForgeWorkbenchContribution.DEFAULTS_APPLIED_KEY,
			true,
			StorageScope.APPLICATION,
			StorageTarget.USER
		);
	}

	private async setIfNotCustomized<T>(key: string, value: T): Promise<void> {
		const inspection = this.configurationService.inspect<T>(key);
		const hasUserValue = inspection.userValue !== undefined
			|| inspection.userLocalValue !== undefined
			|| inspection.userRemoteValue !== undefined;
		const hasWorkspaceValue = inspection.workspaceValue !== undefined;
		const hasWorkspaceFolderValue = inspection.workspaceFolderValue !== undefined;

		if (hasUserValue || hasWorkspaceValue || hasWorkspaceFolderValue) {
			return;
		}

		try {
			await this.configurationService.updateValue(key, value);
		} catch {
			// noop
		}
	}

	private showWelcomeOnEmptyWorkbench(): void {
		if (this.workspaceService.getWorkbenchState() === WorkbenchState.EMPTY) {
			// Show a simplified message for empty workbench
			this.notificationService.info('💡 Tip: Open a Flutter project to get started with MobileForge IDE!');
		}
	}

	private initializeFlutterEnvironment(): void {
		// TODO: Check Flutter SDK status
		// TODO: Verify Dart SDK
		// TODO: Detect Android SDK
		// TODO: Check iOS toolchain (macOS only)

		console.log('[MobileForge] Initializing Flutter environment...');
	}
}

/**
 * Show MobileForge Welcome Command
 */
class ShowMobileForgeWelcomeAction extends Action2 {
	constructor() {
		super({
			id: 'mobileforge.showWelcome',
			title: { value: 'Show Welcome', original: 'Show Welcome' },
			category: { value: 'MobileForge', original: 'MobileForge' },
			f1: true
		});
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		const notificationService = accessor.get(INotificationService);
		const commandService = accessor.get(ICommandService);

		// Show welcome notification with actions
		notificationService.prompt(
			Severity.Info,
			'Welcome to MobileForge IDE - Your Flutter-First Development Environment! 🚀',
			[
				{
					label: 'Open Flutter Project',
					run: () => {
						commandService.executeCommand('workbench.action.files.openFolder');
					}
				},
				{
					label: 'Check Environment',
					run: () => {
						commandService.executeCommand('mobileforge.checkEnvironment');
					}
				},
				{
					label: 'Learn More',
					run: () => {
						notificationService.info('MobileForge IDE v0.1.0\n\n✅ Flutter-First Development\n✅ AI-Powered Assistance\n✅ Figma to Flutter\n✅ One-Click Deployment\n\nPress Cmd+Shift+P to see all MobileForge commands!');
					}
				}
			]
		);
	}
}

/**
 * Check Environment Health Command
 */
class CheckEnvironmentHealthAction extends Action2 {
	constructor() {
		super({
			id: 'mobileforge.checkEnvironment',
			title: { value: 'Check Environment Health', original: 'Check Environment Health' },
			category: { value: 'MobileForge', original: 'MobileForge' },
			f1: true
		});
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		const notificationService = accessor.get(INotificationService);

		// Create and run the diagnostics service
		const diagnosticsService = new MobileForgeFlutterDiagnosticsService(notificationService);
		await diagnosticsService.showDiagnostics();
	}
}

/**
 * Reset Onboarding Command (for testing)
 */
class ResetOnboardingAction extends Action2 {
	constructor() {
		super({
			id: 'mobileforge.resetOnboarding',
			title: { value: 'Reset Onboarding', original: 'Reset Onboarding' },
			category: { value: 'MobileForge', original: 'MobileForge' },
			f1: true
		});
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		const storageService = accessor.get(IStorageService);
		const notificationService = accessor.get(INotificationService);

		// Clear the onboarding completed flag
		storageService.remove('mobileforge.fullScreenOnboardingCompleted', StorageScope.APPLICATION);

		notificationService.info('Onboarding reset! Reload the window to see it again.');
	}
}

/**
 * Show Onboarding Now Command (for testing)
 */
class ShowOnboardingNowAction extends Action2 {
	constructor() {
		super({
			id: 'mobileforge.showOnboardingNow',
			title: { value: 'Show Onboarding Now (Test)', original: 'Show Onboarding Now (Test)' },
			category: { value: 'MobileForge', original: 'MobileForge' },
			f1: true
		});
	}

	async run(): Promise<void> {
		console.log('[MobileForge] Manually triggering onboarding...');

		// Create the overlay directly using DOM methods (no innerHTML or cssText)
		const overlayElement = document.createElement('div');
		overlayElement.id = 'mobileforge-onboarding-test';

		// Set styles directly as properties (CSP-safe)
		overlayElement.style.position = 'fixed';
		overlayElement.style.top = '0';
		overlayElement.style.left = '0';
		overlayElement.style.width = '100vw';
		overlayElement.style.height = '100vh';
		overlayElement.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
		overlayElement.style.zIndex = '999999';
		overlayElement.style.display = 'flex';
		overlayElement.style.alignItems = 'center';
		overlayElement.style.justifyContent = 'center';
		overlayElement.style.color = 'white';
		overlayElement.style.fontSize = '48px';
		overlayElement.style.fontWeight = 'bold';

		// Create text content without innerHTML
		const textDiv = document.createElement('div');
		textDiv.textContent = '🚀 MobileForge Onboarding Test!';
		overlayElement.appendChild(textDiv);

		document.body.appendChild(overlayElement);

		console.log('[MobileForge] Test overlay added to body');

		// Remove after 5 seconds
		setTimeout(() => {
			overlayElement.remove();
			console.log('[MobileForge] Test overlay removed');
		}, 5000);
	}
}

/**
 * Import Settings Command
 */
class ImportSettingsAction extends Action2 {
	constructor() {
		super({
			id: 'mobileforge.importSettings',
			title: { value: 'Import Settings from Another IDE', original: 'Import Settings from Another IDE' },
			category: { value: 'MobileForge', original: 'MobileForge' },
			f1: true
		});
	}

	async run(accessor: ServicesAccessor, importSource?: string): Promise<void> {
		const storageService = accessor.get(IStorageService);
		const notificationService = accessor.get(INotificationService);
		const fileService = accessor.get(IFileService);
		const configurationService = accessor.get(IConfigurationService);
		const environmentService = accessor.get(INativeEnvironmentService);
		const commandService = accessor.get(ICommandService);
		const themeService = accessor.get(IWorkbenchThemeService);

		// Create and run the settings importer
		const importer = new MobileForgeSettingsImporterService(
			storageService,
			notificationService,
			fileService,
			configurationService,
			environmentService,
			commandService,
			themeService
		);

		if (importSource) {
			// Import from specific source
			await importer.importFromIDE(importSource);
		} else {
			// Show picker dialog
			notificationService.info('Settings import feature coming soon! You can manually copy settings from your previous IDE.');
		}
	}
}

/**
 * Settings Importer Contribution
 * Handles importing settings from other IDEs after onboarding
 */
class MobileForgeSettingsImporterContribution extends Disposable implements IWorkbenchContribution {
	static readonly ID = 'workbench.contrib.mobileforgeSettingsImporter';

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

		// Initialize the settings importer service
		const importer = new MobileForgeSettingsImporterService(
			this.storageService,
			this.notificationService,
			this.fileService,
			this.configurationService,
			this.environmentService,
			this.commandService,
			this.themeService
		);
		this._register(importer);
	}
}

// Register the workbench contributions
const workbenchRegistry = Registry.as<IWorkbenchContributionsRegistry>(WorkbenchExtensions.Workbench);
workbenchRegistry.registerWorkbenchContribution(MobileForgeFullScreenOnboardingContribution, LifecyclePhase.Restored);
workbenchRegistry.registerWorkbenchContribution(MobileForgeWorkbenchContribution, LifecyclePhase.Restored);
workbenchRegistry.registerWorkbenchContribution(MobileForgeUICustomizerContribution, LifecyclePhase.Restored);
workbenchRegistry.registerWorkbenchContribution(MobileForgeSettingsImporterContribution, LifecyclePhase.Eventually);

// Register commands
registerAction2(ShowMobileForgeWelcomeAction);
registerAction2(CheckEnvironmentHealthAction);
registerAction2(ResetOnboardingAction);
registerAction2(ShowOnboardingNowAction);
registerAction2(ImportSettingsAction);
