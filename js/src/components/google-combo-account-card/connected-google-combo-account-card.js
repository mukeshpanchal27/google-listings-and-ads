/**
 * External dependencies
 */
import { useEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { useAppDispatch } from '.~/data';
import AccountCard, { APPEARANCE } from '../account-card';
import ConnectAds from './connect-ads';
import AccountDetails from './account-details';
import ConnectedAdsAccountsActions from './connected-ads-account-actions';
import Indicator from './indicator';
import getAccountCreationTexts from './getAccountCreationTexts';
import SpinnerCard from '.~/components/spinner-card';
import useAutoCreateAdsMCAccounts from '.~/hooks/useAutoCreateAdsMCAccounts';
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
	const { hasDetermined, creatingWhich } = useAutoCreateAdsMCAccounts();
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
	const editMode = true;
	const shouldClaimGoogleAdsAccount = Boolean(
		googleAdsAccount?.id && hasAccess === false
	);
	const hasExistingGoogleAdsAccounts = existingGoogleAdsAccounts?.length > 0;
	const showConnectAds =
		( ( editMode && hasExistingGoogleAdsAccounts ) ||
			( ! isConnected && hasExistingGoogleAdsAccounts ) ) &&
		! shouldClaimGoogleAdsAccount;

	// Show the spinner if there's an account creation in progress and we're not finalizing the Ads account creation.
	// If we are not showing the ConnectMC screen, for e.g when we are creating the first account,
	// then show the spinner while the Ads account is being claimed.
	const showSpinner =
		( Boolean( creatingWhich ) && ! finalizeAdsAccountCreation ) ||
		( ! showConnectAds && finalizeAdsAccountCreation );

	return (
		<div>
			<AccountCard
				appearance={ APPEARANCE.GOOGLE }
				alignIcon="top"
				className="gla-google-combo-account-card--connected"
				description={ text || <AccountDetails /> }
				helper={ subText }
				indicator={ <Indicator showSpinner={ showSpinner } /> }
			>
				<ConnectedAdsAccountsActions
					claimGoogleAdsAccount={ shouldClaimGoogleAdsAccount }
				/>
			</AccountCard>

			{ showConnectAds && (
				<ConnectAds
					finalizeAdsAccountCreation={ finalizeAdsAccountCreation }
				/>
			) }
		</div>
	);
};

export default ConnectedGoogleComboAccountCard;
