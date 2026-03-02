import { chromium } from 'playwright';

async function record() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    recordVideo: {
      dir: 'videos/',
      size: { width: 1280, height: 720 }
    },
    viewport: { width: 1280, height: 720 }
  });

  const page = await context.newPage();
  await page.goto('http://localhost:4321');

  const portraitSection = page.locator('section:has-text("a portrait artist")');
  await portraitSection.scrollIntoViewIfNeeded();

  // Wait a bit for initial state
  await page.waitForTimeout(1000);

  const rightSide = page.locator('#portrait-stack');
  const leftSide = page.locator('#portrait-left-page');

  // Flip forward 3 times
  for (let i = 0; i < 3; i++) {
    await rightSide.click({ force: true });
    await page.waitForTimeout(1500);
  }

  // Flip back once
  await leftSide.click({ force: true });
  await page.waitForTimeout(1500);

  // Flip forward again
  await rightSide.click({ force: true });
  await page.waitForTimeout(1500);

  // Flip all remaining (assuming 6 total, 3 flipped + 1 flipped back + 1 flipped again = 3 flipped)
  // Let's just flip 4 more times to be sure we hit the end
  for (let i = 0; i < 4; i++) {
    await rightSide.click({ force: true });
    await page.waitForTimeout(1200);
  }

  // Reset
  await rightSide.click({ force: true });
  await page.waitForTimeout(2000);

  await context.close();
  await browser.close();
}

record().catch(console.error);
