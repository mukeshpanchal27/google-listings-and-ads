/**
 * External dependencies
 */
import { noop } from 'lodash';
import { __, sprintf } from '@wordpress/i18n';
import { useState, useEffect, useCallback } from '@wordpress/element';
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import {
	LABEL_AVG_PRICE_ON_GOOGLE,
	LABEL_CHANGE_EFFECTIVENESS,
	LABEL_CURRENT_CLICKS,
	LABEL_CURRENT_CONVERSIONS,
	LABEL_EXPECTED_UPLIFT_IN_CLICKS,
	LABEL_EXPECTED_UPLIFT_IN_CONVERSIONS,
	LABEL_PRICE_GAP_PERCENT,
	LABEL_REGULAR_PRICE,
	LABEL_SUGGESTED_PRICE,
} from '../constants';
import Price from '../price';
import MetricValue from './metric-value';
import AppModal from '~/components/app-modal';
import AppButton from '~/components/app-button';
import DeltaValue from '~/components/delta-value';
import AppInputPriceControl from '~/components/app-input-price-control';
import EffectivenessIndicator from '../effectiveness-indicator';
import useProduct from '~/hooks/useProduct';
import useAdsCurrency from '~/hooks/useAdsCurrency';
import useGoogleAdsAccount from '~/hooks/useGoogleAdsAccount';
import useDispatchProduct from '~/hooks/useDispatchProduct';
import './index.scss';

const ChangePriceModal = ( {
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
	onPriceChange = noop,
	onRequestClose,
} ) => {
	const { formatAmount } = useAdsCurrency();
	const { updateProduct } = useDispatchProduct();
	const [ newPriceError, setNewPriceError ] = useState();
	const [ newPrice, setNewPrice ] = useState( 0 );
	const { googleAdsAccount } = useGoogleAdsAccount();
	const { product: productDetails, hasFinishedResolution } = useProduct(
		product?.id
	);

	useEffect( () => {
		setNewPrice( suggestedPrice );
	}, [ suggestedPrice ] );

	const validatePrice = useCallback( () => {
		const updatedPrice = Number.parseFloat( newPrice );
		setNewPriceError( null );

		if ( updatedPrice < 0 ) {
			setNewPriceError(
				__(
					'New price must be greater than or equals to zero.',
					'google-listings-and-ads'
				)
			);

			return false;
		}

		const salePrice = Number.parseFloat( productDetails?.sale_price );
		if ( salePrice && updatedPrice <= salePrice ) {
			setNewPriceError(
				sprintf(
					// Translators: %s is replaced with the sale price.
					__(
						'New price must be greater than the sale price (%s).',
						'google-listings-and-ads'
					),
					formatAmount( salePrice )
				)
			);

			return false;
		}

		return true;
	}, [ newPrice, productDetails?.sale_price, formatAmount ] );

	const handleOnPriceChange = useCallback( async () => {
		if ( ! validatePrice() ) {
			return;
		}

		try {
			const response = await updateProduct( product.id, {
				regular_price: `${ newPrice }`,
			} );

			if ( response ) {
				// update local store
			}
		} catch ( error ) {
			setNewPriceError( error?.message );
			return;
		}
		onPriceChange( product, newPrice );
	}, [ newPrice, product, onPriceChange, updateProduct, validatePrice ] );

	if ( ! product ) {
		return null;
	}

	const currency = googleAdsAccount?.currency;

	return (
		<AppModal
			buttons={ [
				<AppInputPriceControl
					label={ __( 'New price', 'google-listings-and-ads' ) }
					suffix={ currency }
					value={ newPrice }
					onChange={ setNewPrice }
					onBlur={ validatePrice }
					className={ classnames(
						'gla-change-price-modal__input-price',
						{
							'gla-change-price-modal__input-price--error':
								newPriceError,
						}
					) }
					key="new-price"
					help={ newPriceError }
				/>,
				<AppButton
					key="change-price"
					isPrimary
					onClick={ handleOnPriceChange }
					disabled={ ! hasFinishedResolution || ! productDetails }
				>
					{ __( 'Change Price', 'google-listings-and-ads' ) }
				</AppButton>,
			] }
			title={ __( 'Change Price', 'google-listings-and-ads' ) }
			onRequestClose={ onRequestClose }
			className="gla-change-price-modal"
		>
			<div className="gla-change-price-modal__content">
				<div className="gla-change-price-modal__product">
					{ product.thumbnail && (
						<div className="gla-change-price-modal__product-image">
							<img src={ product.thumbnail } alt="" width="180" />
						</div>
					) }

					<div className="gla-change-price-modal__product-details">
						<p>
							<span>{ product.id }</span>
						</p>
						<p className="gla-change-price-modal__product-title">
							{ product.title }
						</p>
					</div>
				</div>

				<div className="gla-change-price-modal__metrics">
					<MetricValue
						labelKey={ LABEL_CHANGE_EFFECTIVENESS }
						value={
							<EffectivenessIndicator
								effectiveness={ effectiveness }
							/>
						}
					/>

					<hr className="gla-change-price-modal__separator" />

					<div className="gla-change-price-modal__metrics-grid">
						<MetricValue
							labelKey={ LABEL_REGULAR_PRICE }
							value={ <Price amount={ regularPrice } /> }
						/>

						<MetricValue
							labelKey={ LABEL_AVG_PRICE_ON_GOOGLE }
							value={ <Price amount={ priceOnGoogle } /> }
						/>

						<MetricValue
							labelKey={ LABEL_PRICE_GAP_PERCENT }
							value={ priceGap }
						/>

						<MetricValue
							labelKey={ LABEL_SUGGESTED_PRICE }
							value={ <Price amount={ suggestedPrice } /> }
						/>
					</div>

					<hr className="gla-change-price-modal__separator" />

					<div className="gla-change-price-modal__metrics-grid">
						<MetricValue
							labelKey={ LABEL_CURRENT_CLICKS }
							value={ clicks }
						/>

						<MetricValue
							labelKey={ LABEL_CURRENT_CONVERSIONS }
							value={ conversions }
						/>

						<MetricValue
							labelKey={ LABEL_EXPECTED_UPLIFT_IN_CLICKS }
							value={
								<DeltaValue
									amount={ predictedClicksChange * 100 }
									suffix="%"
								/>
							}
						/>

						<MetricValue
							labelKey={ LABEL_EXPECTED_UPLIFT_IN_CONVERSIONS }
							value={
								<DeltaValue
									amount={ predictedConversionsChange * 100 }
									suffix="%"
								/>
							}
						/>
					</div>
				</div>
			</div>
		</AppModal>
	);
};

export default ChangePriceModal;
