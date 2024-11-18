/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { createInterpolateElement } from '@wordpress/element';
import { Icon } from '@wordpress/components';
import { external as externalIcon } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import ClaimAccountButton from '.~/components/google-ads-account-card/claim-account-button';
import { useAppDispatch } from '.~/data';
import useWindowFocusCallbackIntervalEffect from '.~/hooks/useWindowFocusCallbackIntervalEffect';
import './claim-ads-account.scss';

/**
 * ClaimAdsAccount component.
 *
 * @return {JSX.Element} ClaimAdsAccount component.
 */
const ClaimAdsAccount = () => {
	const { fetchGoogleAdsAccountStatus } = useAppDispatch();
	useWindowFocusCallbackIntervalEffect( fetchGoogleAdsAccountStatus, 30 );

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
			<ClaimAccountButton isPrimary>
				{ __(
					'Claim account in Google Ads',
					'google-listings-and-ads'
				) }
				<Icon icon={ externalIcon } size={ 20 } />
			</ClaimAccountButton>
		</div>
	);
};

export default ClaimAdsAccount;
