/**
 * Internal dependencies
 */
import MockRequests from '../mock-requests';
import { LOAD_STATE } from '../constants';

export default class ShippingPage extends MockRequests {
	/**
	 * @param {import('@playwright/test').Page} page
	 */
	constructor( page ) {
		super( page );
		this.page = page;
	}

	/**
	 * Mock all requests related to external resources.
	 *
	 * @return {Promise<void>}
	 */
	async mockRequests() {
		await this.mockSuccessfulSettingsSyncRequest();

		await this.fulfillSettings( {
			shipping_rate: 'flat',
			tax_rate: 'destination',
		} );

		await this.fulfillTargetAudience( {
			location: 'selected',
			countries: [ 'US' ],
			locale: 'en_US',
			language: 'English',
		} );
	}

	/**
	 * Go to the Shipping page.
	 *
	 * @return {Promise<void>}
	 */
	async goto() {
		await this.page.goto(
			'/wp-admin/admin.php?page=wc-admin&path=%2Fgoogle%2Fshipping',
			{ waitUntil: LOAD_STATE.DOM_CONTENT_LOADED }
		);
	}

	/**
	 * Get Save Changes button.
	 *
	 * @return {Promise<import('@playwright/test').Locator>} Get Save Changes button.
	 */
	async getSaveChangesButton() {
		return this.page.getByRole( 'button', {
			name: 'Save changes',
			exact: true,
		} );
	}

	/**
	 * Click the Save Changes button.
	 *
	 * @return {Promise<void>}
	 */
	async clickSaveChanges() {
		const saveChangesButton = await this.getSaveChangesButton();
		await saveChangesButton.click();
	}

	/**
	 * Check the recommended shipping settings.
	 *
	 * @return {Promise<void>}
	 */
	async checkRecommendShippingSettings() {
		return this.page
			.locator(
				'text=Automatically sync my store’s shipping settings to Google.'
			)
			.check();
	}
	/**
	 * Fill the countries shipping time input.
	 *
	 * @param {string} min The minimum shipping time
	 * @param {string} max The maximum shipping time
	 * @return {Promise<void>}
	 */
	async fillCountriesShippingTimeInput( min, max ) {
		const timesLocator = this.page.locator( '.countries-time input' );
		await timesLocator.first().fill( min );
		await timesLocator.last().fill( max );
	}

	/**
	 * Register the requests when the save button is clicked.
	 *
	 * @return {Promise<import('@playwright/test').Request[]>} The requests.
	 */
	registerSavingRequests() {
		const targetAudienceRequest = this.page.waitForRequest(
			( request ) =>
				request.url().includes( '/gla/mc/target_audience' ) &&
				request.method() === 'POST' &&
				request.postDataJSON().countries[ 0 ] === 'US'
		);
		const settingsRequest = this.page.waitForRequest(
			( request ) =>
				request.url().includes( '/gla/mc/settings' ) &&
				request.method() === 'POST' &&
				request.postDataJSON().shipping_rate === 'automatic' &&
				request.postDataJSON().shipping_time === 'flat'
		);

		const syncRequest = this.page.waitForRequest(
			( request ) =>
				request.url().includes( '/gla/mc/settings/sync' ) &&
				request.method() === 'POST'
		);

		return Promise.all( [
			settingsRequest,
			targetAudienceRequest,
			syncRequest,
		] );
	}
}
