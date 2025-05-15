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
	} );

	test.describe( 'Feedback modal', () => {
		const feedbackModalClass = '.gla-experience-rating-feedback-modal';

		test.beforeAll( async () => {
			appRatingsOverview.clickGoodButton();
		} );

		test( 'Feedback modal is visible', async () => {
			const feedbackModal = page.locator( feedbackModalClass );
			await expect( feedbackModal ).toBeVisible();
		} );

		test( 'Feedback modal has action buttons', async () => {
			const feedbackModal = page.locator( feedbackModalClass );
			const cancelButton = feedbackModal.getByRole( 'button', {
				name: 'Cancel',
			} );
			const rateUsButton = feedbackModal.getByRole( 'link', {
				name: 'Rate us',
			} );

			await expect( cancelButton ).toBeVisible();
			await expect( rateUsButton ).toBeVisible();
		} );

		test( 'Rate us button opens external link', async () => {
			const feedbackModal = page.locator( feedbackModalClass );
			const rateUsButton = feedbackModal.getByRole( 'link', {
				name: 'Rate us',
			} );

			await expect( rateUsButton ).toHaveAttribute(
				'href',
				'https://wordpress.org/support/plugin/google-listings-and-ads/reviews/#new-post'
			);
			await expect( rateUsButton ).toHaveAttribute( 'target', '_blank' );
		} );

		test( 'Cancel button closes the modal', async () => {
			const feedbackModal = page.locator( feedbackModalClass );
			const cancelButton = feedbackModal.getByRole( 'button', {
				name: 'Cancel',
			} );

			await expect( cancelButton ).toBeEnabled();
			await cancelButton.click();

			const dialog = page
				.locator( '.gla-experience-rating-feedback-modal' )
				.getByRole( 'dialog' );

			await expect( dialog ).not.toBeVisible();
		} );

		test( 'Clicking the escape button closes the modal', async () => {
			appRatingsOverview.clickGoodButton();

			await page.waitForSelector( feedbackModalClass, {
				state: 'visible',
			} );

			const feedbackModal = page.locator( feedbackModalClass );

			await expect( feedbackModal ).toBeVisible();
			await page.keyboard.press( 'Escape' );

			await expect( feedbackModal ).not.toBeVisible();
		} );

		test( 'Clicking the close button closes the modal', async () => {
			appRatingsOverview.clickGoodButton();

			await page.waitForSelector( feedbackModalClass, {
				state: 'visible',
			} );

			const feedbackModal = page.locator( feedbackModalClass );
			const closeButton = feedbackModal.getByRole( 'button', {
				name: 'Close',
			} );

			await expect( closeButton ).toBeVisible();
			await closeButton.click();
			await expect( feedbackModal ).not.toBeVisible();
		} );
	} );
} );
