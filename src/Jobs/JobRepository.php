<?php
declare( strict_types=1 );

namespace Automattic\WooCommerce\GoogleListingsAndAds\Jobs;

use Automattic\WooCommerce\GoogleListingsAndAds\Infrastructure\Service;
use Automattic\WooCommerce\GoogleListingsAndAds\Internal\ContainerAwareTrait;
use Automattic\WooCommerce\GoogleListingsAndAds\Internal\Interfaces\ContainerAwareInterface;
use Automattic\WooCommerce\GoogleListingsAndAds\Exception\ValidateInterface;

defined( 'ABSPATH' ) || exit;

/**
 * Class JobRepository
 *
 * ContainerAware used for:
 * - JobInterface
 *
 * @package Automattic\WooCommerce\GoogleListingsAndAds\Jobs
 */
class JobRepository implements ContainerAwareInterface, Service {

	use ContainerAwareTrait;
	use ValidateInterface;

	/**
	 * @var JobInterface[]
	 */
	protected $jobs;

	/**
	 * @var string[]
	 */
	protected $jobs_class_name_map = [];

	/**
	 * Fetch all jobs from the Container, and store name and class.
	 */
	private function get_all_jobs() {
		if ( null !== $this->jobs ) {
			return;
		}

		foreach ( $this->container->get( JobInterface::class ) as $job ) {
			$this->validate_instanceof( $job, JobInterface::class );

			$job_name                                = $job->get_name();
			$job_class                               = get_class( $job );
			$this->jobs[ $job_name ]                 = $job;
			$this->jobs_class_name_map[ $job_class ] = $job_name;
		}
	}

	/**
	 * @return JobInterface[]
	 */
	public function list(): array {
		$this->get_all_jobs();
		return $this->jobs;
	}

	/**
	 * @param string $name Job name or class
	 *
	 * @return JobInterface
	 *
	 * @throws JobException If the job is not found.
	 */
	public function get( string $name ): JobInterface {
		$this->get_all_jobs();

		if ( ! isset( $this->jobs[ $name ] ) && ! empty( $this->jobs_class_name_map[ $name ] ) ) {
			$name = $this->jobs_class_name_map[ $name ];
		}

		if ( ! isset( $this->jobs[ $name ] ) ) {
			throw JobException::job_does_not_exist( $name );
		}

		return $this->jobs[ $name ];
	}
}
