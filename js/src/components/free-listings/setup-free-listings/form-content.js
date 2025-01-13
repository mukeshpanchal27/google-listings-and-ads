/**
 * Internal dependencies
 */
import { useAdaptiveFormContext } from '~/components/adaptive-form';
import ChooseAudienceSection from '~/components/free-listings/choose-audience-section';
import ShippingRateSection from '~/components/shipping-rate-section';
import ShippingTimeSection from '~/components/free-listings/configure-product-listings/shipping-time-section';
import OrderValueConditionSection from '~/components/order-value-condition-section';
import isNonFreeShippingRate from '~/utils/isNonFreeShippingRate';

/**
 * Form to configure free listigns.
 */
const FormContent = () => {
	const { values } = useAdaptiveFormContext();

	const shouldDisplayShippingTime = values.shipping_time === 'flat';
	const shouldDisplayOrderValueCondition =
		values.shipping_rate === 'flat' &&
		values.shipping_country_rates.some( isNonFreeShippingRate );

	return (
		<>
			<ChooseAudienceSection />
			<ShippingRateSection />
			{ shouldDisplayOrderValueCondition && (
				<OrderValueConditionSection />
			) }
			{ shouldDisplayShippingTime && <ShippingTimeSection /> }
		</>
	);
};

export default FormContent;
