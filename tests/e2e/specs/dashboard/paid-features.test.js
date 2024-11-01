/**
 * External dependencies
 */
import { expect, test } from '@playwright/test';

/**
 * Internal dependencies
 */
import { clearOnboardedMerchant, setOnboardedMerchant } from '../../utils/api';
import DashboardPage from '../../utils/pages/dashboard.js';

test.use( { storageState: process.env.ADMINSTATE } );

test.describe.configure( { mode: 'serial' } );

/**
 * @type {import('../../utils/pages/dashboard.js').default} dashboardPage
 */
let dashboardPage = null;

/**
 * @type {import('@playwright/test').Page} page
 */
let page = null;

test.describe( 'Paid Feature Listing', () => {
	test.beforeAll( async ( { browser } ) => {
		page = await browser.newPage();
		dashboardPage = new DashboardPage( page );
		await setOnboardedMerchant();
		await dashboardPage.mockRequests();
		await dashboardPage.goto();
	} );

	test.afterAll( async () => {
		await clearOnboardedMerchant();
		await page.close();
	} );

	test( 'Paid Feature Listing is visible if ads campaign setup not complete', async () => {
		await expect( dashboardPage.googleAdsSummaryCard ).toContainText(
			'Google Ads'
		);

		await expect( dashboardPage.paidFeaturesDiv ).toContainText(
			'Reach more customer by advertising your products across Google Ads channels like Search, YouTube and Discover.'
		);

		// FreeAdCredit div content visible.
		await expect( dashboardPage.paidFeaturesDiv ).toContainText(
			'Claim $500 in ads credit when you spend your first $500 with Google Ads.'
		);

		await expect( dashboardPage.createCampaignButton ).toBeEnabled();

		await dashboardPage.createCampaignButton.click();
	} );
} );
