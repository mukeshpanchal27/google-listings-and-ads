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

/**
 * FeedbackModal component.
 *
 * @param {Object} props - Component props.
 * @param {Function} props.onRequestClose - Function to call when the modal is closed.
 * @param {Function} props.onRequestRate - Function to call when the user requests to rate.
 * @return {JSX.Element} The FeedbackModal component.
 */
const FeedbackModal = ( { onRequestClose, onRequestRate } ) => {
	return (
		<AppModal
			className="gla-experience-rating-feedback-modal"
			title={ __(
				'Thanks for letting us know!',
				'google-listings-and-ads'
			) }
			buttons={ [
				<AppButton key="cancel" onClick={ onRequestClose } isTertiary>
					{ __( 'Cancel', 'google-listings-and-ads' ) }
				</AppButton>,
				<AppButton key="rate-us" onClick={ onRequestRate } isPrimary>
					{ __( 'Rate us', 'google-listings-and-ads' ) }
					<Icon icon={ externalIcon } size={ 18 } />
				</AppButton>,
			] }
			shouldCloseOnEsc={ true }
			shouldCloseOnClickOutside={ true }
			onRequestClose={ onRequestClose }
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
