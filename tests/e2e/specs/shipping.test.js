/**
 * External dependencies
 */
import { expect, test } from '@playwright/test';

/**
 * Internal dependencies
 */
import { clearOnboardedMerchant, setOnboardedMerchant } from '../utils/api';
import { checkSnackBarMessage } from '../utils/page';
import ShippingPage from '../utils/pages/shipping';

test.use( { storageState: process.env.ADMINSTATE } );

test.describe.configure( { mode: 'serial' } );

/**
 * @type {import('../../utils/pages/shipping.js').default} shippingPage
 */
let shippingPage = null;

/**
 * @type {import('@playwright/test').Page} page
 */
let page = null;

test.describe( 'Shipping', () => {
	test.beforeAll( async ( { browser } ) => {
		page = await browser.newPage();
		shippingPage = new ShippingPage( page );

		await setOnboardedMerchant();
		await shippingPage.mockRequests();
		await shippingPage.goto();
	} );

	test.afterAll( async () => {
		await clearOnboardedMerchant();
		await page.close();
	} );

	test.skip( 'Should show confirmation modal before saving', async () => {
		// TODO: This test case will be completed in a subsequent PR
		await shippingPage.clickSaveChanges();
	} );

	test( 'Check recommended shipping settings', async () => {
		await shippingPage.checkRecommendShippingSettings();
		await shippingPage.fillCountriesShippingTimeInput( '5', '10' );
		const saveChangesButton = await shippingPage.getSaveChangesButton();
		await expect( saveChangesButton ).toBeEnabled();
	} );

	test( 'Save changes', async () => {
		const awaitForRequests = shippingPage.registerSavingRequests();
		await shippingPage.clickSaveChanges();
		const requests = await awaitForRequests;
		const settingsResponse = await (
			await requests[ 0 ].response()
		).json();

		expect( settingsResponse.status ).toBe( 'success' );
		expect( settingsResponse.message ).toBe(
			'Merchant Center Settings successfully updated.'
		);
		expect( settingsResponse.data.shipping_time ).toBe( 'flat' );

		await checkSnackBarMessage(
			page,
			'Your changes have been saved and will be synced to your Google Merchant Center account.'
		);
	} );
} );
