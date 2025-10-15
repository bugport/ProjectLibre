# Configuration

Most runtime configuration is embedded in resources within the jars. Notable areas:

- User preferences are stored via Java Preferences API under the user’s home. The launcher script writes `~/.projectlibre/run.conf` and caches detected Java version.
- Localization resources are under `projectlibre_core/src/com/projectlibre1/strings` and `projectlibre_ui/src/com/projectlibre1/menu`.
- Packaging scripts and desktop integrations (icons, .desktop) are under `projectlibre_build/resources/`.

## Build-time properties
`projectlibre_build/build.properties` controls:
- `version`, `version_name`, platform-specific `numericVersion*`
- Packaging toggles and tool paths (e.g., `rpm_builds`, `dpkg_deb`, `gnu_tar`)
- `build_contrib` decides whether contrib jars are built and included

`projectlibre_* /build.properties` in each module define `src`, `build`, and `dist` folders.

## Memory and JVM options
Use environment variable `JAVA_OPTS` or pass JVM args directly:
```bash
JAVA_OPTS="-Xms256m -Xmx1g" java -jar dist/projectlibre.jar
```

## File associations
Linux desktop integration and MIME types are provided in `projectlibre_build/resources/projectlibre.desktop` and `projectlibre_build/resources/projectlibre.xml`. Adjust as needed for your distribution.
