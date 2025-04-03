/**
 * External dependencies
 */
import { expect, test } from '@playwright/test';

/**
 * Internal dependencies
 */
import { clearOnboardedMerchant } from '../../utils/api';
import PriceBenchmarkPage from '../../utils/pages/price-benchmark';

test.use( { storageState: process.env.ADMINSTATE } );

test.describe.configure( { mode: 'serial' } );

/**
 * @type {import('../../utils/pages/price-benchmark').default} priceBenchmarkPage
 */
let priceBenchmarkPage = null;

/**
 * @type {import('@playwright/test').Page} page
 */
let page = null;

test.describe( 'Price Benchmark Page', () => {
	test.beforeAll( async ( { browser } ) => {
		page = await browser.newPage();
		priceBenchmarkPage = new PriceBenchmarkPage( page );
		await Promise.all( [ priceBenchmarkPage.mockRequests() ] );
	} );

	test.afterAll( async () => {
		await clearOnboardedMerchant();
		await page.close();
	} );

	test.describe( 'Has navigation', () => {
		// Corrected: Added a function here
		test( 'Goes to the Price Benchmark page', async () => {
			// Added a test case
			await priceBenchmarkPage.goto();

			const expectedTabs = [
				'Price Benchmark & Suggestions',
				'Price Adjustments',
			];

			for ( const tabText of expectedTabs ) {
				const tabLocator = page.locator(
					`a[role="tab"]:has-text("${ tabText }")`
				);
				await expect( tabLocator ).toBeVisible();
			}
		} );
	} );
} );
