/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import useAutoCreateAdsMCAccounts from '.~/hooks/useAutoCreateAdsMCAccounts';
import AccountCard, { APPEARANCE } from '../account-card';
import ConnectAds from './connect-ads';
import AccountDetails from './account-details';
import Indicator from './indicator';
import getAccountCreationTexts from './getAccountCreationTexts';
import SpinnerCard from '.~/components/spinner-card';
import useGoogleMCAccount from '.~/hooks/useGoogleMCAccount';
import useExistingGoogleMCAccounts from '.~/hooks/useExistingGoogleMCAccounts';
import useCreateMCAccount from '.~/hooks/useCreateMCAccount';
import ConnectMC from '.~/components/google-mc-account-card/connect-mc';
import useGoogleAdsAccountReady from '.~/hooks/useGoogleAdsAccountReady';
import useExistingGoogleAdsAccounts from '.~/hooks/useExistingGoogleAdsAccounts';
import AppButton from '.~/components/app-button';
import SwitchAccountButton from '.~/components/google-account-card/switch-account-button';
import './connected-google-combo-account-card.scss';

/**
 * Renders a Google account card UI with connected account information.
 * It will also kickoff Ads and Merchant Center account creation if the user does not have accounts.
 */
const ConnectedGoogleComboAccountCard = () => {
	const [ editMode, setEditMode ] = useState( false );
	const { hasDetermined, creatingWhich } = useAutoCreateAdsMCAccounts();

	// We use a single instance of the hook to create a MC (Merchant Center) account,
	// ensuring consistent results across both the main component (ConnectedGoogleComboAccountCard) and its child component (ConnectMC).
	// This approach is especially useful when an MC account is automatically created, and the URL needs to be reclaimed.
	// The URL reclaim component is rendered within the ConnectMC component.
	const [ createMCAccount, resultCreateMCAccount ] = useCreateMCAccount();
	const { data: existingGoogleMCAccounts } = useExistingGoogleMCAccounts();
	const { isReady: isGoogleMCReady } = useGoogleMCAccount();
	const { text, subText } = getAccountCreationTexts( creatingWhich );
	const { existingAccounts: existingGoogleAdsAccounts } =
		useExistingGoogleAdsAccounts();
	const isConnected = useGoogleAdsAccountReady();

	if ( ! hasDetermined ) {
		return <SpinnerCard />;
	}

	const handleEditClick = () => {
		setEditMode( true );
	};

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
				className="gla-google-combo-account-card gla-google-combo-account-card--connected gla-google-combo-service-account-card--google"
				description={
					<>
						{ text || <AccountDetails /> }

						<div className="gla-google-combo-account-card__actions">
							{ ! editMode && (
								<AppButton
									isLink
									text={ __(
										'Edit',
										'google-listings-and-ads'
									) }
									onClick={ handleEditClick }
								/>
							) }

							{ editMode && (
								<SwitchAccountButton
									text={ __(
										'Connect to a different Google account',
										'google-listings-and-ads'
									) }
								/>
							) }
						</div>
					</>
				}
				helper={ subText }
				indicator={
					<Indicator showSpinner={ Boolean( creatingWhich ) } />
				}
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
