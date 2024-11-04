/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import GridiconGift from 'gridicons/dist/gift';
import { createInterpolateElement } from '@wordpress/element';

/**
 * Internal dependencies
 */
import AppDocumentationLink from '.~/components/app-documentation-link';

/**
 * Render the Free Ads Credit inside the Paid Features component.
 *
 * @fires gla_documentation_link_click with `{ context: 'dashboard', link_id: 'free-ad-credit-terms', href: 'https://www.google.com/ads/coupons/terms/' }`
 * @return {JSX.Element} Free Ads Credit component.
 */
const FreeAdCredit = () => {
	return (
		<div className="gla-free-ad-credit-div">
			<GridiconGift />
			<div>
				{ createInterpolateElement(
					__(
						'Claim $500 in ads credit when you spend your first $500 with Google Ads. <termLink>Terms and conditions apply</termLink>.',
						'google-listings-and-ads'
					),
					{
						termLink: (
							<AppDocumentationLink
								context="dashboard"
								linkId="free-ad-credit-terms"
								href="https://www.google.com/ads/coupons/terms/"
							/>
						),
					}
				) }
			</div>
		</div>
	);
};

export default FreeAdCredit;
