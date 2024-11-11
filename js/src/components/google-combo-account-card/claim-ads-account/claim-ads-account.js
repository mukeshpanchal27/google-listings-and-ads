/**
 * External dependencies
 */
import { useCallback, useState, useRef } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import ClaimAccountButton from '.~/components/google-ads-account-card/claim-account-button';
import { useAppDispatch } from '.~/data';
import useWindowFocusCallbackIntervalEffect from '.~/hooks/useWindowFocusCallbackIntervalEffect';
import './claim-ads-account.scss';

const CLAIM_RETRIES = 3;

/**
 * ClaimAdsAccount component.
 *
 * @return {JSX.Element} ClaimAdsAccount component.
 */
const ClaimAdsAccount = () => {
	const [ claiming, setClaiming ] = useState( false );
	const retries = useRef( CLAIM_RETRIES );
	const { fetchGoogleAdsAccountStatus } = useAppDispatch();

	const checkUpdatedAdsAccountStatus = useCallback( async () => {
		if ( ! claiming ) {
			return;
		}

		await fetchGoogleAdsAccountStatus()
			.then( () => {
				retries.current -= 1;
				// Reset the claiming state after 3 retries.
				if ( retries.current < 1 ) {
					setClaiming( false );
				}
			} )
			.catch( () => {
				// Reset the claiming state if the API call fails.
				setClaiming( false );
			} );
	}, [ claiming, fetchGoogleAdsAccountStatus ] );

	useWindowFocusCallbackIntervalEffect( checkUpdatedAdsAccountStatus, 30 );

	const handleOnClick = () => {
		// Reset retries.
		retries.current = CLAIM_RETRIES;
		setClaiming( true );
	};

	return (
		<div className="gla-claim-ads-account-box">
			<h4>
				{ __(
					'Claim your Google Ads account',
					'google-listings-and-ads'
				) }
			</h4>
			<p>
				{ __(
					'You need to accept the invitation to the Google Ads account we created for you. This gives you access to Google Ads and sets up conversion measurement. You must claim your account in the next 20 days.',
					'google-listings-and-ads'
				) }
			</p>
			<p className="gla-ads-post-claim-instructions">
				{ __(
					'After accepting the invitation, you’ll be prompted to set up billing. We highly recommend doing this to avoid having to do it later on.',
					'google-listings-and-ads'
				) }
			</p>
			<ClaimAccountButton
				loading={ claiming }
				text={
					claiming
						? __( 'Waiting…', 'google-listings-and-ads' )
						: __(
								'Claim account in Google Ads',
								'google-listings-and-ads'
						  )
				}
				isPrimary={ ! claiming }
				onClick={ handleOnClick }
			/>
		</div>
	);
};

export default ClaimAdsAccount;
