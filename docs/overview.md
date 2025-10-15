# ProjectLibre Desktop - Overview

ProjectLibre is a desktop project management application, similar to Microsoft Project. It provides Gantt charts, resource management, critical path, baselines, and reporting. This repository contains the Java/Swing desktop application and build/packaging resources.

- Language: Java (OpenJDK 21 targeted in Ant tasks)
- UI: Swing
- Build system: Apache Ant (multiple modules)
- Modules:
  - projectlibre_core: core scheduling, algorithms, data structures
  - projectlibre_ui: Swing GUI, entry points
  - projectlibre_exchange: import/export (MPXJ-based) and integration helpers
  - projectlibre_contrib: bundled and repackaged third-party libraries
  - projectlibre_reports: JasperReports integration for reporting
  - projectlibre_build: top-level build, packaging, installers

Main class: `com.projectlibre1.main.Main` (in `projectlibre_ui`).

Typical outputs:
- `projectlibre_build/dist/projectlibre.jar` (app jar)
- Platform packages created under `projectlibre_build/packages/` (tar.gz, zip, .deb, .rpm, MSI resources)
