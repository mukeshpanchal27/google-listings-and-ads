/**
 * Internal dependencies
 */
import { GOOGLE_ADS_ACCOUNT_STATUS } from '~/constants';
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
		googleAdsAccount,
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

	// A temorary fix to prevent the user from proceeding when the link merchant step failed but hasAccess is true.
	const linkMerchantFailed =
		hasAccess &&
		step === 'link_merchant' &&
		googleAdsAccount?.status === GOOGLE_ADS_ACCOUNT_STATUS.INCOMPLETE;

	return (
		! linkMerchantFailed &&
		hasGoogleAdsConnection &&
		hasAccess &&
		[ '', 'billing', 'link_merchant' ].includes( step )
	);
};

export default useGoogleAdsAccountReady;
