#!/usr/bin/env bash
#
# MobileForge IDE Launcher Script
# This script properly launches MobileForge IDE in development mode
#

cd "$(dirname "$0")"

# Set Node.js 22 in PATH
export PATH="/opt/homebrew/opt/node@22/bin:$PATH"

# Set development environment variables
export VSCODE_DEV=1
export NODE_ENV=development
export VSCODE_CLI=1
export ELECTRON_ENABLE_STACK_DUMPING=1
export ELECTRON_ENABLE_LOGGING=1

# Get the product name from product.json
PRODUCT_NAME=$(node -p "require('./product.json').nameLong")

# Launch the Electron app directly (just like scripts/code.sh does)
# Use absolute path to Electron binary
ELECTRON_PATH="./.build/electron/$PRODUCT_NAME.app/Contents/MacOS/Electron"
exec "$ELECTRON_PATH" . --disable-extension=vscode.vscode-api-tests "$@"
