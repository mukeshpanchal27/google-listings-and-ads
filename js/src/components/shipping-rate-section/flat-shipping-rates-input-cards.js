/**
 * Internal dependencies
 */
import {
	useAdaptiveFormContext,
	useAdaptiveFormInputProps,
} from '~/components/adaptive-form';
import EstimatedShippingRatesCard from './estimated-shipping-rates-card';

const FlatShippingRatesInputCards = () => {
	const { adapter } = useAdaptiveFormContext();
	const inputProps = useAdaptiveFormInputProps( 'shipping_country_rates' );

	return (
		<EstimatedShippingRatesCard
			audienceCountries={ adapter.audienceCountries }
			{ ...inputProps }
		/>
	);
};

export default FlatShippingRatesInputCards;
