# Troubleshooting

## Build failures
- Java version mismatch: Ensure JDK 21 and Ant 1.10+.
- Missing tools for packaging: Install `rpmbuild`, `dpkg-deb`, or `gtar` as required. Paths configurable in `projectlibre_build/build.properties`.

## Runtime issues
- App fails to start: run with `JAVA_OPTS="-Xms256m -Xmx1g"` and check console output.
- Preferences issues on SUSE: the launcher script sets prefs dirs to avoid known issues.
- Fonts/UI scaling: adjust `-Dsun.java2d.uiScale` or `-Dsun.java2d.opengl=true` as needed.

## Import/export
- Large XML/MPP files: The exchange layer includes a modified MPXJ tree. Ensure contrib jars are built (`build_contrib=true`) so classpath includes required libs.

## Localization
- Ensure locale resources exist in `projectlibre_core/src/com/projectlibre1/strings` and `projectlibre_ui/src/com/projectlibre1/menu`. Missing keys will default to English.
