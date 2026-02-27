import { test, expect } from '@playwright/test';

test('hero profile picture size and header avatar animation', async ({ page }) => {
  await page.goto('http://localhost:4321/');

  // Check hero profile picture size (24x24 tailwind = 96px)
  const heroPic = page.locator('#hero-profile-pic');
  await expect(heroPic).toBeVisible();
  const box = await heroPic.boundingBox();
  expect(box?.width).toBe(96);
  expect(box?.height).toBe(96);

  // Check header avatar is initially hidden
  const headerAvatar = page.locator('#header-avatar');
  // It should be present in DOM but have w-0 and opacity-0
  await expect(headerAvatar).toHaveClass(/opacity-0/);
  await expect(headerAvatar).toHaveClass(/w-0/);

  // Scroll down until hero profile pic is out of view
  await page.evaluate(() => window.scrollTo(0, 1000));

  // Wait for animation
  await page.waitForTimeout(600);

  // Check header avatar is now visible
  await expect(headerAvatar).toHaveClass(/opacity-100/);
  await expect(headerAvatar).toHaveClass(/w-5/);

  // Take screenshot of header with avatar
  await page.screenshot({ path: 'screenshots/header-avatar-visible.png' });

  // Scroll back up
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(600);

  // Check header avatar is hidden again
  await expect(headerAvatar).toHaveClass(/opacity-0/);
  await expect(headerAvatar).toHaveClass(/w-0/);
});
