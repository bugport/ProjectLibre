# Contributing

We welcome improvements to code, build, packaging, documentation, and localization.

## Development environment
- JDK 21, Ant 1.10+
- Import each module into your IDE as a Java project
- Set `projectlibre_ui` run configuration to `com.projectlibre1.main.Main`

## Coding guidelines
- Prefer clear, readable Java with descriptive names
- Keep comments focused on rationale and edge cases
- Avoid deep nesting and unnecessary try/catch blocks

## Submitting changes
1. Create a feature branch
2. Build locally: `cd projectlibre_build && ant dist`
3. Test the application manually, especially core views and sample files
4. Submit a pull request with:
   - Summary of changes and motivation
   - Notes on build or packaging impact
   - Screenshots for UI changes

## Translating
- Update `projectlibre_core/src/com/projectlibre1/strings/*.properties`
- Update `projectlibre_ui/src/com/projectlibre1/menu/*.properties`
- Follow guidance inside those files and test by switching locale
