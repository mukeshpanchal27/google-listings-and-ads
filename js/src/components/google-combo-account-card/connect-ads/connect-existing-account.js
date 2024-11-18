/**
 * External dependencies
 */
import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import AccountCard from '.~/components/account-card';
import ConnectAdsFooter from './connect-ads-footer';
import LoadingLabel from '.~/components/loading-label';
import useApiFetchCallback from '.~/hooks/useApiFetchCallback';
import useDispatchCoreNotices from '.~/hooks/useDispatchCoreNotices';
import useGoogleAdsAccount from '.~/hooks/useGoogleAdsAccount';
import { useAppDispatch } from '.~/data';
import useGoogleAdsAccountReady from '.~/hooks/useGoogleAdsAccountReady';
import AdsAccountSelectControl from '.~/components/ads-account-select-control';
import ConnectedIconLabel from '.~/components/connected-icon-label';
import ConnectButton from '.~/components/google-ads-account-card/connect-ads/connect-button';

/**
 * Renders an account card to connect to an existing Google Ads account.
 *
 * @param {Object} props Component props.
 * @param {Function} props.onCreateClick Callback when clicking on the button to create a new account
 */
const ConnectExistingAccount = ( { onCreateClick } ) => {
	const [ value, setValue ] = useState();
	const [ isLoading, setLoading ] = useState( false );
	const { createNotice } = useDispatchCoreNotices();
	const { fetchGoogleAdsAccountStatus } = useAppDispatch();
	const isConnected = useGoogleAdsAccountReady();
	const {
		googleAdsAccount,
		hasFinishedResolution,
		hasGoogleAdsConnection,
		refetchGoogleAdsAccount,
	} = useGoogleAdsAccount();
	const [ connectGoogleAdsAccount ] = useApiFetchCallback( {
		path: '/wc/gla/ads/accounts',
		method: 'POST',
		data: { id: value },
	} );

	useEffect( () => {
		if ( hasGoogleAdsConnection ) {
			setValue( googleAdsAccount.id );
		}
	}, [ googleAdsAccount, hasGoogleAdsConnection ] );

	const handleConnectClick = async () => {
		if ( ! value ) {
			return;
		}

		setLoading( true );
		try {
			await connectGoogleAdsAccount();
			await fetchGoogleAdsAccountStatus();
			await refetchGoogleAdsAccount();
		} catch ( error ) {
			createNotice(
				'error',
				__(
					'Unable to connect your Google Ads account. Please try again later.',
					'google-listings-and-ads'
				)
			);
		} finally {
			setLoading( false );
		}
	};

	const getIndicator = () => {
		if ( ! hasFinishedResolution ) {
			return <LoadingLabel />;
		}

		if ( isLoading ) {
			return (
				<LoadingLabel
					text={ __( 'Connecting…', 'google-listings-and-ads' ) }
				/>
			);
		}

		if ( isConnected ) {
			return <ConnectedIconLabel />;
		}

		return (
			<ConnectButton accountID={ value } onClick={ handleConnectClick } />
		);
	};

	return (
		<AccountCard
			className="gla-google-combo-account-card gla-google-combo-service-account-card--ads"
			title={ __(
				'Connect to existing Google Ads account',
				'google-listings-and-ads'
			) }
			helper={ __(
				'Required to set up conversion measurement for your store.',
				'google-listings-and-ads'
			) }
			alignIndicator="toDetail"
			indicator={ getIndicator() }
			detail={
				<AdsAccountSelectControl
					value={ value }
					onChange={ setValue }
					autoSelectFirstOption
					nonInteractive={ hasGoogleAdsConnection }
				/>
			}
			actions={
				<ConnectAdsFooter
					disabled={ isLoading }
					isConnected={ hasGoogleAdsConnection }
					onCreateNewClick={ onCreateClick }
				/>
			}
		/>
	);
};

export default ConnectExistingAccount;
