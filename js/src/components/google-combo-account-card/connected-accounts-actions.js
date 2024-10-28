/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import AppNotice from '.~/components/app-notice';
import ClaimAdsAccount from './claim-ads-account/claim-ads-account';
import useGoogleAdsAccount from '.~/hooks/useGoogleAdsAccount';
import useGoogleAdsAccountStatus from '.~/hooks/useGoogleAdsAccountStatus';
import useGoogleAdsAccountReady from '.~/hooks/useGoogleAdsAccountReady';

/**
 * Renders the actionable components for connected accounts.
 * @return {JSX.Element} Connected accounts actions.
 */
const ConnectedAccountsActions = () => {
	const { googleAdsAccount } = useGoogleAdsAccount();
	const { hasAccess } = useGoogleAdsAccountStatus();
	const isReady = useGoogleAdsAccountReady();

	const shouldClaimGoogleAdsAccount = Boolean(
		googleAdsAccount.id && hasAccess === false
	);

	return (
		<div className="gla-connected-accounts-actions">
			{ shouldClaimGoogleAdsAccount && <ClaimAdsAccount /> }
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
