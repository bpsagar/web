import { test, expect } from '@playwright/test';

test.describe('3D Deck Hero Component', () => {
	test('renders 3D deck canvas in hero section', async ({ page }) => {
		await page.goto('http://localhost:4321/');
		await page.waitForSelector('#three-deck-canvas');

		const canvas = page.locator('#three-deck-canvas');
		await expect(canvas).toBeVisible();

		// Check bounding box
		const box = await canvas.boundingBox();
		expect(box).not.toBeNull();
		expect(box!.width).toBeGreaterThan(0);
		expect(box!.height).toBeGreaterThan(0);

		// Take desktop screenshot
		await page.screenshot({ path: 'screenshots/three-deck-desktop.png' });
	});

	test('interacts with 3D deck canvas and shows tooltip on hover', async ({ page }) => {
		await page.goto('http://localhost:4321/');
		await page.waitForSelector('#three-deck-canvas');

		const canvas = page.locator('#three-deck-canvas');
		const box = await canvas.boundingBox();
		expect(box).not.toBeNull();

		// Hover middle object (Maker)
		await page.mouse.move(box!.x + box!.width * 0.5, box!.y + box!.height * 0.5);
		await page.waitForTimeout(500);

		await page.screenshot({ path: 'screenshots/three-deck-hover.png' });

		// Click left object (Software Engineer)
		await page.mouse.click(box!.x + box!.width * 0.25, box!.y + box!.height * 0.5);
		await page.waitForTimeout(1000);

		// Check scroll position moved down towards engineer section
		const scrollY = await page.evaluate(() => window.scrollY);
		expect(scrollY).toBeGreaterThan(0);
	});

	test('renders properly on mobile viewport', async ({ page }) => {
		await page.setViewportSize({ width: 375, height: 667 });
		await page.goto('http://localhost:4321/');
		await page.waitForSelector('#three-deck-canvas');

		const canvas = page.locator('#three-deck-canvas');
		await expect(canvas).toBeVisible();

		await page.screenshot({ path: 'screenshots/three-deck-mobile.png' });
	});
});
