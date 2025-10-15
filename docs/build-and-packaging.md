# Build and Packaging

This document summarizes available Ant targets and packaging outputs.

## Modules and primary Ant targets
- `projectlibre_core`:
  - `ant dist`: builds `dist/projectlibre-core.jar`
  - `ant clean`: removes `build/` and `dist/`
- `projectlibre_contrib`:
  - `ant dist`: builds `projectlibre-contrib.jar`, `projectlibre-script.jar`, `projectlibre-reports.jar`
  - `ant shrink=true dist`: runs ProGuard to minimize jars (requires config files)
  - `ant clean`: cleans outputs
- `projectlibre_exchange`:
  - `ant dist`: builds `lib/exchange/mpop.jar` inside contrib
  - `ant clean`: cleans outputs
- `projectlibre_build` (top-level app jar and installers):
  - `ant dist`: compiles all sources and jars `dist/projectlibre.jar`
  - `ant fatjar`: produces `packages/projectlibre-<version>.jar`
  - `ant dir`: creates `packages/projectlibre-<version>/` layout
  - `ant tar`, `ant zip`: archives
  - `ant deb`, `ant rpm`: Linux packages
  - `ant wix`: WiX resources for MSI
  - `ant jpackage-dmg`, `ant jpackage-deb`, `ant jpackage-msi`: jpackage inputs per OS
  - `ant all`: full packaging pipeline

## Versioning
Configure in `projectlibre_build/build.properties`:
- `version`, `version_name`, `numericVersion3/4`, `rpm_version`, `deb_version`

## Launch scripts and desktop entries
- `projectlibre_build/resources/projectlibre.sh` (Unix launcher)
- `projectlibre_build/resources/projectlibre.bat` (Windows)
- `projectlibre_build/resources/projectlibre.desktop` and `projectlibre_build/resources/projectlibre.xml` for Linux desktop/mime

## Where artifacts are written
- Jars under each module's `dist/`
- App jar under `projectlibre_build/dist/`
- Packages under `projectlibre_build/packages/`

## Frontend module (React + Vite)

Location: `frontend/`

Build options:
- Local: `cd frontend && npm ci && npm run build` -> outputs to `frontend/dist/`
- Dockerized via Gradle (recommended reproducible env):
  - `./gradlew frontendBuildDocker` builds the frontend using `Dockerfile.builder`
  - `./gradlew frontendDockerImage` packages the built `dist/` into an nginx image
  - `./gradlew frontendDockerRun` runs the nginx image at `http://localhost:8080`

Runtime image details (`Dockerfile.front`):
- Multi-purpose runtime based on `nginx:alpine`
- Copies `./frontend/dist` to `/usr/share/nginx/html/`
- Exposes port `80`

Notes:
- Ensure `docker` is installed for the Gradle docker tasks
- The builder image in `Dockerfile.builder` includes Node.js/npm to enable the frontend build

## Backend module (Node + Express + TS)

Location: `backend/`

Run locally:
- `cd backend && npm install && npm run dev` (hot reload)
- `cd backend && npm run build && npm start` (compiled)

Endpoints:
- `GET /health` -> `{ status: "ok" }`
- `GET/POST/PATCH/DELETE /api/projects`
- `GET/POST/PATCH/DELETE /api/tasks` (supports `?projectId=<id>`)
- `GET/POST/PATCH/DELETE /api/resources`
- `GET/POST/PATCH/DELETE /api/calendars`

Docker:
- `cd backend && docker build -t projectlibre/backend:latest .`
- `docker run --rm -p 3001:3001 projectlibre/backend:latest`

## Common build issues
- Ensure JDK 21 is used (Ant `javac` uses `source=21 target=21`).
- On macOS, install GNU tar: `brew install gnu-tar` (provides `gtar`).
- For `deb`/`rpm`, ensure `dpkg-deb` and `rpmbuild` are installed and paths configured in `build.properties`.
