import { test, expect } from '@playwright/test';

test('verify software engineer description', async ({ page }) => {
  await page.goto('http://localhost:4321/');

  // Find the header for "a software engineer" - be more specific to avoid multiple matches
  const sectionHeader = page.locator('div.flex.items-center.font-host').filter({ hasText: 'a software engineer' });
  await expect(sectionHeader).toBeVisible();

  // Find the description div following the header in the software engineer section
  const section = page.locator('section').filter({ has: page.locator('div.flex.items-center.font-host:has-text("a software engineer")') });
  const description = section.locator('div.font-plus.text-zinc-400.text-2xl');

  await expect(description).toContainText('Deployed to production since 2014');
  await expect(description).toContainText('maintaining 99% uptime');
  await expect(description).toContainText('force pushing features');

  // Check for the hr
  await expect(description.locator('hr.border-zinc-100')).toBeVisible();
});
