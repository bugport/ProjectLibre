# Public API Surface

ProjectLibre is primarily a desktop application; it does not expose a formal, stable SDK. The following areas are most relevant if you embed or extend the app:

- `projectlibre_core`: core domain model (tasks, resources, calendars), scheduling algorithms, persistence helpers.
- `projectlibre_ui`: UI components (Swing), dialogs, printing. Entry points under `com.projectlibre1.main`.
- `projectlibre_exchange`: import/export interfaces and adapters (MPXJ-based). Useful for programmatic conversion.

Note: Backwards compatibility is not guaranteed between minor versions. Treat these packages as internal unless you are prepared to adjust to changes.
