# Testing

The codebase includes limited unit test scaffolding under `projectlibre_exchange/src/test`.

## Running tests
This repository uses Ant as the build tool. If JUnit tasks are later added to `build.xml`, they can be run via custom targets.

For now, typical validation is manual:
- Launch the application and verify opening sample projects under `projectlibre_build/resources/samples/`.
- Exercise common views (Gantt, Resources, Reports) and dialogs.

## Adding tests
If you introduce unit tests:
- Use JUnit 4/5 and add Ant `junit`/`junitlauncher` tasks in module `build.xml`.
- Place tests under `src/test/java` and exclude from packaging via Ant includes.
