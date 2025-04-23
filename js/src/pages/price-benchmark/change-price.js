/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { useCallback, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { useAppDispatch } from '~/data';
import AppButton from '~/components/app-button';
import ChangePriceModal from './change-price-modal';

/**
 * @typedef {Object} Product
 * @property {string} id - Product identifier
 * @property {string} title - Product title
 * @property {string} thumbnail - URL to product thumbnail image
 */

/**
 * Component for changing the price of a product.
 *
 * @param {Object} props - Component properties.
 * @param {Product} props.product - The product object containing details about the product. Properties include id, title, and thumbnail.
 * @param {number} props.effectiveness - The effectiveness of the price change.
 * @param {number} props.regularPrice - The regular price of the product.
 * @param {number} props.priceOnGoogle - The current price of the product on Google.
 * @param {number} props.priceGap - The price gap between the regular price and the price on Google.
 * @param {number} props.suggestedPrice - The suggested price for the product.
 * @param {number} props.clicks - The number of clicks the product has received.
 * @param {number} props.conversions - The number of conversions the product has achieved.
 * @param {number} props.predictedClicksChange - The predicted change in clicks if the price is updated.
 * @param {number} props.predictedConversionsChange - The predicted change in conversions if the price is updated.
 * @return {JSX.Element|null} The rendered component or null if the product ID is not available.
 */
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
} ) => {
	const { receivePriceBenchmarkSuggestionsRegularPrice } = useAppDispatch();
	const [ isOpen, setIsOpen ] = useState( false );

	const handleOnRequestClose = () => {
		setIsOpen( false );
	};

	const handleOnPriceChange = useCallback(
		( productId, newPrice ) => {
			receivePriceBenchmarkSuggestionsRegularPrice( productId, newPrice );

			handleOnRequestClose();
		},
		[ receivePriceBenchmarkSuggestionsRegularPrice ]
	);

	if ( ! product?.id ) {
		return null;
	}

	const openModal = () => {
		setIsOpen( true );
	};

	return (
		<>
			<AppButton onClick={ openModal } variant="link">
				{ __( 'Change price', 'google-listings-and-ads' ) }
			</AppButton>

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
					onPriceChange={ handleOnPriceChange }
					onRequestClose={ handleOnRequestClose }
				/>
			) }
		</>
	);
};

export default ChangePrice;
