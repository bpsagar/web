import { test, expect } from '@playwright/test';

test.describe('Maker Section Browser UI', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4321/');
  });

  test('should show first app by default and update URL bar on tab click', async ({ page }) => {
    const urlBar = page.locator('#browser-url-text');
    const firstAppUrl = await page.locator('.browser-tab').first().getAttribute('data-app-url');

    // Check default state
    await expect(urlBar).toHaveText(firstAppUrl || '');

    // Click second tab
    const secondTab = page.locator('.browser-tab').nth(1);
    const secondAppUrl = await secondTab.getAttribute('data-app-url');
    const secondAppName = await secondTab.innerText();

    await secondTab.click();

    // Check updated state
    await expect(urlBar).toHaveText(secondAppUrl || '');

    // Check content visibility
    const secondAppContent = page.locator(`[id="content-${secondAppName.toLowerCase().replace(/\s+/g, '-')}"]`);
    await expect(secondAppContent).toBeVisible();

    // First app content should be hidden
    const firstAppName = await page.locator('.browser-tab').first().innerText();
    const firstAppContent = page.locator(`[id="content-${firstAppName.toLowerCase().replace(/\s+/g, '-')}"]`);
    await expect(firstAppContent).toBeHidden();
  });

  test('URL bar should have correct link and open in new tab', async ({ page }) => {
    const urlBarLink = page.locator('#browser-url-bar');
    const firstAppUrl = await page.locator('.browser-tab').first().getAttribute('data-app-url');

    await expect(urlBarLink).toHaveAttribute('href', firstAppUrl || '');
    await expect(urlBarLink).toHaveAttribute('target', '_blank');
  });
});
