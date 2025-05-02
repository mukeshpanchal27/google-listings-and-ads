<?php
declare( strict_types=1 );

namespace Automattic\WooCommerce\GoogleListingsAndAds\DB\Table;

use Automattic\WooCommerce\GoogleListingsAndAds\DB\Table;

defined( 'ABSPATH' ) || exit;

/**
 * Class MerchantPriceBenchmarksTable
 *
 * @package Automattic\WooCommerce\GoogleListingsAndAds\DB\Tables
 */
class MerchantPriceBenchmarksTable extends Table {

	/**
	 * Get the schema for the DB.
	 *
	 * This should be a SQL string for creating the DB table.
	 *
	 * @return string
	 */
	protected function get_install_query(): string {
		return "
CREATE TABLE `{$this->get_sql_safe_name()}` (
	product_id varchar(255) NOT NULL,
	id varchar(255) NOT NULL,
	price_micros bigint(20) NOT NULL,
	currency_code varchar(3) NOT NULL,
	country_code varchar(2) NOT NULL,
	benchmark_price_micros bigint(20) NOT NULL,
	benchmark_price_currency_code varchar(3) NOT NULL,
	price_compared_with_benchmark tinyint(1) NOT NULL DEFAULT 0,
	PRIMARY KEY (product_id, id),
	KEY currency_code (currency_code),
	KEY country_code (country_code),
	KEY price_compared_with_benchmark (price_compared_with_benchmark)
) {$this->get_collation()};
";
	}

	/**
	 * Get the un-prefixed (raw) table name.
	 *
	 * @return string
	 */
	public static function get_raw_name(): string {
		return 'merchant_price_benchmarks';
	}

	/**
	 * Get the columns for the table.
	 *
	 * @return array
	 */
	public function get_columns(): array {
		return [
			'product_id'                    => true,
			'id'                            => true,
			'price_micros'                  => true,
			'currency_code'                 => true,
			'country_code'                  => true,
			'benchmark_price_micros'        => true,
			'benchmark_price_currency_code' => true,
			'price_compared_with_benchmark' => true,
		];
	}
}
