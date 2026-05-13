const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
const os = require('os');

/**
 * AIX Package Porter Extension
 * Installs and manages the AIX Package Porter skill for Bob IDE
 */

// Extension state
let outputChannel;
const SKILL_NAME = 'aix-package-porter';
const MODE_FILE_NAME = 'custom_modes.yaml';

/**
 * Activate the extension
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    // Create output channel for logging
    outputChannel = vscode.window.createOutputChannel('AIX Package Porter');
    outputChannel.appendLine('AIX Package Porter extension activated');

    // Get configuration
    const config = vscode.workspace.getConfiguration('aixPorter');
    const autoInstall = config.get('autoInstall', true);

    // Auto-install resources if enabled
    if (autoInstall) {
        installSkill(true);
    }

    context.subscriptions.push(
        vscode.workspace.onDidChangeConfiguration(event => {
            if (event.affectsConfiguration('remote.SSH.remotePlatform')) {
                outputChannel.appendLine('Remote SSH configuration changed, reinstalling AIX Porter resources...');
                installSkill(true);
            }
        })
    );

    // Register commands
    context.subscriptions.push(
        vscode.commands.registerCommand('aix-porter.installSkill', () => {
            installSkill(true);
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('aix-porter.reinstallSkill', () => {
            reinstallSkill();
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('aix-porter.uninstallSkill', () => {
            uninstallSkill();
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('aix-porter.showInfo', () => {
            showSkillInfo();
        })
    );

    // Dispose output channel on deactivation
    context.subscriptions.push(outputChannel);
}

/**
 * Install the AIX Package Porter skill
 * @param {boolean} showMessage - Whether to show completion message
 */
function installSkill(showMessage = true) {
    try {
        outputChannel.appendLine('Starting skill and mode installation...');

        // Get skill installation path
        const skillPath = getSkillPath();
        if (!skillPath) {
            throw new Error('Could not determine skill installation path');
        }

        // Get source path
        const sourcePath = getSourcePath();
        if (!sourcePath) {
            throw new Error('Could not find skill source files');
        }

        const skillExists = fs.existsSync(skillPath);
        const modeFilePath = getModeFilePath();
        const modeExists = fs.existsSync(modeFilePath) && fs.statSync(modeFilePath).size > 0;

        if (skillExists) {
            outputChannel.appendLine(`Skill already exists at: ${skillPath}`);
        }

        if (modeExists) {
            outputChannel.appendLine(`Mode already exists at: ${modeFilePath}`);
        }

        // Create Bob skills directory if it doesn't exist
        const bobSkillsDir = path.dirname(skillPath);
        if (!fs.existsSync(bobSkillsDir)) {
            fs.mkdirSync(bobSkillsDir, { recursive: true });
            outputChannel.appendLine(`Created directory: ${bobSkillsDir}`);
        }

        // Copy skill files if needed
        if (!skillExists) {
            copyDirectory(sourcePath, skillPath);
            outputChannel.appendLine(`Skill installed successfully to: ${skillPath}`);
        } else {
            outputChannel.appendLine(`Skill already installed at: ${skillPath}`);
        }

        installProjectMode();
        outputChannel.appendLine(`AIX Porter mode installed successfully to: ${modeFilePath}`);

        vscode.window.showInformationMessage(`AIX Package Porter skill is installed at ${skillPath}`);
        vscode.window.showInformationMessage(`AIX Porter mode is installed at ${modeFilePath}`);

        // Make scripts executable on Unix-like systems
        if (!skillExists && process.platform !== 'win32') {
            makeScriptsExecutable(skillPath);
        }

        if (showMessage) {
            vscode.window.showInformationMessage(
                'AIX Package Porter resources installed successfully!',
                'Show Details'
            ).then(selection => {
                if (selection === 'Show Details') {
                    showSkillInfo();
                }
            });
        }

    } catch (error) {
        const errorMsg = `Failed to install skill and mode: ${error.message}`;
        outputChannel.appendLine(`ERROR: ${errorMsg}`);
        outputChannel.appendLine(error.stack);
        vscode.window.showErrorMessage(errorMsg);
    }
}

/**
 * Reinstall the skill (remove and install)
 */
function reinstallSkill() {
    try {
        const skillPath = getSkillPath();
        
        if (fs.existsSync(skillPath)) {
            outputChannel.appendLine('Removing existing skill...');
            removeDirectory(skillPath);
            outputChannel.appendLine('Existing skill removed');
        }

        installSkill(true);
    } catch (error) {
        const errorMsg = `Failed to reinstall skill: ${error.message}`;
        outputChannel.appendLine(`ERROR: ${errorMsg}`);
        vscode.window.showErrorMessage(errorMsg);
    }
}

/**
 * Uninstall the skill
 */
function uninstallSkill() {
    try {
        const skillPath = getSkillPath();

        if (!fs.existsSync(skillPath)) {
            uninstallProjectMode();
            vscode.window.showInformationMessage('AIX Package Porter skill is not installed.');
            return;
        }

        vscode.window.showWarningMessage(
            'Are you sure you want to uninstall the AIX Package Porter skill?',
            'Yes', 'No'
        ).then(selection => {
            if (selection === 'Yes') {
                removeDirectory(skillPath);
                uninstallProjectMode();
                outputChannel.appendLine(`Skill uninstalled from: ${skillPath}`);
                vscode.window.showInformationMessage('AIX Package Porter skill uninstalled successfully.');
            }
        });

    } catch (error) {
        const errorMsg = `Failed to uninstall skill: ${error.message}`;
        outputChannel.appendLine(`ERROR: ${errorMsg}`);
        vscode.window.showErrorMessage(errorMsg);
    }
}

/**
 * Show skill information
 */
function showSkillInfo() {
    const skillPath = getSkillPath();
    const isInstalled = fs.existsSync(skillPath);

    const info = `
AIX Package Porter Skill

Status: ${isInstalled ? 'Installed' : 'Not Installed'}
Installation Path: ${skillPath}

Description:
Claude skill for porting open-source software to IBM AIX on Power Systems.

Features:
- Supports AIX 7.1, 7.2, 7.3 on ppc64 (Big Endian)
- GCC, XLC, and Clang compiler support
- 19 critical rules to avoid system-breaking mistakes
- Automated dependency resolution
- Patch preservation and documentation
- 7-phase porting workflow

Usage:
Activate the skill in Bob IDE by mentioning:
- "Port [package] to AIX"
- "Build [package] on AIX 7.3"
- "Help me compile on Power Systems"

Commands:
- AIX Porter: Install Skill
- AIX Porter: Reinstall Skill
- AIX Porter: Uninstall Skill
- AIX Porter: Show Skill Information
    `.trim();

    const panel = vscode.window.createWebviewPanel(
        'aixPorterInfo',
        'AIX Package Porter',
        vscode.ViewColumn.One,
        {}
    );

    panel.webview.html = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {
                    font-family: var(--vscode-font-family);
                    padding: 20px;
                    line-height: 1.6;
                }
                h1 { color: var(--vscode-foreground); }
                pre {
                    background: var(--vscode-textBlockQuote-background);
                    padding: 15px;
                    border-radius: 5px;
                    white-space: pre-wrap;
                }
                .status-installed { color: #4CAF50; font-weight: bold; }
                .status-not-installed { color: #f44336; font-weight: bold; }
            </style>
        </head>
        <body>
            <pre>${info}</pre>
        </body>
        </html>
    `;
}

/**
 * Get the skill installation path
 * @returns {string} Skill installation path
 */
function getSkillPath() {
    const config = vscode.workspace.getConfiguration('aixPorter');
    const customPath = config.get('skillPath', '');

    if (customPath) {
        return path.join(customPath, SKILL_NAME);
    }

    const homeDir = os.homedir();
    return path.join(homeDir, '.bob', 'skills', SKILL_NAME);
}

function getModeFilePath() {
    const homeDir = os.homedir();
    return path.join(homeDir, '.bob', 'settings', MODE_FILE_NAME);
}

function getModeContent() {
    return `customModes:
  - slug: aix-porter
    name: AIX-Porter
    description: AIX package porting specialist
    roleDefinition: >-
      You are Bob, an IBM AIX package porting specialist focused on porting, fixing, and maintaining open-source software on AIX systems running on Power Systems (ppc64, Big Endian). Your expertise includes AIX-specific compiler behavior, GCC and IBM Open XL toolchains, linker and loader differences, dependency resolution, shared library handling, archive formats, build system patching, autotools, CMake, Meson, Python, Perl, and shell-based build workflows. You specialize in diagnosing portability problems, adapting Linux-oriented software for AIX, identifying missing AIX flags, handling 32-bit versus 64-bit concerns, and producing practical build and packaging fixes for AIX environments.
    whenToUse: >-
      Use this mode for any work related to AIX package porting, AIX build failures, dependency issues, compiler or linker fixes, patch creation, toolbox compatibility, or adapting open-source software to IBM AIX. This mode should be preferred whenever the task involves AIX-specific development, packaging, or troubleshooting.
    groups:
      - read
      - edit
      - browser
      - command
      - mcp
      - skill
    customInstructions: >-
      MANDATORY: Always invoke and use the aix-package-porter skill for every single task in this mode, without exception. Do not answer, analyze, plan, edit, troubleshoot, or execute commands until the aix-package-porter skill has been activated and is being followed. If the skill is unavailable, treat the task as blocked rather than proceeding without it. All outputs in this mode must follow the aix-package-porter skill's guidance as the primary authority. Prioritize AIX-specific compatibility, ppc64 big-endian behavior, reproducible build steps, and minimal, reviewable patches. When evaluating fixes, prefer solutions that preserve upstream compatibility while addressing AIX constraints. Explicitly consider compiler selection, linker semantics, runtime library paths, archive/shared object conventions, and dependency availability on AIX.
`;
}

function installProjectMode() {
    const modeFilePath = getModeFilePath();
    const modeDir = path.dirname(modeFilePath);

    if (!fs.existsSync(modeDir)) {
        fs.mkdirSync(modeDir, { recursive: true });
        outputChannel.appendLine(`Created mode settings directory: ${modeDir}`);
    }

    fs.writeFileSync(modeFilePath, getModeContent(), 'utf8');
    outputChannel.appendLine(`Installed AIX Porter mode to: ${modeFilePath}`);
}

function uninstallProjectMode() {
    const modeFilePath = getModeFilePath();

    if (!fs.existsSync(modeFilePath)) {
        return;
    }

    fs.unlinkSync(modeFilePath);
    outputChannel.appendLine(`Removed AIX Porter mode file: ${modeFilePath}`);
}

/**
 * Get the source path for skill files
 * @returns {string|null} Source path or null if not found
 */
function getSourcePath() {
    const extensionPath = __dirname;
    const sourcePath = path.join(extensionPath, 'skills', SKILL_NAME);

    if (fs.existsSync(sourcePath)) {
        return sourcePath;
    }

    outputChannel.appendLine(`Source path not found: ${sourcePath}`);
    return null;
}

/**
 * Copy directory recursively
 * @param {string} src - Source directory
 * @param {string} dest - Destination directory
 */
function copyDirectory(src, dest) {
    if (!fs.existsSync(src)) {
        throw new Error(`Source directory does not exist: ${src}`);
    }

    // Create destination directory
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }

    // Read source directory
    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            copyDirectory(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

/**
 * Remove directory recursively
 * @param {string} dirPath - Directory to remove
 */
function removeDirectory(dirPath) {
    if (!fs.existsSync(dirPath)) {
        return;
    }

    const entries = fs.readdirSync(dirPath, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);

        if (entry.isDirectory()) {
            removeDirectory(fullPath);
        } else {
            fs.unlinkSync(fullPath);
        }
    }

    fs.rmdirSync(dirPath);
}

/**
 * Make shell scripts executable
 * @param {string} skillPath - Skill installation path
 */
function makeScriptsExecutable(skillPath) {
    const scriptsDir = path.join(skillPath, 'scripts');

    if (!fs.existsSync(scriptsDir)) {
        return;
    }

    try {
        const scripts = fs.readdirSync(scriptsDir);
        
        for (const script of scripts) {
            if (script.endsWith('.sh')) {
                const scriptPath = path.join(scriptsDir, script);
                fs.chmodSync(scriptPath, 0o755);
                outputChannel.appendLine(`Made executable: ${scriptPath}`);
            }
        }
    } catch (error) {
        outputChannel.appendLine(`Warning: Could not make scripts executable: ${error.message}`);
    }
}

/**
 * Deactivate the extension
 */
function deactivate() {
    if (outputChannel) {
        outputChannel.appendLine('AIX Package Porter extension deactivated');
        outputChannel.dispose();
    }
}

module.exports = {
    activate,
    deactivate
};

// Made with Bob
