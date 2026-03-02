import { test, expect } from '@playwright/test';

test('Career terminal interaction and formatting', async ({ page }) => {
  await page.goto('http://localhost:4321/');

  // Wait for terminal to be visible
  const terminal = page.locator('.terminal-container');
  await expect(terminal).toBeVisible();

  // Find the first company option (should be Funding Societies v3.x)
  const firstRole = page.locator('.role-option').first();
  const roleText = await firstRole.textContent();
  expect(roleText).toContain('v3.x: Funding Societies');

  // Click the first company (Funding Societies)
  await firstRole.click();

  // Wait for the role sub-menu to appear
  const roleMenu = terminal.locator('.role-menu');
  await expect(roleMenu).toBeVisible();

  // Find and click the first role in the sub-menu (it depends on sorting)
  // Based on test failure, it seems v3.2 is first.
  const firstSubRole = roleMenu.locator('.role-sub-option').first();
  const subRoleText = await firstSubRole.textContent();

  await firstSubRole.click();

  // Wait for the detail container to appear
  // Note: detailContainer is now created inside displayRoleDetails
  const detailContainer = terminal.locator('.mt-4.space-y-1').first();
  await expect(detailContainer).toBeVisible();

  // Check the title line (Version: Role)
  const titleLine = detailContainer.locator('div').nth(0);
  await expect(titleLine).toHaveClass(/text-white/);
  await expect(titleLine).toHaveClass(/font-bold/);
  // Match whatever was in the first sub-role option (excluding the bullet)
  const expectedTitle = subRoleText?.replace('●', '').trim();
  await expect(titleLine).toContainText(expectedTitle!, { timeout: 10000 });

  // Check the first line (Period • Location)
  const periodLine = detailContainer.locator('div').nth(1);
  const periodSpan = periodLine.locator('span');
  await expect(periodSpan).toHaveClass(/text-\[#abb2bf\]/);
  await expect(periodSpan).toHaveClass(/italic/);
  await expect(periodSpan).toContainText('•', { timeout: 10000 });

  // Check the second line (Description)
  const roleLine = detailContainer.locator('div').nth(2);
  await expect(roleLine).toHaveClass(/text-white/);
  await page.waitForTimeout(2000); // Wait for typing animation
  const roleContent = await roleLine.textContent();
  expect(roleContent).not.toContain('Role:');

  // Check the third line (Stack)
  const stackLine = detailContainer.locator('div').nth(3);
  const stackPrefix = stackLine.locator('span').first();
  await expect(stackPrefix).toHaveText(/⚡ Stack:/);
  await expect(stackPrefix).toHaveClass(/text-\[#e5c07b\]/);

  // Check for horizontal rule
  const hrLine = detailContainer.locator('div').nth(4);
  await expect(hrLine).toContainText('---');

  // Check for fade-out of previous content (the company menu)
  const previousMenu = terminal.locator('.wizard-menu');
  await expect(previousMenu).toHaveClass(/-translate-y-2/);
  const question = previousMenu.locator('.text-white');
  await expect(question).toHaveClass(/opacity-50/);

  // Check for fade-out of role menu
  await expect(roleMenu).toHaveClass(/-translate-y-2/);
  const roleQuestion = roleMenu.locator('.text-white');
  await expect(roleQuestion).toHaveClass(/opacity-50/);
});
