/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import useGoogleAdsAccount from '~/hooks/useGoogleAdsAccount';
import AppButton from '~/components/app-button';
import AppModal from '~/components/app-modal';
import AppInputPriceControl from '~/components/app-input-price-control';
import DeltaValue from '~/components/delta-value';
import EffectivenessIndicator from '../effectiveness-indicator';
import Price from '../price';
import MetricValue from './metric-value';
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
	onPriceChange,
	onRequestClose,
} ) => {
	const { googleAdsAccount } = useGoogleAdsAccount();

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
					value={ 20 }
					key="new-price"
				/>,
				<AppButton
					key="change-price"
					isPrimary
					onClick={ onPriceChange }
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
							<img
								src="https://live.staticflickr.com/5725/21726228300_51333bd62c_b.jpg"
								alt=""
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
