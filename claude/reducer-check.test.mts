import { describe, it, expect } from 'vitest';
import mapReducer, { MapState, stepsWithPathProps } from '../src/mapReducer.ts';
import { steps, initialState } from '../src/WW1.tsx';

function freshState(): MapState {
  // Marker pathProps stand in for WW1's real toWithPathProps color mapping.
  return { steps: stepsWithPathProps(steps, c => ({ ...c, pathProps: { fill: 'marker' } })), ...initialState, step: 0 };
}

describe('startAnimation + doTransitions', () => {
  it('applies step 0 transitions over a full animation', () => {
    let state = freshState();

    state = mapReducer(state, { type: 'startAnimation' });
    expect(state.step).toBe(1);
    expect(state.animationStart).toBeDefined();

    state = mapReducer(state, { type: 'doTransitions', percentage: 0.5 });
    const finland = state.textCollection.find(t => t.id === 'Finland');
    expect(finland?.opacity).toBe(0.5);

    state = mapReducer(state, { type: 'doTransitions', percentage: 1 });
    expect(state.textCollection.find(t => t.id === 'StartSummary')).toBeUndefined();
    expect(state.textCollection.find(t => t.id === 'Finland')?.opacity).toBe(1);
    expect(state.highlightCollection.find(h => h.id === 'Finland')?.opacity).toBe(1);
  });

  it('interpolates viewCenter/zoom/textMove from animationStart (step 2)', () => {
    let state = mapReducer(freshState(), { type: 'directStep', step: 1 });
    expect(state.step).toBe(2);
    const startCenter = state.viewCenter;

    state = mapReducer(state, { type: 'startAnimation' });
    state = mapReducer(state, { type: 'doTransitions', percentage: 0.5 });
    // step 2: viewCenterChange(15, 52), zoomChange(8), textMove('Russian Empire', 38, 54)
    expect(state.viewCenter[0]).toBeCloseTo(startCenter[0] + (15 - startCenter[0]) * 0.5);
    expect(state.zoom).not.toBe(initialState.zoom);

    state = mapReducer(state, { type: 'doTransitions', percentage: 1 });
    expect(state.viewCenter).toEqual([15, 52]);
    expect(state.zoom).toBe(8);
    expect(state.textCollection.find(t => t.id === 'Russian Empire')?.coordinates).toEqual([38, 54]);
  });
});

describe('initial baseline captured in state', () => {
  it('reInit restores the pristine step-0 state without a payload', () => {
    let state = freshState();
    state = mapReducer(state, { type: 'startAnimation' });
    state = mapReducer(state, { type: 'doTransitions', percentage: 1 });

    state = mapReducer(state, { type: 'reInit' });
    expect(state.step).toBe(0);
    expect(state.countries).toEqual(initialState.countries);
    expect(state.textCollection).toEqual(initialState.textCollection);
    expect(state.viewCenter).toEqual(initialState.viewCenter);
    expect(state.zoom).toBe(initialState.zoom);
  });

  it('directStep replays from the state-held baseline even after mutations', () => {
    // Mutate state first (run step 0 fully), then jump: the replay must start
    // from the captured baseline, not from the mutated collections.
    let state = freshState();
    state = mapReducer(state, { type: 'startAnimation' });
    state = mapReducer(state, { type: 'doTransitions', percentage: 1 });

    state = mapReducer(state, { type: 'directStep', step: 1 });
    expect(state.step).toBe(2);
    // step 1 replaces Russia+Finland with RussiaFinland, which enters state
    // with the pathProps stepsWithPathProps pre-applied to the transition
    // (plus the top-level opacity its fade-in finishes at)
    expect(state.countries.find(c => c.name === 'Russia')).toBeUndefined();
    expect(state.countries.find(c => c.name === 'RussiaFinland')?.pathProps).toEqual({ fill: 'marker' });
    expect(state.countries.find(c => c.name === 'RussiaFinland')?.opacity).toBe(1);
    // step 0's fade-ins that survive step 1 are present exactly once (no
    // duplicates from the mutated state), and Finland's label was faded out
    expect(state.textCollection.filter(t => t.id === 'RussianEmpireSummary')).toHaveLength(1);
    expect(state.textCollection.find(t => t.id === 'Finland')).toBeUndefined();
  });

  it('directStep to the last step matches stepping through every animation', () => {
    const last = steps.length - 1;

    let stepped = freshState();
    for (let i = 0; i <= last; i++) {
      stepped = mapReducer(stepped, { type: 'startAnimation' });
      stepped = mapReducer(stepped, { type: 'doTransitions', percentage: 1 });
    }
    const jumped = mapReducer(freshState(), { type: 'directStep', step: last });

    expect(jumped.step).toBe(stepped.step);
    expect(jumped.countries.map(c => c.name)).toEqual(stepped.countries.map(c => c.name));
    expect(jumped.textCollection.map(t => t.id)).toEqual(stepped.textCollection.map(t => t.id));
    expect(jumped.highlightCollection.map(h => h.id)).toEqual(stepped.highlightCollection.map(h => h.id));
    expect(jumped.viewCenter[0]).toBeCloseTo(stepped.viewCenter[0]);
    expect(jumped.viewCenter[1]).toBeCloseTo(stepped.viewCenter[1]);
    expect(jumped.zoom).toBeCloseTo(stepped.zoom);
  });
});
