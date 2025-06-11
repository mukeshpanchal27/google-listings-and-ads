/**
 * External dependencies
 */
import { Notice, Icon } from '@wordpress/components';
import { useDispatch } from '@wordpress/data';
import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { external as externalIcon } from '@wordpress/icons';
import { store as preferencesStore } from '@wordpress/preferences';

/**
 * Internal dependencies
 */
import AppButton from '../app-button';
import FeedbackModal from './feedback-modal';
import { recordGlaEvent } from '~/utils/tracks';
import usePreference from '~/hooks/usePreference';
import {
	APP_RATINGS_BANNER_CONTEXT,
	PREFERENCES_STORE_NAMESPACE,
} from '~/constants';
import './index.scss';

const BANNER_DISMISSED_KEY = 'experience-rating-banner-dismissed';

/**
 * Fired when the experience rating banner is displayed to the user.
 *
 * @event gla_app_ratings_shown
 * @property {string} context The context in which the event is triggered.
 */

/**
 * Fired when the user clicks the "Good" button on the banner.
 *
 * @event gla_app_ratings_good_clicked
 * @property {string} context The context in which the event is triggered.
 */

/**
 * Fired when the feedback modal is closed by the user.
 *
 * @event gla_app_ratings_close
 * @property {string} context The context in which the event is triggered.
 */

/**
 * Fired when the user clicks the "Need help" button on the banner.
 *
 * @event gla_app_ratings_need_help_clicked
 * @property {string} context The context in which the event is triggered.
 */

/**
 * ExperienceRatingBanner component.
 *
 * Displays a dismissible banner asking users to rate their experience with Google for WooCommerce.
 * Handles user interactions such as clicking "Good", "Need help", and dismissing the banner,
 * and records corresponding events. Shows a feedback modal when "Good" is clicked.
 *
 * @return {JSX.Element|null} The ExperienceRatingBanner component, or null if dismissed.
 *
 * @fires gla_app_ratings_shown - Fired when the banner is shown.
 * @fires gla_app_ratings_good_clicked - Fired when the "Good" button is clicked.
 * @fires gla_app_ratings_close - Fired when the feedback modal is closed.
 * @fires gla_app_ratings_need_help_clicked - Fired when the "Need help" button is clicked.
 */
const ExperienceRatingBanner = () => {
	const [ showModal, setShowModal ] = useState( false );
	const { set } = useDispatch( preferencesStore );
	const isDismissed = usePreference( BANNER_DISMISSED_KEY );

	// Fire event when banner is shown.
	useEffect( () => {
		if ( ! isDismissed ) {
			recordGlaEvent( 'gla_app_ratings_shown', {
				context: APP_RATINGS_BANNER_CONTEXT,
			} );
		}
	}, [ isDismissed ] );

	const handleClick = () => {
		recordGlaEvent( 'gla_app_ratings_good_clicked', {
			context: APP_RATINGS_BANNER_CONTEXT,
		} );
		setShowModal( true );
	};

	const handleRequestClose = () => {
		recordGlaEvent( 'gla_app_ratings_close', {
			context: APP_RATINGS_BANNER_CONTEXT,
		} );
		setShowModal( false );
	};

	const handleOnNeedHelpClick = () => {
		recordGlaEvent( 'gla_app_ratings_need_help_clicked', {
			context: APP_RATINGS_BANNER_CONTEXT,
		} );
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
						onClick={ handleOnNeedHelpClick }
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
