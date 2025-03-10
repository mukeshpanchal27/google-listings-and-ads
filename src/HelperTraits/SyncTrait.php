<?php
declare( strict_types=1 );

namespace Automattic\WooCommerce\GoogleListingsAndAds\HelperTraits;

defined( 'ABSPATH' ) || exit;

/**
 * Trait with some helpers for API Pull and MC Push Sync modes.
 *
 * @package Automattic\WooCommerce\GoogleListingsAndAds\HelperTraits
 */
trait SyncTrait {

	/**
	 * Get the products datatype key
	 *
	 * @return string
	 */
	public function get_products_datatype(): string {
		return 'products';
	}

	/**
	 * Get the coupons datatype key
	 *
	 * @return string
	 */
	public function get_coupons_datatype(): string {
		return 'coupons';
	}

	/**
	 * Get the shipping datatype key
	 *
	 * @return string
	 */
	public function get_shipping_datatype(): string {
		return 'shipping';
	}

	/**
	 * Get the settings datatype key
	 *
	 * @return string
	 */
	public function get_settings_datatype(): string {
		return 'settings';
	}

	/**
	 * Get the default config for the sync mode.
	 *
	 * @return array[]
	 */
	public function get_default_sync_mode(): array {
		$default_mode = [
			'pull' => true,
			'push' => true,
		];

		return [
			$this->get_products_datatype() => $default_mode,
			$this->get_coupons_datatype()  => $default_mode,
			$this->get_shipping_datatype() => $default_mode,
			$this->get_settings_datatype() => $default_mode,
		];
	}
}
