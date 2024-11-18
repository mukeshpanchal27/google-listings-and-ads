/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import Section from '.~/wcdl/section';
import OrderValueConditionCard from './order-value-condition-card';

const OrderValueConditionSection = () => {
	return (
		<Section
			title={ __( 'Order value condition', 'google-listings-and-ads' ) }
			description={
				<div>
					<p> { __( 'Optional', 'google-listings-and-ads' ) } </p>
				</div>
			}
		>
			<OrderValueConditionCard />
		</Section>
	);
};

export default OrderValueConditionSection;
