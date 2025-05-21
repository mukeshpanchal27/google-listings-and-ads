/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { ExternalLink } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { recordGlaEvent } from '~/utils/tracks';

const URL = 'https://woocommerce.com/document/google-for-woocommerce/faq/';

const FaqLink = () => {
	return (
		<ExternalLink
			onClick={ () => {
				recordGlaEvent( 'gla_price_benchmark_faq_link_clicked', {
					context: 'price_benchmark',
					link_id: 'faq_link',
					href: URL,
				} );
			} }
			href={ URL }
		>
			{ __( 'FAQ', 'google-listings-and-ads' ) }
		</ExternalLink>
	);
};

export default FaqLink;
