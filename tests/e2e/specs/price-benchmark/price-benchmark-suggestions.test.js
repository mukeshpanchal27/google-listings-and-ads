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
	} );

	test.afterAll( async () => {
		await clearOnboardedMerchant();
		await page.close();
	} );

	test.describe( 'Has navigation', () => {
		test( 'Goes to the Price Benchmark page', async () => {
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

		test( 'Click on "Price Adjustments" should update the URL', async () => {
			await priceBenchmarkPage.goto();

			const priceAdjustmentsTab = page.locator(
				'a[role="tab"]:has-text("Price Adjustments")'
			);
			await priceAdjustmentsTab.click();

			await expect( page ).toHaveURL(
				'/wp-admin/admin.php?page=wc-admin&tableType=adjustments&path=%2Fgoogle%2Fprice-benchmark'
			);
		} );

		test( 'Click on "Price Benchmark & Suggestions" should update the URL', async () => {
			await priceBenchmarkPage.goto();

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
		test( 'Shows no results if there is no data', async () => {
			await priceBenchmarkPage.goto();

			await priceBenchmarkPage.fulfillPriceBenchmarkSuggestions( [] );

			await expect( page.getByText( 'No results' ) ).toBeVisible();
		} );

		test( 'Shows 10 results per page by default', async () => {
			await priceBenchmarkPage.goto();

			await priceBenchmarkPage.fulfillPriceBenchmarkSuggestions( [
				...priceBenchmarkSuggestionsData,
			] );

			const tableRows = page.locator( 'table tbody tr' );
			await expect( tableRows ).toHaveCount( 10 );
		} );

		test( 'Navigates to the next page and shows 5 results', async () => {
			const nextPageButton = page.locator( '[aria-label="Next page"]' );
			await nextPageButton.click();

			// Ensure the table displays 5 rows on the second page
			const tableRows = page.locator( 'table tbody tr' );
			await expect( tableRows ).toHaveCount( 5 );
		} );

		test( 'Displays the product and action columns only in the table when screen is resized to 400px', async () => {
			await page.setViewportSize( { width: 400, height: 800 } );

			const tableHeaderColumns = page.locator( 'table thead tr th' );
			await expect( tableHeaderColumns ).toHaveCount( 2 );

			await expect( tableHeaderColumns.nth( 0 ) ).toHaveText( 'Product' );
			await expect( tableHeaderColumns.nth( 1 ) ).toHaveText( 'Action' );

			await page.setViewportSize( { width: 1280, height: 720 } );
		} );
	} );

	test.describe( 'Change Price Modal Functionality', () => {
		test( 'Clicking "Change Price" link renders the modal', async () => {
			await priceBenchmarkPage.goto();

			await priceBenchmarkPage.fulfillPriceBenchmarkSuggestions( [
				...priceBenchmarkSuggestionsData,
			] );

			await priceBenchmarkPage.fulfillWCProduct(
				{
					regular_price: '100.00',
					sale_price: '90.00',
				},
				[ 'GET' ]
			);

			const changePriceLink =
				await priceBenchmarkPage.getFirstProductChangePriceLink();
			await changePriceLink.click();

			const changePriceModal =
				await priceBenchmarkPage.getChangePriceModal();
			await expect( changePriceModal ).toBeVisible();
		} );

		test( 'Clicking the close button closes the modal', async () => {
			const closeButton = await priceBenchmarkPage.getCloseModalButton();
			await closeButton.click();

			const changePriceModal =
				await priceBenchmarkPage.getChangePriceModal();
			await expect( changePriceModal ).not.toBeVisible();
		} );

		test( 'Displays error message when user inputs a negative price', async () => {
			// Open the modal again
			const changePriceLink =
				await priceBenchmarkPage.getFirstProductChangePriceLink();
			await changePriceLink.click();

			const priceInput = await priceBenchmarkPage.getPriceInputModal();
			await priceInput.fill( '-5' );
			await priceInput.blur();

			const error = priceBenchmarkPage.getPriceInputError();
			await expect( error ).toHaveText(
				'New price must be greater than or equals to zero.'
			);

			const changePriceButton =
				await priceBenchmarkPage.getChangePriceModalButton();
			await expect( changePriceButton ).toBeDisabled();
		} );

		test( 'Displays error message when user inputs a price lower than the sale price', async () => {
			const priceInput = await priceBenchmarkPage.getPriceInputModal();
			await priceInput.fill( '80' );
			await priceInput.blur();

			const error = priceBenchmarkPage.getPriceInputError();
			await expect( error ).toHaveText(
				'New price must be greater than the sale price (NT$90.00).'
			);

			const changePriceButton =
				await priceBenchmarkPage.getChangePriceModalButton();
			await expect( changePriceButton ).toBeDisabled();
		} );

		test( 'Clicking "Change Price" button with a valid price closes the modal and updates the table', async () => {
			await priceBenchmarkPage.goto();

			await priceBenchmarkPage.fulfillPriceBenchmarkSuggestions( [
				...priceBenchmarkSuggestionsData,
			] );

			await priceBenchmarkPage.fulfillWCProduct(
				{
					regular_price: '100.00',
					sale_price: '90.00',
				},
				[ 'GET' ]
			);

			await priceBenchmarkPage.fulfillWCProduct(
				{
					regular_price: '120.00',
				},
				[ 'POST' ]
			);

			const changePriceLink =
				await priceBenchmarkPage.getFirstProductChangePriceLink();
			await changePriceLink.click();

			const priceInput = await priceBenchmarkPage.getPriceInputModal();
			await priceInput.fill( '120' );
			priceInput.blur();

			const error = priceBenchmarkPage.getPriceInputError();
			await expect( error ).not.toBeVisible();

			const changePriceButton =
				await priceBenchmarkPage.getChangePriceModalButton();
			await expect( changePriceButton ).toBeEnabled();
			await changePriceButton.click();

			const changePriceModal =
				await priceBenchmarkPage.getChangePriceModal();
			await expect( changePriceModal ).not.toBeVisible();

			const firstProductCells = await priceBenchmarkPage
				.getFirstProductRow()
				.locator( 'td' );
			await expect( firstProductCells.nth( 2 ) ).toHaveText(
				'NT$120.00'
			);
		} );
	} );
} );
