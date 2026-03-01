import { chromium } from 'playwright';
import { promises as fs } from 'fs';
import path from 'path';

const apps = [
  { name: 'story-cv', url: 'https://story.cv' },
  { name: 'resumey-pro', url: 'https://resumey.pro' },
  { name: 'meatymeets', url: 'https://meatymeets.github.io' },
  { name: 'timetime', url: 'https://www.timetime.in/' },
];

async function capture() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 2,
  });

  for (const app of apps) {
    const page = await context.newPage();
    console.log(`Capturing ${app.name} at ${app.url}...`);
    try {
      await page.goto(app.url, { waitUntil: 'networkidle', timeout: 60000 });
      // Wait a bit more for animations/dynamic content
      await page.waitForTimeout(2000);
      const screenshotPath = path.join('src/assets/apps', `${app.name}.png`);
      await page.screenshot({ path: screenshotPath });
      console.log(`Saved to ${screenshotPath}`);
    } catch (error) {
      console.error(`Failed to capture ${app.name}:`, error);
    } finally {
      await page.close();
    }
  }

  await browser.close();
}

capture();
