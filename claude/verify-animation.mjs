import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
await page.goto('http://localhost:5199/map-animation');
await page.waitForSelector('#root svg');

const snap = () => page.evaluate(() => {
  const svg = document.querySelector('#root svg');
  return {
    viewBox: svg.getAttribute('viewBox'),
    texts: [...svg.querySelectorAll('text')].map(t => {
      const g = t.closest('g[opacity]');
      return { text: t.textContent.slice(0, 22), opacity: g ? Number(g.getAttribute('opacity')) : null };
    }),
    currentStepBtn: document.querySelector('.stepPicker .current')?.textContent ?? null,
  };
});

const initial = await snap();
console.log('INITIAL:', JSON.stringify(initial, null, 1));

// NEXT: step 0 cross-fade should animate
await page.click('button[title="Next step"]');
await page.waitForTimeout(400);
console.log('STEP0 MID:', JSON.stringify((await snap()).texts, null, 1));
await page.waitForTimeout(900);
console.log('STEP0 DONE:', JSON.stringify(await snap(), null, 1));

// directStep: jump straight to step 2 via the step picker (payload-less action)
await page.click('.stepPicker > button:nth-child(3)');
await page.waitForTimeout(200);
const jumped = await snap();
console.log('DIRECTSTEP(2):', JSON.stringify(jumped, null, 1));

// reInit: Restart should restore the pristine initial state (payload-less action)
await page.click('button[title="Restart"]');
await page.waitForTimeout(200);
const restarted = await snap();
console.log('RESTART:', JSON.stringify(restarted, null, 1));
console.log('restart matches initial:', JSON.stringify(restarted) === JSON.stringify(initial));

await browser.close();
