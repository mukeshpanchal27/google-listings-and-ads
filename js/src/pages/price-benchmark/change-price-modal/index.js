/**
 * External dependencies
 */
import { noop } from 'lodash';
import { __ } from '@wordpress/i18n';

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
import DeltaValue from '~/components/delta-value';
import EffectivenessIndicator from '../effectiveness-indicator';
import PriceInputFooter from './price-input-footer';
import './index.scss';

/**
 * @typedef { import("../change-price").Product } Product
 */

/**
 * ChangePriceModal component.
 *
 * This component renders a modal for changing the price of a product. It displays
 * product details, pricing metrics, and predicted changes in clicks and conversions.
 * The modal also includes a footer with a price input field for updating the price.
 *
 * @param {Object} props - Component properties.
 * @param {Product} props.product - The product object containing details such as `id`, `title`, and `thumbnail`.
 * @param {string} props.effectiveness - The effectiveness rating of the price change.
 * @param {number} props.regularPrice - The regular price of the product.
 * @param {number} props.priceOnGoogle - The average price of the product on Google.
 * @param {string} props.priceGap - The percentage gap between the regular price and the price on Google.
 * @param {number} props.suggestedPrice - The suggested price for the product.
 * @param {number} props.clicks - The current number of clicks for the product.
 * @param {number} props.conversions - The current number of conversions for the product.
 * @param {number} props.predictedClicksChange - The predicted percentage change in clicks.
 * @param {number} props.predictedConversionsChange - The predicted percentage change in conversions.
 * @param {Function} props.onRequestClose - Callback function triggered when the modal is requested to close.
 * @param {Function} [props.onPriceChange=noop] - Callback function triggered when the price is changed. Defaults to a no-operation function (`noop`) if not provided.
 * @return {JSX.Element|null} The rendered ChangePriceModal component or `null` if no product is provided.
 */
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
	onRequestClose,
	onPriceChange = noop,
} ) => {
	if ( ! product ) {
		return null;
	}

	return (
		<AppModal
			buttons={ [
				<PriceInputFooter
					onPriceChange={ onPriceChange }
					productId={ product?.id }
					key="price-input-footer"
					suggestedPrice={ suggestedPrice }
				/>,
			] }
			title={ __( 'Change Price', 'google-listings-and-ads' ) }
			onRequestClose={ onRequestClose }
			className="gla-change-price-modal"
		>
			<div className="gla-change-price-modal__content">
				<div className="gla-change-price-modal__product">
					{ product.thumbnail && (
						<div className="gla-change-price-modal__product-image">
							<img
								src={ product.thumbnail }
								alt={ __(
									'Product thumbnail',
									'google-listings-and-ads'
								) }
								width="180"
							/>
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
							value={ `${ priceGap }%` }
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
									amount={
										( predictedClicksChange ?? 0 ) * 100
									}
									suffix="%"
								/>
							}
						/>

						<MetricValue
							labelKey={ LABEL_EXPECTED_UPLIFT_IN_CONVERSIONS }
							value={
								<DeltaValue
									amount={
										( predictedConversionsChange ?? 0 ) *
										100
									}
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
