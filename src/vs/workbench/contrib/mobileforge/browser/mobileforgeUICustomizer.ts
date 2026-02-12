/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from '../../../../base/common/lifecycle.js';
import { IWorkbenchContribution } from '../../../common/contributions.js';

/**
 * Service that customizes specific workbench UI elements for MobileForge branding.
 *
 * IMPORTANT: This is intentionally LIMITED in scope. We only rebrand:
 * - Window title
 * - Welcome/Getting Started page titles
 * - About dialog
 *
 * We do NOT rebrand:
 * - Extension descriptions (they reference VS Code APIs/marketplace)
 * - Settings descriptions
 * - Documentation text
 * - Error messages
 *
 * This approach is similar to how Cursor handles branding - minimal and targeted.
 */
export class MobileForgeUICustomizerService extends Disposable {

	constructor() {
		super();
		this.initializeCustomizations();
	}

	private initializeCustomizations(): void {
		// Wait for DOM to be ready
		if (document.readyState === 'loading') {
			document.addEventListener('DOMContentLoaded', () => this.applyCustomizations());
		} else {
			this.applyCustomizations();
		}
	}

	private applyCustomizations(): void {
		// Inject custom CSS for MobileForge styling
		this.injectCustomCSS();

		// Update window title
		this.updateWindowTitle();

		// Set up observer for specific elements only
		this.setupTargetedObserver();
	}

	private injectCustomCSS(): void {
		const cssLink = document.createElement('link');
		cssLink.rel = 'stylesheet';
		cssLink.href = 'vs/workbench/contrib/mobileforge/browser/media/mobileforge.css';
		document.head.appendChild(cssLink);
	}

	private updateWindowTitle(): void {
		// Update the document title if it contains Code - OSS
		if (document.title.includes('Code - OSS')) {
			document.title = document.title.replace('Code - OSS', 'MobileForge IDE');
		}
	}

	private setupTargetedObserver(): void {
		// Only observe title changes, not all text content
		const titleObserver = new MutationObserver(() => {
			this.updateWindowTitle();
		});

		// Observe document title changes
		const titleElement = document.querySelector('title');
		if (titleElement) {
			titleObserver.observe(titleElement, { childList: true, characterData: true, subtree: true });
		}

		// Also observe for title element being added
		titleObserver.observe(document.head, { childList: true });

		this._register({
			dispose: () => titleObserver.disconnect()
		});
	}
}

/**
 * Workbench contribution that initializes the UI customizer
 */
export class MobileForgeUICustomizerContribution extends Disposable implements IWorkbenchContribution {
	static readonly ID = 'workbench.contrib.mobileforgeUICustomizer';

	constructor() {
		super();

		// Initialize the customizer service
		const customizer = new MobileForgeUICustomizerService();
		this._register(customizer);
	}
}
