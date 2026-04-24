# AIX Package Porter Extension

Bob IDE extension that installs and manages the AIX Package Porter skill.

## Overview

The AIX Package Porter is a Claude skill that specializes in porting open-source software from Linux/x86 to IBM AIX on Power Systems. This extension automatically installs the skill into Bob IDE's skill directory.

**Note**: Bob IDE is a VS Code fork, so this extension works in Bob IDE using the VS Code extension system.

## Features

- **Automatic Installation**: Installs the AIX Package Porter skill on extension activation
- **Easy Management**: Commands to install, reinstall, and uninstall the skill
- **Comprehensive Documentation**: Includes 19 critical rules, reference materials, and helper scripts
- **Multi-Compiler Support**: GCC, XLC, and Clang compiler configurations
- **Dependency Resolution**: Automated dependency checking and installation workflow

## Requirements

- **Bob IDE**: This extension requires Bob IDE to be installed (VS Code fork)
- **Operating System**: macOS, Linux, or Windows

## Installation

### From VSIX Package

1. Download the `.vsix` file
2. Open Bob IDE
3. Go to Extensions view (Ctrl+Shift+X / Cmd+Shift+X)
4. Click the "..." menu at the top
5. Select "Install from VSIX..."
6. Choose the downloaded `.vsix` file

### From Source

```bash
# Clone or download the extension
cd aix-porter-extension

# Install dependencies
npm install

# Package the extension
npm install -g @vscode/vsce
vsce package

# Install the generated .vsix file
code --install-extension aix-package-porter-0.0.1.vsix
```

## Usage

### Automatic Installation

By default, the skill is automatically installed when the extension activates. The skill will be installed to:

```
~/.bob/skills/aix-package-porter/
```

### Manual Commands

Access commands via Command Palette (Ctrl+Shift+P / Cmd+Shift+P):

- **AIX Porter: Install Skill** - Install the skill (if not already installed)
- **AIX Porter: Reinstall Skill** - Remove and reinstall the skill (useful for updates)
- **AIX Porter: Uninstall Skill** - Remove the skill from Bob IDE
- **AIX Porter: Show Skill Information** - Display skill details and usage

### Using the Skill in Bob IDE

Once installed, the skill is available in Bob IDE. Activate it by mentioning AIX-related tasks:

```
"Port curl to AIX 7.3"
"Build Python 3.11 on Power Systems"
"Help me compile nginx on AIX with GCC"
"AIX porting assistance for OpenSSL"
```

The skill automatically activates in Bob IDE when:
- You mention AIX, Power Systems, or ppc64
- You're SSH'd into an AIX machine
- You run AIX-specific commands (uname, oslevel, lslpp)
- You encounter AIX compilation errors

## Configuration

Configure the extension in Bob IDE settings:

```json
{
  "aixPorter.autoInstall": true,
  "aixPorter.skillPath": ""
}
```

### Settings

- **aixPorter.autoInstall** (boolean, default: `true`)
  - Automatically install the skill when the extension activates
  - Set to `false` to disable automatic installation

- **aixPorter.skillPath** (string, default: `""`)
  - Custom installation path for the skill
  - Leave empty to use default: `~/.bob/skills/`
  - Example: `/custom/path/to/skills`

## Skill Contents

The installed skill includes:

### Core Files
- **SKILL.md** - Main skill instructions with 7-phase porting workflow
- **AIX_CRITICAL_MISTAKES.md** - 19 critical rules to avoid system-breaking errors
- **REFERENCE.md** - Technical reference for AIX-specific issues
- **FORMS.md** - Porting checklist and documentation templates

### Helper Scripts
- **check_and_install_dependency.sh** - Automated dependency resolution
- **setup_compiler_env.sh** - Compiler environment configuration
- **preserve_patches.sh** - Patch preservation after successful builds

### Templates
- **compiler_profiles.conf** - GCC, XLC, and Clang configurations

### Documentation
- **README.md** - Skill overview and quick start
- **INSTALLATION.md** - Detailed installation instructions
- **ACTIVATION_GUIDE.md** - How to activate the skill

## Skill Capabilities

### Target Platform
- **OS**: IBM AIX 7.1, 7.2, 7.3
- **Architecture**: ppc64 (POWER8, POWER9, POWER10)
- **Endianness**: Big Endian
- **Mode**: 64-bit only (OBJECT_MODE=64)

### Compiler Support
1. **GCC** (Recommended) - GCC 10+ from AIX Toolbox
2. **XLC** (Legacy) - IBM XL C/C++ compiler
3. **Clang** (Experimental) - Clang 14+ with LLVM

### Core Workflow
1. **Discovery** - Check IBM Toolbox, analyze build system, resolve dependencies
2. **Preparation** - Set environment, clone source, configure compiler
3. **Patch Application** - Fetch and apply patches from IBM Toolbox
4. **Build System Fixes** - Convert GNU Make to POSIX, fix AIX compatibility
5. **Build** - Configure, compile, and test
6. **Verification** - Check binaries, test runtime, validate 64-bit mode
7. **Documentation** - Preserve patches and document changes

### Common Issues Handled
- getopt_long() missing (GNU extension)
- GNU Make syntax conversion to POSIX
- Big Endian byte order issues
- Shared library creation (.a archives containing .so)
- OBJECT_MODE=64 propagation
- libiconv/libintl linking
- AIX-specific system calls
- 64-bit dev_t and file handling

## Troubleshooting

### Skill Not Installing

1. Verify Bob IDE is installed
2. Check permissions on `~/.bob/skills/` directory
3. Check extension output: View → Output → "AIX Package Porter"
4. Try manual reinstall: Command Palette → "AIX Porter: Reinstall Skill"

### Skill Not Activating in Bob IDE

1. Restart Bob IDE after installation
2. Verify skill is installed: `ls ~/.bob/skills/aix-package-porter/`
3. Check SKILL.md exists and has proper YAML frontmatter
4. Try explicit activation: "Use the aix-package-porter skill"

### Custom Installation Path

If using a custom skill path:

1. Set `aixPorter.skillPath` in VS Code settings
2. Ensure Bob IDE is configured to read from that path
3. Reinstall the skill after changing the path

### Permission Issues on Unix

If scripts are not executable:

```bash
cd ~/.bob/skills/aix-package-porter/scripts
chmod +x *.sh
```

## Development

### Building from Source

```bash
# Install dependencies
npm install

# Run tests (if available)
npm test

# Package extension
vsce package
```

### Project Structure

```
aix-porter-extension/
├── extension.js           # Main extension code
├── package.json          # Extension manifest
├── README.md            # This file
├── CHANGELOG.md         # Version history
├── .vscodeignore        # Files to exclude from package
└── skills/
    └── aix-package-porter/
        ├── SKILL.md
        ├── AIX_CRITICAL_MISTAKES.md
        ├── REFERENCE.md
        ├── FORMS.md
        ├── README.md
        ├── INSTALLATION.md
        ├── ACTIVATION_GUIDE.md
        ├── scripts/
        │   ├── check_and_install_dependency.sh
        │   ├── setup_compiler_env.sh
        │   └── preserve_patches.sh
        └── templates/
            └── compiler_profiles.conf
```

## Support

For issues, questions, or contributions:

1. Check the skill documentation in `~/.bob/skills/aix-package-porter/`
2. Review AIX_CRITICAL_MISTAKES.md for common pitfalls
3. Consult REFERENCE.md for technical details
4. Check extension output for error messages

## License

This extension and the AIX Package Porter skill are provided as-is for use with Bob IDE.

## Version History

See [CHANGELOG.md](CHANGELOG.md) for version history and updates.

## Acknowledgments

- IBM AIX Toolbox for Linux Applications
- AIX Open Source community
- Bob IDE development team

---

**Note**: This extension is specifically designed for Bob IDE and requires Bob to be installed to function properly.