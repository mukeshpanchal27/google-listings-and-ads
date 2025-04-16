/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import AppButton from '~/components/app-button';
import ChangePriceModal from './change-price-modal';

/**
 * ChangePrice component.
 *
 * Placeholder component.
 *
 * @param {Object} props - Component properties.
 * @param {number} props.productID - The ID of the product for which the price is being changed.
 * @param {string} [props.label='Change price'] - The label text for the button. Defaults to 'Change price'.
 * @return {JSX.Element} The rendered AppButton component.
 */
const ChangePrice = ( {
	productID,
	label = __( 'Change price', 'google-listings-and-ads' ),
} ) => {
	const [ isOpen, setIsOpen ] = useState( true );
	const openModal = () => {
		setIsOpen( true );
	};

	const closeModal = () => {
		setIsOpen( false );
	};

	return (
		<>
			<AppButton id={ productID } onClick={ openModal }>
				{ label }
			</AppButton>

			{ isOpen && (
				<ChangePriceModal
					productID={ productID }
					onRequestClose={ closeModal }
				/>
			) }
		</>
	);
};

export default ChangePrice;
