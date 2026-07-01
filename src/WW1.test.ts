// Validates that every textMove and textFontSize transition in the WW1 animation
// references a label id that is actually present in the textCollection at that
// point in the sequence.
//
// This catches the class of bug where a label is faded out in one step but a
// later step still tries to move or resize it — MapAnimation.tsx's
// animateTextMove/animateTextFontSize use a non-null assertion on .find(), so a
// missing id crashes at runtime and silently prevents the step from advancing.

import { describe, it, expect } from 'vitest';
import { steps, initialState } from './WW1';

describe('WW1 animation transition integrity', () => {
  it('every textMove and textFontSize target exists in textCollection when its step runs', () => {
    // Replay the same directStep logic the reducer uses: apply each step's
    // transitions in order, maintaining a live set of active label ids.
    const activeIds = new Set(initialState.textCollection.map(t => t.id));

    for (let i = 0; i < steps.length; i++) {
      const { transitions } = steps[i];

      // Check targets BEFORE applying this step's own transitions — this is the
      // state animateTextMove/animateTextFontSize see when they read stateRef.current.
      for (const t of transitions) {
        if (t.type === 'TextMove' || t.type === 'TextFontSize') {
          const id = t.mapTextId;
          expect(
            activeIds.has(id),
            `Step ${i}: ${t.type}('${id}') but '${id}' is not in textCollection — was it faded out earlier?`
          ).toBe(true);
        }
      }

      // Apply this step's transitions to advance state for the next iteration.
      for (const t of transitions) {
        if (t.type === 'TextFadeIn') activeIds.add(t.mapText.id);
        if (t.type === 'TextFadeOut') activeIds.delete(t.mapTextId);
      }
    }
  });
});
