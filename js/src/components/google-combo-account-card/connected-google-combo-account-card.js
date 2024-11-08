/**
 * External dependencies
 */
import { useEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { useAppDispatch } from '.~/data';
import { GOOGLE_ADS_ACCOUNT_STATUS } from '.~/constants';
import AccountCard, { APPEARANCE } from '../account-card';
import ConnectAds from './connect-ads';
import AccountDetails from './account-details';
import ConnectedAdsAccountDetail from './connected-ads-account-detail';
import Indicator from './indicator';
import getAccountCreationTexts from './getAccountCreationTexts';
import SpinnerCard from '.~/components/spinner-card';
import useAutoCreateAdsMCAccounts from '.~/hooks/useAutoCreateAdsMCAccounts';
import useGoogleMCAccount from '.~/hooks/useGoogleMCAccount';
import useExistingGoogleMCAccounts from '.~/hooks/useExistingGoogleMCAccounts';
import useCreateMCAccount from '.~/hooks/useCreateMCAccount';
import ConnectMC from '.~/components/google-mc-account-card/connect-mc';
import useGoogleAdsAccountReady from '.~/hooks/useGoogleAdsAccountReady';
import useExistingGoogleAdsAccounts from '.~/hooks/useExistingGoogleAdsAccounts';
import useGoogleAdsAccountStatus from '.~/hooks/useGoogleAdsAccountStatus';
import useGoogleAdsAccount from '.~/hooks/useGoogleAdsAccount';
import useUpsertAdsAccount from '.~/hooks/useUpsertAdsAccount';
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
	const { invalidateResolution } = useAppDispatch();
	const { googleAdsAccount } = useGoogleAdsAccount();
	const { hasAccess, step } = useGoogleAdsAccountStatus();
	const [ upsertAdsAccount ] = useUpsertAdsAccount();

	const finalizeAdsAccountCreation =
		hasAccess === true && step === 'conversion_action';

	// Ideally updating the account should be done in ConnectMC component but the latter is not always rendered,
	// (for e.g when the user is creating the first account).
	useEffect( () => {
		const upsertAccount = async () => {
			if ( finalizeAdsAccountCreation ) {
				await upsertAdsAccount();
				invalidateResolution( 'getExistingGoogleAdsAccounts', [] );
			}
		};

		upsertAccount();
	}, [ finalizeAdsAccountCreation, upsertAdsAccount, invalidateResolution ] );

	if ( ! hasDetermined ) {
		return <SpinnerCard />;
	}

	// @TODO: edit mode implementation in 2605
	const editMode = false;
	const shouldClaimGoogleAdsAccount = Boolean(
		googleAdsAccount?.id && hasAccess === false
	);

	const hasExistingGoogleMCAccounts = existingGoogleMCAccounts?.length > 0;
	const showConnectMC =
		( editMode && hasExistingGoogleMCAccounts ) ||
		( ! isGoogleMCReady && hasExistingGoogleMCAccounts );

	const hasExistingGoogleAdsAccounts = existingGoogleAdsAccounts?.length > 0;
	const showConnectAds =
		( editMode && hasExistingGoogleAdsAccounts ) ||
		( ! isConnected && hasExistingGoogleAdsAccounts );

	// Show the spinner if there's an account creation in progress and account should not be claimed.
	// If we are not showing the ConnectMC screen, for e.g when we are creating the first account,
	// then show the spinner in the Google combo card while the Ads account is being claimed.
	const showSpinner =
		( Boolean( creatingWhich ) && ! shouldClaimGoogleAdsAccount ) ||
		( ! showConnectAds && finalizeAdsAccountCreation );

	const showConversionMeasurementNotice =
		googleAdsAccount.status === GOOGLE_ADS_ACCOUNT_STATUS.CONNECTED ||
		googleAdsAccount.step === 'link_merchant';
	return (
		<div>
			<AccountCard
				appearance={ APPEARANCE.GOOGLE }
				alignIcon="top"
				className="gla-google-combo-account-card gla-google-combo-account-card--connected gla-google-combo-service-account-card--google"
				description={ text || <AccountDetails /> }
				helper={ subText }
				indicator={ <Indicator showSpinner={ showSpinner } /> }
				detail={
					<ConnectedAdsAccountDetail
						showConversionMeasurementNotice={
							showConversionMeasurementNotice
						}
						claimGoogleAdsAccount={ shouldClaimGoogleAdsAccount }
					/>
				}
				expandedDetail
			/>

			{ showConnectAds && <ConnectAds /> }

			{ showConnectMC && (
				<ConnectMC
					createAccount={ createMCAccount }
					resultCreateAccount={ resultCreateMCAccount }
					className="gla-google-combo-account-card gla-google-combo-service-account-card--mc"
				/>
			) }
		</div>
	);
};

export default ConnectedGoogleComboAccountCard;
