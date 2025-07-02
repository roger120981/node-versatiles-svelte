import { expect, test } from '@playwright/test';
import { checkScreenshot, trackServerRequests, waitForMapIsReady } from './lib/utils.js';

test('default', async ({ page }) => {
	const tracker = await trackServerRequests(page);

	await page.goto('/bbox-map');
	await waitForMapIsReady(page);

	expect(await page.locator('.wrapper').count()).toBe(1);
	expect(await page.locator('.wrapper').boundingBox()).toStrictEqual({
		x: 0,
		y: 0,
		width: 1280,
		height: 720
	});

	expect(tracker()).toStrictEqual([
		'assets/glyphs/noto_sans_regular/0-255.pbf',
		'assets/glyphs/noto_sans_regular/256-511.pbf',
		'assets/glyphs/noto_sans_regular/512-767.pbf',
		'assets/sprites/basics/sprites.json',
		'assets/sprites/basics/sprites.png',
		'tiles/osm/5/15/10',
		'tiles/osm/5/15/11',
		'tiles/osm/5/16/10',
		'tiles/osm/5/16/11',
		'tiles/osm/5/17/10',
		'tiles/osm/5/17/11'
	]);

	expect(await page.locator('.wrapper').ariaSnapshot()).toBe(`- textbox "Find country, region or city …": Germany
- region "Map"
- group:
  - text: ©
  - link "OpenStreetMap":
    - /url: https://www.openstreetmap.org/copyright
  - text: contributors`);
	await checkScreenshot(page, 'default', 3e5);
});

test('initial state', async ({ page }) => {
	const tracker = await trackServerRequests(page);

	await page.goto('/bbox-map#2.52,49.495,6.38,51.497');
	await waitForMapIsReady(page);

	expect(tracker()).toStrictEqual([
		'assets/glyphs/noto_sans_regular/0-255.pbf',
		'assets/sprites/basics/sprites.json',
		'assets/sprites/basics/sprites.png',
		'tiles/osm/7/64/42',
		'tiles/osm/7/64/43',
		'tiles/osm/7/65/42',
		'tiles/osm/7/65/43',
		'tiles/osm/7/66/42',
		'tiles/osm/7/66/43'
	]);
});

test('delayed state', async ({ page }) => {
	const tracker = await trackServerRequests(page);

	await page.goto('/bbox-map');
	await waitForMapIsReady(page);
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	await page.waitForFunction(() => (window as any).setBBox([2.52, 49.495, 6.38, 51.497]));
	await page.waitForTimeout(3000); // wait for the bbox to be set

	expect(tracker()).toStrictEqual([
		'assets/glyphs/noto_sans_regular/0-255.pbf',
		'assets/glyphs/noto_sans_regular/256-511.pbf',
		'assets/glyphs/noto_sans_regular/512-767.pbf',
		'assets/sprites/basics/sprites.json',
		'assets/sprites/basics/sprites.png',
		'tiles/osm/5/15/10',
		'tiles/osm/5/15/11',
		'tiles/osm/5/16/10',
		'tiles/osm/5/16/11',
		'tiles/osm/5/17/10',
		'tiles/osm/5/17/11',
		'tiles/osm/7/64/42',
		'tiles/osm/7/64/43',
		'tiles/osm/7/65/42',
		'tiles/osm/7/65/43',
		'tiles/osm/7/66/42',
		'tiles/osm/7/66/43'
	]);
});
