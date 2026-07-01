// Jumps directly to a given animation step via the numbered step buttons
// (these call mapReducer's `directStep`, which replays every transition up
// to that index instantly — no need to click NEXT repeatedly) and saves a
// screenshot. Handy for visually checking a single step without sitting
// through the whole animation.
//
// Requires `npm install -D playwright` and `npx playwright install chromium`,
// and a running dev server (`npx vite --port 5183 --strictPort`).
//
// Usage:
//   node claude/screenshot-step.mjs <stepIndex> [outFile] [port]
//   node claude/screenshot-step.mjs 38
//   node claude/screenshot-step.mjs 38 video-output/step38.png 5183

import { chromium } from 'playwright';

const step = parseInt(process.argv[2] ?? '0', 10);
const outFile = process.argv[3] ?? `video-output/step${step}.png`;
const port = process.argv[4] ?? '5183';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
await page.goto(`http://localhost:${port}/map-animation`, { waitUntil: 'networkidle' });

// The numbered step buttons live in a `.stepPicker` div, shown by default.
const stepButtons = page.locator('.stepPicker > button');
const count = await stepButtons.count();
if (step < 0 || step >= count) {
  throw new Error(`Step ${step} out of range — only ${count} steps exist (0-${count - 1})`);
}

await stepButtons.nth(step).click();
await page.waitForTimeout(300);

await page.screenshot({ path: outFile });
const viewBox = await page.locator('svg').getAttribute('viewBox');
console.log(`Saved ${outFile}. viewBox: ${viewBox}`);

await browser.close();
