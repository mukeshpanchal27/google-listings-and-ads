/**
 * Internal dependencies
 */
import { useAdaptiveFormContext } from '.~/components/adaptive-form';
import EstimatedShippingRatesCard from './estimated-shipping-rates-card';

const FlatShippingRatesInputCards = () => {
	const { getInputProps, adapter } = useAdaptiveFormContext();

	function getCardProps( key, validationKey = key ) {
		return {
			...getInputProps( key ),
			helper: adapter.renderRequestedValidation( validationKey ),
		};
	}

	return (
		<EstimatedShippingRatesCard
			audienceCountries={ adapter.audienceCountries }
			{ ...getCardProps( 'shipping_country_rates' ) }
		/>
	);
};

export default FlatShippingRatesInputCards;
