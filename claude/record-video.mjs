// Drives the app like a user repeatedly clicking "NEXT", recording the whole
// session as a video via Playwright. Useful for producing a frame-by-frame
// video of the animation, or for spot-checking the whole sequence visually.
//
// Requires `npm install -D playwright` and `npx playwright install chromium`
// (not committed as a permanent devDependency to keep this repo lean).
//
// Usage:
//   npx vite --port 5183 --strictPort &   (start the dev server first)
//   node claude/record-video.mjs
//
// Output: a .webm video under video-output/.

import { chromium } from 'playwright';
import { mkdirSync } from 'fs';
import path from 'path';

const PORT = 5183;
const URL = `http://localhost:${PORT}/map-animation`;
const OUT_DIR = path.resolve('video-output');
mkdirSync(OUT_DIR, { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1600, height: 900 },
  recordVideo: { dir: OUT_DIR, size: { width: 1600, height: 900 } },
});
const page = await context.newPage();
await page.goto(URL, { waitUntil: 'networkidle' });

const nextButton = page.getByRole('button', { name: 'NEXT' });
// See screenshot-step.mjs for why this must be scoped to `.controls > div`.
const stepButtons = page.locator('.controls > div > button:not(:first-child)');
const stepCount = await stepButtons.count();
console.log(`Detected ${stepCount} steps`);

// Hold on the starting frame briefly.
await page.waitForTimeout(800);

for (let i = 0; i < stepCount; i++) {
  await nextButton.click();
  // Animation duration is 1000ms (see MapAnimation.tsx's `duration` const);
  // wait a bit longer to ensure it settles, plus a pause on the resulting frame.
  await page.waitForTimeout(1500);
}

// Hold on the final frame.
await page.waitForTimeout(1500);

await context.close();
await browser.close();

console.log('Done. Video saved in', OUT_DIR);
