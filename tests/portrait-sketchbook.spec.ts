import { test, expect } from '@playwright/test';

test('Moleskine sketchbook flipping interaction', async ({ page }) => {
  await page.goto('http://localhost:4321');

  const portraitSection = page.locator('section:has-text("a portrait artist")');
  await portraitSection.scrollIntoViewIfNeeded();

  const portraitSpread = page.locator('#portrait-spread');
  const leftSide = page.locator('#portrait-left-page');
  const rightSide = page.locator('#portrait-stack');
  await expect(portraitSpread).toBeVisible();

  const pages = page.locator('.portrait-page');
  const count = await pages.count();

  // Initially, no pages should have the 'flipped' class
  for (let i = 0; i < count; i++) {
    await expect(pages.nth(i)).not.toHaveClass(/flipped/);
  }

  // 1. Flip forward first page
  await rightSide.click({ force: true });
  await expect(pages.nth(0)).toHaveClass(/flipped/, { timeout: 2000 });

  // Z-index of flipped page should be 51
  let zIndex = await pages.nth(0).evaluate(el => (el as HTMLElement).style.zIndex);
  expect(parseInt(zIndex)).toBe(51);

  // 2. Flip back first page
  await leftSide.click({ force: true });
  await page.waitForTimeout(1100);
  await expect(pages.nth(0)).not.toHaveClass(/flipped/);

  // Z-index of restored page should be original (count-0 = 6 if 6 pages)
  zIndex = await pages.nth(0).evaluate(el => (el as HTMLElement).style.zIndex);
  expect(parseInt(zIndex)).toBe(count);

  // 3. Flip all pages forward
  for (let i = 0; i < count; i++) {
    await rightSide.click({ force: true });
    await expect(pages.nth(i)).toHaveClass(/flipped/, { timeout: 5000 });
    await page.waitForTimeout(1100);
  }

  // All pages should be flipped
  for (let i = 0; i < count; i++) {
    await expect(pages.nth(i)).toHaveClass(/flipped/);
  }

  // Instruction should update correctly
  const instruction = page.locator('#portrait-instruction');
  await expect(instruction).toHaveText(/Click left to flip back or right to close/i);

  // 4. Close book (reset)
  await rightSide.click({ force: true });
  await page.waitForTimeout(1500); // Wait for all pages to flip back

  // All pages should be restored
  for (let i = 0; i < count; i++) {
    await expect(pages.nth(i)).not.toHaveClass(/flipped/);
  }
});
