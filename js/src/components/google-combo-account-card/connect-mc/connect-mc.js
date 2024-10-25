/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { useEffect, useState } from '@wordpress/element';
import classNames from 'classnames';

/**
 * Internal dependencies
 */
import useGoogleMCAccount from '.~/hooks/useGoogleMCAccount';
import ConnectAccountCard from '../connect-account-card';
import ConnectMCBody from './connect-mc-body';
import ConnectMCFooter from './connect-mc-footer';
import SpinnerCard from '.~/components/spinner-card';
import AccountConnectionStatus from '.~/components/google-mc-account-card/connect-mc/account-connection-status';
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
		<ConnectAccountCard
			className={ classNames( 'gla-google-combo-account-card--mc', {
				'gla-google-combo-account-card--connected': isGoogleMCReady,
			} ) }
			title={ __(
				'Connect to existing Merchant Center account',
				'google-listings-and-ads'
			) }
			helper={ __(
				'Required to sync products so they show on Google.',
				'google-listings-and-ads'
			) }
			body={
				<ConnectMCBody
					value={ accountID }
					setValue={ setAccountID }
					isConnected={ isGoogleMCReady }
					isConnecting={ resultConnectMC.loading }
					handleConnectMC={ handleConnectMC }
				/>
			}
			footer={
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
