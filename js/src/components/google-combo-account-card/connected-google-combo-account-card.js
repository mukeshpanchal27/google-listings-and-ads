/**
 * Internal dependencies
 */
import AccountCard, { APPEARANCE } from '../account-card';
import ConnectAds from './connect-ads';
import AccountDetails from './account-details';
import Indicator from './indicator';
import getAccountCreationTexts from './getAccountCreationTexts';
import SpinnerCard from '.~/components/spinner-card';
import useAutoCreateAdsMCAccounts from '.~/hooks/useAutoCreateAdsMCAccounts';
import useGoogleMCAccount from '.~/hooks/useGoogleMCAccount';
import useExistingGoogleMCAccounts from '.~/hooks/useExistingGoogleMCAccounts';
import useCreateMCAccount from '.~/hooks/useCreateMCAccount';
import ConnectMC from './connect-mc';
import useGoogleAdsAccountReady from '.~/hooks/useGoogleAdsAccountReady';
import useExistingGoogleAdsAccounts from '.~/hooks/useExistingGoogleAdsAccounts';
import './connected-google-combo-account-card.scss';

/**
 * Renders a Google account card UI with connected account information.
 * It will also kickoff Ads and Merchant Center account creation if the user does not have accounts.
 */
const ConnectedGoogleComboAccountCard = () => {
	// We use a single instance of the hook to create a MC (Merchant Center) account,
	// ensuring consistent results across both the main component (ConnectedGoogleComboAccountCard) and its child component (ConnectMC).
	// This approach is especially useful when an MC account is automatically created, and the URL needs to be reclaimed.
	// The URL reclaim component is rendered within the ConnectMC component.
	const [ createMCAccount, resultCreateMCAccount ] = useCreateMCAccount();
	const { data: existingGoogleMCAccounts } = useExistingGoogleMCAccounts();
	const { isReady: isGoogleMCReady } = useGoogleMCAccount();
	const { hasDetermined, creatingWhich } =
		useAutoCreateAdsMCAccounts( createMCAccount );
	const { text, subText } = getAccountCreationTexts( creatingWhich );
	const { existingAccounts: existingGoogleAdsAccounts } =
		useExistingGoogleAdsAccounts();
	const isConnected = useGoogleAdsAccountReady();

	if ( ! hasDetermined ) {
		return <SpinnerCard />;
	}

	// @TODO: edit mode implementation in 2605
	const editMode = false;
	const hasExistingGoogleMCAccounts = existingGoogleMCAccounts?.length > 0;
	const showConnectMC =
		( editMode && hasExistingGoogleMCAccounts ) ||
		( ! isGoogleMCReady && hasExistingGoogleMCAccounts );

	const hasExistingGoogleAdsAccounts = existingGoogleAdsAccounts?.length > 0;
	const showConnectAds =
		( editMode && hasExistingGoogleAdsAccounts ) ||
		( ! isConnected && hasExistingGoogleAdsAccounts );

	return (
		<div>
			<AccountCard
				appearance={ APPEARANCE.GOOGLE }
				alignIcon="top"
				className="gla-google-combo-account-card gla-google-combo-account-card--connected"
				description={ text || <AccountDetails /> }
				helper={ subText }
				indicator={
					<Indicator showSpinner={ Boolean( creatingWhich ) } />
				}
			/>

			{ showConnectAds && <ConnectAds /> }

			{ showConnectMC && (
				<ConnectMC
					createMCAccount={ createMCAccount }
					resultCreateMCAccount={ resultCreateMCAccount }
				/>
			) }
		</div>
	);
};

export default ConnectedGoogleComboAccountCard;
