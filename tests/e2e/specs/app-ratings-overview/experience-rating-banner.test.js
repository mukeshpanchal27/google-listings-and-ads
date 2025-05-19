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
		const bannerClass = '.gla-experience-rating-banner';

		test.beforeAll( async () => {
			await page.waitForSelector( '.gla-dashboard', {
				state: 'visible',
			} );
		} );

		test( 'Banner visibility on dashboard tab', async () => {
			await page.waitForSelector( '.gla-dashboard', {
				state: 'visible',
			} );

			const banner = page.locator( bannerClass );
			await expect( banner ).toBeVisible();
		} );

		test( 'Banner visibility on product feed tab', async () => {
			await appRatingsOverview.goto(
				'/wp-admin/admin.php?page=wc-admin&path=%2Fgoogle%2Fproduct-feed'
			);
			await page.waitForSelector( '.gla-product-feed', {
				state: 'visible',
			} );

			const banner = page.locator( bannerClass );
			await expect( banner ).toBeVisible();
		} );

		test( 'Banner has action buttons', async () => {
			const banner = page.locator( bannerClass );
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
			const banner = page.locator( bannerClass );
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

			const banner = page.locator( bannerClass );
			const dismissButton = banner.getByRole( 'button', {
				name: 'Close',
			} );

			await dismissButton.click();

			await expect( banner ).not.toBeVisible();
		} );

		test( 'Banner is not visible after reload once dismissed', async () => {
			await appRatingsOverview.goto();

			const banner = page.locator( bannerClass );
			await expect( banner ).not.toBeVisible();
		} );
	} );
} );
