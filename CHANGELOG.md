# Change Log

All notable changes to the AIX Package Porter extension will be documented in this file.

## [0.0.1] - 2026-04-24

### Added
- Initial release of AIX Package Porter extension
- Automatic skill installation on extension activation
- Command: Install Skill
- Command: Reinstall Skill
- Command: Uninstall Skill
- Command: Show Skill Information
- Configuration option: autoInstall (default: true)
- Configuration option: skillPath (custom installation path)
- Output channel for logging and debugging
- Cross-platform support (macOS, Linux, Windows)
- Automatic script permissions on Unix systems

### Skill Contents
- SKILL.md - Core porting workflow with 7 phases
- AIX_CRITICAL_MISTAKES.md - 19 critical rules
- REFERENCE.md - Technical reference documentation
- FORMS.md - Porting checklist templates
- Helper scripts for dependency resolution and compiler setup
- Compiler configuration templates (GCC, XLC, Clang)
- Comprehensive documentation and activation guide

### Features
- Supports IBM AIX 7.1, 7.2, 7.3
- ppc64 Big Endian architecture
- Multi-compiler support (GCC, XLC, Clang)
- Automated dependency resolution workflow
- Patch preservation system
- Build system compatibility fixes
- 64-bit mode enforcement

## [Unreleased]

### Planned
- Skill update notifications
- Version checking and auto-update
- Skill usage statistics
- Integration with AIX development containers
- Additional helper scripts for common tasks
- Enhanced error diagnostics