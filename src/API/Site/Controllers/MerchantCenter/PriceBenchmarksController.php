<?php
declare( strict_types=1 );

namespace Automattic\WooCommerce\GoogleListingsAndAds\API\Site\Controllers\MerchantCenter;

use Automattic\WooCommerce\GoogleListingsAndAds\API\Google\MerchantPriceBenchmarks;
use Automattic\WooCommerce\GoogleListingsAndAds\API\Site\Controllers\BaseController;
use Automattic\WooCommerce\GoogleListingsAndAds\API\TransportMethods;
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
					'args'                => $this->get_collection_params(),
				],
				'schema' => $this->get_api_response_schema_callback(),
			]
		);

		$this->register_route(
			'mc/price-benchmarks/(?P<id>[\d]+)',
			[
				[
					'methods'             => TransportMethods::READABLE,
					'callback'            => $this->get_price_benchmarks_item_callback(),
					'permission_callback' => $this->get_permission_callback(),
					'args'                => $this->get_item_params(),
				],
				'schema' => $this->get_api_response_schema_callback(),
			]
		);

		// Route for price benchmarks summary.
		$this->register_route(
			'mc/price-benchmarks/summary',
			[
				[
					'methods'             => TransportMethods::READABLE,
					'callback'            => $this->get_price_benchmarks_summary_callback(),
					'permission_callback' => $this->get_permission_callback(),
				],
				'schema' => $this->get_summary_response_schema_callback(),
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
				$response_data = $this->map_price_benchmarks_response( $benchmark_data, $price_insights_data );
				return new Response( $response_data );
			} catch ( Exception $e ) {
				return $this->response_from_exception( $e );
			}
		};
	}

	/**
	 * Get the callback function for a specific price benchmark request.
	 *
	 * @return callable
	 */
	protected function get_price_benchmarks_item_callback(): callable {
		return function ( Request $request ) {
			try {
				/** @var MerchantPriceBenchmarks $merchant */
				$merchant = $this->container->get( MerchantPriceBenchmarks::class );

				$benchmark_data      = $merchant->get_benchmark_data( $this->prepare_query_arguments( $request ) );
				$price_insights_data = $merchant->get_price_insights( $this->prepare_query_arguments( $request ) );

				// Map the data to the required format.
				$response_data = $this->map_price_benchmarks_response( $benchmark_data, $price_insights_data );

				if ( ! empty( $response_data ) ) {
					$metrics_data = $this->get_products_report_data( $request );
					// Combine metrics data into the response for the specific product.
					if ( isset( $response_data[ $metrics_data['id'] ] ) ) {
						$response_data[ $metrics_data['id'] ] = array_merge(
							$response_data[ $metrics_data['id'] ],
							[
								'clicks'      => $metrics_data['clicks'],
								'conversions' => $metrics_data['conversions'],
							],
						);
					}
				}

				return new Response( $response_data );
			} catch ( Exception $e ) {
				return $this->response_from_exception( $e );
			}
		};
	}

	/**
	 * Get the query params for collections.
	 *
	 * @return array
	 */
	public function get_collection_params(): array {
		$params = parent::get_collection_params(); // Inherited from WP_REST_Controller.

		$params['next_page'] = [
			'description'       => __( 'Token to retrieve the next page.', 'google-listings-and-ads' ),
			'type'              => 'string',
			'validate_callback' => 'rest_validate_request_arg',
		];

		return $params;
	}

	/**
	 * Get the query params for a single product.
	 *
	 * @return array
	 */
	public function get_item_params(): array {
		$params = parent::get_collection_params();

		$item_params = [
			'id'        => [
				'description' => __( 'The Id of the product.', 'google-listings-and-ads' ),
				'type'        => 'integer',
			],
			'next_page' => [
				'description'       => __( 'Token to retrieve the next page.', 'google-listings-and-ads' ),
				'type'              => 'string',
				'validate_callback' => 'rest_validate_request_arg',
			],
		];

		return array_merge( $params, $item_params );
	}

	/**
	 * Retrieves the products report data for the given request.
	 *
	 * @param Request $request REST Request.
	 * @return array|WP_Error Prepared response data or error.
	 */
	protected function get_products_report_data( $request ): array {
		try {
			/** @var MerchantPriceBenchmarks $merchant */
			$merchant = $this->container->get( MerchantPriceBenchmarks::class );

			$product_id = $request->get_param( 'id' );

			// If no product ID is provided, bail early.
			if ( ! $product_id ) {
				return [];
			}

			$report_args = [
				'ids' => [ $product_id ],
			];

			$reports = $merchant->get_specific_product_report( $report_args );

			return $reports['results'][0] ?? [];
		} catch ( Exception $exception ) {
			// Log the exception and return an empty array.
			return [];
		}
	}

	/**
	 * Callback for the price benchmarks summary endpoint.
	 *
	 * @return callable
	 */
	protected function get_price_benchmarks_summary_callback(): callable {
		return function () {
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
	 * Maps the benchmark and price insights data to the required API response format.
	 *
	 * @param array $benchmark_data       Raw benchmark data.
	 * @param array $price_insights_data  Raw price insights data.
	 * @return array Mapped response data.
	 */
	protected function map_price_benchmarks_response( array $benchmark_data, array $price_insights_data ): array {
		$mapped_data = [];

		// Combine all data sets into $mapped_data keyed by product ID.
		foreach ( $benchmark_data['results'] ?? [] as $benchmark_result ) {
			$product_id                 = $benchmark_result['offer_id'];
			$mapped_data[ $product_id ] = [
				'price_competitiveness' => $benchmark_result,
				'price_insights'        => [],
			];
		}

		// Map price insights data to benchmarks data.
		if ( ! empty( $price_insights_data['results'] ) ) {
			foreach ( $price_insights_data['results'] as $price_insights_result ) {
				$product_id = $price_insights_result['offer_id'];
				if ( isset( $mapped_data[ $product_id ] ) ) {
					$mapped_data[ $product_id ]['price_insights'] = $price_insights_result;
				}
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
					'product'                      => [
						'id'        => $wc_product_id,
						'thumbnail' => $thumbnail,
						'title'     => $price_competitiveness['title'],
					],
					'effectiveness'                => $price_insights['effectiveness'] ?? '',
					'regular_price'                => round( $regular_price / 1000000, 2 ),
					'price_on_google'              => round( $price_on_google / 1000000, 2 ),
					'price_gap'                    => round( $price_gap / 1000000, 2 ),
					'suggested_price'              => isset( $price_insights['suggested_price_micros'] )
						? round( $price_insights['suggested_price_micros'] / 1000000, 2 )
						: '',
					'predicted_clicks_change'      => $price_insights['predicted_clicks_change_fraction'] ?? '',
					'predicted_conversions_change' => $price_insights['predicted_conversions_change_fraction'] ?? '',
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
	 * Get the schema for the summary endpoint.
	 *
	 * @see BaseController::get_api_response_schema_callback
	 *
	 * @return array
	 */
	protected function get_summary_response_schema_callback(): callable {
		return function () {
			return $this->prepare_item_schema( $this->get_summary_schema_properties(), $this->get_summary_schema_title() );
		};
	}

	/**
	 * Get the schema properties for the summary endpoint.
	 *
	 * @return array
	 */
	protected function get_summary_schema_properties(): array {
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

	/**
	 * Get the item schema name for the controller.
	 *
	 * Used for building the API response schema.
	 *
	 * @return string
	 */
	protected function get_summary_schema_title(): string {
		return 'price_benchmarks_summary';
	}
}
