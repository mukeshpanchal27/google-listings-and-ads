/**
 * External dependencies
 */
import { Notice, Icon } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { external as externalIcon } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import AppButton from '../app-button';
import { REPORT_SOURCE_PAID } from '~/constants';
import useMCProductStatistics from '~/hooks/useMCProductStatistics';
import useGoogleMCAccount from '~/hooks/useGoogleMCAccount';
import useProductsReport from '~/pages/reports/products/useProductsReport';
import './index.scss';

const ExperienceRatingBanner = () => {
	const { data: statisticsData } = useMCProductStatistics();
	const { isReady: isMCAccountReady } = useGoogleMCAccount();
	const { data: productsReport } = useProductsReport( REPORT_SOURCE_PAID );

	const totalProducts = Object.values(
		statisticsData?.statistics || {}
	).reduce( ( total, value ) => total + value, 0 );

	const notSyncedProducts = statisticsData?.statistics?.not_synced || 0;
	const activeProducts = statisticsData?.statistics?.active || 0;
	const conversions = productsReport?.totals?.conversions?.value || 0;

	const isApproved = ( activeProducts / totalProducts ) * 100 >= 70;
	const isSynced = notSyncedProducts === 0 && activeProducts > 0;
	const isReady = isMCAccountReady;
	const hasConversions = conversions > 0;

	const shouldDisplayBanner =
		isApproved && isSynced && isReady && hasConversions;

	if ( ! shouldDisplayBanner ) {
		return null;
	}

	const handleClick = () => false;

	return (
		<Notice
			className="gla-experience-rating-banner"
			status="info"
			isDismissible={ true }
		>
			<p className="gla-experience-rating-banner__text">
				{ __(
					'How was your experience with Google for WooCommerce?',
					'google-listings-and-ads'
				) }
			</p>

			<div className="gla-experience-rating-banner__actions">
				<AppButton onClick={ handleClick } isSecondary>
					{ __( 'Good', 'google-listings-and-ads' ) }
				</AppButton>

				<AppButton
					isSecondary
					href="https://woocommerce.com"
					target="_blank"
				>
					{ __( 'Need help', 'google-listings-and-ads' ) }
					<Icon icon={ externalIcon } size={ 18 } />
				</AppButton>
			</div>
		</Notice>
	);
};

export default ExperienceRatingBanner;
