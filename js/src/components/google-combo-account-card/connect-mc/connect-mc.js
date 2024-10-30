/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { useEffect, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import useGoogleMCAccount from '.~/hooks/useGoogleMCAccount';
import AccountCard from '.~/components/account-card';
import AppButton from '.~/components/app-button';
import ConnectedIconLabel from '.~/components/connected-icon-label';
import ConnectMCFooter from './connect-mc-footer';
import LoadingLabel from '.~/components/loading-label';
import SpinnerCard from '.~/components/spinner-card';
import AccountConnectionStatus from '.~/components/google-mc-account-card/connect-mc/account-connection-status';
import MerchantCenterSelect from './merchant-center-select';
import useConnectMCAccount from '.~/hooks/useConnectMCAccount';
import { hasAccountConnectionIssue } from '.~/components/google-mc-account-card/connect-mc/utils';

/**
 * Clicking on the "Switch account" button to select a different Google Merchant Center account to connect.
 *
 * @event gla_mc_account_switch_account_button_click
 * @property {string} context (`switch-url`|`reclaim-url`) - indicate the button is clicked from which step.
 */

/**
 * ConnectMC component.
 *
 * This component renders Merchant Center connection section.
 * It is using createMCAccount and resultCreateMCAccount from the parent component.
 *
 * @param {Object}   props
 * @param {Function} props.createMCAccount Callback function for creating a new Merchant Center account.
 * @param {Object}   props.resultCreateMCAccount The result of the create account request.
 */
const ConnectMC = ( { createMCAccount, resultCreateMCAccount } ) => {
	const {
		googleMCAccount,
		hasFinishedResolution,
		isReady: isGoogleMCReady,
	} = useGoogleMCAccount();
	const [ accountID, setAccountID ] = useState();
	const [ handleConnectMC, resultConnectMC ] =
		useConnectMCAccount( accountID );

	useEffect( () => {
		if ( isGoogleMCReady ) {
			setAccountID( googleMCAccount.id );
		}
	}, [ googleMCAccount, isGoogleMCReady ] );

	if ( ! hasFinishedResolution ) {
		return <SpinnerCard />;
	}

	const accountConnectionIssue = hasAccountConnectionIssue(
		resultConnectMC,
		resultCreateMCAccount
	);

	// TODO: Implement getIndicator function
	const getIndicator = () => {
		if ( isGoogleMCReady ) {
			return (
				<ConnectedIconLabel className="gla-google-combo-service-connected-icon-label" />
			);
		}

		if ( resultConnectMC.loading ) {
			return (
				<LoadingLabel
					text={ __( 'Connecting…', 'google-listings-and-ads' ) }
				/>
			);
		}

		return (
			<AppButton
				isSecondary
				eventName="gla_mc_account_connect_button_click"
				eventProps={ { id: Number( accountID ) } }
				onClick={ handleConnectMC }
			>
				{ __( 'Connect', 'google-listings-and-ads' ) }
			</AppButton>
		);
	};

	if ( ! isGoogleMCReady && accountConnectionIssue ) {
		return (
			<AccountConnectionStatus
				resultConnectMC={ resultConnectMC }
				resultCreateAccount={ resultCreateMCAccount }
				onRetry={ createMCAccount }
			/>
		);
	}

	return (
		<AccountCard
			className="gla-google-combo-account-card gla-google-combo-service-account-card--mc"
			title={ __(
				'Connect to existing Merchant Center account',
				'google-listings-and-ads'
			) }
			helper={ __(
				'Required to sync products so they show on Google.',
				'google-listings-and-ads'
			) }
			alignIndicator='toDetail'
			indicator={ getIndicator() }
			detail={
				<MerchantCenterSelect
					isConnected={ isGoogleMCReady }
					value={ accountID }
					onChange={ setAccountID }
				/>
			}
			actions={
				<ConnectMCFooter
					isConnected={ isGoogleMCReady }
					resultConnectMC={ resultConnectMC }
					resultCreateAccount={ resultCreateMCAccount }
					handleCreateAccount={ createMCAccount }
				/>
			}
		/>
	);
};

export default ConnectMC;
