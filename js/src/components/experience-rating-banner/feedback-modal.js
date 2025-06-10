/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { Icon } from '@wordpress/components';
import { external as externalIcon } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import AppModal from '../app-modal';
import AppButton from '../app-button';
import { APP_RATINGS_BANNER_CONTEXT } from '~/constants';
import { recordGlaEvent } from '~/utils/tracks';

/**
 * FeedbackModal component.
 *
 * @param {Object} props - Component props.
 * @param {Function} props.onRequestClose - Function to call when the modal is closed.
 * @return {JSX.Element} The FeedbackModal component.
 */

/**
 * @event gla_app_ratings_cancel_clicked
 * @property {string} context The context in which the event is triggered.
 */

/**
 * @event gla_app_ratings_rate_clicked
 * @property {string} context The context in which the event is triggered.
 */

const FeedbackModal = ( { onRequestClose } ) => {
	const trackEvent = ( eventName ) => {
		recordGlaEvent( eventName, { context: APP_RATINGS_BANNER_CONTEXT } );
	};

	return (
		<AppModal
			title={ __(
				'Thanks for letting us know!',
				'google-listings-and-ads'
			) }
			className="gla-experience-rating-banner__feedback-modal"
			buttons={ [
				<AppButton
					key="cancel"
					onClick={ () => {
						trackEvent( 'gla_app_ratings_cancel_clicked' );
						onRequestClose();
					} }
					isTertiary
				>
					{ __( 'Cancel', 'google-listings-and-ads' ) }
				</AppButton>,
				<AppButton
					key="rate-us"
					onClick={ () => {
						trackEvent( 'gla_app_ratings_rate_clicked' );
						onRequestClose();
					} }
					isPrimary
					target="_blank"
					href="https://wordpress.org/support/plugin/google-listings-and-ads/reviews/#new-post"
				>
					{ __( 'Rate us', 'google-listings-and-ads' ) }
					<Icon icon={ externalIcon } size={ 18 } />
				</AppButton>,
			] }
			onRequestClose={ onRequestClose }
			shouldCloseOnEsc
			shouldCloseOnClickOutside
		>
			<p>
				{ __(
					"If you have a minute, we'd appreciate it if you could leave us a rating. Your review will help other store owners find this extension.",
					'google-listings-and-ads'
				) }
			</p>
		</AppModal>
	);
};

export default FeedbackModal;
