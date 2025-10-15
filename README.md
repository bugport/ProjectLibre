# ProjectLibre Desktop

ProjectLibre is an open source desktop project management application, similar to Microsoft Project. It supports Gantt charts, resource allocation, critical path, baselines, and reporting.

- Language: Java (OpenJDK 21)
- UI: Swing
- Build: Apache Ant
- License: CPAL 1.0 (see `projectlibre_build/license/license.txt`)

## Contents
- `projectlibre_core`: core scheduling engine and domain model
- `projectlibre_ui`: Swing UI and entry point `com.projectlibre1.main.Main`
- `projectlibre_exchange`: import/export and integrations (MPXJ-based)
- `projectlibre_contrib`: bundled third-party libraries
- `projectlibre_reports`: JasperReports integration
- `projectlibre_build`: top-level build and packaging resources

## Quick start

### Prerequisites
- Java 21 (OpenJDK recommended)
- Apache Ant 1.10+

### Build
From `projectlibre_build`:
```bash
ant dist
```
Artifacts:
- App jar: `projectlibre_build/dist/projectlibre.jar`

### Run
```bash
# From projectlibre_build
java -jar dist/projectlibre.jar
```
Optional fat jar:
```bash
ant fatjar
java -jar packages/projectlibre-<version>.jar
```

### Packages (optional)
From `projectlibre_build`:
```bash
ant tar zip            # archives under packages/
ant deb rpm            # Linux packages (requires tools)
ant wix                # WiX resources for Windows MSI
ant jpackage-dmg       # macOS inputs
ant jpackage-deb       # Linux inputs
ant jpackage-msi       # Windows inputs
```

## Documentation
- Overview: `docs/overview.md`
- Getting started: `docs/getting-started.md`
- Configuration: `docs/configuration.md`
- Architecture: `docs/architecture.md`
- Build and packaging: `docs/build-and-packaging.md`
- API surface: `docs/api.md`
- Testing: `docs/testing.md`
- Troubleshooting: `docs/troubleshooting.md`
- Contributing: `docs/contributing.md`

## License
This project is distributed under the Common Public Attribution License (CPAL) 1.0.
See `projectlibre_build/license/license.txt` and third-party licenses in `projectlibre_build/license/third-party/`.
