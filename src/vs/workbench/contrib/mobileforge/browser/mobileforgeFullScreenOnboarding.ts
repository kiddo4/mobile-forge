/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from '../../../../base/common/lifecycle.js';
import { IWorkbenchContribution } from '../../../common/contributions.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { ConfigurationTarget } from '../../../../platform/configuration/common/configuration.js';
import { IWorkbenchThemeService } from '../../../services/themes/common/workbenchThemeService.js';

/**
 * Full-screen onboarding overlay that takes over the entire window
 * on first launch with a beautiful multi-slide experience
 */
export class MobileForgeFullScreenOnboardingContribution extends Disposable implements IWorkbenchContribution {
	static readonly ID = 'workbench.contrib.mobileforgeFullScreenOnboarding';
	private static readonly ONBOARDING_COMPLETED_KEY = 'mobileforge.fullScreenOnboardingCompleted';

	private overlayElement: HTMLElement | null = null;
	private currentSlide = 0;
	private selectedTheme = 'MobileForge Dark';
	private selectedImportSource = 'fresh';

	constructor(
		@IStorageService private readonly storageService: IStorageService,
		@ICommandService private readonly commandService: ICommandService,
		@IWorkbenchThemeService private readonly themeService: IWorkbenchThemeService
	) {
		super();

		console.log('[MobileForge] Onboarding contribution initialized');

		const hasCompletedOnboarding = this.storageService.getBoolean(
			MobileForgeFullScreenOnboardingContribution.ONBOARDING_COMPLETED_KEY,
			StorageScope.APPLICATION,
			false
		);

		console.log('[MobileForge] Onboarding completed:', hasCompletedOnboarding);

		// FORCE SHOW FOR TESTING - Change to !hasCompletedOnboarding for production
		if (!hasCompletedOnboarding) {  // Always show for testing
			// Use setTimeout to ensure DOM is ready and workbench is visible
			setTimeout(() => this.showOnboarding(), 100);
		}
	}

	private showOnboarding(): void {
		console.log('[MobileForge] Showing onboarding overlay');
		console.log('[MobileForge] document.body exists:', !!document.body);

		// Ensure body exists
		if (!document.body) {
			console.error('[MobileForge] document.body not found, retrying...');
			setTimeout(() => this.showOnboarding(), 100);
			return;
		}

		// Create full-screen overlay
		this.overlayElement = this.buildOverlayDOM();
		document.body.appendChild(this.overlayElement);

		console.log('[MobileForge] Onboarding overlay appended to body');

		// Setup event listeners
		this.setupEventListeners();

		// Show first slide
		this.showSlide(0);
	}

	private buildOverlayDOM(): HTMLElement {
		// Create main overlay container
		const overlay = document.createElement('div');
		overlay.id = 'mobileforge-onboarding-overlay';
		this.applyOverlayStyles(overlay);

		// Inject CSS styles
		const styleElement = this.createStyleElement();
		overlay.appendChild(styleElement);

		// Create skip button
		const skipButton = this.createSkipButton();
		overlay.appendChild(skipButton);

		// Create all 5 slides
		const slide1 = this.createSlide1();
		const slide2 = this.createSlide2();
		const slide3 = this.createSlide3();
		const slide4 = this.createSlide4();
		const slide5 = this.createSlide5();

		overlay.appendChild(slide1);
		overlay.appendChild(slide2);
		overlay.appendChild(slide3);
		overlay.appendChild(slide4);
		overlay.appendChild(slide5);

		// Create dot navigation
		const dotsNav = this.createDotsNavigation();
		overlay.appendChild(dotsNav);

		return overlay;
	}

	private applyOverlayStyles(element: HTMLElement): void {
		element.style.position = 'fixed';
		element.style.top = '0';
		element.style.left = '0';
		element.style.width = '100vw';
		element.style.height = '100vh';
		element.style.background = 'linear-gradient(135deg, #0a0a15 0%, #16162a 50%, #1a1a2e 100%)';
		element.style.zIndex = '999999';
		element.style.display = 'flex';
		element.style.flexDirection = 'column';
		element.style.alignItems = 'center';
		element.style.justifyContent = 'center';
		element.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif';
		element.style.color = '#eaeaea';
		element.style.overflow = 'hidden';
	}

	private createStyleElement(): HTMLStyleElement {
		const style = document.createElement('style');
		style.textContent = `
			.onboarding-slide {
				display: none;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				text-align: center;
				max-width: 700px;
				padding: 40px;
				animation: slideIn 0.5s ease-out;
			}

			.onboarding-slide.active {
				display: flex;
			}

			@keyframes slideIn {
				from {
					opacity: 0;
					transform: translateY(30px);
				}
				to {
					opacity: 1;
					transform: translateY(0);
				}
			}

			@keyframes pulse {
				0%, 100% {
					transform: scale(1);
					box-shadow: 0 8px 32px rgba(102, 126, 234, 0.4);
				}
				50% {
					transform: scale(1.05);
					box-shadow: 0 12px 48px rgba(102, 126, 234, 0.6);
				}
			}

			.onboarding-logo {
				width: 120px;
				height: 120px;
				background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
				border-radius: 24px;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 48px;
				margin-bottom: 32px;
				box-shadow: 0 8px 32px rgba(102, 126, 234, 0.4);
				animation: pulse 2s ease-in-out infinite;
			}

			.onboarding-title {
				font-size: 36px;
				font-weight: 700;
				margin-bottom: 16px;
				background: linear-gradient(135deg, #667eea 0%, #60d9fa 100%);
				-webkit-background-clip: text;
				-webkit-text-fill-color: transparent;
				background-clip: text;
			}

			.onboarding-subtitle {
				font-size: 16px;
				color: #8892b0;
				margin-bottom: 48px;
				line-height: 1.6;
			}

			.onboarding-button {
				background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
				color: white;
				border: none;
				padding: 16px 48px;
				font-size: 16px;
				font-weight: 600;
				border-radius: 8px;
				cursor: pointer;
				transition: all 0.3s ease;
				box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
			}

			.onboarding-button:hover {
				transform: translateY(-2px);
				box-shadow: 0 6px 24px rgba(102, 126, 234, 0.5);
			}

			.onboarding-button-secondary {
				background: transparent;
				border: 2px solid #667eea;
				color: #667eea;
				margin-left: 16px;
			}

			.onboarding-button-secondary:hover {
				background: #667eea22;
			}

			.theme-selector {
				display: flex;
				gap: 24px;
				margin-bottom: 32px;
			}

			.theme-option {
				width: 160px;
				height: 120px;
				border: 3px solid transparent;
				border-radius: 12px;
				cursor: pointer;
				transition: all 0.3s ease;
				overflow: hidden;
				position: relative;
			}

			.theme-option:hover {
				transform: translateY(-4px);
				border-color: #667eea44;
			}

			.theme-option.selected {
				border-color: #60d9fa;
				box-shadow: 0 4px 16px rgba(96, 217, 250, 0.4);
			}

			.theme-option::after {
				content: '✓';
				position: absolute;
				top: 8px;
				right: 8px;
				background: #60d9fa;
				color: white;
				width: 24px;
				height: 24px;
				border-radius: 50%;
				display: none;
				align-items: center;
				justify-content: center;
				font-weight: bold;
			}

			.theme-option.selected::after {
				display: flex;
			}

			.theme-preview {
				width: 100%;
				height: 100%;
				padding: 12px;
				display: flex;
				flex-direction: column;
				gap: 4px;
			}

			.theme-preview-line {
				height: 4px;
				border-radius: 2px;
			}

			.theme-label {
				text-align: center;
				margin-top: 8px;
				font-size: 14px;
				font-weight: 600;
			}

			.import-options {
				display: grid;
				grid-template-columns: 1fr 1fr;
				gap: 20px;
				margin-bottom: 24px;
				max-width: 500px;
			}

			.import-option {
				background: #16162a;
				padding: 24px;
				border: 3px solid transparent;
				border-radius: 12px;
				cursor: pointer;
				transition: all 0.3s ease;
				display: flex;
				flex-direction: column;
				align-items: center;
				gap: 12px;
			}

			.import-option:hover {
				transform: translateY(-4px);
				border-color: #667eea44;
			}

			.import-option.selected {
				border-color: #60d9fa;
				box-shadow: 0 4px 16px rgba(96, 217, 250, 0.4);
				background: #1a1a2e;
			}

			.import-icon {
				font-size: 40px;
			}

			.import-name {
				font-size: 16px;
				font-weight: 600;
				color: #eaeaea;
			}

			.feature-grid {
				display: grid;
				grid-template-columns: 1fr 1fr;
				gap: 16px;
				margin-bottom: 32px;
			}

			.feature-card {
				background: #16162a;
				padding: 24px;
				border-radius: 12px;
				border: 2px solid #667eea22;
				text-align: left;
			}

			.feature-icon {
				font-size: 32px;
				margin-bottom: 12px;
			}

			.feature-title {
				font-size: 16px;
				font-weight: 600;
				margin-bottom: 8px;
			}

			.feature-description {
				font-size: 13px;
				color: #8892b0;
				line-height: 1.5;
			}

			.config-icons {
				display: flex;
				gap: 24px;
				margin-bottom: 32px;
			}

			.config-icon {
				width: 64px;
				height: 64px;
				background: #16162a;
				border-radius: 12px;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 32px;
				opacity: 0.5;
			}

			.config-icon.active {
				background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
				opacity: 1;
				box-shadow: 0 4px 16px rgba(102, 126, 234, 0.4);
			}

			.dots-navigation {
				position: absolute;
				bottom: 40px;
				display: flex;
				gap: 12px;
			}

			.dot {
				width: 8px;
				height: 8px;
				background: #667eea44;
				border-radius: 50%;
				transition: all 0.3s ease;
				cursor: pointer;
			}

			.dot.active {
				width: 32px;
				background: linear-gradient(90deg, #667eea 0%, #60d9fa 100%);
				border-radius: 4px;
			}

			.skip-button {
				position: absolute;
				top: 24px;
				right: 24px;
				background: transparent;
				border: none;
				color: #8892b0;
				font-size: 14px;
				cursor: pointer;
				padding: 8px 16px;
			}

			.skip-button:hover {
				color: #eaeaea;
			}
		`;
		return style;
	}

	private createSkipButton(): HTMLButtonElement {
		const button = document.createElement('button');
		button.className = 'skip-button';
		button.id = 'skip-onboarding';
		button.textContent = 'Skip';
		return button;
	}

	private createSlide1(): HTMLElement {
		const slide = document.createElement('div');
		slide.className = 'onboarding-slide';
		slide.setAttribute('data-slide', '0');

		// Logo
		const logo = document.createElement('div');
		logo.className = 'onboarding-logo';
		logo.textContent = '🚀';
		slide.appendChild(logo);

		// Title
		const title = document.createElement('h1');
		title.className = 'onboarding-title';
		title.textContent = 'Welcome to MobileForge IDE';
		slide.appendChild(title);

		// Subtitle
		const subtitle = document.createElement('p');
		subtitle.className = 'onboarding-subtitle';
		subtitle.textContent = 'The Flutter-first development environment built for speed.\nShip production-ready mobile apps in record time.';
		slide.appendChild(subtitle);

		// Button
		const button = document.createElement('button');
		button.className = 'onboarding-button';
		button.id = 'get-started';
		button.textContent = 'Get Started';
		slide.appendChild(button);

		return slide;
	}

	private createSlide2(): HTMLElement {
		const slide = document.createElement('div');
		slide.className = 'onboarding-slide';
		slide.setAttribute('data-slide', '1');

		// Title
		const title = document.createElement('h1');
		title.className = 'onboarding-title';
		title.textContent = 'Import Your Settings';
		slide.appendChild(title);

		// Subtitle
		const subtitle = document.createElement('p');
		subtitle.className = 'onboarding-subtitle';
		subtitle.textContent = 'Bring your themes, keybindings, and extensions from your previous IDE.';
		slide.appendChild(subtitle);

		// Import options container
		const importOptions = document.createElement('div');
		importOptions.className = 'import-options';

		// VS Code option
		const vscodeOption = this.createImportOption('VS Code', '💙', 'vscode');
		importOptions.appendChild(vscodeOption);

		// Cursor option
		const cursorOption = this.createImportOption('Cursor', '⚡', 'cursor');
		importOptions.appendChild(cursorOption);

		// Trae IDE option
		const traeOption = this.createImportOption('Trae IDE', '🎯', 'trae');
		importOptions.appendChild(traeOption);

		// Start Fresh option
		const freshOption = this.createImportOption('Start Fresh', '✨', 'fresh', true);
		importOptions.appendChild(freshOption);

		slide.appendChild(importOptions);

		// Button container
		const buttonContainer = document.createElement('div');
		buttonContainer.style.display = 'flex';
		buttonContainer.style.gap = '16px';
		buttonContainer.style.marginTop = '32px';

		const continueButton = document.createElement('button');
		continueButton.className = 'onboarding-button';
		continueButton.id = 'continue-import';
		continueButton.textContent = 'Continue';
		buttonContainer.appendChild(continueButton);

		const skipButton = document.createElement('button');
		skipButton.className = 'onboarding-button onboarding-button-secondary';
		skipButton.id = 'skip-import';
		skipButton.textContent = 'Skip';
		buttonContainer.appendChild(skipButton);

		slide.appendChild(buttonContainer);

		return slide;
	}

	private createImportOption(name: string, icon: string, value: string, selected: boolean = false): HTMLElement {
		const option = document.createElement('div');
		option.className = 'import-option' + (selected ? ' selected' : '');
		option.setAttribute('data-import', value);

		const iconDiv = document.createElement('div');
		iconDiv.className = 'import-icon';
		iconDiv.textContent = icon;
		option.appendChild(iconDiv);

		const nameDiv = document.createElement('div');
		nameDiv.className = 'import-name';
		nameDiv.textContent = name;
		option.appendChild(nameDiv);

		return option;
	}

	private createThemeOption(themeName: string, label: string, bgColor: string, selected: boolean): HTMLElement {
		const option = document.createElement('div');
		option.className = 'theme-option' + (selected ? ' selected' : '');
		option.setAttribute('data-theme', themeName);

		const preview = document.createElement('div');
		preview.className = 'theme-preview';
		preview.style.background = bgColor;

		// Add preview lines
		const line1 = document.createElement('div');
		line1.className = 'theme-preview-line';
		line1.style.background = themeName === 'Flutter Blue' ? '#027DFD' : '#667eea';
		preview.appendChild(line1);

		const line2 = document.createElement('div');
		line2.className = 'theme-preview-line';
		line2.style.width = '60%';
		line2.style.background = themeName === 'Flutter Blue' ? '#13B9FD' : '#60d9fa';
		preview.appendChild(line2);

		const line3 = document.createElement('div');
		line3.className = 'theme-preview-line';
		line3.style.width = '40%';
		line3.style.background = themeName === 'Flutter Blue' ? '#00D2B8' : '#764ba2';
		preview.appendChild(line3);

		option.appendChild(preview);

		const themeLabel = document.createElement('div');
		themeLabel.className = 'theme-label';
		themeLabel.textContent = label;
		option.appendChild(themeLabel);

		return option;
	}

	private createSlide3(): HTMLElement {
		const slide = document.createElement('div');
		slide.className = 'onboarding-slide';
		slide.setAttribute('data-slide', '2');

		// Title
		const title = document.createElement('h1');
		title.className = 'onboarding-title';
		title.textContent = 'Choose Your Theme';
		slide.appendChild(title);

		// Subtitle
		const subtitle = document.createElement('p');
		subtitle.className = 'onboarding-subtitle';
		subtitle.textContent = 'Pick a theme that matches your workflow. You can always change it later.';
		slide.appendChild(subtitle);

		// Theme selector container
		const themeSelector = document.createElement('div');
		themeSelector.className = 'theme-selector';

		// MobileForge Dark theme (default for MobileForge IDE)
		const mobileforgeTheme = this.createThemeOption('MobileForge Dark', 'MobileForge', '#0a0a15', true);
		themeSelector.appendChild(mobileforgeTheme);

		// Dark theme (VS Code default dark)
		const darkTheme = this.createThemeOption('Default Dark Modern', 'Dark', '#1e1e1e', false);
		themeSelector.appendChild(darkTheme);

		// Light theme (VS Code default light)
		const lightTheme = this.createThemeOption('Default Light Modern', 'Light', '#f8f8f8', false);
		themeSelector.appendChild(lightTheme);

		slide.appendChild(themeSelector);

		// Button
		const button = document.createElement('button');
		button.className = 'onboarding-button';
		button.id = 'continue-theme';
		button.textContent = 'Continue';
		slide.appendChild(button);

		return slide;
	}

	private createFeatureCard(icon: string, title: string, description: string): HTMLElement {
		const card = document.createElement('div');
		card.className = 'feature-card';

		const iconDiv = document.createElement('div');
		iconDiv.className = 'feature-icon';
		iconDiv.textContent = icon;
		card.appendChild(iconDiv);

		const titleDiv = document.createElement('div');
		titleDiv.className = 'feature-title';
		titleDiv.textContent = title;
		card.appendChild(titleDiv);

		const descDiv = document.createElement('div');
		descDiv.className = 'feature-description';
		descDiv.textContent = description;
		card.appendChild(descDiv);

		return card;
	}

	private createSlide4(): HTMLElement {
		const slide = document.createElement('div');
		slide.className = 'onboarding-slide';
		slide.setAttribute('data-slide', '3');

		// Title
		const title = document.createElement('h1');
		title.className = 'onboarding-title';
		title.textContent = 'Built for Flutter Development';
		slide.appendChild(title);

		// Subtitle
		const subtitle = document.createElement('p');
		subtitle.className = 'onboarding-subtitle';
		subtitle.textContent = 'Every feature designed to accelerate your mobile development workflow.';
		slide.appendChild(subtitle);

		// Feature grid
		const grid = document.createElement('div');
		grid.className = 'feature-grid';

		grid.appendChild(this.createFeatureCard('🤖', 'AI-Powered Coding', 'Intelligent code completion and widget generation'));
		grid.appendChild(this.createFeatureCard('🎨', 'Design to Code', 'Import Figma designs as Flutter widgets instantly'));
		grid.appendChild(this.createFeatureCard('⚡', 'Hot Reload++', 'See changes in real-time across multiple devices'));
		grid.appendChild(this.createFeatureCard('🚀', 'Ship Faster', 'One-click deployment to App Store & Play Store'));

		slide.appendChild(grid);

		// Button
		const button = document.createElement('button');
		button.className = 'onboarding-button';
		button.id = 'continue-features';
		button.textContent = 'Continue';
		slide.appendChild(button);

		return slide;
	}

	private createSlide5(): HTMLElement {
		const slide = document.createElement('div');
		slide.className = 'onboarding-slide';
		slide.setAttribute('data-slide', '4');

		// Config icons
		const iconsContainer = document.createElement('div');
		iconsContainer.className = 'config-icons';

		const icon1 = document.createElement('div');
		icon1.className = 'config-icon';
		icon1.textContent = '⚙️';
		iconsContainer.appendChild(icon1);

		const icon2 = document.createElement('div');
		icon2.className = 'config-icon';
		icon2.textContent = '🔗';
		iconsContainer.appendChild(icon2);

		const icon3 = document.createElement('div');
		icon3.className = 'config-icon active';
		icon3.textContent = '✅';
		iconsContainer.appendChild(icon3);

		slide.appendChild(iconsContainer);

		// Title
		const title = document.createElement('h1');
		title.className = 'onboarding-title';
		title.textContent = 'Verify Your Setup';
		slide.appendChild(title);

		// Subtitle
		const subtitle = document.createElement('p');
		subtitle.className = 'onboarding-subtitle';
		subtitle.textContent = 'Let us check your Flutter SDK, Dart tools, and platform dependencies.';
		slide.appendChild(subtitle);

		// Button container
		const buttonContainer = document.createElement('div');
		buttonContainer.style.display = 'flex';
		buttonContainer.style.gap = '16px';
		buttonContainer.style.justifyContent = 'center';

		// Check button
		const checkButton = document.createElement('button');
		checkButton.className = 'onboarding-button';
		checkButton.id = 'check-flutter';
		checkButton.textContent = 'Run Diagnostics';
		buttonContainer.appendChild(checkButton);

		// Skip button
		const skipButton = document.createElement('button');
		skipButton.className = 'onboarding-button onboarding-button-secondary';
		skipButton.id = 'skip-flutter';
		skipButton.textContent = 'Skip for Now';
		buttonContainer.appendChild(skipButton);

		slide.appendChild(buttonContainer);

		return slide;
	}

	private createDotsNavigation(): HTMLElement {
		const dotsContainer = document.createElement('div');
		dotsContainer.className = 'dots-navigation';

		for (let i = 0; i < 5; i++) {
			const dot = document.createElement('div');
			dot.className = 'dot' + (i === 0 ? ' active' : '');
			dot.setAttribute('data-slide', i.toString());
			dotsContainer.appendChild(dot);
		}

		return dotsContainer;
	}

	private setupEventListeners(): void {
		if (!this.overlayElement) { return; }

		// Get Started button
		const getStartedBtn = this.overlayElement.querySelector('#get-started');
		getStartedBtn?.addEventListener('click', () => this.nextSlide());

		// Import option selection
		const importOptions = this.overlayElement.querySelectorAll('.import-option');
		importOptions.forEach(option => {
			option.addEventListener('click', () => {
				importOptions.forEach(opt => opt.classList.remove('selected'));
				option.classList.add('selected');
				this.selectedImportSource = option.getAttribute('data-import') || 'fresh';
			});
		});

		// Import continue/skip buttons
		this.overlayElement.querySelector('#continue-import')?.addEventListener('click', () => {
			// Start import in background (don't await - it can take a while with extensions)
			this.performImport();

			// If importing from another IDE, skip theme selection (theme comes with settings)
			if (this.selectedImportSource !== 'fresh') {
				// Skip to features slide (slide 3, index 3)
				this.showSlide(3);
			} else {
				this.nextSlide();
			}
		});
		this.overlayElement.querySelector('#skip-import')?.addEventListener('click', () => this.nextSlide());

		// Theme selection
		const themeOptions = this.overlayElement.querySelectorAll('.theme-option');
		themeOptions.forEach(option => {
			option.addEventListener('click', () => {
				themeOptions.forEach(opt => opt.classList.remove('selected'));
				option.classList.add('selected');
				this.selectedTheme = option.getAttribute('data-theme') || 'Default Dark Modern';
			});
		});

		// Continue theme button
		this.overlayElement.querySelector('#continue-theme')?.addEventListener('click', () => {
			this.applyTheme();
			this.nextSlide();
		});

		// Continue features button
		this.overlayElement.querySelector('#continue-features')?.addEventListener('click', () => this.nextSlide());

		// Flutter SDK check
		this.overlayElement.querySelector('#check-flutter')?.addEventListener('click', () => {
			this.commandService.executeCommand('mobileforge.checkEnvironment');
			this.finishOnboarding();
		});
		this.overlayElement.querySelector('#skip-flutter')?.addEventListener('click', () => this.finishOnboarding());

		// Skip button (top right)
		this.overlayElement.querySelector('#skip-onboarding')?.addEventListener('click', () => this.finishOnboarding());

		// Dot navigation
		const dots = this.overlayElement.querySelectorAll('.dot');
		dots.forEach(dot => {
			dot.addEventListener('click', () => {
				const slideNum = parseInt(dot.getAttribute('data-slide') || '0');
				this.showSlide(slideNum);
			});
		});
	}

	private showSlide(slideNum: number): void {
		if (!this.overlayElement) { return; }

		const slides = this.overlayElement.querySelectorAll('.onboarding-slide');
		const dots = this.overlayElement.querySelectorAll('.dot');

		slides.forEach((slide, index) => {
			if (index === slideNum) {
				slide.classList.add('active');
			} else {
				slide.classList.remove('active');
			}
		});

		dots.forEach((dot, index) => {
			if (index === slideNum) {
				dot.classList.add('active');
			} else {
				dot.classList.remove('active');
			}
		});

		this.currentSlide = slideNum;
	}

	private nextSlide(): void {
		const nextSlideNum = Math.min(this.currentSlide + 1, 4);
		this.showSlide(nextSlideNum);
	}

	private async applyTheme(): Promise<void> {
		console.log('[MobileForge] Applying theme:', this.selectedTheme);

		// Use the theme service directly for immediate effect
		// The 'user' target ensures the theme is persisted in user settings
		await this.themeService.setColorTheme(this.selectedTheme, ConfigurationTarget.USER);

		console.log('[MobileForge] Theme applied successfully:', this.selectedTheme);
	}

	private async performImport(): Promise<void> {
		if (this.selectedImportSource === 'fresh') {
			console.log('[MobileForge] Starting fresh - no import needed');
			return;
		}

		console.log('[MobileForge] Importing settings from:', this.selectedImportSource);

		// Trigger the actual import command which will handle the file copying
		try {
			await this.commandService.executeCommand('mobileforge.importSettings', this.selectedImportSource);
			console.log('[MobileForge] Settings import triggered successfully');
		} catch (error) {
			console.error('[MobileForge] Failed to import settings:', error);
		}
	}

	private async finishOnboarding(): Promise<void> {
		// Only apply theme if user didn't import from another IDE (imported settings include theme)
		if (this.selectedImportSource === 'fresh') {
			await this.applyTheme();
		}

		// Mark onboarding as completed
		this.storageService.store(
			MobileForgeFullScreenOnboardingContribution.ONBOARDING_COMPLETED_KEY,
			true,
			StorageScope.APPLICATION,
			StorageTarget.USER
		);

		// Remove overlay with fade out animation
		if (this.overlayElement) {
			this.overlayElement.style.transition = 'opacity 0.5s ease-out';
			this.overlayElement.style.opacity = '0';
			setTimeout(() => {
				this.overlayElement?.remove();
				this.overlayElement = null;
			}, 500);
		}
	}
}
