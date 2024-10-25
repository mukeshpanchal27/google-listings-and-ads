/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { createInterpolateElement } from '@wordpress/element';

/**
 * Internal dependencies
 */
import AppModal from '.~/components/app-modal';
import AppButton from '.~/components/app-button';
import WarningIcon from '.~/components/warning-icon';

const ConfirmCreateModal = ( {
	existingAccount = [],
	onContinue = () => {},
	onRequestClose = () => {},
} ) => {
	const handleCreateAccountClick = () => {
		onContinue();
	};

	return (
		<AppModal
			className="gla-ads-warning-modal"
			title={ __(
				'Create Google Ads Account',
				'google-listings-and-ads'
			) }
			buttons={ [
				<AppButton
					key="confirm"
					isSecondary
					eventName="gla_ads_account_warning_modal_confirm_button_click"
					onClick={ handleCreateAccountClick }
				>
					{ __(
						'Yes, I want a new account',
						'google-listings-and-ads'
					) }
				</AppButton>,
				<AppButton key="cancel" isPrimary onClick={ onRequestClose }>
					{ __( 'Cancel', 'google-listings-and-ads' ) }
				</AppButton>,
			] }
			onRequestClose={ onRequestClose }
		>
			<p className="gla-ads-warning-modal__warning-text">
				<WarningIcon />
				<span>
					{ __(
						'Are you sure you want to create a new Google Ads account?',
						'google-listings-and-ads'
					) }
				</span>
			</p>
			{ existingAccount.length > 0 && (
				<p>
					{ createInterpolateElement(
						__(
							'You already have another verified account, <storename />, which is connected to this store’s URL, <storeurl />.',
							'google-listings-and-ads'
						),
						{
							storename: (
								<strong>{ existingAccount.name }</strong>
							),
							storeurl: (
								<strong>{ existingAccount.domain }</strong>
							),
						}
					) }
				</p>
			) }
			<p>
				{ __(
					'If you create a new Ads account, you will have to claim the new account. Do you want to proceed?',
					'google-listings-and-ads'
				) }
			</p>
		</AppModal>
	);
};

export default ConfirmCreateModal;
