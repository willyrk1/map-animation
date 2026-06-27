// Finds robust label points for one or more countries at a given step: a
// point that's verifiably inside the country's *real* geometry (not a
// bbox-clipped approximation — see the README note on why that matters) and
// has good clearance from the country's border in all four directions, so a
// short text label won't visually spill across a border or coastline.
//
// This is the tool that actually fixed repeated bad label placements for the
// final WWI step — earlier attempts using turf.centroid() or
// turf.pointOnFeature() on a bbox-clipped intersection looked reasonable on
// paper but produced labels that landed in the sea or across a border. This
// script checks candidate points against the country's full, unclipped
// polygon instead.
//
// Usage:
//   STEP=38 COUNTRIES=Italy,RomaniaFinal,BulgariaFinal npx vitest run claude/find-label-point.test.mts
//
// Optional env vars:
//   PREFER_CENTER=AustriaHungaryFinal  — for this comma-separated subset of
//     COUNTRIES, rank candidates by distance to the view's center instead of
//     by margin (use when "close to the middle of the screen" matters more
//     than "as far from any border as possible").
//   LONG_MIN/LONG_MAX/LAT_MIN/LAT_MAX — restrict the search box (defaults
//     below are tuned to stay on-screen across both ~16:9 and wider windows
//     for this app's current final-step zoom level; adjust for other steps).

import { test } from 'vitest';
import * as turf from '@turf/turf';
import { transitions, initialState } from '../src/WW1.tsx';

const STEP = process.env.STEP !== undefined ? parseInt(process.env.STEP, 10) : transitions.length - 1;
const COUNTRIES = (process.env.COUNTRIES ?? '').split(',').map(s => s.trim()).filter(Boolean);
const PREFER_CENTER = new Set((process.env.PREFER_CENTER ?? '').split(',').map(s => s.trim()).filter(Boolean));

const VIEW = {
  longMin: process.env.LONG_MIN ? parseFloat(process.env.LONG_MIN) : 12.9,
  longMax: process.env.LONG_MAX ? parseFloat(process.env.LONG_MAX) : 23.9,
  latMin: process.env.LAT_MIN ? parseFloat(process.env.LAT_MIN) : 41.6,
  latMax: process.env.LAT_MAX ? parseFloat(process.env.LAT_MAX) : 46.0,
};

function toWithPathProps(c: any) { return c }

function isInside(pt: [number, number], country: any) {
  const p = turf.point(pt);
  for (const ring of country.coordinates) {
    try {
      if (turf.booleanPointInPolygon(p, turf.polygon([ring]))) return true;
    } catch (e) { /* skip invalid ring */ }
  }
  return false;
}

// How far (in degrees) the point can move in each of the 4 cardinal
// directions while staying inside the country. The minimum of the four is a
// cheap stand-in for "distance to nearest border" (a poor man's pole of
// inaccessibility — there's no polylabel-style helper in @turf/turf itself).
function margin(pt: [number, number], country: any, step = 0.1, max = 1.2) {
  function probe(dx: number, dy: number) {
    let d = 0;
    while (d + step <= max && isInside([pt[0] + dx * (d + step), pt[1] + dy * (d + step)], country)) d += step;
    return d;
  }
  return Math.min(probe(1, 0), probe(-1, 0), probe(0, 1), probe(0, -1));
}

test(`find label points at step ${STEP} for: ${COUNTRIES.join(', ')}`, () => {
  let state: any = { ...initialState, countries: initialState.countries.map(toWithPathProps), step: 0 };
  for (let i = 0; i < STEP; i++) {
    const transitionDefinition = transitions[i](state);
    const list = Array.isArray(transitionDefinition) ? transitionDefinition : [transitionDefinition];
    for (const transition of list) {
      switch (transition.type) {
        case 'CountryFadeIn': state.countries = state.countries.concat(toWithPathProps(transition.country)); break;
        case 'CountryReplace': state.countries = state.countries.filter((c: any) => c.name !== transition.name); break;
      }
    }
  }

  let viewCenter: [number, number] = [(VIEW.longMin + VIEW.longMax) / 2, (VIEW.latMin + VIEW.latMax) / 2];
  const stepTransitions = transitions[STEP](state);
  for (const t of (Array.isArray(stepTransitions) ? stepTransitions : [stepTransitions])) {
    if (t.type === 'ViewCenterChange') viewCenter = [t.long, t.lat];
  }

  for (const countryName of COUNTRIES) {
    const country = state.countries.find((c: any) => c.name === countryName);
    if (!country) { console.log(countryName, '-> NOT FOUND'); continue; }
    const preferCenter = PREFER_CENTER.has(countryName);
    let best: { pt: [number, number]; margin: number; distToCenter: number } | null = null;
    for (let long = VIEW.longMin; long <= VIEW.longMax; long += 0.1) {
      for (let lat = VIEW.latMin; lat <= VIEW.latMax; lat += 0.1) {
        if (!isInside([long, lat], country)) continue;
        const m = margin([long, lat], country);
        if (m < 0.3) continue; // not enough clearance for even a short label
        const distToCenter = Math.hypot(long - viewCenter[0], lat - viewCenter[1]);
        const better = preferCenter ? (!best || distToCenter < best.distToCenter) : (!best || m > best.margin);
        if (better) best = { pt: [Math.round(long * 100) / 100, Math.round(lat * 100) / 100], margin: Math.round(m * 100) / 100, distToCenter: Math.round(distToCenter * 100) / 100 };
      }
    }
    console.log(countryName, '->', best ?? 'no point found with enough clearance — widen the search box or lower the margin threshold');
  }
});
