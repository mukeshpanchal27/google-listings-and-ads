<?php
declare( strict_types=1 );

namespace Automattic\WooCommerce\GoogleListingsAndAds\API\Google;

use Automattic\WooCommerce\GoogleListingsAndAds\API\Google\Query\MerchantPriceBenchmarksQuery;
use Automattic\WooCommerce\GoogleListingsAndAds\API\Google\Query\MerchantPriceSuggestionsQuery;
use Automattic\WooCommerce\GoogleListingsAndAds\Options\OptionsAwareInterface;
use Automattic\WooCommerce\GoogleListingsAndAds\Options\OptionsAwareTrait;
use Automattic\WooCommerce\GoogleListingsAndAds\Product\ProductHelper;
use Automattic\WooCommerce\GoogleListingsAndAds\Vendor\Google\Service\ShoppingContent;
use Exception;

/**
 * Class MerchantPriceBenchmarks
 *
 * @package Automattic\WooCommerce\GoogleListingsAndAds\API\Google
 */
class MerchantPriceBenchmarks implements OptionsAwareInterface {

	use OptionsAwareTrait;

	/**
	 * The shopping service.
	 *
	 * @var ShoppingContent
	 */
	protected $service;

	/**
	 * Product helper class.
	 *
	 * @var ProductHelper
	 */
	protected $product_helper;

	/**
	 * Merchant Report constructor.
	 *
	 * @param ShoppingContent $service
	 * @param ProductHelper   $product_helper
	 */
	public function __construct( ShoppingContent $service, ProductHelper $product_helper ) {
		$this->service        = $service;
		$this->product_helper = $product_helper;
	}

	/**
	 * Get MerchantPriceBenchmarksQuery Query response.
	 *
	 * @return array Associative array with product statuses and the next page token.
	 *
	 * @throws Exception If the merchant price benchmarks report data can't be retrieved.
	 */
	public function get_benchmark_data(): array {
		try {
			$response = ( new MerchantPriceBenchmarksQuery() )
			->set_client( $this->service, $this->options->get_merchant_id() )
			->get_results();

			$results = $response->getResults() ?? [];

			return $results;
		} catch ( GoogleException $e ) {
			do_action( 'woocommerce_gla_mc_client_exception', $e, __METHOD__ );
			throw new Exception( __( 'Unable to retrieve Merchant Price Benchmarks.', 'google-listings-and-ads' ) . $e->getMessage(), $e->getCode() );
		}
	}

	/**
	 * Get MerchantPriceSuggestions Query response.
	 *
	 * @return array Associative array with product statuses and the next page token.
	 *
	 * @throws Exception If the merchant price suggestions data can't be retrieved.
	 */
	public function get_price_insights_product_view(): array {
		try {
			$response = ( new MerchantPriceSuggestionsQuery() )
			->set_client( $this->service, $this->options->get_merchant_id() )
			->get_results();

			$results = $response->getResults() ?? [];

			return $results;
		} catch ( GoogleException $e ) {
			do_action( 'woocommerce_gla_mc_client_exception', $e, __METHOD__ );
			throw new Exception( __( 'Unable to retrieve Merchant Price Benchmarks.', 'google-listings-and-ads' ) . $e->getMessage(), $e->getCode() );
		}
	}
}
