import { test, expect } from '@playwright/test';

test.describe('Maker Section Browser UI', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4321/');
  });

  test('should show first app by default and update URL bar on tab click', async ({ page }) => {
    const urlBar = page.locator('#browser-url-text');
    const firstTab = page.locator('.browser-tab').first();
    const firstAppUrl = await firstTab.getAttribute('data-app-url');

    // Check default state
    await expect(urlBar).toHaveText(firstAppUrl || '');

    // Click second tab - using data-app-id to avoid case/formatting issues
    const secondTabId = await page.locator('.browser-tab').nth(1).getAttribute('data-app-id');
    const secondTab = page.locator(`.browser-tab[data-app-id="${secondTabId}"]`);
    const secondAppUrl = await secondTab.getAttribute('data-app-url');

    await secondTab.click();

    // Check updated state
    await expect(urlBar).toHaveText(secondAppUrl || '');

    // Check content visibility
    const secondAppContent = page.locator(`[id="content-${secondTabId}"]`);
    await expect(secondAppContent).toBeVisible();

    // First app content should be hidden
    const firstTabId = await firstTab.getAttribute('data-app-id');
    const firstAppContent = page.locator(`[id="content-${firstTabId}"]`);
    await expect(firstAppContent).toBeHidden();
  });

  test('URL bar should have correct link and open in new tab', async ({ page }) => {
    const urlBarLink = page.locator('#browser-url-bar');
    const firstAppUrl = await page.locator('.browser-tab').first().getAttribute('data-app-url');

    await expect(urlBarLink).toHaveAttribute('href', firstAppUrl || '');
    await expect(urlBarLink).toHaveAttribute('target', '_blank');
  });

  test('should display desktop screenshot on desktop and mobile screenshot on mobile', async ({ page, viewport }) => {
    const firstTabId = await page.locator('.browser-tab').first().getAttribute('data-app-id');
    const content = page.locator(`[id="content-${firstTabId}"]`);

    // On desktop (default viewport in playwright.config.ts is usually desktop size)
    const desktopScreenshot = content.locator('img[alt$="desktop screenshot"]');
    const mobileScreenshot = content.locator('img[alt$="mobile screenshot"]');

    if (viewport && viewport.width >= 768) {
      await expect(desktopScreenshot).toBeVisible();
      await expect(mobileScreenshot).not.toBeVisible();
    } else {
      await expect(mobileScreenshot).toBeVisible();
      await expect(desktopScreenshot).not.toBeVisible();
    }
  });
});
