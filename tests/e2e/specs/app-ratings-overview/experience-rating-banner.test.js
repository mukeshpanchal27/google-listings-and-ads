/**
 * External dependencies
 */
import { expect, test } from '@playwright/test';

/**
 * Internal dependencies
 */
import { clearOnboardedMerchant, setOnboardedMerchant } from '../../utils/api';
import AppRatingsOverview from '../../utils/app-ratings-overview';

test.use( { storageState: process.env.ADMINSTATE } );

test.describe.configure( { mode: 'serial' } );

/**
 * @type {import('../../utils/app-ratings-overview').default} appRatingsOverview
 */
let appRatingsOverview = null;

/**
 * @type {import('@playwright/test').Page} page
 */
let page = null;
const BANNER_CLASS = '.gla-experience-rating-banner';

test.describe( 'App Ratings Banner', () => {
	test.beforeAll( async ( { browser } ) => {
		page = await browser.newPage();
		appRatingsOverview = new AppRatingsOverview( page );
		await Promise.all( [
			appRatingsOverview.mockRequests(),
			setOnboardedMerchant(),
		] );
		await appRatingsOverview.goto();
	} );

	test.afterAll( async () => {
		await clearOnboardedMerchant();
		await page.close();
	} );

	test.describe( 'Banner is visible across all tabs', () => {
		test.beforeAll( async () => {
			await page.waitForSelector( '.gla-dashboard', {
				state: 'visible',
			} );
		} );

		test( 'Banner visibility on dashboard tab', async () => {
			await page.waitForSelector( '.gla-dashboard', {
				state: 'visible',
			} );

			const banner = page.locator( BANNER_CLASS );
			await expect( banner ).toBeVisible();
		} );

		test( 'Banner visibility on product feed tab', async () => {
			await appRatingsOverview.goto(
				'/wp-admin/admin.php?page=wc-admin&path=%2Fgoogle%2Fproduct-feed'
			);
			await page.waitForSelector( '.gla-product-feed', {
				state: 'visible',
			} );

			const banner = page.locator( BANNER_CLASS );
			await expect( banner ).toBeVisible();
		} );

		test( 'Banner has action buttons', async () => {
			const banner = page.locator( BANNER_CLASS );
			const goodButton = banner.getByRole( 'button', {
				name: 'Good',
			} );
			const needHelpButton = banner.getByRole( 'link', {
				name: 'Need help',
			} );

			await expect( goodButton ).toBeVisible();
			await expect( needHelpButton ).toBeVisible();
		} );

		test( 'Need help button opens external link', async () => {
			const banner = page.locator( BANNER_CLASS );
			const needHelpButton = banner.getByRole( 'link', {
				name: 'Need help',
			} );

			await expect( needHelpButton ).toHaveAttribute(
				'href',
				'https://woocommerce.com'
			);
			await expect( needHelpButton ).toHaveAttribute(
				'target',
				'_blank'
			);
		} );

		test( 'Hides the banner when dismissed', async () => {
			await appRatingsOverview.fulfillUsersPreferences();

			const banner = page.locator( BANNER_CLASS );
			const dismissButton = banner.getByRole( 'button', {
				name: 'Close',
			} );

			await dismissButton.click();

			await expect( banner ).not.toBeVisible();
		} );

		test( 'Banner is not visible after reload once dismissed', async () => {
			await page.reload();

			const banner = page.locator( BANNER_CLASS );
			await expect( banner ).not.toBeVisible();
		} );
	} );

	test.describe( 'Banner not displayed when criteria is not met', () => {
		test( 'Banner should not be visible if approved percentage is less than 70%', async () => {
			appRatingsOverview.fulfillProductStatisticsRequest( {
				timestamp: 1678886400,
				statistics: {
					active: 30,
					expiring: 75,
					pending: 200,
					disapproved: 30,
					not_synced: 0,
				},
				scheduled_sync: 5,
				loading: false,
				error: null,
			} );

			await appRatingsOverview.goto();
			await page.waitForSelector( '.gla-dashboard', {
				state: 'visible',
			} );
			const banner = page.locator( '.gla-experience-rating-banner' );
			await expect( banner ).not.toBeVisible();
		} );

		test( 'Banner should not be visible if not all products are synced', async () => {
			appRatingsOverview.fulfillProductStatisticsRequest( {
				timestamp: 1678886400,
				statistics: {
					active: 100,
					expiring: 0,
					pending: 0,
					disapproved: 0,
					not_synced: 10,
				},
				scheduled_sync: 5,
				loading: false,
				error: null,
			} );

			await appRatingsOverview.goto();
			await page.waitForSelector( '.gla-dashboard', {
				state: 'visible',
			} );
			const banner = page.locator( '.gla-experience-rating-banner' );
			await expect( banner ).not.toBeVisible();
		} );

		test( 'Banner should not be visible if no conversions are recorded', async () => {
			appRatingsOverview.fulfillProductStatisticsRequest( {
				timestamp: 1678886400,
				statistics: {
					active: 100,
					expiring: 0,
					pending: 0,
					disapproved: 0,
					not_synced: 0,
				},
				scheduled_sync: 5,
				loading: false,
				error: null,
			} );

			appRatingsOverview.fulfillProductsReport( {
				totals: { conversions: { value: 0 } },
			} );

			await appRatingsOverview.goto();
			await page.waitForSelector( '.gla-dashboard', {
				state: 'visible',
			} );
			const banner = page.locator( '.gla-experience-rating-banner' );
			await expect( banner ).not.toBeVisible();
		} );

		test( 'Banner should not be visible if Merchant Center account is not ready', async () => {
			appRatingsOverview.mockMCIncomplete();

			await appRatingsOverview.goto();
			await page.waitForSelector( '.gla-dashboard', {
				state: 'visible',
			} );
			const banner = page.locator( '.gla-experience-rating-banner' );
			await expect( banner ).not.toBeVisible();
		} );
	} );
} );
