# Architecture

ProjectLibre is organized into multiple Ant-built modules:

- `projectlibre_core`: Core scheduling engine, calendars, resources, WBS, serialization helpers. Produces `projectlibre-core.jar`.
- `projectlibre_ui`: Swing UI with views, dialogs, printing, and the main entry point `com.projectlibre1.main.Main`. Depends on core and contrib jars.
- `projectlibre_exchange`: Import/export adapters and integration code (e.g., MPXJ-based readers/writers), packaged into `mpop.jar` under contrib libs.
- `projectlibre_contrib`: Assembles third-party libraries and repackages them into `projectlibre-contrib.jar`, `projectlibre-script.jar`, `projectlibre-reports.jar`. Optionally shrunk with ProGuard.
- `projectlibre_reports`: Report definitions and rendering helpers (JasperReports).
- `projectlibre_build`: Aggregates builds, jars the application, and produces platform packages and installers.

## Build flow
1. `projectlibre_core: dist` → `dist/projectlibre-core.jar`
2. `projectlibre_contrib: dist` → `projectlibre-contrib.jar`, `projectlibre-script.jar`, `projectlibre-reports.jar`
3. `projectlibre_exchange: dist` → `lib/exchange/mpop.jar` inside contrib
4. `projectlibre_build: dist` → compiles sources and produces `dist/projectlibre.jar` with `Main-Class: com.projectlibre1.main.Main`
5. Optional: `fatjar`, `dir`, `tar`, `zip`, `deb`, `rpm`, `wix`, `jpackage-*`

## Entry points
- Desktop main class: `com.projectlibre1.main.Main`
- Launcher script: `projectlibre_build/resources/projectlibre.sh`

## Notable packages
- `com.projectlibre1.pm` (core scheduling, calendars, resources)
- `com.projectlibre1.pm.graphic` (Gantt and charting UI)
- `com.projectlibre1.dialog` (dialogs)
- `com.projectlibre1.exchange` and `net.sf.mpxj` (import/export)

## Persistence adapter
An optional Gradle submodule `spring-database-adapter` provides database persistence for key domain objects using Spring Data JPA. See the persistence guide for mapped entities, repositories, and usage: [persistence.md](persistence.md).

## Java version
Ant build targets Java 21 (`source="21" target="21"`). Ensure JDK 21.
