/**
 * External dependencies
 */
import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import AppButton from '.~/components/app-button';
import AccountCard from '.~/components/account-card';
import useConnectMCAccount from '.~/hooks/useConnectMCAccount';
import useGoogleMCAccount from '.~/hooks/useGoogleMCAccount';
import SwitchUrlCard from '../switch-url-card';
import ReclaimUrlCard from '../reclaim-url-card';
import LoadingLabel from '.~/components/loading-label';
import ConnectedIconLabel from '.~/components/connected-icon-label';
import MerchantCenterSelect from './merchant-center-select';
import Actions from './actions';
import CreatingCard from '../creating-card';
import './index.scss';

/**
 * Clicking on the button to connect an existing Google Merchant Center account.
 *
 * @event gla_mc_account_connect_button_click
 * @property {number} id The account ID to be connected.
 */

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
 * @fires gla_mc_account_connect_button_click
 * @param {Object} props
 * @param {Function} props.createMCAccount Callback function for creating a new Merchant Center account.
 * @param {Object} props.resultCreateMCAccount The result of the create account request.
 * @param {string} [className] Additional class name to be added to the card.
 */
const ConnectMC = ( { createMCAccount, resultCreateMCAccount, className } ) => {
	const [ value, setValue ] = useState();
	const [ handleConnectMC, resultConnectMC ] = useConnectMCAccount( value );
	const {
		googleMCAccount,
		hasFinishedResolution,
		isReady: isGoogleMCReady,
	} = useGoogleMCAccount();

	useEffect( () => {
		if ( isGoogleMCReady ) {
			setValue( googleMCAccount.id );
		}
	}, [ googleMCAccount, isGoogleMCReady ] );

	if ( resultConnectMC.response?.status === 409 ) {
		return (
			<SwitchUrlCard
				id={ resultConnectMC.error.id }
				message={ resultConnectMC.error.message }
				claimedUrl={ resultConnectMC.error.claimed_url }
				newUrl={ resultConnectMC.error.new_url }
				onSelectAnotherAccount={ resultConnectMC.reset }
			/>
		);
	}

	if (
		resultConnectMC.response?.status === 403 ||
		resultCreateMCAccount.response?.status === 403
	) {
		return (
			<ReclaimUrlCard
				id={
					resultConnectMC.error?.id || resultCreateMCAccount.error?.id
				}
				websiteUrl={
					resultConnectMC.error?.website_url ||
					resultCreateMCAccount.error?.website_url
				}
				onSwitchAccount={ () => {
					resultConnectMC.reset();
					resultCreateMCAccount.reset();
				} }
			/>
		);
	}

	if (
		resultCreateMCAccount.loading ||
		resultCreateMCAccount.response?.status === 503
	) {
		return (
			<CreatingCard
				retryAfter={ resultCreateMCAccount.error?.retry_after }
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
				eventProps={ { id: Number( value ) } }
				onClick={ handleConnectMC }
			>
				{ __( 'Connect', 'google-listings-and-ads' ) }
			</AppButton>
		);
	};

	return (
		<AccountCard
			className={ classnames( 'gla-connect-mc-card', className ) }
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
					value={ value }
					onChange={ setValue }
				/>
			}
			actions={
				<Actions
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
