/**
 * Internal dependencies
 */
import { LOAD_STATE } from '../constants';
import MockRequests from '../mock-requests';

/**
 * ProductFeed page object class.
 */
export default class PriceBenchmarkPage extends MockRequests {
	/**
	 * @param {import('@playwright/test').Page} page
	 */
	constructor( page ) {
		super( page );
		this.page = page;
	}

	/**
	 * Go to the product feed page.
	 * 
	 * @param {string|null} path - The path to navigate to. If null, defaults to the Price Benchmark page.
	 *
	 * @return {Promise<void>}
	 */
	async goto( path = null ) {
		const url =
			path ||
			'/wp-admin/admin.php?page=wc-admin&path=%2Fgoogle%2Fprice-benchmark';
		await this.page.goto( url, {
			waitUntil: LOAD_STATE.DOM_CONTENT_LOADED,
		} );
	}

	/**
	 * Mock all requests related to external accounts such as Merchant Center, Google, etc.
	 *
	 * @return {Promise<void>}
	 */
	async mockRequests() {
		await Promise.all( [
			this.fulfillMCReview( {
				cooldown: 0,
				issues: [],
				reviewEligibleRegions: [],
				status: 'ONBOARDING',
			} ),

			this.fulfillAccountIssuesRequest( {
				issues: [],
				page: 1,
				total: 0,
				loading: false,
			} ),

			this.mockJetpackConnected(),
			this.mockGoogleConnected(),
			this.mockAdsAccountConnected(),
		] );
	}

	/**
	 * Get the active product value element.
	 *
	 * @return {import('@playwright/test').Locator} The active product value element.
	 */
	getActiveProductValueElement() {
		return this.page
			.locator( '.woocommerce-summary__item-label span >> text=Active' )
			.locator( '../..' )
			.locator( '.woocommerce-summary__item-value span' );
	}
}
