/**
 * External dependencies
 */
import { expect, test } from '@playwright/test';

/**
 * Internal dependencies
 */
import { clearOnboardedMerchant } from '../../utils/api';
import priceBenchmarkSuggestionsData from '../../utils/__fixtures__/price-benchmark-suggestions.json';
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
		await priceBenchmarkPage.goto();
	} );

	test.afterAll( async () => {
		await clearOnboardedMerchant();
		await page.close();
	} );

	test.describe( 'Has navigation', () => {
		// Corrected: Added a function here
		test( 'Goes to the Price Benchmark page', async () => {
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

		test( 'Click on "Price Adjustments" should update the URL', async () => {
			const priceAdjustmentsTab = page.locator(
				'a[role="tab"]:has-text("Price Adjustments")'
			);
			await priceAdjustmentsTab.click();

			await expect( page ).toHaveURL(
				'/wp-admin/admin.php?page=wc-admin&tableType=adjustments&path=%2Fgoogle%2Fprice-benchmark'
			);
		} );

		test( 'Click on "Price Benchmark & Suggestions" should update the URL', async () => {
			const priceBenchmarkTab = page.locator(
				'a[role="tab"]:has-text("Price Benchmark & Suggestions")'
			);
			await priceBenchmarkTab.click();

			await expect( page ).toHaveURL(
				'/wp-admin/admin.php?page=wc-admin&tableType=suggestions&path=%2Fgoogle%2Fprice-benchmark'
			);
		} );

		test( 'Visiting the adjustments URL should show the "Price Adjustments" tab by default', async () => {
			await priceBenchmarkPage.goto(
				'/wp-admin/admin.php?page=wc-admin&tableType=adjustments&path=%2Fgoogle%2Fprice-benchmark'
			);

			const priceAdjustmentsTab = page.locator(
				'a[role="tab"]:has-text("Price Adjustments")'
			);
			await expect( priceAdjustmentsTab ).toHaveAttribute(
				'aria-selected',
				'true'
			);
		} );
	} );

	test.describe( 'Price Benchmark Suggestions Functionality', () => {
		test.beforeEach( async () => {
			await priceBenchmarkPage.goto();
		} );

		test( 'Shows no results if there is no data', async () => {
			await priceBenchmarkPage.fulfillPriceBenchmarkSuggestions( [] );

			const emptyStateNotice = page.locator(
				'.gla-price-benchmark__empty-metrics'
			);

			await expect( emptyStateNotice ).toBeVisible();
			await expect( emptyStateNotice ).toContainText(
				'You do not have any sale price suggestions at this moment.'
			);
			await expect( emptyStateNotice ).toContainText(
				'Find out if you meet all eligibility criteria to receive suggestions in the future.'
			);
		} );

		test.only( 'Shows empty state notice when Market Insights is not enabled for the account.', async () => {
			await priceBenchmarkPage.fulfillPriceBenchmarkSuggestions(
				[],
				403
			);
			const emptyStateNotice = page.locator(
				'.gla-price-benchmark__empty-metrics'
			);
			await expect( emptyStateNotice ).toBeVisible();
			await expect( emptyStateNotice ).toContainText(
				'You do not have any sale price suggestions at this moment.'
			);
			await expect( emptyStateNotice ).toContainText(
				'Find out if you meet all eligibility criteria to receive suggestions in the future.'
			);
		} );

		test( 'Shows 10 results per page by default', async () => {
			await priceBenchmarkPage.fulfillPriceBenchmarkSuggestions( [
				...priceBenchmarkSuggestionsData,
			] );

			const tableRows = page.locator( 'table tbody tr' );
			await expect( tableRows ).toHaveCount( 10 );
		} );

		test( 'Navigates to the next page and shows 5 results', async () => {
			priceBenchmarkPage.fulfillPriceBenchmarkSuggestions( [
				...priceBenchmarkSuggestionsData,
			] );

			const nextPageButton = page.locator( '[aria-label="Next page"]' );
			await nextPageButton.click();

			// Ensure the table displays 5 rows on the second page
			const tableRows = page.locator( 'table tbody tr' );
			await expect( tableRows ).toHaveCount( 5 );
		} );

		test( 'Displays the product and action columns only in the table when screen is resized to 400px', async () => {
			await priceBenchmarkPage.fulfillPriceBenchmarkSuggestions( [
				...priceBenchmarkSuggestionsData,
			] );

			await page.setViewportSize( { width: 400, height: 800 } );

			const tableHeaderColumns = page.locator( 'table thead tr th' );
			await expect( tableHeaderColumns ).toHaveCount( 2 );

			await expect( tableHeaderColumns.nth( 0 ) ).toHaveText( 'Product' );
			await expect( tableHeaderColumns.nth( 1 ) ).toHaveText( 'Action' );
		} );
	} );
} );
