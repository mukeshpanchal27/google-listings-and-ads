<?php
declare( strict_types=1 );

namespace Automattic\WooCommerce\GoogleListingsAndAds\API\Site\Controllers\RestAPI;

use Automattic\WooCommerce\GoogleListingsAndAds\API\Site\Controllers\BaseOptionsController;
use Automattic\WooCommerce\GoogleListingsAndAds\API\TransportMethods;
use Automattic\WooCommerce\GoogleListingsAndAds\Options\OptionsInterface;
use Automattic\WooCommerce\GoogleListingsAndAds\Proxies\RESTServer;
use Exception;
use WP_REST_Request as Request;

defined( 'ABSPATH' ) || exit;

/**
 * Class SyncController
 *
 * @package Automattic\WooCommerce\GoogleListingsAndAds\API\Site\Controllers\RestAPI
 *
 * @since x.x.x
 */
class SyncController extends BaseOptionsController {

	private const DEFAULT_SYNC_MODE = [
		'products' => [
			'pull' => false,
			'push' => false,
		],
		'coupons'  => [
			'pull' => false,
			'push' => false,
		],
		'shipping' => [
			'pull' => false,
			'push' => false,
		],
		'settings' => [
			'pull' => false,
			'push' => false,
		],
	];

	/**
	 * The base for routes in this controller.
	 *
	 * @var string
	 */
	protected $route_base = 'sync';

	/**
	 * SyncController constructor.
	 *
	 * @param RESTServer $server
	 */
	public function __construct( RESTServer $server ) {
		parent::__construct( $server );
	}

	/**
	 * Registers the routes.
	 */
	public function register_routes() {
		$this->register_route(
			$this->route_base,
			[
				[
					'methods'             => TransportMethods::READABLE,
					'callback'            => $this->get_sync_callback(),
					'permission_callback' => $this->get_permission_callback(),
				],
				'schema' => $this->get_api_response_schema_callback(),
			]
		);
	}

	/**
	 * Get the callback function for getting the current sync mode.
	 *
	 * @return callable
	 */
	protected function get_sync_callback(): callable {
		return function ( Request $request ) {
			try {
				$sync_mode = $this->options->get( OptionsInterface::API_PULL_SYNC_MODE );
				if ( ! $sync_mode ) {
					$sync_mode = self::DEFAULT_SYNC_MODE;
				}
				return $this->prepare_item_for_response( $sync_mode, $request );
			} catch ( Exception $e ) {
				return $this->response_from_exception( $e );
			}
		};
	}

	/**
	 * Get the item schema name for the controller.
	 *
	 * Used for building the API response schema.
	 *
	 * @return string
	 */
	protected function get_schema_title(): string {
		return $this->route_base;
	}

	/**
	 * Get the item schema properties for the controller.
	 *
	 * @return array
	 */
	protected function get_schema_properties(): array {
		return [
			'products' => [
				'type'  => 'array',
				'items' => $this->get_pull_push_schema_fields(),
			],
			'coupons'  => [
				'type'  => 'array',
				'items' => $this->get_pull_push_schema_fields(),
			],
			'shipping' => [
				'type'  => 'array',
				'items' => $this->get_pull_push_schema_fields(),
			],
			'settings' => [
				'type'  => 'array',
				'items' => $this->get_pull_push_schema_fields(),
			],
		];
	}

	/**
	 * Get the item schema properties for the pull and push field.
	 *
	 * @return array[]
	 */
	private function get_pull_push_schema_fields() {
		return [
			'push' => [
				'type' => 'boolean',
			],
			'pull' => [
				'type' => 'boolean',
			],
		];
	}
}
