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
import useApiFetchCallback from '.~/hooks/useApiFetchCallback';
import useCreateAccountActions from './useCreateAccountActions';
import useDispatchCoreNotices from '.~/hooks/useDispatchCoreNotices';
import useExistingGoogleAdsAccounts from '.~/hooks/useExistingGoogleAdsAccounts';
import useGoogleAdsAccount from '.~/hooks/useGoogleAdsAccount';
import useGoogleAdsAccountReady from '.~/hooks/useGoogleAdsAccountReady';
import { useAppDispatch } from '.~/data';
import LoadingLabel from '.~/components/loading-label/loading-label';

/**
 * ConnectAds component renders an account card to connect to an existing Google Ads account.
 *
 * @fires gla_documentation_link_click with `{ context: 'setup-ads-connect-account', link_id: 'connect-sub-account', href: 'https://support.google.com/google-ads/answer/6139186' }`
 * @return {JSX.Element} {@link AccountCard} filled with content.
 */
const ConnectAds = () => {
	const {
		existingAccounts: accounts,
		hasFinishedResolution: hasFinishedResolutionForExistingAdsAccount,
	} = useExistingGoogleAdsAccounts();

	const {
		googleAdsAccount,
		hasFinishedResolution: hasFinishedResolutionForCurrentAccount,
	} = useGoogleAdsAccount();

	const isConnected = useGoogleAdsAccountReady();

	const [ value, setValue ] = useState();
	const [ isLoading, setLoading ] = useState( false );
	const [ fetchConnectAdsAccount ] = useApiFetchCallback( {
		path: '/wc/gla/ads/accounts',
		method: 'POST',
		data: { id: value },
	} );

	const { refetchGoogleAdsAccount } = useGoogleAdsAccount();
	const { createNotice } = useDispatchCoreNotices();
	const { fetchGoogleAdsAccountStatus } = useAppDispatch();
	const {
		creatingNewAccount,
		showCreateNewModal,
		onContinue,
		onCreateNew,
		onRequestClose,
	} = useCreateAccountActions();

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
			await fetchConnectAdsAccount();
			await fetchGoogleAdsAccountStatus();
			refetchGoogleAdsAccount();
			setLoading( false );
		} catch ( error ) {
			setLoading( false );
			createNotice(
				'error',
				__(
					'Unable to connect your Google Ads account. Please try again later.',
					'google-listings-and-ads'
				)
			);
		}
	};

	if ( creatingNewAccount ) {
		return (
			<AccountCard
				description={
					<LoadingLabel
						text={ __(
							'Creating new ads account',
							'google-listings-and-ads'
						) }
					/>
				}
			/>
		);
	}

	// If the accounts are still being fetched, we don't want to show the card.
	if (
		! hasFinishedResolutionForExistingAdsAccount ||
		! hasFinishedResolutionForCurrentAccount ||
		! accounts?.length
	) {
		return null;
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
						isConnected={ isConnected }
						handleConnectClick={ handleConnectClick }
						isLoading={ isLoading }
						setValue={ setValue }
						value={ value }
					/>
				}
				footer={
					<ConnectAdsFooter
						onCreateNew={ onCreateNew }
						isConnected={ isConnected }
					/>
				}
			/>
			{ showCreateNewModal && (
				<ConfirmCreateModal
					onContinue={ onContinue }
					onRequestClose={ onRequestClose }
				/>
			) }
		</>
	);
};

export default ConnectAds;
