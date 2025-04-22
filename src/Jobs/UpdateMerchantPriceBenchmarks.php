<?php
declare( strict_types=1 );

namespace Automattic\WooCommerce\GoogleListingsAndAds\Jobs;

use Automattic\WooCommerce\GoogleListingsAndAds\ActionScheduler\ActionSchedulerInterface;
use Automattic\WooCommerce\GoogleListingsAndAds\MerchantCenter\MerchantCenterService;
use Automattic\WooCommerce\GoogleListingsAndAds\MerchantCenter\PriceBenchmarks;
use Automattic\WooCommerce\GoogleListingsAndAds\API\Google\MerchantPriceBenchmarks;
use Throwable;

defined( 'ABSPATH' ) || exit;

/**
 * Class UpdateMerchantPriceBenchmarks
 *
 * Update Product Stats
 *
 * Note: The job will not start if it is already running or if the Google Merchant Center account is not connected.
 *
 * @package Automattic\WooCommerce\GoogleListingsAndAds\Jobs
 *
 * @since 2.6.4
 */
class UpdateMerchantPriceBenchmarks extends AbstractActionSchedulerJob {
	/**
	 * @var MerchantCenterService
	 */
	protected $merchant_center;

	/**
	 * @var MerchantReport
	 */
	protected $merchant_report;

	/**
	 * @var MerchantStatuses
	 */

	protected $merchant_statuses;

	/**
	 * UpdateMerchantPriceBenchmarks constructor.
	 *
	 * @param ActionSchedulerInterface  $action_scheduler
	 * @param ActionSchedulerJobMonitor $monitor
	 * @param MerchantCenterService     $merchant_center
	 * @param PriceBenchmarks           $price_benchmarks
	 */
	public function __construct(
		ActionSchedulerInterface $action_scheduler,
		ActionSchedulerJobMonitor $monitor,
		MerchantCenterService $merchant_center,
		PriceBenchmarks $price_benchmarks,
	) {
		parent::__construct( $action_scheduler, $monitor );
		$this->merchant_center  = $merchant_center;
		$this->price_benchmarks = $price_benchmarks;
	}

	/**
	 * Get the name of the job.
	 *
	 * @return string
	 */
	public function get_name(): string {
		return 'update_merchant_price_benchmarks';
	}

	/**
	 * Can the job be scheduled.
	 *
	 * @param array|null $args
	 *
	 * @return bool Returns true if the job can be scheduled.
	 */
	public function can_schedule( $args = [] ): bool {
		return parent::can_schedule( $args ) && $this->merchant_center->is_connected();
	}

	/**
	 * Process the job.
	 *
	 * @param int[] $items An array of job arguments.
	 *
	 * @throws JobException If the merchant product statuses cannot be retrieved..
	 */
	public function process_items( array $items ) {
		try {
			// Fetch price benchmarks from the API.
			$this->price_benchmarks->update_price_benchmarks();
		} catch ( Throwable $e ) {
			throw new JobException( 'Error updating merchant price benchmarks: ' . $e->getMessage() );
		}
	}

	/**
	 * Schedule the job.
	 *
	 * @param array $args - arguments.
	 */
	public function schedule( array $args = [] ) {
		if ( $this->can_schedule( $args ) ) {
			$this->action_scheduler->schedule_immediate( $this->get_process_item_hook(), $args );
		}
	}

	/**
	 * The job is considered to be scheduled if the "process_item" action is currently pending or in-progress regardless of the arguments.
	 *
	 * @return bool
	 */
	public function is_scheduled(): bool {
		// We set 'args' to null so it matches any arguments. This is because it's possible to have multiple instances of the job running with different page tokens
		return $this->is_running( null );
	}
}
