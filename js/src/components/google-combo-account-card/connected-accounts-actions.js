/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import AppNotice from '.~/components/app-notice';
import ClaimAdsAccount from './claim-ads-account';
import useGoogleAdsAccountReady from '.~/hooks/useGoogleAdsAccountReady';

/**
 * Renders the actionable components for connected accounts.
 * @param {Object} props Component props.
 * @param {boolean} props.claimGoogleAdsAccount Whether the user should claim the Google Ads account.
 * @return {JSX.Element} Connected accounts actions.
 */
const ConnectedAccountsActions = ( { claimGoogleAdsAccount } ) => {
	const isReady = useGoogleAdsAccountReady();

	return (
		<div className="gla-connected-accounts-actions">
			{ claimGoogleAdsAccount && <ClaimAdsAccount /> }

			{ isReady && (
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

export default ConnectedAccountsActions;
