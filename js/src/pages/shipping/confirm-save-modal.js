/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import AppButton from '~/components/app-button';
import AppModal from '~/components/app-modal';
import styles from './confirm-save-modal.module.scss';

/**
 * Renders a modal to confirm before saving changes.
 *
 * @param {Object} props React props.
 * @param {Function} props.onContinue Callback when the continue button is clicked.
 * @param {Function} props.onRequestClose Callback when requesting to close the modal.
 */
export default function ConfirmSaveModal( { onContinue, onRequestClose } ) {
	return (
		<AppModal
			className={ styles.confirmationModal }
			title={ __( 'Before you save…', 'google-listings-and-ads' ) }
			buttons={ [
				<AppButton key="cancel" isSecondary onClick={ onRequestClose }>
					{ __( `Don't save`, 'google-listings-and-ads' ) }
				</AppButton>,
				<AppButton key="continue" isPrimary onClick={ onContinue }>
					{ __( 'Continue to save', 'google-listings-and-ads' ) }
				</AppButton>,
			] }
			onRequestClose={ onRequestClose }
		>
			<p>
				{ __(
					'Results typically improve with time.',
					'google-listings-and-ads'
				) }
			</p>
			<p>
				{ __(
					'Changes will result in the loss of any optimisations learned over time.',
					'google-listings-and-ads'
				) }
			</p>
			<p>
				{ __(
					'We recommend allowing your listings to run for at least 14 days after set up without changing them for optimal performance.',
					'google-listings-and-ads'
				) }
			</p>
		</AppModal>
	);
}
