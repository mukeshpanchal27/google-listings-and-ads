/**
 * External dependencies
 */
import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import AccountCard from '.~/components/account-card';
import useApiFetchCallback from '.~/hooks/useApiFetchCallback';
import useDispatchCoreNotices from '.~/hooks/useDispatchCoreNotices';
import useGoogleAdsAccount from '.~/hooks/useGoogleAdsAccount';
import { useAppDispatch } from '.~/data';
import useExistingGoogleAdsAccounts from '.~/hooks/useExistingGoogleAdsAccounts';
import useGoogleAdsAccountReady from '.~/hooks/useGoogleAdsAccountReady';
import ConnectAccountCard from '../connect-account-card';
import ConnectAdsFooter from './connect-ads-footer';
import ConnectAdsBody from './connect-ads-body';

/**
 * ConnectAds component renders an account card to connect to an existing Google Ads account.
 *
 * @return {JSX.Element} {@link AccountCard} filled with content.
 */
const ConnectAds = ( { isEditing = false } ) => {
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
	const [ connectGoogleAdsAccount ] = useApiFetchCallback( {
		path: '/wc/gla/ads/accounts',
		method: 'POST',
		data: { id: value },
	} );

	const { refetchGoogleAdsAccount } = useGoogleAdsAccount();
	const { createNotice } = useDispatchCoreNotices();
	const { fetchGoogleAdsAccountStatus } = useAppDispatch();

	useEffect( () => {
		if ( isConnected ) {
			setValue( googleAdsAccount.id );
		}
	}, [ googleAdsAccount, isConnected ] );

	if ( isConnected && ! isEditing ) {
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
			await refetchGoogleAdsAccount();
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

	// If the accounts are still being fetched, we don't want to show the card.
	if (
		! hasFinishedResolutionForExistingAdsAccount ||
		! hasFinishedResolutionForCurrentAccount ||
		! accounts?.length
	) {
		return null;
	}

	return (
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
					onClick={ handleConnectClick }
					isLoading={ isLoading }
					setValue={ setValue }
					accountID={ value }
				/>
			}
			footer={
				<ConnectAdsFooter
					isConnected={ isConnected }
					disabled={ isLoading }
				/>
			}
		/>
	);
};

export default ConnectAds;
