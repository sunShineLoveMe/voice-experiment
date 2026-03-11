# Notes: Single-File to Vite Migration

## Existing Structure Findings
- Current project has one runnable file: `Sound-wave-mvp.html`.
- The page includes:
  - Full HTML UI markup
  - Full CSS in `<style>`
  - Three.js logic in `<script type="module">`
- Three.js currently imports from `https://esm.sh/three@0.166.1` to avoid sandbox issues.

## Migration Choices
- Replace CDN imports with npm package imports:
  - `import * as THREE from 'three'`
  - `import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'`
- Keep exact feature behavior and UI text.
- Keep old file for reference and add Vite entrypoint as default runnable app.

## Target File Layout
- `package.json`
- `index.html`
- `src/main.js`
- `src/style.css`
- `.gitignore`
