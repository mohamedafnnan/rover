import { chromium } from 'playwright';
import fs from 'fs/promises';
import path from 'path';

const base = 'http://127.0.0.1:4321';
const shots = [
  ['home', '/'],
  ['dawn', '/dawn/'],
  ['team', '/team/'],
  ['sponsors', '/sponsors/'],
  ['3d-portal', '/dawn-3d/'],
  ['3d-app', '/dawn-3d-app/']
];

const outDir = path.resolve('./audit-shots');
await fs.mkdir(outDir, { recursive: true });
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 2200 } });
for (const [name, route] of shots) {
  await page.goto(base + route, { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(outDir, `${name}.png`), fullPage: true });
}
await page.setViewportSize({ width: 390, height: 1600 });
for (const [name, route] of [['home-mobile','/'],['3d-portal-mobile','/dawn-3d/']]) {
  await page.goto(base + route, { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(outDir, `${name}.png`), fullPage: true });
}
await browser.close();
console.log(outDir);
