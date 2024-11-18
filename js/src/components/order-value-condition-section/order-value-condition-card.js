/**
 * Internal dependencies
 */
import { useAdaptiveFormContext } from '.~/components/adaptive-form';
import OfferFreeShippingCard from './offer-free-shipping-card';
import MinimumOrderCard from './minimum-order-card';

const OrderValueConditionCard = () => {
	const { getInputProps, values, adapter } = useAdaptiveFormContext();

	function getCardProps( key, validationKey = key ) {
		return {
			...getInputProps( key ),
			helper: adapter.renderRequestedValidation( validationKey ),
		};
	}

	return (
		<>
			<OfferFreeShippingCard
				{ ...getCardProps( 'offer_free_shipping' ) }
			/>
			{ values.offer_free_shipping && (
				<MinimumOrderCard
					{ ...getCardProps(
						'shipping_country_rates',
						'free_shipping_threshold'
					) }
				/>
			) }
		</>
	);
};

export default OrderValueConditionCard;
