<?php
declare( strict_types=1 );

namespace Automattic\WooCommerce\GoogleListingsAndAds\API\Google\Query;

use Automattic\WooCommerce\GoogleListingsAndAds\API\Google\Query\MerchantQuery;

/**
 * Class MerchantPriceSuggestionsQuery
 *
 * @package Automattic\WooCommerce\GoogleListingsAndAds\API\Google\Query
 */
class MerchantPriceSuggestionsQuery extends MerchantQuery {

	/**
	 * MerchantPriceSuggestionsQuery constructor.
	 */
	public function __construct() {
		parent::__construct( 'PriceInsightsProductView' );
		$this->set_initial_columns();
	}

	/**
	 * Filter the query by a list of product IDs.
	 *
	 * @param array $ids List of product IDs to filter by.
	 *
	 * @return $this
	 */
	public function filter( array $ids ): QueryInterface {
		if ( ! empty( $ids ) ) {
			$this->where( 'product_view.id', 'IN', $ids );
		}
		return $this;
	}

	/**
	 * Set the initial columns for this query.
	 */
	protected function set_initial_columns() {
		$this->columns(
			[
				'id'                                    => 'product_view.id',
				'title'                                 => 'product_view.title',
				'brand'                                 => 'product_view.brand',
				'price_micros'                          => 'product_view.price_micros',
				'currency_code'                         => 'product_view.currency_code',
				'suggested_price_micros'                => 'price_insights.suggested_price_micros',
				'suggested_price_currency_code'         => 'price_insights.suggested_price_currency_code',
				'predicted_impressions_change_fraction' => 'price_insights.predicted_impressions_change_fraction',
				'predicted_clicks_change_fraction'      => 'price_insights.predicted_clicks_change_fraction',
				'predicted_conversions_change_fraction' => 'price_insights.predicted_conversions_change_fraction',
			]
		);
	}
}
