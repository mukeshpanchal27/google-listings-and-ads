/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
import useAutoCreateAdsMCAccounts from '.~/hooks/useAutoCreateAdsMCAccounts';
import { useAppDispatch } from '.~/data';
import { GOOGLE_ADS_ACCOUNT_STATUS } from '.~/constants';
import AccountCard, { APPEARANCE } from '../account-card';
import ConnectAds from './connect-ads';
import AccountDetails from './account-details';
import ConnectedAdsAccountDetail from './connected-ads-account-detail';
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
import useGoogleAdsAccountStatus from '.~/hooks/useGoogleAdsAccountStatus';
import useGoogleAdsAccount from '.~/hooks/useGoogleAdsAccount';
import useUpsertAdsAccount from '.~/hooks/useUpsertAdsAccount';
import './connected-google-combo-account-card.scss';

/**
 * Renders a Google account card UI with connected account information.
 * It will also kickoff Ads and Merchant Center account creation if the user does not have accounts.
 */
const ConnectedGoogleComboAccountCard = () => {
	const [
		showConversionMeasurementNotice,
		setShowConversionMeasurementNotice,
	] = useState( false );
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
	const { invalidateResolution } = useAppDispatch();
	const { googleAdsAccount } = useGoogleAdsAccount();
	const { hasAccess, step } = useGoogleAdsAccountStatus();
	const [ upsertAdsAccount, { action } ] = useUpsertAdsAccount();

	const hasExistingGoogleMCAccounts = existingGoogleMCAccounts?.length > 0;
	const hasExistingGoogleAdsAccounts = existingGoogleAdsAccounts?.length > 0;
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

	useEffect( () => {
		setShowConversionMeasurementNotice(
			googleAdsAccount?.status === GOOGLE_ADS_ACCOUNT_STATUS.CONNECTED ||
				googleAdsAccount?.step === 'link_merchant'
		);
	}, [ googleAdsAccount ] );

	if ( ! hasDetermined ) {
		return <SpinnerCard />;
	}

	const onCancelClick = () => {
		setShowConversionMeasurementNotice( false );
		setEditMode( false );
	};

	const onEditClick = () => {
		setEditMode( true );
	};

	const cardActions = (
		<div className="gla-google-combo-account-card__description-actions">
			{ editMode ? (
				<>
					<SwitchAccountButton
						isTertiary
						text={ __(
							'Connect to a different Google account',
							'google-listings-and-ads'
						) }
					/>
					<AppButton isTertiary onClick={ onCancelClick }>
						{ __( 'Cancel', 'google-listings-and-ads' ) }
					</AppButton>
				</>
			) : (
				<AppButton
					isTertiary
					text={ __( 'Edit', 'google-listings-and-ads' ) }
					onClick={ onEditClick }
				/>
			) }
		</div>
	);

	const showConnectMC =
		( editMode && hasExistingGoogleMCAccounts ) ||
		( ! isGoogleMCReady && hasExistingGoogleMCAccounts );
	const shouldClaimGoogleAdsAccount = Boolean(
		googleAdsAccount?.id && hasAccess === false
	);

	const showConnectAds =
		( ( editMode && hasExistingGoogleAdsAccounts ) ||
			( ! isConnected && hasExistingGoogleAdsAccounts ) ) &&
		! shouldClaimGoogleAdsAccount;

	// Show the spinner if there's an account creation in progress and account should not be claimed.
	// If we are not showing the ConnectMC screen, for e.g when we are creating the first account,
	// then show the spinner in the Google combo card while the Ads account is being claimed.
	const showSpinner =
		( Boolean( creatingWhich ) && ! shouldClaimGoogleAdsAccount ) ||
		( ! showConnectAds && finalizeAdsAccountCreation );

	return (
		<div>
			<AccountCard
				appearance={ APPEARANCE.GOOGLE }
				alignIcon="top"
				className="gla-google-combo-account-card gla-google-combo-account-card--connected gla-google-combo-service-account-card--google"
				description={ text || <AccountDetails /> }
				actions={ cardActions }
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

			{ showConnectAds && (
				<ConnectAds
					isConnecting={ action === 'update' }
					isCreating={ action === 'create' }
					onCreate={ upsertAdsAccount }
				/>
			) }

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
