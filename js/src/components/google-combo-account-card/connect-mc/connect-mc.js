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
 * Clicking on the button to connect an existing Google Merchant Center account.
 *
 * @event gla_mc_account_connect_button_click
 * @property {number} id The account ID to be connected.
 */

/**
 * ConnectMC component.
 *
 * This component renders Merchant Center connection section.
 * It is using createMCAccount and resultCreateMCAccount from the parent component.
 * @fires gla_mc_account_connect_button_click
 * @param {Object} props
 * @param {Function} props.createMCAccount Callback function for creating a new Merchant Center account.
 * @param {Object} props.resultCreateMCAccount The result of the create account request.
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

	const accountConnectionIssue = hasAccountConnectionIssue(
		resultConnectMC,
		resultCreateMCAccount
	);

	if ( ! isGoogleMCReady && accountConnectionIssue ) {
		return (
			<AccountConnectionStatus
				resultConnectMC={ resultConnectMC }
				resultCreateAccount={ resultCreateMCAccount }
				onRetry={ createMCAccount }
			/>
		);
	}

	const getIndicator = () => {
		if ( ! hasFinishedResolution ) {
			return <LoadingLabel />;
		}

		if ( isGoogleMCReady ) {
			return <ConnectedIconLabel />;
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
			alignIndicator="toDetail"
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
