import { test, expect } from '@playwright/test';

test('Portrait sketchbook flipping interaction', async ({ page }) => {
  await page.goto('http://localhost:4321');

  const portraitStack = page.locator('#portrait-stack');
  await expect(portraitStack).toBeVisible();

  // Get initial z-indices
  const getZIndices = async () => {
    const pages = page.locator('.portrait-page');
    const count = await pages.count();
    const zIndices = [];
    for (let i = 0; i < count; i++) {
      const zIndex = await pages.nth(i).evaluate(el => (el as HTMLElement).style.zIndex);
      zIndices.push(parseInt(zIndex));
    }
    return zIndices;
  };

  const initialZIndices = await getZIndices();
  const maxZ = Math.max(...initialZIndices);
  const topPageIndex = initialZIndices.indexOf(maxZ);

  // Click the stack to flip
  await portraitStack.click();

  // Wait for the flip animation and z-index update
  await page.waitForTimeout(1000);

  const updatedZIndices = await getZIndices();

  // The old top page should now have z-index 1
  expect(updatedZIndices[topPageIndex]).toBe(1);

  // Other pages should have their z-index increased by 1
  for (let i = 0; i < updatedZIndices.length; i++) {
    if (i !== topPageIndex) {
      expect(updatedZIndices[i]).toBe(initialZIndices[i] + 1);
    }
  }
});
