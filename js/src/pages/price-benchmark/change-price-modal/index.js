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
import './index.scss';
import Label from '../label';
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
import MetricValue from './metric-value';

const ChangePriceModal = ( { productID, onPriceChange, onRequestClose } ) => {
	const { googleAdsAccount } = useGoogleAdsAccount();
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
					<div className="gla-change-price-modal__product-image">
						<img
							src="https://live.staticflickr.com/5725/21726228300_51333bd62c_b.jpg"
							alt=""
							width="180"
						/>
					</div>

					<div className="gla-change-price-modal__product-details">
						<p>
							<span>259252</span>
						</p>
						<p className="gla-change-price-modal__product-title">
							Abstract Geometric Poster
						</p>
					</div>
				</div>

				<div className="gla-change-price-modal__metrics">
					<MetricValue
						labelKey={ LABEL_CHANGE_EFFECTIVENESS }
						value={ <EffectivenessIndicator effectiveness={ 1 } /> }
					/>

					<hr className="gla-change-price-modal__separator" />

					<div className="gla-change-price-modal__metrics-grid">
						<MetricValue
							labelKey={ LABEL_REGULAR_PRICE }
							value={ <Price amount={ 25 } /> }
						/>

						<MetricValue
							labelKey={ LABEL_AVG_PRICE_ON_GOOGLE }
							value={ <Price amount={ 20 } /> }
						/>

						<MetricValue
							labelKey={ LABEL_PRICE_GAP_PERCENT }
							value="25%"
						/>

						<MetricValue
							labelKey={ LABEL_SUGGESTED_PRICE }
							value={ <Price amount={ 20 } /> }
						/>
					</div>

					<hr className="gla-change-price-modal__separator" />

					<div className="gla-change-price-modal__metrics-grid">
						<MetricValue
							labelKey={ LABEL_CURRENT_CLICKS }
							value={ 400 }
						/>

						<MetricValue
							labelKey={ LABEL_CURRENT_CONVERSIONS }
							value={ 16 }
						/>

						<MetricValue
							labelKey={ LABEL_EXPECTED_UPLIFT_IN_CLICKS }
							value={ <DeltaValue amount={ 43 } suffix="%" /> }
						/>

						<MetricValue
							labelKey={ LABEL_EXPECTED_UPLIFT_IN_CONVERSIONS }
							value={ <DeltaValue amount={ 45 } suffix="%" /> }
						/>
					</div>
				</div>
			</div>
		</AppModal>
	);
};

export default ChangePriceModal;
