/**
 * External dependencies
 */
import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import AccountCard from '.~/components/account-card';
import ConnectAccountCard from '../connect-account-card';
import ConnectAdsFooter from './connect-ads-footer';
import ConnectAdsBody from './connect-ads-body';
import ConfirmCreateModal from './confirm-create-modal';
import LoadingLabel from '.~/components/loading-label';
import useApiFetchCallback from '.~/hooks/useApiFetchCallback';
import useUpsertAdsAccount from '.~/hooks/useUpsertAdsAccount';
import useDispatchCoreNotices from '.~/hooks/useDispatchCoreNotices';
import useExistingGoogleAdsAccounts from '.~/hooks/useExistingGoogleAdsAccounts';
import useGoogleAdsAccount from '.~/hooks/useGoogleAdsAccount';
import useGoogleAdsAccountReady from '.~/hooks/useGoogleAdsAccountReady';
import useGoogleAdsAccountStatus from '.~/hooks/useGoogleAdsAccountStatus';
import { useAppDispatch } from '.~/data';

/**
 * ConnectAds component renders an account card to connect to an existing Google Ads account.
 *
 * @param {Object} props Component props.
 * @param {boolean} props.isEditing Whether in edit mode where the card is expanded.
 * @return {JSX.Element} {@link AccountCard} filled with content.
 */
const ConnectAds = ( { isEditing } ) => {
	const [ showCreateNewModal, setShowCreateNewModal ] = useState( false );
	const [ value, setValue ] = useState();
	const [ isLoading, setLoading ] = useState( false );
	const { createNotice } = useDispatchCoreNotices();
	const { fetchGoogleAdsAccountStatus } = useAppDispatch();
	const isConnected = useGoogleAdsAccountReady();
	const {
		hasAccess,
		hasFinishedResolution: hasFinishedResolutionForAccountStatus,
	} = useGoogleAdsAccountStatus();
	const {
		existingAccounts: accounts,
		hasFinishedResolution: hasFinishedResolutionForExistingAdsAccount,
	} = useExistingGoogleAdsAccounts();
	const {
		googleAdsAccount,
		refetchGoogleAdsAccount,
		hasFinishedResolution: hasFinishedResolutionForCurrentAccount,
	} = useGoogleAdsAccount();
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

	const shouldClaimGoogleAdsAccount = Boolean(
		googleAdsAccount?.id && hasAccess === false
	);

	if (
		// @TODO: review condition to display the component once 2596 and 2597 have been merged.
		! isEditing ||
		shouldClaimGoogleAdsAccount
	) {
		return null;
	}

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

	if ( creatingNewAccount ) {
		return (
			<ConnectAccountCard
				className="gla-google-combo-service-account-card--ads"
				title={ __(
					'Creating a new Google Ads account',
					'google-listings-and-ads'
				) }
				helperText={ __(
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
			<ConnectAccountCard
				className="gla-google-combo-service-account-card--ads"
				title={ __(
					'Connect to existing Google Ads account',
					'google-listings-and-ads'
				) }
				helperText={ __(
					'Required to set up conversion measurement for your store.',
					'google-listings-and-ads'
				) }
				body={
					<ConnectAdsBody
						hasResolvedAccounts={
							hasFinishedResolutionForExistingAdsAccount &&
							hasFinishedResolutionForCurrentAccount &&
							hasFinishedResolutionForAccountStatus &&
							isConnected !== null
						}
						isConnected={ isConnected }
						onClick={ handleConnectClick }
						isLoading={ isLoading }
						setValue={ setValue }
						accountID={ value }
					/>
				}
				footer={
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
