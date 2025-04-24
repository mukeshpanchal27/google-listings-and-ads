<?php
declare( strict_types=1 );

namespace Automattic\WooCommerce\GoogleListingsAndAds\API\Google;

use Automattic\WooCommerce\GoogleListingsAndAds\API\Google\Query\MerchantPriceBenchmarksQuery;
use Automattic\WooCommerce\GoogleListingsAndAds\API\Google\Query\MerchantPriceSuggestionsQuery;
use Automattic\WooCommerce\GoogleListingsAndAds\Options\OptionsAwareInterface;
use Automattic\WooCommerce\GoogleListingsAndAds\Options\OptionsAwareTrait;
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
	 * Merchant Report constructor.
	 *
	 * @param ShoppingContent $service
	 */
	public function __construct( ShoppingContent $service ) {
		$this->service = $service;
	}

	/**
	 * Get MerchantPriceBenchmarksQuery Query response.
	 *
	 * @param array $args Query arguments.
	 *
	 * @return array Associative array with price benchmarks data and the next page token.
	 *
	 * @throws Exception If the merchant price benchmarks data can't be retrieved.
	 */
	public function get_benchmark_data( array $args ): array {
		try {
			$response = ( new MerchantPriceBenchmarksQuery( $args ) )
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
	 * @param array $args Query arguments.
	 *
	 * @return array Associative array with price benchmarks data and the next page token.
	 *
	 * @throws Exception If the merchant price suggestions data can't be retrieved.
	 */
	public function get_price_insights( array $args ): array {
		try {
			$response = ( new MerchantPriceSuggestionsQuery( $args ) )
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
	 * Maps the benchmark and price insights data to the required API response format.
	 *
	 * @param array $benchmark_data Raw benchmark data.
	 * @param array $price_insights_data Raw price insights data.
	 * @return array Mapped response data.
	 */
	public function map_price_benchmarks_response( array $benchmark_data, array $price_insights_data ): array {
		$mapped_data = [];

		if ( empty( $benchmark_data['results'] ) || empty( $price_insights_data['results'] ) ) {
			return $mapped_data;
		}

		// Process benchmark data and add it to $mapped_data keyed by product ID.
		foreach ( $benchmark_data['results'] as $benchmark_result ) {
			$product_id = $benchmark_result['offer_id'];

			$mapped_data[ $product_id ] = [
				'price_competitiveness' => $benchmark_result ?? [],
				'price_insights'        => [], // Placeholder for price insights data.
			];
		}

		// Process price insights data and merge it into $mapped_data.
		foreach ( $price_insights_data['results'] as $price_insights_result ) {
			$product_id = $price_insights_result['offer_id'];

			if ( isset( $mapped_data[ $product_id ] ) ) {
				$mapped_data[ $product_id ]['price_insights'] = $price_insights_result ?? [];
			}
		}

		// Transform $mapped_data into the desired response format using array_map.
		$response_data = array_map(
			function ( $data ) {
				$price_competitiveness = $data['price_competitiveness'];
				$price_insights        = $data['price_insights'];

				// Calculate the price gap.
				$regular_price   = (int) $price_competitiveness['price_micros'];
				$price_on_google = (int) $price_competitiveness['benchmark_price_micros'];
				$price_gap       = $regular_price - $price_on_google;

				// Get the WooCommerce product ID and thumbnail.
				$wc_product_id = (int) $price_competitiveness['offer_id'];
				$thumbnail     = $this->get_product_thumbnail( $wc_product_id );

				// Map the data to the required format.
				return [
					'product'         => [
						'id'        => $wc_product_id,
						'thumbnail' => $thumbnail,
						'title'     => $price_competitiveness['title'],
					],
					'effectiveness'   => $price_insights['effectiveness'] ?? '',
					'regular_price'   => round( $regular_price / 1000000, 2 ),
					'price_on_google' => round( $price_on_google / 1000000, 2 ),
					'price_gap'       => round( $price_gap / 1000000, 2 ),
					'suggested_price' => isset( $price_insights['suggested_price_micros'] )
						? round( $price_insights['suggested_price_micros'] / 1000000, 2 )
						: '',
				];
			},
			$mapped_data
		);

		return $response_data;
	}
}
