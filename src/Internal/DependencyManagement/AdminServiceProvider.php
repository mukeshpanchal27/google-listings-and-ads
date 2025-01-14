<?php
declare( strict_types=1 );

namespace Automattic\WooCommerce\GoogleListingsAndAds\Internal\DependencyManagement;

use Automattic\WooCommerce\GoogleListingsAndAds\Infrastructure\AdminConditional;
use Automattic\WooCommerce\GoogleListingsAndAds\Infrastructure\Conditional;
use Automattic\WooCommerce\GoogleListingsAndAds\Infrastructure\Service;
use Automattic\WooCommerce\GoogleListingsAndAds\Menu\AttributeMapping;
use Automattic\WooCommerce\GoogleListingsAndAds\Menu\Dashboard;
use Automattic\WooCommerce\GoogleListingsAndAds\Menu\GetStarted;
use Automattic\WooCommerce\GoogleListingsAndAds\Menu\ProductFeed;
use Automattic\WooCommerce\GoogleListingsAndAds\Menu\Reports;
use Automattic\WooCommerce\GoogleListingsAndAds\Menu\Settings;
use Automattic\WooCommerce\GoogleListingsAndAds\Menu\SetupAds;
use Automattic\WooCommerce\GoogleListingsAndAds\Menu\SetupMerchantCenter;
use Automattic\WooCommerce\GoogleListingsAndAds\Menu\Shipping;

/**
 * Class AdminServiceProvider
 * Provides services which are only required for the WP admin dashboard.
 *
 * Note: These services will not be available in a REST API request.
 *
 * @package Automattic\WooCommerce\GoogleListingsAndAds\Internal\DependencyManagement
 */
class AdminServiceProvider extends AbstractServiceProvider implements Conditional {

	use AdminConditional;

	/**
	 * @var array
	 */
	protected $provides = [
		AttributeMapping::class    => true,
		Dashboard::class           => true,
		GetStarted::class          => true,
		ProductFeed::class         => true,
		Reports::class             => true,
		Settings::class            => true,
		SetupAds::class            => true,
		SetupMerchantCenter::class => true,
		Shipping::class            => true,
		Service::class             => true,
	];

	/**
	 * Use the register method to register items with the container via the
	 * protected $this->container property or the `getContainer` method
	 * from the ContainerAwareTrait.
	 *
	 * @return void
	 */
	public function register(): void {
		$this->conditionally_share_with_tags( AttributeMapping::class );
		$this->conditionally_share_with_tags( Dashboard::class );
		$this->conditionally_share_with_tags( GetStarted::class );
		$this->conditionally_share_with_tags( ProductFeed::class );
		$this->conditionally_share_with_tags( Reports::class );
		$this->conditionally_share_with_tags( Settings::class );
		$this->conditionally_share_with_tags( SetupAds::class );
		$this->conditionally_share_with_tags( SetupMerchantCenter::class );
		$this->conditionally_share_with_tags( Shipping::class );
	}
}
