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
				[
					'methods'             => TransportMethods::EDITABLE,
					'callback'            => $this->get_update_sync_callback(),
					'permission_callback' => $this->get_permission_callback(),
					'args'                => $this->get_update_sync_params(),
				],
				'schema' => $this->get_api_response_schema_callback(),
			]
		);
	}

	/**
	 * Get the callback function for getting the current sync mode for API PULL.
	 *
	 * @return callable
	 */
	protected function get_sync_callback(): callable {
		return function ( Request $request ) {
			try {
				$sync_mode = $this->get_current_sync_value();
				return $this->prepare_item_for_response( $sync_mode, $request );
			} catch ( Exception $e ) {
				return $this->response_from_exception( $e );
			}
		};
	}

	/**
	 * Get the callback function for updating the current sync mode for API PULL.
	 *
	 * @return callable
	 */
	protected function get_update_sync_callback(): callable {
		return function ( Request $request ) {
			try {
				$sync_mode     = $this->get_current_sync_value();
				$new_params    = $this->get_request_params( $request );
				$new_sync_mode = wp_parse_args( $new_params, $sync_mode );
				$this->options->update( OptionsInterface::API_PULL_SYNC_MODE, $new_sync_mode );
				return $this->prepare_item_for_response( $this->options->get( OptionsInterface::API_PULL_SYNC_MODE ), $request );
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
				'type'  => 'object',
				'items' => $this->get_pull_push_schema_fields(),
			],
			'coupons'  => [
				'type'  => 'object',
				'items' => $this->get_pull_push_schema_fields(),
			],
			'shipping' => [
				'type'  => 'object',
				'items' => $this->get_pull_push_schema_fields(),
			],
			'settings' => [
				'type'  => 'object',
				'items' => $this->get_pull_push_schema_fields(),
			],
		];
	}

	/**
	 * Get the item schema properties for the pull and push field.
	 *
	 * @return array[]
	 */
	private function get_pull_push_schema_fields(): array {
		return [
			'push' => [
				'type' => 'boolean',
			],
			'pull' => [
				'type' => 'boolean',
			],
		];
	}

	/**
	 * Get the query params for the update sync request.
	 *
	 * @return array
	 */
	protected function get_update_sync_params(): array {
		return $this->get_schema_properties();
	}

	/**
	 * Get the current value for the API PULL Sync
	 *
	 * @return array
	 */
	protected function get_current_sync_value(): array {
		$sync_mode = $this->options->get( OptionsInterface::API_PULL_SYNC_MODE );
		if ( ! is_array( $sync_mode ) ) {
			$sync_mode = [];
		}

		return wp_parse_args( $sync_mode, self::DEFAULT_SYNC_MODE );
	}

	/**
	 * Get the parameters from the request body.
	 * Only the keys in self::DEFAULT_SYNC_MODE that contains pull/push values as boolean are allowed as params.
	 *
	 * @param Request $request The request
	 * @return array
	 */
	protected function get_request_params( Request $request ): array {
		$request_params = $request->get_json_params();
		$params         = array_intersect_key( $request_params, self::DEFAULT_SYNC_MODE );
		$valid_params   = [];

		foreach ( $params as $key => $param ) {
			if ( isset( $param['push'] ) && isset( $param['pull'] ) && is_bool( $param['push'] ) && is_bool( $param['pull'] ) ) {
				$valid_params[ $key ] = [
					'push' => $param['push'],
					'pull' => $param['pull'],
				];
			}
		}

		return $valid_params;
	}
}
