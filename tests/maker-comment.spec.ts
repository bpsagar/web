import { test, expect } from '@playwright/test';

test('Maker section content and comment', async ({ page }) => {
  await page.goto('http://localhost:4321/');

  // Check for the new content
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
});
