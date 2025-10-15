# Getting Started

This guide describes local builds and running from source.

## Prerequisites
- Java 21 (OpenJDK recommended)
- Apache Ant (1.10+ recommended)
- Linux, macOS, or Windows

Optional for packaging:
- GNU tar (macOS: gtar via Homebrew)
- rpmbuild, dpkg-deb for Linux packages
- WiX Toolset / PowerShell for Windows MSI
- macOS codesigning tools for DMG (if distributing)

## Clone
```bash
git clone <this-repo>
cd projectlibre_build
```

## Build all modules
Run from `projectlibre_build`:
```bash
ant dist
```
This compiles all modules and produces `dist/projectlibre.jar`. With `build_contrib=true`, contrib jars are built and referenced by the app manifest.

## Package artifacts (optional)
From `projectlibre_build`:
```bash
ant fatjar           # packages fat jar under packages/
ant dir              # prepares directory layout under packages/
ant tar              # tar.gz archive under packages/
ant zip              # zip archive under packages/
ant deb              # build Debian package (requires dpkg-deb)
ant rpm              # build RPM package (requires rpmbuild)
ant wix              # prepare WiX resources (Windows)
ant jpackage-dmg     # prepare macOS jpackage inputs
ant jpackage-deb     # prepare Linux jpackage inputs
ant jpackage-msi     # prepare Windows jpackage inputs
ant all              # runs the full packaging pipeline
```

Outputs are placed under `projectlibre_build/packages/`.

## Run from build outputs
After `ant dist` or `ant fatjar`:
```bash
# Minimal run (from projectlibre_build)
java -jar dist/projectlibre.jar

# Fat jar (from projectlibre_build)
java -jar packages/projectlibre-<version>.jar
```
Alternatively, use the launcher script template at `projectlibre_build/resources/projectlibre.sh` (expects jar in same folder as the script). Adjust memory flags via `JAVA_OPTS`.

## Run in IDE
- Import all modules as Java projects
- Module dependencies:
  - `projectlibre_ui` depends on `projectlibre_core`, `projectlibre_contrib`, `projectlibre_reports`, `projectlibre_exchange`
- Main class: `com.projectlibre1.main.Main`
- Recommended VM options for UI responsiveness:
  - `-Xms256m -Xmx1g`

