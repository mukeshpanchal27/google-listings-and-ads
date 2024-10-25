/**
 * Internal dependencies
 */
import ClaimAdsAccount from './claim-ads-account/claim-ads-account';
import ConversionMeasurementNotice from './conversion-measurement-notice';
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
			{ isReady && <ConversionMeasurementNotice /> }
		</div>
	);
};

export default ConnectedAccountsActions;
