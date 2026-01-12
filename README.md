# neoanno-data

Versioned, canonical data for NeoAnno apps (Anno 1800 today; more later).

This repo is designed to be consumed directly by web apps (NeoAnno-Designer, calculators, etc.)
via static hosting (GitHub Pages). The app pins to a data version and loads JSON files at runtime.

## Hosting

Primary (recommended): GitHub Pages

Base URL:
- https://<USER>.github.io/neoanno-data/

Examples:
- https://<USER>.github.io/neoanno-data/versions/latest.json
- https://<USER>.github.io/neoanno-data/anno1800/v2.0.1/buildings.json

Optional fallback:
- https://raw.githubusercontent.com/<USER>/neoanno-data/main/...

## Structure

neoanno-data/
├─ versions/
│ ├─ latest.json
│ ├─ index.json
│ └─ v2.0.1.json
└─ anno1800/
└─ v2.0.1/
├─ meta.json
├─ buildings.json
├─ goods.json
├─ productionChains.json
├─ consumption.json
├─ services.json
├─ residents.json
├─ items.json
├─ itemEffects.json
├─ docklands.json
├─ docklands-progression.json
├─ docklands-ui.json
└─ build-report.json

## Versioning

- Data is immutable per version folder: `anno1800/vX.Y.Z/`
- Apps should pin to an explicit version where possible.
- `versions/latest.json` provides the recommended version for each supported game.

## Manifests

### `versions/latest.json`
Points to the latest recommended version.

### `versions/index.json`
Lists all available versions.

### `versions/vX.Y.Z.json`
Optional per-version manifest:
- file list
- sha256 checksums (optional but recommended)

## Integrity (optional)

If you include checksums:
- the app can validate cached files
- detect corruption and auto-repair by re-downloading

## License / attribution

This repo contains derived/reference data used to support NeoAnno tools.
If any upstream sources require attribution or impose restrictions, document them here.
