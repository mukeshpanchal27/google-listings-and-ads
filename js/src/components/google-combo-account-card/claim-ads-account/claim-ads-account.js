/**
 * External dependencies
 */
import { useCallback, useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import ClaimAccountButton from '.~/components/google-ads-account-card/claim-account-button';
import Section from '.~/wcdl/section';
import useGoogleAdsAccountStatus from '.~/hooks/useGoogleAdsAccountStatus';
import { useAppDispatch } from '.~/data';
import useGoogleAdsAccount from '.~/hooks/useGoogleAdsAccount';
import useUpsertAdsAccount from '.~/hooks/useUpsertAdsAccount';
import useWindowFocusCallbackIntervalEffect from '.~/hooks/useWindowFocusCallbackIntervalEffect';
import './claim-ads-account.scss';

/**
 * ClaimAdsAccount component.
 *
 * @return {JSX.Element} ClaimAdsAccount component.
 */
const ClaimAdsAccount = () => {
	const [ updating, setUpdating ] = useState( false );
	const { googleAdsAccount } = useGoogleAdsAccount();
	const { fetchGoogleAdsAccountStatus } = useAppDispatch();
	const { hasAccess, step } = useGoogleAdsAccountStatus();
	const [ upsertAdsAccount ] = useUpsertAdsAccount();

	const shouldClaimGoogleAdsAccount = Boolean(
		googleAdsAccount.id && hasAccess === false
	);

	const checkUpdatedAdsAccountStatus = useCallback( async () => {
		if ( ! shouldClaimGoogleAdsAccount ) {
			return;
		}

		setUpdating( true );
		await fetchGoogleAdsAccountStatus();
		setUpdating( false );
	}, [ fetchGoogleAdsAccountStatus, shouldClaimGoogleAdsAccount ] );

	useWindowFocusCallbackIntervalEffect( checkUpdatedAdsAccountStatus, 30 );

	useEffect( () => {
		if ( hasAccess === true && step === 'conversion_action' ) {
			upsertAdsAccount();
		}
	}, [ hasAccess, step, upsertAdsAccount ] );

	if ( ! shouldClaimGoogleAdsAccount ) {
		return null;
	}

	return (
		<Section.Card.Body className="gla-claim-ads-account-section">
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
					loading={ updating }
					text={
						updating
							? __( 'Updating…', 'google-listings-and-ads' )
							: __(
									'Claim your Google Ads account',
									'google-listings-and-ads'
							  )
					}
					isPrimary={ ! updating }
				/>
			</div>
		</Section.Card.Body>
	);
};

export default ClaimAdsAccount;
