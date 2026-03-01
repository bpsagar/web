import { test, expect } from '@playwright/test';

test('Career terminal interaction and formatting', async ({ page }) => {
  await page.goto('http://localhost:4321/');

  // Wait for terminal to be visible
  const terminal = page.locator('.terminal-container');
  await expect(terminal).toBeVisible();

  // Find the first role option
  const firstRole = page.locator('.role-option').first();
  const roleText = await firstRole.textContent();

  // Click the first role
  await firstRole.click();

  // Wait for the detail container to appear
  const detailContainer = terminal.locator('.mt-4.space-y-1');
  await expect(detailContainer).toBeVisible();

  // Check that indentation (pl-4, border-l, ml-2) is NOT present
  const containerClass = await detailContainer.getAttribute('class');
  expect(containerClass).not.toContain('pl-4');
  expect(containerClass).not.toContain('border-l');
  expect(containerClass).not.toContain('ml-2');

  // Check the first line (Period • Location)
  const periodLine = detailContainer.locator('div').nth(0);
  const periodSpan = periodLine.locator('span');
  await expect(periodSpan).toHaveClass(/text-\[#abb2bf\]/);
  await expect(periodSpan).toHaveClass(/italic/);
  // Need to wait longer for typing to finish or use a longer timeout
  await expect(periodSpan).toContainText('•', { timeout: 10000 });

  // Check the second line (Description)
  const roleLine = detailContainer.locator('div').nth(1);
  await expect(roleLine).toHaveClass(/text-white/);
  await page.waitForTimeout(2000); // Wait for typing animation
  const roleContent = await roleLine.textContent();
  expect(roleContent).not.toContain('Role:');
  expect(roleContent).not.toContain('○');

  // Check the third line (Stack)
  const stackLine = detailContainer.locator('div').nth(2);
  const stackPrefix = stackLine.locator('span').first();
  await expect(stackPrefix).toHaveText(/⚡ Stack:/);
  await expect(stackPrefix).toHaveClass(/text-\[#e5c07b\]/);

  // Check for fade-out of previous content (the menu)
  const previousMenu = terminal.locator('.wizard-menu');
  await expect(previousMenu).toHaveClass(/opacity-50/);
  await expect(previousMenu).toHaveClass(/-translate-y-2/);
});
