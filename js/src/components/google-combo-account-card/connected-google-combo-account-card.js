/**
 * Internal dependencies
 */
import AccountCard, { APPEARANCE } from '../account-card';
import ConnectAds from './connect-ads';
import AccountDetails from './account-details';
import ConnectedAccountsActions from './connected-accounts-actions';
import Indicator from './indicator';
import getAccountCreationTexts from './getAccountCreationTexts';
import SpinnerCard from '.~/components/spinner-card';
import useAutoCreateAdsMCAccounts from '.~/hooks/useAutoCreateAdsMCAccounts';
import useGoogleAdsAccountReady from '.~/hooks/useGoogleAdsAccountReady';
import useExistingGoogleAdsAccounts from '.~/hooks/useExistingGoogleAdsAccounts';
import useGoogleAdsAccountStatus from '.~/hooks/useGoogleAdsAccountStatus';
import useGoogleAdsAccount from '.~/hooks/useGoogleAdsAccount';
import './connected-google-combo-account-card.scss';

/**
 * Renders a Google account card UI with connected account information.
 * It will also kickoff Ads and Merchant Center account creation if the user does not have accounts.
 */
const ConnectedGoogleComboAccountCard = () => {
	const { hasDetermined, creatingWhich } = useAutoCreateAdsMCAccounts();
	const { text, subText } = getAccountCreationTexts( creatingWhich );
	const { existingAccounts: existingGoogleAdsAccounts } =
		useExistingGoogleAdsAccounts();
	const isConnected = useGoogleAdsAccountReady();
	const { hasAccess } = useGoogleAdsAccountStatus();
	const { googleAdsAccount } = useGoogleAdsAccount();

	if ( ! hasDetermined ) {
		return <SpinnerCard />;
	}

	// @TODO: edit mode implementation in 2605
	const editMode = false;
	const shouldClaimGoogleAdsAccount = Boolean(
		googleAdsAccount?.id && hasAccess === false
	);
	const hasExistingGoogleAdsAccounts = existingGoogleAdsAccounts?.length > 0;
	const showConnectAds =
		( editMode && hasExistingGoogleAdsAccounts ) ||
		( ! isConnected && hasExistingGoogleAdsAccounts ) ||
		! shouldClaimGoogleAdsAccount;

	return (
		<div>
			<AccountCard
				appearance={ APPEARANCE.GOOGLE }
				alignIcon="top"
				className="gla-google-combo-account-card--connected"
				description={ text || <AccountDetails /> }
				helper={ subText }
				indicator={
					<Indicator showSpinner={ Boolean( creatingWhich ) } />
				}
			>
				<ConnectedAccountsActions />
			</AccountCard>

			{ showConnectAds && <ConnectAds /> }
		</div>
	);
};

export default ConnectedGoogleComboAccountCard;
