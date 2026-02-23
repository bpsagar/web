import { test } from '@playwright/test';

test('take screenshots', async ({ page }) => {
  await page.goto('http://localhost:4321/web');
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: 'screenshot-desktop.png', fullPage: true });

  await page.setViewportSize({ width: 375, height: 812 });
  await page.screenshot({ path: 'screenshot-mobile.png', fullPage: true });
});
