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
import ConfirmCreateModal from './confirm-create-modal';
import LoadingLabel from '.~/components/loading-label';
import useApiFetchCallback from '.~/hooks/useApiFetchCallback';
import useUpsertAdsAccount from '.~/hooks/useUpsertAdsAccount';
import useDispatchCoreNotices from '.~/hooks/useDispatchCoreNotices';
import useExistingGoogleAdsAccounts from '.~/hooks/useExistingGoogleAdsAccounts';
import useGoogleAdsAccount from '.~/hooks/useGoogleAdsAccount';
import useGoogleAdsAccountReady from '.~/hooks/useGoogleAdsAccountReady';
import { useAppDispatch } from '.~/data';
import AdsAccountSelectControl from '.~/components/ads-account-select-control';
import ConnectedIconLabel from '.~/components/connected-icon-label';
import ConnectButton from '.~/components/google-ads-account-card/connect-ads/connect-button';

/**
 * ConnectAds component renders an account card to connect to an existing Google Ads account.
 *
 * @return {JSX.Element} {@link AccountCard} filled with content.
 */
const ConnectAds = () => {
	const [ value, setValue ] = useState();
	const [ isLoading, setLoading ] = useState( false );
	const { createNotice } = useDispatchCoreNotices();
	const { fetchGoogleAdsAccountStatus } = useAppDispatch();
	const isConnected = useGoogleAdsAccountReady();
	const [ showCreateNewModal, setShowCreateNewModal ] = useState( false );
	const { existingAccounts: accounts } = useExistingGoogleAdsAccounts();
	const { googleAdsAccount, refetchGoogleAdsAccount } = useGoogleAdsAccount();
	const [ connectGoogleAdsAccount ] = useApiFetchCallback( {
		path: '/wc/gla/ads/accounts',
		method: 'POST',
		data: { id: value },
	} );
	const [ upsertAdsAccount, { loading: creatingNewAccount } ] =
		useUpsertAdsAccount();

	const onCreateNew = () => {
		setShowCreateNewModal( true );
	};

	const handleOnRequestClose = () => {
		setShowCreateNewModal( false );
	};

	const handleOnContinue = async () => {
		setShowCreateNewModal( false );
		await upsertAdsAccount();
	};

	useEffect( () => {
		if ( isConnected ) {
			setValue( googleAdsAccount.id );
		}
	}, [ googleAdsAccount, isConnected ] );

	const handleConnectClick = async () => {
		if ( ! value ) {
			return;
		}

		setLoading( true );
		try {
			await connectGoogleAdsAccount();
			await fetchGoogleAdsAccountStatus();
			refetchGoogleAdsAccount();
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

	if ( ! accounts?.length ) {
		return null;
	}

	const getIndicator = () => {
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

	if ( creatingNewAccount ) {
		return (
			<AccountCard
				className="gla-google-combo-service-account-card--ads"
				title={ __(
					'Creating a new Google Ads account',
					'google-listings-and-ads'
				) }
				helper={ __(
					'This may take a few minutes, please wait a moment…',
					'google-listings-and-ads'
				) }
				indicator={
					<LoadingLabel
						text={ __( 'Creating…', 'google-listings-and-ads' ) }
					/>
				}
			/>
		);
	}

	return (
		<>
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
						nonInteractive={ isConnected }
					/>
				}
				actions={
					<ConnectAdsFooter
						disabled={ isLoading }
						isConnected={ isConnected }
						onCreateNew={ onCreateNew }
					/>
				}
			/>

			{ showCreateNewModal && (
				<ConfirmCreateModal
					onContinue={ handleOnContinue }
					onRequestClose={ handleOnRequestClose }
				/>
			) }
		</>
	);
};

export default ConnectAds;
