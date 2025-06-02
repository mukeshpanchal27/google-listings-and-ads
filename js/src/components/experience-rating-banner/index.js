/**
 * External dependencies
 */
import { Notice, Icon } from '@wordpress/components';
import { useDispatch } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { external as externalIcon } from '@wordpress/icons';
import { store as preferencesStore } from '@wordpress/preferences';

/**
 * Internal dependencies
 */
import AppButton from '../app-button';
import FeedbackModal from './feedback-modal';
import usePreference from '~/hooks/usePreference';
import { PREFERENCES_STORE_NAMESPACE } from '~/constants';
import './index.scss';

const BANNER_DISMISSED_KEY = 'experience-rating-banner-dismissed';

const ExperienceRatingBanner = () => {
	const [ showModal, setShowModal ] = useState( false );
	const { set } = useDispatch( preferencesStore );
	const isDismissed = usePreference( BANNER_DISMISSED_KEY );

	const handleClick = () => {
		setShowModal( true );
	};

	const handleRequestClose = () => {
		setShowModal( false );
	};

	const onDismiss = () => {
		set( PREFERENCES_STORE_NAMESPACE, BANNER_DISMISSED_KEY, true );
	};

	if ( isDismissed ) {
		return null;
	}

	return (
		<div className="gla-experience-rating-banner__container">
			{ showModal && (
				<FeedbackModal onRequestClose={ handleRequestClose } />
			) }
			<Notice
				className="gla-experience-rating-banner"
				status="info"
				isDismissible={ true }
				onRemove={ onDismiss }
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
