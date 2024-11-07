/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { Notice } from '@wordpress/components';

/**
 * Internal dependencies
 */
import ClaimAdsAccount from './claim-ads-account';

/**
 * Renders logic to claim an Ads account or show the conversion measurement notice.
 * @param {Object} props Component props.
 * @param {boolean} props.claimGoogleAdsAccount Whether the user should claim the Google Ads account.
 * @param {boolean} props.showConversionMeasurementNotice Whether to show the conversion measurement notice.
 * @return {JSX.Element} Connected accounts actions.
 */
const ConnectedAdsAccountDetail = ( {
	claimGoogleAdsAccount,
	showConversionMeasurementNotice,
} ) => {
	if ( ! claimGoogleAdsAccount && ! showConversionMeasurementNotice ) {
		return null;
	}

	return (
		<div className="gla-connected-ads-account-actions">
			{ claimGoogleAdsAccount && <ClaimAdsAccount /> }

			{ showConversionMeasurementNotice && (
				<Notice
					className="gla-ads-conversion-measurement-notice"
					status="success"
					isDismissible={ false }
				>
					{ __(
						'Google Ads conversion measurement has been set up for your store.',
						'google-listings-and-ads'
					) }
				</Notice>
			) }
		</div>
	);
};

export default ConnectedAdsAccountDetail;
