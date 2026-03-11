# Task Plan: Migrate Single HTML to Vite Multi-File Project

## Goal
Convert the existing single-file Three.js demo into a Vite-based multi-file project suitable for formal development.

## Phases
- [x] Phase 1: Plan and setup
- [x] Phase 2: Research current structure
- [x] Phase 3: Execute migration
- [x] Phase 4: Review and deliver

## Key Questions
1. Which files should be created for a minimal but production-friendly Vite structure?
2. How to keep current visual/interaction behavior unchanged after migration?

## Decisions Made
- Use `three` and `vite` as dependencies and move inline logic to `src/main.js`.
- Move inline CSS to `src/style.css`.

## Errors Encountered
- `vite build` chunk warning (>500kB minified JS): accepted for now because project is single-page demo and behavior parity was prioritized.
- `npm audit` reported 2 moderate vulnerabilities in dependency tree: not auto-fixed to avoid unintended breaking changes.

## Status
**Completed** - Vite multi-file migration is done and build passes.
