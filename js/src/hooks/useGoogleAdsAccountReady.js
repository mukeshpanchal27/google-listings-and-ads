/**
 * Internal dependencies
 */
import useGoogleAdsAccount from '~/hooks/useGoogleAdsAccount';
import useGoogleAdsAccountStatus from '~/hooks/useGoogleAdsAccountStatus';

/**
 * Hook to check if the Google Ads account is ready.
 * This is used to determine if the user can proceed to the next step.
 *
 * @return {boolean|null} Whether the Google Ads account is ready. `null` if the state is not yet determined.
 */
const useGoogleAdsAccountReady = () => {
	const {
		hasGoogleAdsConnection,
		hasFinishedResolution: adsAccountResolved,
	} = useGoogleAdsAccount();
	const {
		hasAccess,
		step,
		hasFinishedResolution: adsAccountStatusResolved,
	} = useGoogleAdsAccountStatus();

	if ( ! adsAccountResolved || ! adsAccountStatusResolved ) {
		return null;
	}

	return (
		hasGoogleAdsConnection &&
		hasAccess &&
		[ '', 'billing', 'link_merchant' ].includes( step )
	);
};

export default useGoogleAdsAccountReady;
