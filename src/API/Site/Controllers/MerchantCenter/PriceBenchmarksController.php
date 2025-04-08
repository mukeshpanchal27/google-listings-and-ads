<?php
declare( strict_types=1 );

namespace Automattic\WooCommerce\GoogleListingsAndAds\API\Site\Controllers\MerchantCenter;

use Automattic\WooCommerce\GoogleListingsAndAds\API\Site\Controllers\BaseController;
use Automattic\WooCommerce\GoogleListingsAndAds\API\TransportMethods;
use Automattic\WooCommerce\GoogleListingsAndAds\API\Google\Query\MerchantPriceSuggestionsQuery;
use Automattic\WooCommerce\GoogleListingsAndAds\API\Google\MerchantPriceBenchmarks;
use Automattic\WooCommerce\GoogleListingsAndAds\Internal\ContainerAwareTrait;
use Automattic\WooCommerce\GoogleListingsAndAds\Internal\Interfaces\ContainerAwareInterface;
use Exception;
use WP_REST_Request as Request;
use WP_REST_Response as Response;

defined( 'ABSPATH' ) || exit;

/**
 * Class PriceBenchmarksController
 *
 * @package Automattic\WooCommerce\GoogleListingsAndAds\API\Site\Controllers\MerchantCenter
 */
class PriceBenchmarksController extends BaseController implements ContainerAwareInterface {

	use ContainerAwareTrait;

	/**
	 * Register rest routes with WordPress.
	 */
	public function register_routes(): void {
		$this->register_route(
			'mc/price-benchmarks',
			[
				[
					'methods'  => TransportMethods::READABLE,
					'callback' => $this->get_price_benchmarks_callback(),
				],
				'schema' => $this->get_api_response_schema_callback(),
			]
		);
	}

	/**
	 * Maps query arguments from the REST request.
	 *
	 * @param Request $request REST Request.
	 * @return array
	 */
	protected function prepare_query_arguments( Request $request ): array {
		$args = wp_parse_args(
			array_intersect_key(
				$request->get_query_params(),
				$this->get_collection_params()
			),
			$request->get_default_params()
		);

		return $args;
	}

	/**
	 * Get the callback function for the price benchmarks request.
	 *
	 * @return callable
	 */
	protected function get_price_benchmarks_callback(): callable {
		return function ( Request $request ) {
			try {
				/** @var MerchantPriceBenchmarks $merchant */
				$merchant = $this->container->get( MerchantPriceBenchmarks::class );

				$benchmark_data = $merchant->get_benchmark_data( $this->prepare_query_arguments( $request ) );
				$benchmark_data = $this->prepare_item_for_response( $benchmark_data, $request );

				$get_price_insights = $merchant->get_price_insights( $this->prepare_query_arguments( $request ) );
				$get_price_insights = $this->prepare_item_for_response( $get_price_insights, $request );

				return new Response(
					[
						'price_benchmarks' => $benchmark_data,
						'price_insights'   => $get_price_insights,
					]
				);
			} catch ( Exception $e ) {
				return $this->response_from_exception( $e );
			}
		};
	}

	/**
	 * Get the schema for settings endpoints.
	 *
	 * @return array
	 */
	protected function get_schema_properties(): array {
		return [
			'product'         => [
				'description' => __( 'Product details.', 'google-listings-and-ads' ),
				'type'        => 'object',
				'properties'  => [
					'id'        => [ 'type' => 'integer' ],
					'thumbnail' => [
						'type'   => 'string',
						'format' => 'uri',
					],
					'title'     => [ 'type' => 'string' ],
				],
			],
			'effectiveness'   => [
				'description' => __( 'Effectiveness score.', 'google-listings-and-ads' ),
				'type'        => 'number',
			],
			'regular_price'   => [
				'description' => __( 'Regular price of the product.', 'google-listings-and-ads' ),
				'type'        => 'number',
			],
			'price_on_google' => [
				'description' => __( 'Price of the product on Google.', 'google-listings-and-ads' ),
				'type'        => 'number',
			],
			'price_gap'       => [
				'description' => __( 'Price gap between the regular price and the price on Google.', 'google-listings-and-ads' ),
				'type'        => 'number',
			],
			'suggested_price' => [
				'description' => __( 'Suggested price for the product.', 'google-listings-and-ads' ),
				'type'        => 'number',
			],
		];
	}

	/**
	 * Get the item schema name for the controller.
	 *
	 * Used for building the API response schema.
	 *
	 * @return string
	 */
	protected function get_schema_title(): string {
		return 'price_benchmarks';
	}
}
