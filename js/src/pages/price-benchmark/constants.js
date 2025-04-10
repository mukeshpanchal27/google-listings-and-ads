/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import AppTooltip from '~/components/app-tooltip';

export const TABLE_TYPE_SUGGESTIONS = 'suggestions';
export const TABLE_TYPE_ADJUSTMENTS = 'adjustments';

export const TOOLTIPS = {
	PRICE_CHANGE_EFFECTIVENESS: (
		<AppTooltip
			text={ __(
				'Effectiveness tells you which products would benefit most from price changes. This rating takes into consideration the performance boost predicted by adjusting the sale price and the difference between your current price and the suggested price. Price suggestions with “High” effectiveness are predicted to drive the largest increase in performance. Keep in mind that predictions do not guarantee improvements in future performance.',
				'google-listings-and-ads'
			) }
		>
			{ __( 'Price Change Effectiveness', 'google-listings-and-ads' ) }
		</AppTooltip>
	),
	PRICE_ON_GOOGLE: (
		<AppTooltip
			text={ __(
				'The effective price for a product across all retailers selling the same product weighted by customer clicks. Products are matched based on the GTIN you provide in the product details.',
				'google-listings-and-ads'
			) }
		>
			{ __( 'Price on Google', 'google-listings-and-ads' ) }
		</AppTooltip>
	),
	PRICE_GAP: (
		<AppTooltip
			text={ __(
				'The percentage difference between your price and the price on Google for this product.',
				'google-listings-and-ads'
			) }
		>
			{ __( 'Price Gap %', 'google-listings-and-ads' ) }
		</AppTooltip>
	),
	SUGGESTED_PRICE: (
		<AppTooltip
			text={ __(
				'Suggested sale price predicted by Google for products that benefit most from pricing adjustments. It is based on advanced simulations at different price points over the past 7 days factoring in price elasticity, current performance and the performance impact on price changes for businesses similar to you. Use suggested sale prices as valuable directional guidance to help shape your pricing strategy. Learn more about how to change the sale price of your products. Keep in mind that predictions do not guarantee future performance outcomes.',
				'google-listings-and-ads'
			) }
		>
			{ __( 'Suggested Price', 'google-listings-and-ads' ) }
		</AppTooltip>
	),
};
