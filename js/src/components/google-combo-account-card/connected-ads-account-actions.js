/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import AppNotice from '.~/components/app-notice';
import ClaimAdsAccount from './claim-ads-account';

/**
 * Renders the actionable components for connected accounts.
 * @param {Object} props Component props.
 * @param {boolean} props.claimGoogleAdsAccount Whether the user should claim the Google Ads account.
 * @param {boolean} props.showConversionMeasurementNotice Whether to show the conversion measurement notice.
 * @return {JSX.Element} Connected accounts actions.
 */
const ConnectedAdsAccountsActions = ( {
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
				<AppNotice
					className="gla-ads-conversion-measurement-notice"
					status="success"
					isDismissible={ false }
				>
					{ __(
						'Google Ads conversion measurement has been set up for your store.',
						'google-listings-and-ads'
					) }
				</AppNotice>
			) }
		</div>
	);
};

export default ConnectedAdsAccountsActions;
