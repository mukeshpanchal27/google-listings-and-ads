/**
 * External dependencies
 */
import { render } from '@testing-library/react';

/**
 * Internal dependencies
 */
import SummarySection from '.~/dashboard/summary-section';
import useAdsCampaigns from '.~/hooks/useAdsCampaigns';

// Mimic no data loaded.
jest.mock( './usePerformance', () =>
	jest
		.fn()
		.mockName( 'usePerformance' )
		.mockReturnValue( { data: false, loaded: true } )
);
// Mock currency hooks not to require WooCommerce settings.
jest.mock( '.~/hooks/useAdsCurrency', () =>
	jest.fn().mockReturnValue( {
		formatAmount: jest.fn().mockName( 'formatAmount' ),
	} )
);
jest.mock( '.~/hooks/useCurrencyFormat', () => jest.fn() );
jest.mock( '.~/hooks/useAdsCampaigns', () =>
	jest.fn().mockName( 'useAdsCampaigns' )
);

describe( 'SummarySection when no data is loaded', () => {
	beforeAll( () => {
		useAdsCampaigns.mockImplementation( () => {
			return { loaded: true, data: [] };
		} );
	} );

	it( 'Shows no data message for Free Campaigns', async () => {
		const { findByText } = render( <SummarySection /> );

		expect(
			await findByText(
				"We're having trouble loading this data. Try again later, or track your performance in Google Merchant Center."
			)
		).toBeTruthy();

		const link = await findByText( 'Open Google Merchant Center' );

		expect( link ).toBeTruthy();
		expect( link.href ).toBe(
			'https://merchants.google.com/mc/reporting/dashboard'
		);
	} );
	it( 'Shows no data message for Paid Campaigns', async () => {
		const { findByText } = render( <SummarySection /> );

		expect(
			await findByText(
				"We're having trouble loading this data. Try again later, or track your performance in Google Ads."
			)
		).toBeTruthy();

		const link = await findByText( 'Open Google Ads' );

		expect( link ).toBeTruthy();
		expect( link.href ).toBe( 'https://ads.google.com/' );
	} );
} );
