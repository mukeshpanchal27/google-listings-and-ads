/**
 * Internal dependencies
 */
import usePreference from '~/hooks/usePreference';
import useGoogleAdsAccount from '~/hooks/useGoogleAdsAccount';
import Banner from './banner';
import { BANNER_DISMISSED_KEY } from './constants';
import './index.scss';

/**
 * ExperienceRatingBanner component.
 *
 * Displays a banner asking users to rate their experience with Google for WooCommerce.
 *
 * @return {JSX.Element|null} The ExperienceRatingBanner component, or null if dismissed or Ads account is disconnected.
 */
const ExperienceRatingBanner = () => {
	const { hasGoogleAdsConnection } = useGoogleAdsAccount();
	const isDismissed = usePreference( BANNER_DISMISSED_KEY );

	if ( ! hasGoogleAdsConnection || isDismissed ) {
		return null;
	}

	return <Banner />;
};

export default ExperienceRatingBanner;
