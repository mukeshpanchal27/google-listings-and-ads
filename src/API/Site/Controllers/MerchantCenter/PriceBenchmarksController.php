<?php
declare( strict_types=1 );

namespace Automattic\WooCommerce\GoogleListingsAndAds\API\Site\Controllers\MerchantCenter;

use Automattic\WooCommerce\GoogleListingsAndAds\API\Site\Controllers\BaseController;
use Automattic\WooCommerce\GoogleListingsAndAds\API\TransportMethods;
use Automattic\WooCommerce\GoogleListingsAndAds\API\Google\Query\MerchantPriceSuggestionsQuery;
use Automattic\WooCommerce\GoogleListingsAndAds\API\Google\MerchantPriceBenchmarks;
use Automattic\WooCommerce\GoogleListingsAndAds\Internal\ContainerAwareTrait;
use Automattic\WooCommerce\GoogleListingsAndAds\Internal\Interfaces\ContainerAwareInterface;
use Automattic\WooCommerce\GoogleListingsAndAds\MerchantCenter\PriceBenchmarks;
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
					'methods'             => TransportMethods::READABLE,
					'callback'            => $this->get_price_benchmarks_callback(),
					'permission_callback' => $this->get_permission_callback(),
				],
				'schema' => $this->get_api_response_schema_callback(),
			]
		);

		// Route for price benchmarks summary.
		$this->register_route(
			'mc/price-benchmarks/summary',
			[
				[
					'methods'  => TransportMethods::READABLE,
					'callback' => $this->get_price_benchmarks_summary_callback(),
					// TODO: Add permission callback.
					'args'     => $this->get_summary_response_schema_callback(),
				],
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

				$benchmark_data      = $merchant->get_benchmark_data( $this->prepare_query_arguments( $request ) );
				$price_insights_data = $merchant->get_price_insights( $this->prepare_query_arguments( $request ) );

				// Map the data to the required format.
				$response_data = $merchant->map_price_benchmarks_response( $benchmark_data, $price_insights_data );

				return new Response( $response_data );
			} catch ( Exception $e ) {
				return $this->response_from_exception( $e );
			}
		};
	}

	/**
	 * Callback for the price benchmarks summary endpoint.
	 *
	 * @return callable
	 */
	protected function get_price_benchmarks_summary_callback(): callable {
		return function ( Request $request ) {
			try {
				/** @var PriceBenchmarks $price_benchmarks */
				$price_benchmarks = $this->container->get( PriceBenchmarks::class );

				$summary_data = $price_benchmarks->get_summary();

				return new Response( $summary_data );
			} catch ( Exception $e ) {
				return $this->response_from_exception( $e );
			}
		};
	}

	/**
	 * Retrieves the product thumbnail URL.
	 *
	 * @param int $product_id WooCommerce product ID.
	 * @return string|null Product thumbnail URL or null if not found.
	 */
	protected function get_product_thumbnail( int $product_id ): ?string {
		$thumbnail_id = get_post_thumbnail_id( $product_id );

		if ( ! $thumbnail_id ) {
			return '';
		}

		$thumbnail_url = wp_get_attachment_url( $thumbnail_id );

		return $thumbnail_url ?? '';
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
	 * Get the schema for the summary endpoint.
	 *
	 * @return array
	 */
	protected function get_summary_response_schema_callback(): array {
		return [
			'total_products' => [
				'description' => __( 'Total number of products represented in the Google report.', 'google-listings-and-ads' ),
				'type'        => 'integer',
			],
			'price_similar'  => [
				'description' => __( 'Total number of products with similar prices to benchmark data.', 'google-listings-and-ads' ),
				'type'        => 'integer',
			],
			'price_higher'   => [
				'description' => __( 'Total number of products with higher prices to benchmark data.', 'google-listings-and-ads' ),
				'type'        => 'integer',
			],
			'price_lower'    => [
				'description' => __( 'Total number of products with lower prices to benchmark data.', 'google-listings-and-ads' ),
				'type'        => 'integer',
			],
			'price_unknown'  => [
				'description' => __( 'Total number of products without price benchmark data.', 'google-listings-and-ads' ),
				'type'        => 'integer',
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
