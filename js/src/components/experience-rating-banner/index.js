/**
 * External dependencies
 */
import { useState } from '@wordpress/element';
import { Notice, Icon } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { external as externalIcon } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import AppButton from '../app-button';
import FeedbackModal from './feedback-modal';
import './index.scss';

const ExperienceRatingBanner = () => {
	const [ showModal, setShowModal ] = useState( false );

	const handleClick = () => {
		// Open the feedback modal
		setShowModal( true );
	};

	const handleRequestClose = () => {
		// Close the feedback modal
		setShowModal( false );
	};

	return (
		<div className="gla-experience-rating-banner__container">
			{ showModal && (
				<FeedbackModal onRequestClose={ handleRequestClose } />
			) }
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
						<Icon icon={ externalIcon } size={ 12 } />
					</AppButton>
				</div>
			</Notice>
		</div>
	);
};

export default ExperienceRatingBanner;
