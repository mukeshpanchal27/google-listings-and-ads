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
	 * Get the count of unknown products priced than the benchmark.
	 *
	 * @return int
	 */
	public function get_unknown_products_priced_than_benchmark_count() {
		$query = $this->wpdb->prepare(
			"SELECT COUNT(*) FROM {$this->table->get_name()} WHERE price_compared_with_benchmark = %d", // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
			0
		);

		return (int) $this->wpdb->get_var( $query ); // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared
	}

	/**
	 * Get the count of products priced lower than the benchmark.
	 *
	 * @return int
	 */
	public function get_products_priced_lower_than_benchmark_count() {
		$query = $this->wpdb->prepare(
			"SELECT COUNT(*) FROM {$this->table->get_name()} WHERE price_compared_with_benchmark = %d", // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
			1
		);

		return (int) $this->wpdb->get_var( $query ); // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared
	}

	/**
	 * Get the count of products priced similar than the benchmark.
	 *
	 * @return int
	 */
	public function get_products_priced_similar_than_benchmark_count() {
		$query = $this->wpdb->prepare(
			"SELECT COUNT(*) FROM {$this->table->get_name()} WHERE price_compared_with_benchmark = %d", // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
			2
		);

		return (int) $this->wpdb->get_var( $query ); // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared
	}

	/**
	 * Get the count of products priced higher than the benchmark.
	 *
	 * @return int
	 */
	public function get_products_priced_higher_than_benchmark_count() {
		$query = $this->wpdb->prepare(
			"SELECT COUNT(*) FROM {$this->table->get_name()} WHERE price_compared_with_benchmark = %d", // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
			3
		);

		return (int) $this->wpdb->get_var( $query ); // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared
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
