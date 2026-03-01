import { test, expect } from '@playwright/test';

test('Maker section browser UI exists', async ({ page }) => {
  await page.goto('http://localhost:4321');

  // Check for browser container
  const browserContainer = page.locator('#browser-container');
  await expect(browserContainer).toBeVisible();

  // Check for traffic lights
  const trafficLights = page.locator('.bg-\\[\\#ff5f57\\]'); // Red light
  await expect(trafficLights).toBeVisible();

  // Check for tabs
  const tabs = page.locator('.browser-tab');
  const tabCount = await tabs.count();
  expect(tabCount).toBeGreaterThan(0);

  // Check for URL bar
  const urlBar = page.locator('#browser-url-bar');
  await expect(urlBar).toBeVisible();
  const urlText = await page.locator('#browser-url-text').innerText();
  expect(urlText).toContain('story.cv');
});

test('Maker section tab switching', async ({ page }) => {
  await page.goto('http://localhost:4321');

  const tabs = page.locator('.browser-tab');
  const secondTab = tabs.nth(1);
  const appId = await secondTab.getAttribute('data-app-id');

  await secondTab.click();

  // Check if second content is visible
  const secondContent = page.locator(`.app-content[id="content-${appId}"]`);
  await expect(secondContent).toBeVisible();

  // Check if URL bar updated
  const urlText = await page.locator('#browser-url-text').innerText();
  expect(urlText).not.toContain('story.cv');
});

test('Maker section desktop bleed effect', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:4321');

  const browserContainer = page.locator('#browser-container');
  const box = await browserContainer.boundingBox();

  // The container should extend to the right edge (or close to it due to margin calculation)
  // On 1440px width, max-width 500px centered means 470px padding on each side.
  // md:-mr-[calc(50vw-226px)] = 720 - 226 = 494px negative margin.
  // 500 + 494 = 994px wide approximately.

  expect(box.width).toBeGreaterThan(900);
});
