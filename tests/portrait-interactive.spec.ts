import { test, expect } from '@playwright/test';

test.describe('Portrait Artist Section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4321/');
    // Wait for the portrait section to be visible
    await page.locator('#portraits').scrollIntoViewIfNeeded();
  });

  test('should display fanned cards on desktop', async ({ page, isMobile }) => {
    if (isMobile) return;

    const cards = page.locator('.portrait-card');
    await expect(cards).toHaveCount(4);

    // Check that cards are visible and have different transforms (fanned out)
    const firstCard = cards.first();
    const lastCard = cards.last();

    await expect(firstCard).toBeVisible();
    await expect(lastCard).toBeVisible();

    const firstTransform = await firstCard.evaluate(el => (el as HTMLElement).style.transform);
    const lastTransform = await lastCard.evaluate(el => (el as HTMLElement).style.transform);

    expect(firstTransform).not.toBe(lastTransform);
  });

  test('should enter focused state on card click (desktop)', async ({ page, isMobile }) => {
    if (isMobile) return;

    const firstCard = page.locator('.portrait-card').first();
    await firstCard.click();

    // Container should have is-focused class
    const container = page.locator('#portrait-interactive-container');
    await expect(container).toHaveClass(/is-focused/);

    // Title inside the card should be visible
    const cardTitle = firstCard.locator('span');
    await expect(cardTitle).toBeVisible();
    const titleText = await cardTitle.textContent();
    expect(titleText?.length).toBeGreaterThan(0);

    // Other cards should be visible (opacity 1)
    const otherCard = page.locator('.portrait-card').nth(1);
    await expect(otherCard).toHaveCSS('opacity', '1');
  });

  test('should exit focused state on close button click (desktop)', async ({ page, isMobile }) => {
    if (isMobile) return;

    const firstCard = page.locator('.portrait-card').first();
    await firstCard.click();

    const closeBtn = page.locator('#portrait-close');
    await closeBtn.click();

    const container = page.locator('#portrait-interactive-container');
    await expect(container).not.toHaveClass(/is-focused/);
  });

  test('should show stacked cards on mobile and allow swiping', async ({ page, isMobile }) => {
    if (!isMobile) return;

    const cards = page.locator('.portrait-card');
    const firstCard = cards.first();
    const secondCard = cards.nth(1);

    // Initial state: first card on top (zIndex higher)
    const z1 = await firstCard.evaluate(el => parseInt((el as HTMLElement).style.zIndex));
    const z2 = await secondCard.evaluate(el => parseInt((el as HTMLElement).style.zIndex));
    expect(z1).toBeGreaterThan(z2);

    // Simulate swipe left
    const box = await firstCard.boundingBox();
    if (box) {
        await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
        await page.mouse.down();
        await page.mouse.move(box.x - 100, box.y + box.height / 2, { steps: 5 });
        await page.mouse.up();
    }

    // After swipe, first card should have moved to back (zIndex lower)
    // Wait for transition
    await page.waitForTimeout(600);

    const z1After = await firstCard.evaluate(el => parseInt((el as HTMLElement).style.zIndex));
    const z2After = await secondCard.evaluate(el => parseInt((el as HTMLElement).style.zIndex));
    expect(z1After).toBeLessThan(z2After);
  });
});
