<?php
declare( strict_types=1 );

namespace Automattic\WooCommerce\GoogleListingsAndAds\MerchantCenter;

use Automattic\WooCommerce\GoogleListingsAndAds\API\Google\MerchantPriceBenchmarks;
use Automattic\WooCommerce\GoogleListingsAndAds\DB\Table\MerchantPriceBenchmarksTable;
use Automattic\WooCommerce\GoogleListingsAndAds\Infrastructure\Service;
use Automattic\WooCommerce\GoogleListingsAndAds\Internal\ContainerAwareTrait;
use Automattic\WooCommerce\GoogleListingsAndAds\Internal\Interfaces\ContainerAwareInterface;
use Automattic\WooCommerce\GoogleListingsAndAds\DB\Query\MerchantPriceBenchmarksQuery;
use Automattic\WooCommerce\GoogleListingsAndAds\Jobs\UpdateMerchantPriceBenchmarks;

defined( 'ABSPATH' ) || exit;

/**
 * Class PriceBenchmarks
 *
 * @package Automattic\WooCommerce\GoogleListingsAndAds\MerchantCenter
 */
class PriceBenchmarks implements ContainerAwareInterface, Service {

	use ContainerAwareTrait;

	/**
	 * Update price benchmarks by querying the Google Content API and saving the data locally.
	 */
	public function update_price_benchmarks(): void {
		try {
			/** @var MerchantPriceBenchmarks $merchant */
			$merchant = $this->container->get( MerchantPriceBenchmarks::class );

			$benchmarks = $merchant->get_benchmark_data( [] );

			if ( empty( $benchmarks ) || empty( $benchmarks['results'] ) ) {
				return;
			}

			/** @var MerchantPriceBenchmarksQuery $query */
			$query = $this->container->get( MerchantPriceBenchmarksQuery::class );

			// Clear existing data before updating.
			$query->reload_data();

			// Insert new benchmark data.
			foreach ( $benchmarks['results'] as $benchmark ) {

				$price_compared_with_benchmark = $this->price_compared_with_benchmark( $benchmark['price_micros'], $benchmark['benchmark_price_micros'] );
				$query->insert(
					[
						'product_id'                    => $benchmark['offer_id'],
						'id'                            => $benchmark['id'],
						'price_micros'                  => $benchmark['price_micros'],
						'currency_code'                 => $benchmark['currency_code'],
						'country_code'                  => $benchmark['country_code'],
						'benchmark_price_micros'        => $benchmark['benchmark_price_micros'],
						'benchmark_price_currency_code' => $benchmark['benchmark_price_currency_code'],
						'price_compared_with_benchmark' => $price_compared_with_benchmark,
					]
				);
			}
		} catch ( \Exception $e ) {
			do_action( 'woocommerce_gla_debug_message', $e->getMessage(), __METHOD__ );
		}
	}

	/**
	 * Compares a given price with a benchmark price.
	 *
	 * This function takes two prices in micros (1,000,000 micros = 1 unit of currency)
	 * and performs a comparison to determine their relationship.
	 *
	 * @param int $price_micros           The price to compare, in micros.
	 * @param int $benchmark_price_micros The benchmark price to compare against, in micros.
	 * @return bool Returns specific price compare group if the price meets the comparison criteria with the benchmark.
	 */
	private function price_compared_with_benchmark( $price_micros, $benchmark_price_micros ) {
		if ( empty( $price_micros ) || empty( $benchmark_price_micros ) ) {
			return 0;
		} elseif ( abs( $price_micros - $benchmark_price_micros ) <= ( $benchmark_price_micros * 0.01 ) ) {
			return 2;
		} elseif ( $price_micros < $benchmark_price_micros ) {
			return 1;
		} elseif ( $price_micros > $benchmark_price_micros ) {
			return 3;
		}
	}

	/**
	 * Get a summary of price benchmarks.
	 *
	 * @return array
	 */
	public function get_summary(): array {
		/** @var MerchantPriceBenchmarksQuery $query */
		$query = $this->container->get( MerchantPriceBenchmarksQuery::class );

		$job = $this->container->get( UpdateMerchantPriceBenchmarks::class );

		// If force_refresh is true or if not transient, return empty array and scheduled the job to update the statuses.
		if ( ! $job->is_scheduled() ) {
			// Schedule job to update the statuses. If the failure rate is too high, the job will not be scheduled.
			$job->schedule();
		}

		// Get counts for all benchmark comparison groups in one query
		$price_comparison_counts = $query->get_price_benchmark_counts();

		return [
			'total_products' => $price_comparison_counts['total'] ?? 0, // Total products
			'price_unknown'  => $price_comparison_counts[0] ?? 0, // Unknown/missing
			'price_lower'    => $price_comparison_counts[1] ?? 0, // Lower price
			'price_similar'  => $price_comparison_counts[2] ?? 0, // Similar price
			'price_higher'   => $price_comparison_counts[3] ?? 0, // Higher price
		];
	}

	/**
	 * Get individual benchmark data for a specific product ID.
	 *
	 * @param string $product_id
	 * @return array|null
	 */
	public function get_benchmark_by_product_id( string $product_id ): ?array {
		/** @var MerchantPriceBenchmarksQuery $query */
		$query = $this->container->get( MerchantPriceBenchmarksQuery::class );

		return $query->get_row( [ 'product_id' => $product_id ] );
	}
}
