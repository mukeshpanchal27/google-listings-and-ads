/**
 * Internal dependencies
 */
import { GOOGLE_ADS_ACCOUNT_STATUS } from '~/constants';

/**
 * Helper for determining whether to show the ads conversion notice based on the
 * Google Ads account status and step.
 *
 * @param {Object} googleAdsAccount A Google Ads account object.
 * @return {boolean} Whether to show the ads conversion notice.
 */
export default function showAdsConversionNotice( googleAdsAccount ) {
	return (
		googleAdsAccount?.status === GOOGLE_ADS_ACCOUNT_STATUS.CONNECTED ||
		[ 'link_merchant', 'billing' ].includes( googleAdsAccount?.step )
	);
}
