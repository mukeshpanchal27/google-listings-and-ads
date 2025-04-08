/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { TablePlaceholder } from '@woocommerce/components';

const TABLE_DATA_HEADERS = [
	{
		key: 'product',
		label: __( 'Product', 'google-listings-and-ads' ),
		isLeftAligned: true,
		required: true,
	},
	{
		key: 'adjusted-price',
		label: __( 'Adjusted Price', 'google-listings-and-ads' ),
		isLeftAligned: true,
		required: true,
	},
	{
		key: 'previous-price',
		label: __( 'Previous Price', 'google-listings-and-ads' ),
		isLeftAligned: true,
		required: true,
	},
	{
		key: 'price-adjustments',
		label: __( 'Price Adjustment', 'google-listings-and-ads' ),
		isLeftAligned: true,
		required: true,
	},
	{
		key: 'weekly-clicks',
		label: __( 'Weekly Clicks', 'google-listings-and-ads' ),
		isLeftAligned: true,
		required: true,
	},
	{
		key: 'weekly-conversions',
		label: __( 'Weekly Conv.', 'google-listings-and-ads' ),
		isLeftAligned: true,
		required: true,
	},
	{
		key: 'weekly-clicks-uplift',
		label: __( 'Weekly Clicks Uplift', 'google-listings-and-ads' ),
		isLeftAligned: true,
		required: true,
	},
	{
		key: 'weekly-conv-uplift',
		label: __( 'Weekly Conv. Uplift', 'google-listings-and-ads' ),
		isLeftAligned: true,
		required: true,
	},
	{
		key: 'actions',
		label: __( 'Action', 'google-listings-and-ads' ),
		isLeftAligned: true,
		required: true,
	},
];

const PriceBenchmarkAdjustments = () => {
	return (
		<TablePlaceholder
			headers={ TABLE_DATA_HEADERS }
			caption={ __(
				'Loading the adjustment data…',
				'google-listings-and-ads'
			) }
		/>
	);
};

export default PriceBenchmarkAdjustments;
