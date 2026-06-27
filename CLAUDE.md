# CLAUDE.md

This is a React + TypeScript + Vite app that renders an animated map (currently telling the story of WWI-era European border changes, in `src/WW1.tsx`) by stepping through a list of declarative transitions (`src/mapReducer.ts`).

Before exploring from scratch, check **[claude/README.md](claude/README.md)** — it has notes on non-obvious behavior in this codebase (e.g. an SVG viewBox/aspect-ratio quirk that affects what's actually visible on screen) plus reusable scripts for inspecting any animation step's state and visible content, screenshotting a step, and recording the whole animation as a video.
