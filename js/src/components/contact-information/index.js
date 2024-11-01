/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import Section from '.~/wcdl/section';
import StoreAddressCard from './store-address-card';
import VerticalGapLayout from '.~/components/vertical-gap-layout';

const description = (
	<>
		<p>
			{ __(
				'Your contact information is required for verification by Google.',
				'google-listings-and-ads'
			) }
		</p>
		<p>
			{ __(
				'It would be shared with Google Merchant Center for store verification and would not be displayed to customers.',
				'google-listings-and-ads'
			) }
		</p>
	</>
);

const settingsTitle = __( 'Contact information', 'google-listings-and-ads' );

/**
 * Renders a preview of contact information section,
 * or a <NoContactInformationCard> if contact information are not saved yet.
 */
export function ContactInformationPreview() {
	return (
		<Section title={ settingsTitle } description={ description }>
			<VerticalGapLayout size="overlap">
				<StoreAddressCard />
			</VerticalGapLayout>
		</Section>
	);
}
