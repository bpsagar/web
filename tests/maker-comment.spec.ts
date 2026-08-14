import { test, expect } from '@playwright/test';

test('Maker section content and comment', async ({ page }) => {
  await page.goto('http://localhost:4321/');

  // Check for the description content (which is inline and visible)
  await expect(page.getByText('These are the results of my nights and weekends.')).toBeVisible();
  await expect(page.getByText('Some are for profit, some are for free')).toBeVisible();

  // Check for the comment trigger
  const trigger = page.locator('span[data-comment*="Kavya"]');
  await expect(trigger).toBeVisible();
  await expect(trigger).toHaveText('we');

  // Click the trigger and check if comment appears
  await trigger.click();
  const commentBody = page.locator('.page-comment-body');
  await expect(commentBody).toBeVisible();
  await expect(commentBody).toContainText('Kavya (my wife) and I worked on many of these projects together.');

  // Close the comment drawer so it does not intercept our subsequent dock interaction
  const closeBtn = page.locator('.page-comment-close');
  await expect(closeBtn).toBeVisible();
  await closeBtn.click();
  await page.waitForTimeout(400); // Wait for comment hide transition

  // Scroll to maker section to trigger dock
  const makerSection = page.locator('#maker-section');
  await makerSection.scrollIntoViewIfNeeded();

  // Click on the browser dock icon to open the browser modal
  const dockBrowserBtn = page.locator('#dock-browser-btn');
  await expect(dockBrowserBtn).toBeVisible();
  await dockBrowserBtn.click({ force: true });

  // Verify browser modal is visible
  const browserModal = page.locator('#browser-modal');
  await expect(browserModal).toBeVisible();

  // Click a tab and verify it updates the browser view
  const secondTab = browserModal.locator('.browser-tab').nth(1);
  await secondTab.click({ force: true });
});
