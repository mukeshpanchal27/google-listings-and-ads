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
import useProduct from '~/hooks/useProduct';
import useAdsCurrency from '~/hooks/useAdsCurrency';
import useGoogleAdsAccount from '~/hooks/useGoogleAdsAccount';
import useDispatchProduct from '~/hooks/useDispatchProduct';

/**
 * PriceInputFooter component.
 *
 * This component renders a footer section for a price input modal, allowing users to update the price of a product.
 * It validates the new price, handles price updates, and displays any relevant errors.
 *
 * @param {Object} props - Component properties.
 * @param {number} props.productId - The ID of the product whose price is being updated.
 * @param {number} props.suggestedPrice - The suggested price to prefill in the input field.
 * @param {Function} props.onPriceChange - Callback function triggered when the price is successfully updated.
 *
 * @return {JSX.Element|null} The rendered component or null if no productId is provided.
 */
const PriceInputFooter = ( { productId, suggestedPrice, onPriceChange } ) => {
	const { formatAmount } = useAdsCurrency();
	const { updateProduct } = useDispatchProduct();
	const [ newPriceError, setNewPriceError ] = useState();
	const [ loading, setLoading ] = useState( false );
	const [ newPrice, setNewPrice ] = useState( 0 );
	const { googleAdsAccount } = useGoogleAdsAccount();
	const { product: productDetails, hasFinishedResolution } =
		useProduct( productId );

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

		const salePrice = Number.parseFloat( productDetails?.sale_price );
		if ( salePrice && updatedPrice <= salePrice ) {
			return sprintf(
				// Translators: %s is replaced with the sale price.
				__(
					'New price must be greater than the sale price (%s).',
					'google-listings-and-ads'
				),
				formatAmount( salePrice )
			);
		}

		return null;
	}, [ newPrice, productDetails?.sale_price, formatAmount ] );

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

	if ( ! productDetails ) {
		return null;
	}

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
				disabled={
					! hasFinishedResolution ||
					! productDetails ||
					hasError !== null
				}
				loading={ loading }
			>
				{ __( 'Change Price', 'google-listings-and-ads' ) }
			</AppButton>
		</div>
	);
};

export default PriceInputFooter;
