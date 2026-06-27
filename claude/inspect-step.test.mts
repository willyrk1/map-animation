// Reusable tool for inspecting the WW1 animation's state at any step, without
// running the app in a browser. Simulates the same "apply every transition up
// to step N" logic that mapReducer's `directStep` case uses (see
// src/mapReducer.ts), then reports:
//   - the resulting viewCenter/zoom
//   - the *actual* rendered viewBox, accounting for the SVG aspect-ratio quirk
//     described in README.md (the app's viewBox is always 2 units wide, so on
//     a typical widescreen window the visible longitude range ends up much
//     wider than the nominal viewBox — the height is the constraining
//     dimension under the default `xMidYMid meet` SVG scaling)
//   - every text label and whether it falls inside that rendered viewBox
//   - every country polygon that intersects the rendered viewBox, with the
//     percentage of the viewBox it covers and a guaranteed-on-land point
//     within the visible portion (handy for placing new labels — see the
//     "labelPoint vs centroid" note in README.md)
//
// Usage:
//   STEP=38 ASPECT=1.7778 npx vitest run claude/inspect-step.test.mts
//
// STEP defaults to the last transition index. ASPECT defaults to 16:9 (a
// typical desktop browser window) — pass e.g. 1 for a square window.
//
// Requires `initialState` and `transitions` to be exported from src/WW1.tsx
// (they are, as of this writing — see the `export const` on both).

import { test } from 'vitest';
import * as turf from '@turf/turf';
import { transitions, initialState } from '../src/WW1.tsx';
import { lat2y, y2lat } from '../src/utility.ts';

const STEP = process.env.STEP !== undefined ? parseInt(process.env.STEP, 10) : transitions.length - 1;
const ASPECT = process.env.ASPECT !== undefined ? parseFloat(process.env.ASPECT) : 16 / 9;

function toWithPathProps(c: any) { return c }

test(`inspect state at step ${STEP}`, () => {
  let state: any = { ...initialState, countries: initialState.countries.map(toWithPathProps), step: 0 };

  // Apply every transition strictly before STEP to build up the state the
  // user would see right as they click "NEXT" into STEP.
  for (let i = 0; i < STEP; i++) {
    const transitionDefinition = transitions[i](state);
    const transitionDefinitions = Array.isArray(transitionDefinition) ? transitionDefinition : [transitionDefinition];
    for (const transition of transitionDefinitions) {
      switch (transition.type) {
        case 'CountryFadeIn':
          state.countries = state.countries.concat(toWithPathProps(transition.country));
          break;
        case 'CountryReplace':
          state.countries = state.countries.filter((c: any) => c.name !== transition.name);
          break;
        case 'ViewCenterChange':
          state.viewCenter = [transition.long, transition.lat];
          break;
        case 'ZoomChange':
          state.zoom = transition.newZoom;
          break;
        case 'TextFadeIn':
          state.textCollection = state.textCollection.concat(transition.mapText);
          break;
        case 'TextFadeOut':
          state.textCollection = state.textCollection.filter((t: any) => t.id !== transition.mapTextId);
          break;
        case 'TextMove': {
          const idx = state.textCollection.findIndex((t: any) => t.id === transition.mapTextId);
          if (idx >= 0) {
            state.textCollection = state.textCollection.toSpliced(idx, 1, { ...state.textCollection[idx], coordinates: transition.newCoordinates });
          }
          break;
        }
      }
    }
  }

  console.log(`--- text labels active right before step ${STEP} ---`);
  for (const t of state.textCollection) {
    console.log(t.id, t.coordinates);
  }

  // Now resolve STEP's own ViewCenterChange/ZoomChange (if any) to know the
  // view the user will actually be looking at after clicking NEXT.
  const stepTransitions = transitions[STEP](state);
  const list = Array.isArray(stepTransitions) ? stepTransitions : [stepTransitions];
  let viewCenter = state.viewCenter, zoom = state.zoom;
  for (const t of list) {
    if (t.type === 'ViewCenterChange') viewCenter = [t.long, t.lat];
    if (t.type === 'ZoomChange') zoom = t.newZoom;
  }

  const WORLDHEIGHT = lat2y(85) - lat2y(-60);
  const height = WORLDHEIGHT / zoom; // matches MapAnimation.tsx's viewBox math
  // The app's viewBox is nominally 2 units wide. Under `xMidYMid meet` (the
  // SVG default, which this app does not override), the browser uniformly
  // scales until the *whole* viewBox fits, then fills the rest of the
  // element. Since 2 is narrow relative to any normal window, height ends up
  // being the constraining dimension, and the effectively-visible longitude
  // range is wider than the nominal "2" — it's `height * elementAspect`.
  const effectiveWidth = height * ASPECT;
  const [long, lat] = viewCenter;
  const x = long + 180, y = 180 - lat2y(lat);
  const yTop = y - height / 2, yBot = y + height / 2;
  const latTop = y2lat(180 - yTop), latBot = y2lat(180 - yBot);
  const longLeft = x - effectiveWidth / 2 - 180, longRight = x + effectiveWidth / 2 - 180;

  console.log(`--- step ${STEP}: viewCenter ${viewCenter}, zoom ${zoom} ---`);
  console.log('rendered long range', longLeft, longRight);
  console.log('rendered lat range', latBot, latTop);

  console.log('--- text labels inside the rendered viewbox ---');
  for (const t of state.textCollection) {
    const [tlong, tlat] = t.coordinates;
    const inView = tlong >= longLeft && tlong <= longRight && tlat >= latBot && tlat <= latTop;
    if (inView) console.log('IN VIEW:', t.id, t.coordinates);
  }

  console.log('--- countries intersecting the rendered viewbox ---');
  const bboxPoly = turf.bboxPolygon([longLeft, latBot, longRight, latTop]);
  const bboxArea = turf.area(bboxPoly);
  for (const c of state.countries) {
    try {
      const multi = turf.multiPolygon(c.coordinates.map((p: any) => [p]));
      if (turf.booleanIntersects(multi, bboxPoly)) {
        let overlapArea = 0;
        let labelPoint: number[] | undefined;
        try {
          const inter = turf.intersect(turf.featureCollection([multi, bboxPoly]));
          if (inter) {
            overlapArea = turf.area(inter);
            // NOTE: turf.centroid() is the average of all vertices and can land
            // outside the actual landmass — in the sea for a concave/multi-island
            // country like Italy, or just over the border for a country whose
            // visible sliver is an odd shape (Bulgaria/Romania near this view).
            // turf.pointOnFeature() guarantees a point that lies ON the polygon.
            labelPoint = turf.pointOnFeature(inter).geometry.coordinates;
          }
        } catch (e) { /* malformed intersection, skip area/labelPoint */ }
        console.log(c.name, 'pctOfView:', ((overlapArea / bboxArea) * 100).toFixed(2), 'labelPoint:', labelPoint);
      }
    } catch (e) { /* malformed polygon, skip */ }
  }
});
