# AIX Package Porter Extension - Installation Guide

Complete guide for installing and using the AIX Package Porter VS Code extension.

## Prerequisites

### Required
- **VS Code**: Version 1.85.0 or higher
- **Bob IDE**: Must be installed and configured
- **Operating System**: macOS, Linux, or Windows

### Optional (for building from source)
- **Node.js**: Version 16.x or higher
- **npm**: Version 8.x or higher
- **vsce**: VS Code Extension Manager (`npm install -g @vscode/vsce`)

## Installation Methods

### Method 1: Install from VSIX (Recommended)

1. **Download the VSIX file**
   - Get `aix-package-porter-1.0.0.vsix` from the release

2. **Install via VS Code UI**
   - Open VS Code
   - Press `Ctrl+Shift+X` (Windows/Linux) or `Cmd+Shift+X` (macOS)
   - Click the "..." menu at the top of Extensions view
   - Select "Install from VSIX..."
   - Navigate to and select the `.vsix` file
   - Click "Install"

3. **Install via Command Line**
   ```bash
   code --install-extension aix-package-porter-1.0.0.vsix
   ```

4. **Verify Installation**
   - Open Command Palette: `Ctrl+Shift+P` / `Cmd+Shift+P`
   - Type "AIX Porter"
   - You should see the extension commands listed

### Method 2: Build and Install from Source

1. **Clone or Download Source**
   ```bash
   cd /path/to/aix-porter-extension
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Package the Extension**
   ```bash
   # Install vsce if not already installed
   npm install -g @vscode/vsce
   
   # Package the extension
   vsce package
   ```
   
   This creates `aix-package-porter-1.0.0.vsix`

4. **Install the Package**
   ```bash
   code --install-extension aix-package-porter-1.0.0.vsix
   ```

### Method 3: Development Mode

For testing and development:

1. **Open Extension in VS Code**
   ```bash
   cd aix-porter-extension
   code .
   ```

2. **Run Extension**
   - Press `F5` to open Extension Development Host
   - Test commands in the new VS Code window

## Post-Installation

### Automatic Skill Installation

By default, the skill is automatically installed when the extension activates:

1. **Check Installation**
   ```bash
   ls ~/.bob/skills/aix-package-porter/
   ```

2. **Verify Files**
   ```bash
   ls ~/.bob/skills/aix-package-porter/
   # Should show:
   # SKILL.md
   # AIX_CRITICAL_MISTAKES.md
   # REFERENCE.md
   # FORMS.md
   # README.md
   # INSTALLATION.md
   # ACTIVATION_GUIDE.md
   # scripts/
   # templates/
   ```

3. **Check Script Permissions** (Unix/macOS)
   ```bash
   ls -l ~/.bob/skills/aix-package-porter/scripts/
   # Scripts should be executable (rwxr-xr-x)
   ```

### Manual Skill Installation

If automatic installation fails or is disabled:

1. **Open Command Palette**
   - Press `Ctrl+Shift+P` / `Cmd+Shift+P`

2. **Run Install Command**
   - Type: "AIX Porter: Install Skill"
   - Press Enter

3. **Check Output**
   - View → Output
   - Select "AIX Package Porter" from dropdown
   - Review installation logs

## Configuration

### Settings

Configure the extension in VS Code settings:

1. **Open Settings**
   - File → Preferences → Settings (Windows/Linux)
   - Code → Preferences → Settings (macOS)
   - Or press `Ctrl+,` / `Cmd+,`

2. **Search for "AIX Porter"**

3. **Available Settings**

   **Auto Install** (`aixPorter.autoInstall`)
   - Type: boolean
   - Default: `true`
   - Description: Automatically install skill on extension activation
   
   ```json
   {
     "aixPorter.autoInstall": true
   }
   ```

   **Skill Path** (`aixPorter.skillPath`)
   - Type: string
   - Default: `""` (uses `~/.bob/skills/`)
   - Description: Custom installation path for the skill
   
   ```json
   {
     "aixPorter.skillPath": "/custom/path/to/skills"
   }
   ```

### Example Configuration

Add to your `settings.json`:

```json
{
  "aixPorter.autoInstall": true,
  "aixPorter.skillPath": ""
}
```

## Using the Extension

### Available Commands

Access via Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`):

1. **AIX Porter: Install Skill**
   - Installs the skill if not already installed
   - Safe to run multiple times (checks for existing installation)

2. **AIX Porter: Reinstall Skill**
   - Removes existing skill and reinstalls
   - Useful for updating to new version
   - Preserves no data (clean install)

3. **AIX Porter: Uninstall Skill**
   - Removes the skill from Bob IDE
   - Prompts for confirmation
   - Can be reinstalled later

4. **AIX Porter: Show Skill Information**
   - Displays skill details in webview
   - Shows installation status
   - Lists features and usage instructions

### Using the Skill in Bob IDE

Once installed, activate in Bob IDE by mentioning:

```
"Port curl to AIX 7.3"
"Build Python on Power Systems"
"Help me compile nginx on AIX with GCC"
"AIX porting assistance for OpenSSL"
```

The skill automatically activates when:
- You mention AIX, Power Systems, or ppc64
- You're SSH'd into an AIX machine
- You run AIX commands (uname, oslevel, lslpp)
- You encounter AIX compilation errors

## Troubleshooting

### Extension Not Loading

**Problem**: Extension doesn't appear in VS Code

**Solutions**:
1. Verify installation:
   ```bash
   code --list-extensions | grep aix-package-porter
   ```

2. Reload VS Code:
   - Command Palette → "Developer: Reload Window"

3. Check VS Code version:
   ```bash
   code --version
   # Should be 1.85.0 or higher
   ```

### Skill Not Installing

**Problem**: Skill doesn't install to `~/.bob/skills/`

**Solutions**:
1. Check output logs:
   - View → Output → "AIX Package Porter"

2. Verify Bob directory exists:
   ```bash
   mkdir -p ~/.bob/skills
   ```

3. Check permissions:
   ```bash
   ls -ld ~/.bob/skills
   # Should be writable by your user
   ```

4. Try manual installation:
   - Command Palette → "AIX Porter: Install Skill"

5. Check custom path (if configured):
   ```bash
   # If you set aixPorter.skillPath
   ls -la /your/custom/path/
   ```

### Scripts Not Executable (Unix/macOS)

**Problem**: Shell scripts don't run

**Solutions**:
1. Make scripts executable:
   ```bash
   chmod +x ~/.bob/skills/aix-package-porter/scripts/*.sh
   ```

2. Reinstall skill:
   - Command Palette → "AIX Porter: Reinstall Skill"

### Skill Not Activating in Bob IDE

**Problem**: Skill doesn't activate when mentioned

**Solutions**:
1. Restart Bob IDE after installation

2. Verify SKILL.md exists:
   ```bash
   cat ~/.bob/skills/aix-package-porter/SKILL.md | head -20
   # Should show YAML frontmatter
   ```

3. Try explicit activation:
   - In Bob IDE: "Use the aix-package-porter skill"

4. Check skill files:
   ```bash
   ls -la ~/.bob/skills/aix-package-porter/
   ```

### Permission Denied Errors

**Problem**: Cannot write to skill directory

**Solutions**:
1. Check directory ownership:
   ```bash
   ls -ld ~/.bob/skills
   ```

2. Fix permissions:
   ```bash
   sudo chown -R $USER:$USER ~/.bob/skills
   chmod -R u+w ~/.bob/skills
   ```

3. Use custom path with proper permissions:
   ```json
   {
     "aixPorter.skillPath": "/path/with/write/access"
   }
   ```

## Updating the Extension

### Update from New VSIX

1. **Uninstall old version**:
   ```bash
   code --uninstall-extension aix-package-porter
   ```

2. **Install new version**:
   ```bash
   code --install-extension aix-package-porter-1.1.0.vsix
   ```

### Update Skill Only

If only the skill content changed:

1. **Reinstall skill**:
   - Command Palette → "AIX Porter: Reinstall Skill"

2. **Or manually copy**:
   ```bash
   rm -rf ~/.bob/skills/aix-package-porter
   cp -r /path/to/new/skill ~/.bob/skills/aix-package-porter
   ```

## Uninstallation

### Complete Removal

1. **Uninstall skill**:
   - Command Palette → "AIX Porter: Uninstall Skill"

2. **Uninstall extension**:
   ```bash
   code --uninstall-extension aix-package-porter
   ```

3. **Remove skill directory** (if needed):
   ```bash
   rm -rf ~/.bob/skills/aix-package-porter
   ```

### Keep Skill, Remove Extension

To keep the skill but remove the extension:

```bash
code --uninstall-extension aix-package-porter
# Skill remains in ~/.bob/skills/aix-package-porter
```

## Verification Checklist

After installation, verify:

- [ ] Extension appears in Extensions view
- [ ] Commands available in Command Palette
- [ ] Skill directory exists: `~/.bob/skills/aix-package-porter/`
- [ ] SKILL.md file present and readable
- [ ] Scripts are executable (Unix/macOS)
- [ ] Bob IDE recognizes the skill
- [ ] Skill activates on AIX-related prompts

## Support

For issues:

1. Check extension output: View → Output → "AIX Package Porter"
2. Review skill documentation: `~/.bob/skills/aix-package-porter/README.md`
3. Consult troubleshooting section above
4. Check AIX_CRITICAL_MISTAKES.md for common pitfalls

## Next Steps

After successful installation:

1. Read the skill documentation:
   - `~/.bob/skills/aix-package-porter/README.md`
   - `~/.bob/skills/aix-package-porter/ACTIVATION_GUIDE.md`

2. Review critical rules:
   - `~/.bob/skills/aix-package-porter/AIX_CRITICAL_MISTAKES.md`

3. Try the skill in Bob IDE:
   - "Port a simple package to AIX"
   - "Show me AIX porting workflow"

4. Explore helper scripts:
   - `~/.bob/skills/aix-package-porter/scripts/`

---

**Version**: 1.0.0  
**Last Updated**: 2026-04-24