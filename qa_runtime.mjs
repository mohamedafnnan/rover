import { chromium } from 'playwright';

const routes = ['/', '/mission/', '/dawn/', '/engineering/', '/irc-2026/', '/team/', '/sponsors/', '/gallery/', '/contact/', '/dawn-3d/', '/dawn-3d-app/'];
const base = 'http://127.0.0.1:4321';
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 1100 } });
const issues = [];
for (const route of routes) {
  const page = await context.newPage();
  page.on('console', msg => {
    if (['error', 'warning'].includes(msg.type())) issues.push({ route, type: 'console', level: msg.type(), text: msg.text() });
  });
  page.on('pageerror', err => issues.push({ route, type: 'pageerror', text: err.message }));
  const response = await page.goto(base + route, { waitUntil: 'networkidle' });
  if (!response || !response.ok()) issues.push({ route, type: 'http', text: String(response?.status()) });
  const links = await page.$$eval('a[href]', as => as.map(a => a.getAttribute('href')).filter(Boolean));
  if (route === '/dawn-3d-app/') {
    await page.keyboard.press('Space').catch(() => {});
    await page.waitForTimeout(2500);
  }
  issues.push({ route, type: 'meta', text: `links:${links.length}` });
  await page.close();
}
await browser.close();
console.log(JSON.stringify(issues, null, 2));
