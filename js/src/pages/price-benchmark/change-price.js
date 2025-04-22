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

const ChangePrice = ( {
	product,
	effectiveness,
	regularPrice,
	priceOnGoogle,
	priceGap,
	suggestedPrice,
	clicks,
	conversions,
	predictedClicksChange,
	predictedConversionsChange,
	label = __( 'Change price', 'google-listings-and-ads' ),
} ) => {
	const [ isOpen, setIsOpen ] = useState( false );

	if ( ! product?.id ) {
		return null;
	}

	const openModal = () => {
		setIsOpen( true );
	};

	const closeModal = () => {
		// setIsOpen( false );
	};

	return (
		<>
			<AppButton onClick={ openModal }>{ label }</AppButton>

			{ isOpen && (
				<ChangePriceModal
					product={ product }
					effectiveness={ effectiveness }
					regularPrice={ regularPrice }
					priceOnGoogle={ priceOnGoogle }
					priceGap={ priceGap }
					suggestedPrice={ suggestedPrice }
					clicks={ clicks }
					conversions={ conversions }
					predictedClicksChange={ predictedClicksChange }
					predictedConversionsChange={ predictedConversionsChange }
					onPriceChange={ closeModal }
					onRequestClose={ closeModal }
				/>
			) }
		</>
	);
};

export default ChangePrice;
