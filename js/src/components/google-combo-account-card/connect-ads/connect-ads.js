/**
 * External dependencies
 */
import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import useDispatchCoreNotices from '.~/hooks/useDispatchCoreNotices';
import useGoogleAdsAccount from '.~/hooks/useGoogleAdsAccount';
import { useAppDispatch } from '.~/data';
import useGoogleAdsAccountReady from '.~/hooks/useGoogleAdsAccountReady';
import AccountCard from '.~/components/account-card';
import ConnectAdsFooter from './connect-ads-footer';
import ConfirmCreateModal from './confirm-create-modal';
import LoadingLabel from '.~/components/loading-label';
import useApiFetchCallback from '.~/hooks/useApiFetchCallback';
import useUpsertAdsAccount from '.~/hooks/useUpsertAdsAccount';
import useExistingGoogleAdsAccounts from '.~/hooks/useExistingGoogleAdsAccounts';
import AdsAccountSelectControl from '.~/components/ads-account-select-control';
import ConnectedIconLabel from '.~/components/connected-icon-label';
import ConnectButton from '.~/components/google-ads-account-card/connect-ads/connect-button';

/**
 * ConnectAds component renders an account card to connect to an existing Google Ads account.
 *
 * @param {Object} props Component props.
 * @param {boolean} props.finalizeAdsAccountCreation Whether the user is in the process of finalizing the Ads account creation, i.e after the user has claimed the account and the step is conversion_action.
 * @return {JSX.Element} {@link AccountCard} filled with content.
 */
const ConnectAds = ( { finalizeAdsAccountCreation } ) => {
	const [ value, setValue ] = useState();
	const [ isLoading, setLoading ] = useState( false );
	const { createNotice } = useDispatchCoreNotices();
	const { fetchGoogleAdsAccountStatus } = useAppDispatch();
	const isConnected = useGoogleAdsAccountReady();
	const [ showCreateNewModal, setShowCreateNewModal ] = useState( false );
	const { hasFinishedResolution } = useExistingGoogleAdsAccounts();
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

	// Show a loading state if the Ads account is being updated or if a new Ads account is being created.
	// If finalizeAdsAccountCreation is true, the processing is done in `ConnectedGoogleComboAccountCard`.
	if ( creatingNewAccount || finalizeAdsAccountCreation ) {
		let title = __(
			'Creating a new Google Ads account',
			'google-listings-and-ads'
		);
		let indicatorLabel = __( 'Creating…', 'google-listings-and-ads' );

		if ( finalizeAdsAccountCreation ) {
			title = __(
				'Connecting your Google Ads account',
				'google-listings-and-ads'
			);
			indicatorLabel = __( 'Connecting…', 'google-listings-and-ads' );
		}

		return (
			<AccountCard
				className="gla-google-combo-service-account-card--ads"
				title={ title }
				helper={ __(
					'This may take a few minutes, please wait a moment…',
					'google-listings-and-ads'
				) }
				indicator={ <LoadingLabel text={ indicatorLabel } /> }
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
