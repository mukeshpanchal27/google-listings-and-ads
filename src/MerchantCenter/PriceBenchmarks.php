<?php
declare( strict_types=1 );

namespace Automattic\WooCommerce\GoogleListingsAndAds\MerchantCenter;

use Automattic\WooCommerce\GoogleListingsAndAds\API\Google\MerchantPriceBenchmarks;
use Automattic\WooCommerce\GoogleListingsAndAds\DB\Table\MerchantPriceBenchmarksTable;
use Automattic\WooCommerce\GoogleListingsAndAds\Infrastructure\Service;
use Automattic\WooCommerce\GoogleListingsAndAds\Internal\ContainerAwareTrait;
use Automattic\WooCommerce\GoogleListingsAndAds\Internal\Interfaces\ContainerAwareInterface;

defined( 'ABSPATH' ) || exit;

/**
 * Class PriceBenchmarks
 *
 * @package Automattic\WooCommerce\GoogleListingsAndAds\MerchantCenter
 */
class PriceBenchmarks implements ContainerAwareInterface, Service {

	use ContainerAwareTrait;

	/**
	 * Hook name for the scheduled task.
	 */
	public const SCHEDULED_TASK_HOOK = 'woocommerce_gla_update_price_benchmarks';

	/**
	 * Set up the scheduled task for updating price benchmarks.
	 */
	public function setup_scheduled_task(): void {
		if ( ! wp_next_scheduled( self::SCHEDULED_TASK_HOOK ) ) {
			wp_schedule_event( time(), 'hourly', self::SCHEDULED_TASK_HOOK );
		}

		add_action( self::SCHEDULED_TASK_HOOK, [ $this, 'update_price_benchmarks' ] );
	}

	/**
	 * Update price benchmarks by querying the Google Content API and saving the data locally.
	 */
	public function update_price_benchmarks(): void {
		/** @var MerchantPriceBenchmarks $api */
		$api = $this->container->get( MerchantPriceBenchmarks::class );

		try {
			$benchmarks = $api->get_benchmarks();

			/** @var MerchantPriceBenchmarksTable $table */
			$table = $this->container->get( MerchantPriceBenchmarksTable::class );

			// Clear existing data before updating.
			$table->truncate();

			// Insert new benchmark data.
			foreach ( $benchmarks as $benchmark ) {
				$table->insert(
					[
						'product_id'                    => $benchmark['product_id'],
						'id'                            => $benchmark['id'],
						'price_micros'                  => $benchmark['price_micros'],
						'currency_code'                 => $benchmark['currency_code'],
						'country_code'                  => $benchmark['country_code'],
						'benchmark_price_micros'        => $benchmark['benchmark_price_micros'],
						'benchmark_price_currency_code' => $benchmark['benchmark_price_currency_code'],
						'price_compared_with_benchmark' => $benchmark['price_compared_with_benchmark'],
					]
				);
			}
		} catch ( \Exception $e ) {
			do_action( 'woocommerce_gla_debug_message', $e->getMessage(), __METHOD__ );
		}
	}

	/**
	 * Get a summary of price benchmarks.
	 *
	 * @return array
	 */
	public function get_summary(): array {
		/** @var MerchantPriceBenchmarksTable $table */
		$table = $this->container->get( MerchantPriceBenchmarksTable::class );

		$results = $table->get_results();

		$total_products  = count( $results );
		$total_price_gap = 0;

		foreach ( $results as $result ) {
			$total_price_gap += (int) $result['price_micros'] - (int) $result['benchmark_price_micros'];
		}

		return [
			'total_products'    => $total_products,
			'average_price_gap' => $total_products > 0 ? round( $total_price_gap / $total_products / 1000000, 2 ) : 0,
		];
	}

	/**
	 * Get individual benchmark data for a specific product ID.
	 *
	 * @param string $product_id
	 * @return array|null
	 */
	public function get_benchmark_by_product_id( string $product_id ): ?array {
		/** @var MerchantPriceBenchmarksTable $table */
		$table = $this->container->get( MerchantPriceBenchmarksTable::class );

		return $table->get_row( [ 'product_id' => $product_id ] );
	}

	/**
	 * Get a list of all price benchmarks.
	 *
	 * @return array
	 */
	public function get_all_benchmarks(): array {
		/** @var MerchantPriceBenchmarksTable $table */
		$table = $this->container->get( MerchantPriceBenchmarksTable::class );

		return $table->get_results();
	}
}
