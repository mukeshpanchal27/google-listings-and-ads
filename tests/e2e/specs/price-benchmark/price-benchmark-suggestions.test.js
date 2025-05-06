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
				'New price must be greater than the sales price (NT$90.00).'
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

	test.describe( 'Price Benchmark Suggestions Banner', () => {
		test( 'Shows the banner when the user is not onboarded', async () => {
			await priceBenchmarkPage.fulfillPriceBenchmarkSuggestions( [
				...priceBenchmarkSuggestionsData,
			] );

			const banner = page.locator(
				'.gla-price-benchmark-suggestions-banner'
			);

			await expect( banner ).toBeVisible();

			const title = banner.locator(
				'.gla-price-benchmark-suggestions-banner__text h3'
			);
			await expect( title ).toContainText(
				'Price Benchmark & Suggestions'
			);
		} );

		test( 'Hides the banner when dismissed', async () => {
			await priceBenchmarkPage.fulfillUsersPreferences();
			await priceBenchmarkPage.fulfillPriceBenchmarkSuggestions( [
				...priceBenchmarkSuggestionsData,
			] );

			const banner = page.locator(
				'.gla-price-benchmark-suggestions-banner'
			);
			const dismissButton = banner.locator(
				'button:has-text("Dismiss")'
			);

			await dismissButton.click();

			await expect( banner ).not.toBeVisible();
		} );
	} );

	test.describe.only( 'Price Benchmark Suggestions Functionality', () => {
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

		test( 'Shows empty state notice when Market Insights is not enabled for the account.', async () => {
			await priceBenchmarkPage.fulfillPriceBenchmarkSuggestions(
				{
					message: {
						error: {
							code: 403,
							message:
								'Market Insights not enabled for account 5330359695. For more information check https://support.google.com/merchants/answer/9625913',
							errors: [
								{
									message:
										'Market Insights not enabled for account 5330359695. For more information check https://support.google.com/merchants/answer/9625913',
									domain: 'global',
									reason: 'forbidden',
								},
							],
							status: 'PERMISSION_DENIED',
							details: [
								{
									'@type':
										'type.googleapis.com/google.rpc.ErrorInfo',
									reason: 'forbidden',
									domain: 'global',
								},
							],
						},
					},
				},
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

		test( 'Displays error message when data view fails to load', async () => {
			await priceBenchmarkPage.fulfillPriceBenchmarkSuggestions( [] );
			await priceBenchmarkPage.fulfillDataViewScript( {}, 500 );

			const errorMessage = page.locator(
				'.gla-price-benchmark__error-message'
			);
			await expect( errorMessage ).toBeVisible();
			await expect( errorMessage ).toContainText(
				'There was an error loading the price benchmark suggestions.'
			);
		} );
	} );
} );
