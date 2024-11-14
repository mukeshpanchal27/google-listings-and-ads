/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { useAppDispatch } from '.~/data';
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
import AppButton from '.~/components/app-button';
import SwitchAccountButton from '.~/components/google-account-card/switch-account-button';
import useGoogleAdsAccountStatus from '.~/hooks/useGoogleAdsAccountStatus';
import useGoogleAdsAccount from '.~/hooks/useGoogleAdsAccount';
import useUpsertAdsAccount from '.~/hooks/useUpsertAdsAccount';
import showAdsConversionNotice from '.~/utils/showAdsConversionNotice';
import './connected-google-combo-account-card.scss';

/**
 * Renders a Google account card UI with connected account information.
 * It will also kickoff Ads and Merchant Center account creation if the user does not have accounts.
 */
const ConnectedGoogleComboAccountCard = () => {
	const [ editMode, setEditMode ] = useState( false );

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
	const [ upsertAdsAccount, { action, loading } ] = useUpsertAdsAccount();

	const hasExistingGoogleMCAccounts = existingGoogleMCAccounts?.length > 0;
	const hasExistingGoogleAdsAccounts = existingGoogleAdsAccounts?.length > 0;
	const shouldClaimGoogleAdsAccount = Boolean(
		! loading && googleAdsAccount?.id && hasAccess === false
	);
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

	const handleCancelClick = () => {
		setEditMode( false );
	};

	const handleEditClick = () => {
		setEditMode( true );
	};

	const showConnectMC =
		( editMode && hasExistingGoogleMCAccounts ) ||
		( ! isGoogleMCReady && hasExistingGoogleMCAccounts );

	const showConnectAds =
		( ( editMode && hasExistingGoogleAdsAccounts ) ||
			( ! isConnected && hasExistingGoogleAdsAccounts ) ) &&
		! shouldClaimGoogleAdsAccount;

	// When Ads and MC are disconnected in edit mode, exit edit mode.
	useEffect( () => {
		if ( editMode && ! isGoogleMCReady && ! isConnected ) {
			setEditMode( false );
		}
	}, [ editMode, isConnected, isGoogleMCReady ] );

	if ( ! hasDetermined ) {
		return <SpinnerCard />;
	}

	const switchAccountButton = (
		<SwitchAccountButton
			isTertiary
			text={ __(
				'Or, connect to a different Google account',
				'google-listings-and-ads'
			) }
		/>
	);

	const getCardActions = () => {
		if ( editMode ) {
			return (
				<div className="gla-google-combo-account-card__description-actions">
					{ switchAccountButton }
					<AppButton isTertiary onClick={ handleCancelClick }>
						{ __( 'Cancel', 'google-listings-and-ads' ) }
					</AppButton>
				</div>
			);
		}

		// When not in edit mode, only show the edit button if both
		// the `ConnectAds and ConnectMC cards are not already shown.
		return (
			<div className="gla-google-combo-account-card__description-actions">
				{ showConnectAds && showConnectMC ? (
					switchAccountButton
				) : (
					<AppButton
						isTertiary
						text={ __( 'Edit', 'google-listings-and-ads' ) }
						onClick={ handleEditClick }
					/>
				) }
			</div>
		);
	};

	// Show the spinner if there's an account creation in progress and account should not be claimed.
	// If we are not showing the ConnectMC screen, for e.g when we are creating the first account,
	// then show the spinner in the Google combo card while the Ads account is being claimed.
	const showSpinner =
		( Boolean( creatingWhich ) && ! shouldClaimGoogleAdsAccount ) ||
		( ! showConnectAds && finalizeAdsAccountCreation );

	const showConversionMeasurementNotice =
		showAdsConversionNotice( googleAdsAccount );

	return (
		<div>
			<AccountCard
				appearance={ APPEARANCE.GOOGLE }
				alignIcon="top"
				className="gla-google-combo-account-card gla-google-combo-account-card--connected gla-google-combo-service-account-card--google"
				description={ text || <AccountDetails /> }
				actions={ getCardActions() }
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
					onRequestCreate={ upsertAdsAccount }
					upsertingAction={ action }
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
