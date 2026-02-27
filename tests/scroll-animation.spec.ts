import { test, expect } from '@playwright/test';

test.describe('Hero Profile Picture and Header Animation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4321/');
  });

  test('hero profile picture is rendered with correct size', async ({ page }) => {
    const heroPic = page.locator('#hero-profile-pic');
    await expect(heroPic).toBeVisible();

    const box = await heroPic.boundingBox();
    expect(box?.width).toBe(96);
    expect(box?.height).toBe(96);
  });

  test('multiple header avatars animate in on scroll', async ({ page }) => {
    const avatars = page.locator('.header-avatar');

    // Initial state: hidden
    await expect(avatars.first()).toHaveClass(/opacity-0/);
    await expect(avatars.last()).toHaveClass(/opacity-0/);

    // Scroll down to hide hero picture
    await page.evaluate(() => window.scrollTo(0, 1000));

    // Wait for animation to trigger
    await page.waitForTimeout(600);

    // All avatars should be visible
    const count = await avatars.count();
    expect(count).toBeGreaterThan(1);

    for (let i = 0; i < count; i++) {
        await expect(avatars.nth(i)).toHaveClass(/opacity-100/);
    }

    // Take a screenshot showing one of the lower headers with avatar
    await page.screenshot({ path: 'screenshots/multiple-avatars-visible.png' });

    // Scroll back to top
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(600);

    // Should be hidden again
    for (let i = 0; i < count; i++) {
        await expect(avatars.nth(i)).toHaveClass(/opacity-0/);
    }
  });
});
