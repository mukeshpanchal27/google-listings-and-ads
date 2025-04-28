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
	METRIC_TYPE_DELTA,
	METRIC_TYPE_EFFECTIVENESS,
	METRIC_TYPE_PERCENTAGE,
	METRIC_TYPE_PRICE,
} from '../constants';
import MetricValue from './metric-value';
import AppModal from '~/components/app-modal';
import PriceInputFooter from './price-input-footer';
import usePriceBenchmarkSuggestionsProduct from '~/hooks/usePriceBenchmarkSuggestionsProduct';
import SpinnerCard from '~/components/spinner-card';
import './index.scss';

const ChangePriceModal = ( {
	productId,
	onRequestClose,
	onPriceChange = noop,
} ) => {
	const { product, hasFinishedResolution } =
		usePriceBenchmarkSuggestionsProduct( productId );
	const {
		effectiveness,
		regular_price: regularPrice,
		price_on_google: priceOnGoogle,
		price_gap: priceGap,
		suggested_price: suggestedPrice,
		clicks,
		conversions,
		predicted_clicks_change: predictedClicksChange,
		predicted_conversions_change: predictedConversionsChange,
		product: { id, title, thumbnail },
	} = product || {};

	return (
		<AppModal
			buttons={ [
				hasFinishedResolution && (
					<PriceInputFooter
						onPriceChange={ onPriceChange }
						productId={ id }
						key="price-input-footer"
						suggestedPrice={ suggestedPrice }
					/>
				),
			] }
			title={ __( 'Change Price', 'google-listings-and-ads' ) }
			onRequestClose={ onRequestClose }
			className="gla-change-price-modal"
		>
			{ ! hasFinishedResolution && <SpinnerCard /> }

			{ hasFinishedResolution && (
				<div className="gla-change-price-modal__content">
					<div className="gla-change-price-modal__product">
						{ thumbnail && (
							<div className="gla-change-price-modal__product-image">
								<img
									src={ thumbnail }
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
								<span>{ id }</span>
							</p>
							<p className="gla-change-price-modal__product-title">
								{ title }
							</p>
						</div>
					</div>

					<div className="gla-change-price-modal__metrics">
						<MetricValue
							labelKey={ LABEL_CHANGE_EFFECTIVENESS }
							value={ effectiveness }
							type={ METRIC_TYPE_EFFECTIVENESS }
						/>

						<hr className="gla-change-price-modal__separator" />

						<div className="gla-change-price-modal__metrics-grid">
							<MetricValue
								labelKey={ LABEL_REGULAR_PRICE }
								value={ regularPrice }
								type={ METRIC_TYPE_PRICE }
							/>

							<MetricValue
								labelKey={ LABEL_AVG_PRICE_ON_GOOGLE }
								value={ priceOnGoogle }
								type={ METRIC_TYPE_PRICE }
							/>

							<MetricValue
								labelKey={ LABEL_PRICE_GAP_PERCENT }
								value={ priceGap }
								type={ METRIC_TYPE_PERCENTAGE }
							/>

							<MetricValue
								labelKey={ LABEL_SUGGESTED_PRICE }
								value={ suggestedPrice }
								type={ METRIC_TYPE_PRICE }
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
								value={ predictedClicksChange }
								type={ METRIC_TYPE_DELTA }
							/>

							<MetricValue
								labelKey={
									LABEL_EXPECTED_UPLIFT_IN_CONVERSIONS
								}
								value={ predictedConversionsChange }
								type={ METRIC_TYPE_DELTA }
							/>
						</div>
					</div>
				</div>
			) }
		</AppModal>
	);
};

export default ChangePriceModal;
