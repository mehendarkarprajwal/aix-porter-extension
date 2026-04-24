# Build Instructions for AIX Package Porter Extension

This document provides step-by-step instructions for building and packaging the AIX Package Porter extension for Bob IDE (VS Code fork).

## Prerequisites

### Required Software
- **Node.js**: Version 16.x or higher
- **npm**: Version 8.x or higher
- **Bob IDE**: Installed (VS Code fork, for testing)

### Install Build Tools

```bash
# Install vsce (VS Code Extension Manager)
npm install -g @vscode/vsce

# Verify installation
vsce --version
```

## Project Structure Verification

Before building, verify the project structure:

```bash
cd aix-porter-extension

# Check all required files exist
ls -la

# Expected files:
# - extension.js
# - package.json
# - README.md
# - CHANGELOG.md
# - INSTALLATION_GUIDE.md
# - EXTENSION_SUMMARY.md
# - .vscodeignore
# - .gitignore
# - skills/aix-package-porter/ (directory with all skill files)
```

## Build Steps

### Step 1: Verify Package.json

Ensure [`package.json`](package.json:1) has correct metadata:

```bash
# Check package.json
cat package.json | grep -E "name|version|displayName"
```

Expected output:
```json
"name": "aix-package-porter",
"version": "0.0.1",
"displayName": "AIX Package Porter",
```

### Step 2: Validate Extension Structure

```bash
# Check extension.js syntax
node -c extension.js

# Should output nothing if syntax is valid
```

### Step 3: Install Dependencies (if any)

```bash
# Currently no dependencies, but run for safety
npm install

# This creates package-lock.json
```

### Step 4: Package the Extension

```bash
# Create VSIX package
vsce package

# Output: aix-package-porter-0.0.1.vsix
```

Expected output:
```
Executing prepublish script 'npm run vscode:prepublish'...
...
DONE  Packaged: /path/to/aix-porter-extension/aix-package-porter-0.0.1.vsix (X files, XXX KB)
```

### Step 5: Verify Package Contents

```bash
# List contents of VSIX (it's a ZIP file)
unzip -l aix-package-porter-0.0.1.vsix

# Should include:
# - extension/extension.js
# - extension/package.json
# - extension/README.md
# - extension/CHANGELOG.md
# - extension/skills/aix-package-porter/* (all skill files)
```

## Testing

### Test 1: Install Locally

```bash
# Install the extension in Bob IDE
code --install-extension aix-package-porter-0.0.1.vsix

# Verify installation
code --list-extensions | grep aix-package-porter
```

### Test 2: Test in Bob IDE

1. **Open Bob IDE**
   ```bash
   code .
   ```

2. **Open Command Palette**
   - Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (macOS)

3. **Test Commands**
   - Type "AIX Porter"
   - Verify all 4 commands appear:
     - AIX Porter: Install Skill
     - AIX Porter: Reinstall Skill
     - AIX Porter: Uninstall Skill
     - AIX Porter: Show Skill Information

4. **Test Installation**
   - Run "AIX Porter: Install Skill"
   - Check output: View → Output → "AIX Package Porter"
   - Verify skill installed: `ls ~/.bob/skills/aix-package-porter/`

5. **Test Info Command**
   - Run "AIX Porter: Show Skill Information"
   - Verify webview displays correctly

### Test 3: Verify Skill Files

```bash
# Check skill installation
ls -la ~/.bob/skills/aix-package-porter/

# Verify all files present
ls ~/.bob/skills/aix-package-porter/SKILL.md
ls ~/.bob/skills/aix-package-porter/AIX_CRITICAL_MISTAKES.md
ls ~/.bob/skills/aix-package-porter/REFERENCE.md
ls ~/.bob/skills/aix-package-porter/scripts/*.sh

# Check script permissions (Unix/macOS)
ls -l ~/.bob/skills/aix-package-porter/scripts/*.sh
# Should show: -rwxr-xr-x (executable)
```

### Test 4: Test Reinstall

```bash
# Run reinstall command
# Command Palette → "AIX Porter: Reinstall Skill"

# Verify old files removed and new files installed
ls -la ~/.bob/skills/aix-package-porter/
```

### Test 5: Test Uninstall

```bash
# Run uninstall command
# Command Palette → "AIX Porter: Uninstall Skill"
# Confirm when prompted

# Verify skill removed
ls ~/.bob/skills/aix-package-porter/
# Should show: No such file or directory
```

## Development Testing

### Run in Development Mode

1. **Open Extension in VS Code**
   ```bash
   cd aix-porter-extension
   code .
   ```

2. **Start Debugging**
   - Press `F5`
   - This opens a new "Extension Development Host" window

3. **Test in Development Window**
   - Use Command Palette to test commands
   - Check output channel for logs
   - Verify skill installation

4. **Make Changes**
   - Edit [`extension.js`](extension.js:1)
   - Press `Ctrl+Shift+F5` to reload extension
   - Test changes immediately

## Troubleshooting Build Issues

### Issue: vsce not found

```bash
# Install vsce globally
npm install -g @vscode/vsce

# Or use npx
npx vsce package
```

### Issue: Package too large

```bash
# Check .vscodeignore is excluding unnecessary files
cat .vscodeignore

# Verify node_modules excluded
ls -la | grep node_modules
# Should not be in package
```

### Issue: Missing files in package

```bash
# Check .vscodeignore isn't excluding needed files
cat .vscodeignore

# Ensure skills/ directory is NOT in .vscodeignore
```

### Issue: Syntax errors

```bash
# Validate JavaScript syntax
node -c extension.js

# Check JSON syntax
cat package.json | jq .
```

## Publishing (Future)

### Prepare for Marketplace

1. **Create Publisher Account**
   - Visit: https://marketplace.visualstudio.com/manage
   - Create publisher ID

2. **Update package.json**
   ```json
   {
     "publisher": "your-publisher-id",
     "repository": {
       "type": "git",
       "url": "https://github.com/your-org/aix-porter-extension"
     }
   }
   ```

3. **Create Personal Access Token**
   - Azure DevOps: https://dev.azure.com
   - Create PAT with Marketplace (publish) scope

4. **Login to vsce**
   ```bash
   vsce login your-publisher-id
   # Enter PAT when prompted
   ```

5. **Publish**
   ```bash
   vsce publish
   ```

## Version Management

### Update Version

1. **Edit package.json**
   ```json
   {
     "version": "1.1.0"
   }
   ```

2. **Update CHANGELOG.md**
   ```markdown
   ## [1.1.0] - 2026-XX-XX
   ### Added
   - New feature description
   ```

3. **Rebuild**
   ```bash
   vsce package
   ```

### Semantic Versioning

- **Major** (1.0.0 → 2.0.0): Breaking changes
- **Minor** (1.0.0 → 1.1.0): New features, backward compatible
- **Patch** (1.0.0 → 1.0.1): Bug fixes, backward compatible

## Distribution

### Direct Distribution

1. **Share VSIX file**
   - Upload to file sharing service
   - Attach to email
   - Host on website

2. **Installation Instructions**
   - Provide INSTALLATION_GUIDE.md
   - Include command: `code --install-extension aix-package-porter-1.0.0.vsix`

### GitHub Releases

1. **Create Release**
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

2. **Upload VSIX**
   - Go to GitHub Releases
   - Create new release
   - Attach `.vsix` file

## Quality Checklist

Before distributing, verify:

- [ ] Extension installs without errors
- [ ] All commands work correctly
- [ ] Skill files copy successfully
- [ ] Scripts are executable (Unix/macOS)
- [ ] Output channel shows proper logs
- [ ] Info webview displays correctly
- [ ] Reinstall removes old files
- [ ] Uninstall removes skill directory
- [ ] README.md is clear and complete
- [ ] CHANGELOG.md is up to date
- [ ] Version number is correct
- [ ] No console errors in VS Code
- [ ] Works on macOS
- [ ] Works on Linux
- [ ] Works on Windows

## File Size Optimization

Current package size: ~80KB (compressed)

To reduce size if needed:

1. **Remove unnecessary files**
   - Add to .vscodeignore
   - Remove backup files
   - Remove development files

2. **Compress documentation**
   - Remove redundant content
   - Optimize markdown formatting

3. **Optimize scripts**
   - Remove comments if needed
   - Minimize whitespace

## Maintenance

### Regular Updates

1. **Update skill content**
   - Edit files in `skills/aix-package-porter/`
   - Increment version
   - Rebuild package

2. **Update extension logic**
   - Edit [`extension.js`](extension.js:1)
   - Test thoroughly
   - Increment version
   - Rebuild package

3. **Update documentation**
   - Update README.md
   - Update CHANGELOG.md
   - Update INSTALLATION_GUIDE.md

## Support

For build issues:

1. Check Node.js version: `node --version`
2. Check npm version: `npm --version`
3. Check vsce version: `vsce --version`
4. Review error messages carefully
5. Consult VS Code extension documentation

## Resources

- **VS Code Extension API**: https://code.visualstudio.com/api
- **vsce Documentation**: https://github.com/microsoft/vscode-vsce
- **Extension Guidelines**: https://code.visualstudio.com/api/references/extension-guidelines
- **Publishing Extensions**: https://code.visualstudio.com/api/working-with-extensions/publishing-extension

---

**Last Updated**: 2026-04-24
**Extension Version**: 0.0.1
**Target IDE**: Bob IDE (VS Code fork)