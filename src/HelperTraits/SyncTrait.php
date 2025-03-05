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

	/**
	 * Get the products datatype key
	 *
	 * @return string
	 */
	protected function get_products_datatype(): string {
		return 'products';
	}

	/**
	 * Get the coupons datatype key
	 *
	 * @return string
	 */
	protected function get_coupons_datatype(): string {
		return 'coupons';
	}

	/**
	 * Get the shipping datatype key
	 *
	 * @return string
	 */
	protected function get_shipping_datatype(): string {
		return 'shipping';
	}

	/**
	 * Get the settings datatype key
	 *
	 * @return string
	 */
	protected function get_settings_datatype(): string {
		return 'settings';
	}

	/**
	 * Get the default config for the sync mode.
	 *
	 * @return array[]
	 */
	protected function get_default_sync_mode(): array {
		$default_mode = [
			'pull' => true,
			'push' => true
		];

		return [
			$this->get_products_datatype() => $default_mode,
			$this->get_coupons_datatype()  => $default_mode,
			$this->get_shipping_datatype() => $default_mode,
			$this->get_settings_datatype() => $default_mode,
		];
	}

	/**
	 * Get the current value for the API PULL Sync.
	 * Notice that malformed data will be replaced by default data.
	 *
	 * @return array
	 */
	protected function get_current_sync_value(): array {
		$sync_mode = $this->options->get( OptionsInterface::API_PULL_SYNC_MODE );

		if ( ! is_array( $sync_mode ) ) {
			$sync_mode = $this->get_default_sync_mode();
		}

		return array_replace_recursive( $this->get_default_sync_mode(), $sync_mode );
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

		return (bool) apply_filters( 'woocommerce_gla_is_pull_enabled_for_datatype', $data_type, $sync_modes[ $data_type ]['pull'] ?? false );
	}

	/**
	 * Check if MC PUSH is enabled for a specific data type.
	 *
	 * @param string|null $data_type The data type to check.
	 * @return bool
	 */
	protected function is_push_enabled_for_datatype( string $data_type = null ): bool {
		if ( is_null( $data_type ) ) {
			return true;
		}

		$sync_modes = $this->get_current_sync_value();

		return (bool) apply_filters( 'woocommerce_gla_is_push_enabled_for_datatype', $data_type, $sync_modes[ $data_type ]['push'] ?? false );
	}
}
