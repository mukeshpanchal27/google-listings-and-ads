<?php
declare( strict_types=1 );

namespace Automattic\WooCommerce\GoogleListingsAndAds\API\Site\Controllers\MerchantCenter;

use Automattic\WooCommerce\GoogleListingsAndAds\API\Site\Controllers\BaseController;
use Automattic\WooCommerce\GoogleListingsAndAds\API\TransportMethods;
use Automattic\WooCommerce\GoogleListingsAndAds\API\Google\MerchantPriceBenchmarks;
use Automattic\WooCommerce\GoogleListingsAndAds\API\Google\MerchantReport;
use Automattic\WooCommerce\GoogleListingsAndAds\API\Google\Query\MerchantPriceSuggestionsQuery;
use Automattic\WooCommerce\GoogleListingsAndAds\API\Google\Query\ReportQueryTrait;
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
	use ReportQueryTrait;

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
					'args'                => $this->get_price_benchmarks_params(),
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

				$merchant_report_data = $this->get_products_report_data( $request );

				$benchmark_data      = $merchant->get_benchmark_data( $this->prepare_query_arguments( $request ) );
				$price_insights_data = $merchant->get_price_insights( $this->prepare_query_arguments( $request ) );

				// Map the data to the required format.
				$response_data = $this->map_price_benchmarks_response( $benchmark_data, $price_insights_data, $merchant_report_data );
				return new Response( $response_data );
			} catch ( Exception $e ) {
				return $this->response_from_exception( $e );
			}
		};
	}

	/**
	 * Retrieves the products report data for the given request.
	 *
	 * @param Request $request REST Request.
	 * @return array|WP_Error Prepared response data or error.
	 */
	protected function get_products_report_data( Request $request ): array {
		try {
			/** @var MerchantReport $merchant_report */
			$merchant_report         = $this->container->get( MerchantReport::class );
			$prepare_query_arguments = $this->prepare_query_arguments( $request );
			$product_id              = $request->get_param( 'id' );

			// If a product ID is provided, set it in the query arguments.
			if ( $product_id ) {
				$prepare_query_arguments['ids']      = [ $product_id ];
				$prepare_query_arguments['fields']   = [ 'clicks', 'conversions' ];
				$prepare_query_arguments['interval'] = 'week';
			}

			$report_data = $merchant_report->get_report_data( 'products', $prepare_query_arguments );

			// Ensure the response is always an array.
			if ( is_wp_error( $report_data ) ) {
				return [];
			}

			return $report_data;
		} catch ( Exception $exception ) {
			// Log the exception and return an empty array.
			return [];
		}
	}

	/**
	 * Maps the benchmark and price insights data to the required API response format.
	 *
	 * @param array $benchmark_data       Raw benchmark data.
	 * @param array $price_insights_data  Raw price insights data.
	 * @param array $merchant_report_data Raw merchant report data.
	 * @return array Mapped response data.
	 */
	protected function map_price_benchmarks_response( array $benchmark_data, array $price_insights_data, array $merchant_report_data ): array {
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
					...( ! empty( $merchant_report_data ) ? [
						'clicks'                       => 30,
						'conversions'                  => 3,
						'predicted_clicks_change'      => $price_insights['predicted_clicks_change_fraction'] ?? null,
						'predicted_conversions_change' => $price_insights['predicted_conversions_change_fraction'] ?? null,
					] : [] ),
				];
			},
			$mapped_data
		);

		return $response_data;
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
			'product'                      => [
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
			'effectiveness'                => [
				'description' => __( 'Effectiveness score.', 'google-listings-and-ads' ),
				'type'        => 'number',
			],
			'regular_price'                => [
				'description' => __( 'Regular price of the product.', 'google-listings-and-ads' ),
				'type'        => 'number',
			],
			'price_on_google'              => [
				'description' => __( 'Price of the product on Google.', 'google-listings-and-ads' ),
				'type'        => 'number',
			],
			'price_gap'                    => [
				'description' => __( 'Price gap between the regular price and the price on Google.', 'google-listings-and-ads' ),
				'type'        => 'number',
			],
			'suggested_price'              => [
				'description' => __( 'Suggested price for the product.', 'google-listings-and-ads' ),
				'type'        => 'number',
			],
			'clicks'                       => [
				'description' => __( 'Current clicks.', 'google-listings-and-ads' ),
				'type'        => [ 'integer', 'null' ],
			],
			'conversions'                  => [
				'description' => __( 'Current conversions.', 'google-listings-and-ads' ),
				'type'        => [ 'integer', 'null' ],
			],
			'predicted_clicks_change'      => [
				'description' => __( 'Expected uplift in clicks (fraction).', 'google-listings-and-ads' ),
				'type'        => [ 'string', 'null' ],
			],
			'predicted_conversions_change' => [
				'description' => __( 'Expected uplift in conversions (fraction).', 'google-listings-and-ads' ),
				'type'        => [ 'string', 'null' ],
			],
		];
	}

	/**
	 * Retrieves the parameters for price benchmarks.
	 *
	 * @return array An associative array of parameters for price benchmarks.
	 */
	public function get_price_benchmarks_params(): array {
		return [
			'ids'      => [
				'description'       => __( 'Limit result to items with specified ids.', 'google-listings-and-ads' ),
				'type'              => 'array',
				'sanitize_callback' => 'wp_parse_slug_list',
				'validate_callback' => 'rest_validate_request_arg',
				'items'             => [
					'type' => 'string',
				],
			],
			'fields'   => [
				'description' => __( 'Comma-separated list of fields to include in the response.', 'google-listings-and-ads' ),
				'type'        => 'array',
				'required'    => false,
			],
			'interval' => [
				'description'       => __( 'Time interval to use for segments in the returned data.', 'google-listings-and-ads' ),
				'type'              => 'string',
				'required'          => false,
				'enum'              => [
					'day',
					'week',
					'month',
					'quarter',
					'year',
				],
				'validate_callback' => 'rest_validate_request_arg',
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
