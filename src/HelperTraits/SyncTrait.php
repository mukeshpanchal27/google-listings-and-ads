<?php
declare( strict_types=1 );

namespace Automattic\WooCommerce\GoogleListingsAndAds\HelperTraits;

use Automattic\WooCommerce\GoogleListingsAndAds\Jobs\MigrateGTIN;
use Automattic\WooCommerce\GoogleListingsAndAds\Options\OptionsAwareTrait;
use Automattic\WooCommerce\GoogleListingsAndAds\Options\OptionsInterface;
use Exception;
use WC_Product;

defined( 'ABSPATH' ) || exit;

/**
 * Trait with some helpers for API Pull and MC Push Sync modes.
 *
 * @package Automattic\WooCommerce\GoogleListingsAndAds\HelperTraits
 */
trait SyncTrait {

	use OptionsAwareTrait;

	public const PULL = 'pull';
	public const PUSH = 'push';

	public const DATATYPE_PRODUCTS = 'products';
	public const DATATYPE_COUPONS  = 'coupons';
	public const DATATYPE_SHIPPING = 'shipping';
	public const DATATYPE_SETTINGS = 'settings';

	public const DEFAULT_SYNC_MODE = [
		self::DATATYPE_PRODUCTS => [
			self::PULL => false,
			self::PUSH => false,
		],
		self::DATATYPE_COUPONS => [
			self::PULL => false,
			self::PUSH => false,
		],
		self::DATATYPE_SHIPPING => [
			self::PULL => false,
			self::PUSH => false,
		],
		self::DATATYPE_SETTINGS => [
			self::PULL => false,
			self::PUSH => false,
		],
	];




	/**
	 * Get the current value for the API PULL Sync.
	 * Notice that malformed data will be replaced by default data.
	 *
	 * @return array
	 */
	protected function get_current_sync_value(): array {
		$sync_mode = $this->options->get(OptionsInterface::API_PULL_SYNC_MODE);

		if (!is_array($sync_mode)) {
			$sync_mode = self::DEFAULT_SYNC_MODE;
		}

		return array_replace_recursive(self::DEFAULT_SYNC_MODE, $sync_mode);
	}

	/**
	 * Check if API PULL is enabled for a specific data type.
	 *
	 * Checking null data type returns true.
	 * Checking a non-existent data type will return false.
	 *
	 * @param string|null $data_type The data type to check.
	 * @return bool
	 */
	protected function is_pull_enabled_for_datatype( string $data_type = null ): bool {

		if ( is_null( $data_type ) ) {
			return true;
		}

		$sync_modes = $this->get_current_sync_value();

		return apply_filters( 'woocommerce_gla_is_pull_enabled_for_datatype', $sync_modes[ $data_type ][self::PULL] ?? false );
	}

	/**
	 * Check if MC PUSH is enabled for a specific data type.
	 * @param string|null $data_type The data type to check.
	 * @return bool
	 */
	protected function is_push_enabled_for_datatype( string $data_type = null ): bool {

		if ( is_null( $data_type ) ) {
			return true;
		}

		$sync_modes = $this->get_current_sync_value();

		return apply_filters( 'woocommerce_gla_is_push_enabled_for_datatype', $sync_modes[ $data_type ][self::PUSH] ?? false  );
	}
}
