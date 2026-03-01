import { chromium, devices } from 'playwright';
import path from 'path';
import fs from 'fs';

const apps = [
  { name: 'story-cv', url: 'https://story.cv' },
  { name: 'resumey-pro', url: 'https://resumey.pro' },
  { name: 'meatymeets', url: 'https://meatymeets.github.io' },
  { name: 'timetime', url: 'https://www.timetime.in/' },
];

const OUTPUT_DIR = 'src/assets/apps';

async function handleCookies(page) {
  const cookieSelectors = [
    '#cookie-accept-all', // story.cv
    'button:has-text("Accept all")',
    'button:has-text("Accept All")',
    'button:has-text("Allow all")',
    'button:has-text("Accept")',
    '#onetrust-accept-btn-handler',
    '.cookie-accept',
  ];

  for (const selector of cookieSelectors) {
    try {
      const btn = await page.$(selector);
      if (btn && await btn.isVisible()) {
        await btn.click();
        console.log(`    Clicked cookie button: ${selector}`);
        await page.waitForTimeout(1000); // Wait for banner to disappear
        return;
      }
    } catch (e) {
      // Ignore
    }
  }
}

async function capture() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const browser = await chromium.launch();

  for (const app of apps) {
    console.log(`Processing ${app.name}...`);

    // Desktop
    const desktopContext = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      deviceScaleFactor: 2,
    });
    const desktopPage = await desktopContext.newPage();
    try {
      console.log(`  Capturing desktop ${app.url}...`);
      await desktopPage.goto(app.url, { waitUntil: 'networkidle', timeout: 60000 });
      await handleCookies(desktopPage);
      await desktopPage.waitForTimeout(2000);
      const desktopPath = path.join(OUTPUT_DIR, `${app.name}-desktop.png`);
      await desktopPage.screenshot({ path: desktopPath });
      console.log(`  Saved to ${desktopPath}`);
    } catch (e) { console.error(`  Failed desktop: ${e.message}`); }
    await desktopPage.close();
    await desktopContext.close();

    // Mobile
    const mobileContext = await browser.newContext({
      ...devices['iPhone 13'],
      deviceScaleFactor: 2,
    });
    const mobilePage = await mobileContext.newPage();
    try {
      console.log(`  Capturing mobile ${app.url}...`);
      await mobilePage.goto(app.url, { waitUntil: 'networkidle', timeout: 60000 });
      await handleCookies(mobilePage);
      await mobilePage.waitForTimeout(2000);
      const mobilePath = path.join(OUTPUT_DIR, `${app.name}-mobile.png`);
      await mobilePage.screenshot({ path: mobilePath });
      console.log(`  Saved to ${mobilePath}`);
    } catch (e) { console.error(`  Failed mobile: ${e.message}`); }
    await mobilePage.close();
    await mobileContext.close();
  }

  await browser.close();
}

capture();
