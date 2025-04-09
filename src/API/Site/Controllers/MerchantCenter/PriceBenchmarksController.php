<?php
declare( strict_types=1 );

namespace Automattic\WooCommerce\GoogleListingsAndAds\API\Site\Controllers\MerchantCenter;

use Automattic\WooCommerce\GoogleListingsAndAds\API\Site\Controllers\BaseController;
use Automattic\WooCommerce\GoogleListingsAndAds\API\TransportMethods;
use Automattic\WooCommerce\GoogleListingsAndAds\API\Google\Query\MerchantPriceSuggestionsQuery;
use Automattic\WooCommerce\GoogleListingsAndAds\API\Google\MerchantPriceBenchmarks;
use Automattic\WooCommerce\GoogleListingsAndAds\Product\ProductHelper;
use Automattic\WooCommerce\GoogleListingsAndAds\Internal\ContainerAwareTrait;
use Automattic\WooCommerce\GoogleListingsAndAds\Internal\Interfaces\ContainerAwareInterface;
use Automattic\WooCommerce\GoogleListingsAndAds\Proxies\RESTServer;
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
	 * Product helper class.
	 *
	 * @var ProductHelper
	 */
	protected $product_helper;

	/**
	 * Merchant Report constructor.
	 *
	 * @param RESTServer    $server
	 * @param ProductHelper $product_helper
	 */
	public function __construct( RESTServer $server, ProductHelper $product_helper ) {
		parent::__construct( $server );
		$this->product_helper = $product_helper;
	}

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
	 * Maps the benchmark and price insights data to the required API response format.
	 *
	 * @param array $benchmark_data Raw benchmark data.
	 * @param array $price_insights_data Raw price insights data.
	 * @return array Mapped response data.
	 */
	protected function map_price_benchmarks_response( array $benchmark_data, array $price_insights_data ): array {
		$mapped_data = [];

		if ( empty( $benchmark_data['results'] ) || empty( $price_insights_data['results'] ) ) {
			return $mapped_data;
		}
		// Loop through the benchmark data results.
		foreach ( $benchmark_data['results'] as $benchmark_result ) {
			$product_view          = $benchmark_result['productView'];
			$price_competitiveness = $benchmark_result['priceCompetitiveness'];

			// Find the matching price insights data by offer_id.
			foreach ( $price_insights_data['results'] as $price_insights_result ) {
				if ( $product_view['id'] !== $price_insights_result['productView']['id'] ) {
					continue;
				}

				$price_insights = $price_insights_result['priceCompetitiveness'] ?? [];

				// Calculate the price gap.
				$regular_price   = (int) $product_view['priceMicros'];
				$price_on_google = (int) $price_competitiveness['benchmarkPriceMicros'];
				$price_gap       = $regular_price - $price_on_google;

				// Get the WooCommerce product ID and thumbnail.
				$product_id = $this->product_helper->get_wc_product_id( $product_view['id'] );
				$thumbnail  = $this->get_product_thumbnail( $product_id );

				// Map the data to the required format.
				$mapped_data[] = [
					'product'         => [
						'id'        => $product_id,
						'thumbnail' => $thumbnail,
						'title'     => $product_view['title'],
					],
					'effectiveness'   => $price_insights['effectiveness'] ?? '',
					'regular_price'   => round( $regular_price / 1000000, 2 ),
					'price_on_google' => round( $price_on_google / 1000000, 2 ),
					'price_gap'       => round( $price_gap / 1000000, 2 ),
					'suggested_price' => isset( $price_insights['suggestedPriceMicros'] )
						? round( $price_insights['suggestedPriceMicros'] / 1000000, 2 )
						: '',
				];
			}
		}

		return $mapped_data;
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
