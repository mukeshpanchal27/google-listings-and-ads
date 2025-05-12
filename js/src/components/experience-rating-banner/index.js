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
import './index.scss';

const ExperienceRatingBanner = () => {
	const handleClick = () => false;

	return (
		<Notice
			className="gla-experience-rating-banner"
			status="info"
			isDismissible={ true }
		>
			<div className="gla-experience-rating-banner__text">
				{ __(
					'How was your experience with Google for WooCommerce?',
					'google-listings-and-ads'
				) }
			</div>

			<div className="gla-experience-rating-banner__actions">
				<AppButton
					className="gla-experience-rating-banner__button"
					onClick={ handleClick }
					isSecondary
				>
					{ __( 'Good', 'google-listings-and-ads' ) }
				</AppButton>

				<AppButton
					className="gla-experience-rating-banner__button"
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
