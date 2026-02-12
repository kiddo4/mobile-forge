/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Codicon } from '../../../../base/common/codicons.js';
import { registerIcon } from '../../../../platform/theme/common/iconRegistry.js';
import { BuiltinGettingStartedCategory } from '../../welcomeGettingStarted/common/gettingStartedContent.js';

const mobileForgeIcon = registerIcon('mobileforge-flutter', Codicon.rocket, 'MobileForge Flutter icon');
const flutterDevIcon = registerIcon('mobileforge-dev', Codicon.tools, 'MobileForge development icon');

export const mobileforgeCategories: BuiltinGettingStartedCategory[] = [
	{
		id: 'mobileforge.setup',
		title: '🚀 Get Started with Flutter',
		description: 'Create your first Flutter app in minutes',
		isFeatured: true,
		icon: mobileForgeIcon,
		walkthroughPageTitle: 'Get Started with MobileForge',
		content: {
			type: 'steps',
			steps: [
				{
					id: 'mobileforge.checkEnvironment',
					title: 'Check Your Development Environment',
					description: 'Verify Flutter SDK, Dart, Android SDK, and iOS toolchain are ready',
					media: {
						type: 'markdown',
						path: 'vs/workbench/contrib/welcomeGettingStarted/common/media/empty'
					},
					completionEvents: ['onCommand:mobileforge.checkEnvironment']
				},
				{
					id: 'mobileforge.createApp',
					title: 'Create Your First Flutter App',
					description: 'Start with a template: Counter App, E-commerce, or Social Media',
					media: {
						type: 'markdown',
						path: 'vs/workbench/contrib/welcomeGettingStarted/common/media/empty'
					},
					completionEvents: ['onCommand:flutter.createProject']
				},
				{
					id: 'mobileforge.runApp',
					title: 'Run on Device or Emulator',
					description: 'Select a device and launch your app with hot reload',
					media: {
						type: 'markdown',
						path: 'vs/workbench/contrib/welcomeGettingStarted/common/media/empty'
					},
					completionEvents: ['onCommand:flutter.run']
				},
				{
					id: 'mobileforge.aiAssist',
					title: 'Try AI Code Generation',
					description: 'Use MobileForge AI to generate widgets from natural language',
					media: {
						type: 'markdown',
						path: 'vs/workbench/contrib/welcomeGettingStarted/common/media/empty'
					},
					completionEvents: ['onCommand:mobileforge.openAIChat']
				}
			]
		}
	},
	{
		id: 'mobileforge.advanced',
		title: '⚡ Advanced Features',
		description: 'Figma to Flutter, Deployment, and more',
		isFeatured: true,
		icon: flutterDevIcon,
		walkthroughPageTitle: 'Advanced MobileForge Features',
		content: {
			type: 'steps',
			steps: [
				{
					id: 'mobileforge.figma',
					title: 'Import from Figma',
					description: 'Convert Figma designs directly into Flutter widgets',
					media: {
						type: 'markdown',
						path: 'vs/workbench/contrib/welcomeGettingStarted/common/media/empty'
					},
					completionEvents: ['onCommand:mobileforge.importFromFigma']
				},
				{
					id: 'mobileforge.deploy',
					title: 'Deploy to Stores',
					description: 'One-click deployment to App Store and Play Store',
					media: {
						type: 'markdown',
						path: 'vs/workbench/contrib/welcomeGettingStarted/common/media/empty'
					},
					completionEvents: ['onCommand:mobileforge.deployWizard']
				},
				{
					id: 'mobileforge.widgets',
					title: 'Explore Widget Tree',
					description: 'Visualize and navigate your Flutter widget hierarchy',
					media: {
						type: 'markdown',
						path: 'vs/workbench/contrib/welcomeGettingStarted/common/media/empty'
					},
					completionEvents: ['onCommand:mobileforge.showWidgetTree']
				}
			]
		}
	}
];
