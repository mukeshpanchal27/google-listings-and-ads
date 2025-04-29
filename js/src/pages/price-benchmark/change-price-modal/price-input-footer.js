/**
 * External dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { useState, useEffect, useCallback } from '@wordpress/element';
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import AppButton from '~/components/app-button';
import AppInputPriceControl from '~/components/app-input-price-control';
import useAdsCurrency from '~/hooks/useAdsCurrency';
import useGoogleAdsAccount from '~/hooks/useGoogleAdsAccount';
import useDispatchProduct from '~/hooks/useDispatchProduct';

/**
 * PriceInputFooter component.
 *
 * This component renders a footer for the price input modal, allowing users to
 * update the price of a product. It includes validation for the new price and
 * handles the update process.
 *
 * @param {Object} props - Component properties.
 * @param {number} props.productId - The ID of the product being updated.
 * @param {number} props.suggestedPrice - The suggested price for the product.
 * @param {number} [props.salesPrice] - The current sales price of the product (if any).
 * @param {Function} props.onPriceChange - Callback function triggered after the price is successfully updated.
 *
 * @return {JSX.Element} The rendered PriceInputFooter component.
 */
const PriceInputFooter = ( {
	productId,
	suggestedPrice,
	salesPrice,
	onPriceChange,
} ) => {
	const { formatAmount } = useAdsCurrency();
	const { updateProduct } = useDispatchProduct();
	const [ newPriceError, setNewPriceError ] = useState();
	const [ loading, setLoading ] = useState( false );
	const [ newPrice, setNewPrice ] = useState( 0 );
	const { googleAdsAccount } = useGoogleAdsAccount();

	useEffect( () => {
		setNewPrice( suggestedPrice );
	}, [ suggestedPrice ] );

	const getInputError = useCallback( () => {
		const updatedPrice = Number.parseFloat( newPrice );

		if ( updatedPrice < 0 ) {
			return __(
				'New price must be greater than or equals to zero.',
				'google-listings-and-ads'
			);
		}

		const formattedSalesPrice = Number.parseFloat( salesPrice );
		if (
			! isNaN( formattedSalesPrice ) &&
			formattedSalesPrice &&
			updatedPrice <= formattedSalesPrice
		) {
			return sprintf(
				// Translators: %s is replaced with the sales price.
				__(
					'New price must be greater than the sales price (%s).',
					'google-listings-and-ads'
				),
				formatAmount( formattedSalesPrice )
			);
		}

		return null;
	}, [ newPrice, salesPrice, formatAmount ] );

	const validatePrice = useCallback( () => {
		const error = getInputError();
		setNewPriceError( error );

		return error === null;
	}, [ getInputError ] );

	const handleOnPriceChange = useCallback( async () => {
		if ( ! validatePrice() ) {
			return;
		}

		setLoading( true );
		try {
			await updateProduct( productId, {
				regular_price: `${ newPrice }`,
			} );
		} catch ( error ) {
			setNewPriceError( error?.message );
			setLoading( false );
			return;
		}

		setLoading( false );
		onPriceChange( productId, newPrice );
	}, [ newPrice, productId, onPriceChange, updateProduct, validatePrice ] );

	const currency = googleAdsAccount?.currency;
	const hasError = getInputError();

	return (
		<div className="gla-change-price-modal-price-input-footer">
			<AppInputPriceControl
				label={ __( 'New price', 'google-listings-and-ads' ) }
				suffix={ currency }
				value={ newPrice }
				onChange={ setNewPrice }
				onBlur={ validatePrice }
				className={ classnames(
					'gla-change-price-modal-price-input-footer__price',
					{
						'gla-change-price-modal-price-input-footer__price--error':
							newPriceError,
					}
				) }
				key="new-price"
				help={ newPriceError }
			/>

			<AppButton
				key="change-price"
				isPrimary
				onClick={ handleOnPriceChange }
				disabled={ hasError !== null }
				loading={ loading }
			>
				{ __( 'Change Price', 'google-listings-and-ads' ) }
			</AppButton>
		</div>
	);
};

export default PriceInputFooter;
