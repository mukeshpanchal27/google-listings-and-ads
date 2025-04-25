<?php
declare( strict_types=1 );

namespace Automattic\WooCommerce\GoogleListingsAndAds\DB\Query;

use Automattic\WooCommerce\GoogleListingsAndAds\DB\Query;
use Automattic\WooCommerce\GoogleListingsAndAds\DB\Table\MerchantPriceBenchmarksTable;
use Automattic\WooCommerce\GoogleListingsAndAds\Exception\InvalidQuery;
use wpdb;

defined( 'ABSPATH' ) || exit;

/**
 * Class MerchantPriceBenchmarksQuery
 *
 * @package Automattic\WooCommerce\GoogleListingsAndAds\DB\Query
 */
class MerchantPriceBenchmarksQuery extends Query {

	/**
	 * MerchantPriceBenchmarksQuery constructor.
	 *
	 * @param wpdb                         $wpdb
	 * @param MerchantPriceBenchmarksTable $table
	 */
	public function __construct( wpdb $wpdb, MerchantPriceBenchmarksTable $table ) {
		parent::__construct( $wpdb, $table );
		$this->table = $table;
	}

	/**
	 * Sanitize a value for a given column before inserting it into the DB.
	 *
	 * @param string $column The column name.
	 * @param mixed  $value  The value to sanitize.
	 *
	 * @return mixed The sanitized value.
	 */
	protected function sanitize_value( string $column, $value ) {
		return $value;
	}

	/**
	 * Get count of products grouped by price_compared_with_benchmark value.
	 *
	 * @return array Returns an array with counts for each price comparison group.
	 */
	public function get_price_benchmark_counts(): array {
		// Get the raw SQL query with GROUP BY
		$column = 'price_compared_with_benchmark';
		$this->validate_column( $column );

		$query = "SELECT `{$column}`, COUNT(*) as count FROM `{$this->table->get_name()}` GROUP BY `{$column}`";

		$results = $this->wpdb->get_results(
			$query, // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared, No user input.
			ARRAY_A
		);

		// Convert the results to a more usable format
		$counts = [];
		$total  = 0;
		foreach ( $results as $row ) {
			$price_compared_value            = (int) $row['price_compared_with_benchmark'];
			$counts[ $price_compared_value ] = (int) $row['count'];
			$total                          += $counts[ $price_compared_value ];
		}

		// Make sure all possible values are represented (0, 1, 2, 3)
		$all_values = [ 0, 1, 2, 3 ];
		foreach ( $all_values as $value ) {
			if ( ! isset( $counts[ $value ] ) ) {
				$counts[ $value ] = 0;
			}
		}

		$counts['total'] = $total;

		return $counts;
	}

	/**
	 * Reload merchant price benchmarks data.
	 *
	 * @return void
	 */
	public function reload_data(): void {
		if ( $this->table->exists() ) {
			$this->table->truncate();
		}
	}
}
