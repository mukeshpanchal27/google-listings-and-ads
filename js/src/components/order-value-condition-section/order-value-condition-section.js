/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import Section from '.~/wcdl/section';
import { useAdaptiveFormInputProps } from '.~/components/adaptive-form';
import MinimumOrderCard from './minimum-order-card';

const OrderValueConditionSection = () => {
	const inputProps = useAdaptiveFormInputProps(
		'shipping_country_rates',
		'free_shipping_threshold'
	);

	return (
		<Section
			title={ __( 'Order value condition', 'google-listings-and-ads' ) }
			description={
				<div>
					<p> { __( 'Optional', 'google-listings-and-ads' ) } </p>
				</div>
			}
		>
			<MinimumOrderCard { ...inputProps } />;
		</Section>
	);
};

export default OrderValueConditionSection;
