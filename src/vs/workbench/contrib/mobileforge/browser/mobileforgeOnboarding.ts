/*---------------------------------------------------------------------------------------------
 *  MobileForge IDE - Flutter-First Development Environment
 *  Licensed under the MIT License.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from '../../../../base/common/lifecycle.js';
import { IWorkbenchContribution } from '../../../common/contributions.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { IDialogService } from '../../../../platform/dialogs/common/dialogs.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';

/**
 * MobileForge Onboarding Flow
 *
 * Shows a multi-step splash screen/wizard on first launch
 * before the user enters the IDE.
 */
export class MobileForgeOnboardingContribution extends Disposable implements IWorkbenchContribution {

	static readonly ID = 'workbench.contrib.mobileforgeOnboarding';
	private static readonly ONBOARDING_COMPLETED_KEY = 'mobileforge.onboardingCompleted';

	constructor(
		@IStorageService private readonly storageService: IStorageService,
		@IDialogService private readonly dialogService: IDialogService,
		@ICommandService private readonly commandService: ICommandService
	) {
		super();

		// Check if onboarding has been completed
		const hasCompletedOnboarding = this.storageService.getBoolean(
			MobileForgeOnboardingContribution.ONBOARDING_COMPLETED_KEY,
			StorageScope.APPLICATION,
			false
		);

		if (!hasCompletedOnboarding) {
			// Show onboarding flow
			this.showOnboardingFlow().catch(() => { /* noop */ });
		}
	}

	private async showOnboardingFlow(): Promise<void> {
		// Step 1: Welcome Screen
		const welcomeResult = await this.dialogService.prompt({
			type: 'info',
			message: '🚀 Welcome to MobileForge IDE',
			detail: 'Your Flutter-First Development Environment\n\n' +
				'MobileForge IDE is built from the ground up for Flutter developers.\n' +
				'Let\'s get you set up in just a few steps!',
			buttons: [
				{
					label: 'Get Started',
					run: () => true
				},
				{
					label: 'Skip Setup',
					run: () => false
				}
			]
		});

		if (!welcomeResult.result) {
			// User skipped onboarding
			this.markOnboardingComplete();
			return;
		}

		// Step 2: Environment Check
		await this.dialogService.prompt({
			type: 'info',
			message: '🔍 Checking Your Environment',
			detail: 'MobileForge IDE needs the following tools:\n\n' +
				'✓ Flutter SDK\n' +
				'✓ Dart SDK\n' +
				'✓ Android SDK (for Android development)\n' +
				'✓ Xcode (for iOS development on macOS)\n\n' +
				'We\'ll help you install any missing tools.',
			buttons: [
				{
					label: 'Check Now',
					run: () => {
						this.commandService.executeCommand('mobileforge.checkEnvironment');
					}
				},
				{
					label: 'Continue',
					run: () => { }
				}
			]
		});

		// Step 3: Choose Your Path
		const pathResult = await this.dialogService.prompt({
			type: 'question',
			message: '🎯 What Would You Like to Do?',
			detail: 'Choose how you want to get started with MobileForge IDE:',
			buttons: [
				{
					label: '📂 Open Existing Project',
					run: () => 'open'
				},
				{
					label: '✨ Create New Flutter App',
					run: () => 'create'
				},
				{
					label: '📚 Explore Features',
					run: () => 'explore'
				},
				{
					label: '⏭️ Skip',
					run: () => 'skip'
				}
			]
		});

		// Handle user's choice
		switch (pathResult.result) {
			case 'open':
				await this.commandService.executeCommand('workbench.action.files.openFolder');
				break;
			case 'create':
				await this.showProjectTemplates();
				break;
			case 'explore':
				await this.commandService.executeCommand('workbench.action.openWalkthrough');
				break;
		}

		// Mark onboarding as complete
		this.markOnboardingComplete();
	}

	private async showProjectTemplates(): Promise<void> {
		const templateResult = await this.dialogService.prompt({
			type: 'question',
			message: '✨ Choose a Project Template',
			detail: 'Select a template to start your Flutter project:',
			buttons: [
				{
					label: '📱 Counter App (Beginner)',
					run: () => 'counter'
				},
				{
					label: '🛒 E-commerce App',
					run: () => 'ecommerce'
				},
				{
					label: '💬 Social Media App',
					run: () => 'social'
				},
				{
					label: '🎨 Figma to Flutter',
					run: () => 'figma'
				},
				{
					label: '📦 Blank Project',
					run: () => 'blank'
				}
			]
		});

		// TODO: Actually create the project based on template
		await this.dialogService.info(
			'Project Creation',
			`Creating ${templateResult.result} project...\n\n` +
			'This feature is coming soon! For now, you can create a project using:\n' +
			'flutter create my_app'
		);
	}

	private markOnboardingComplete(): void {
		this.storageService.store(
			MobileForgeOnboardingContribution.ONBOARDING_COMPLETED_KEY,
			true,
			StorageScope.APPLICATION,
			StorageTarget.USER
		);
	}
}
