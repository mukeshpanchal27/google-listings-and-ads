<?php
use Automattic\WooCommerce\GoogleListingsAndAds\API\Site\Controllers\MerchantCenter\PriceBenchmarksController;
use Automattic\WooCommerce\GoogleListingsAndAds\API\Google\MerchantPriceBenchmarks;
use Automattic\WooCommerce\GoogleListingsAndAds\Tests\Framework\RESTControllerUnitTest;
use Automattic\WooCommerce\GoogleListingsAndAds\Vendor\Psr\Container\ContainerInterface;
use WP_REST_Request as Request;
use WP_REST_Response as Response;

class PriceBenchmarksControllerTest extends RESTControllerUnitTest {

	/** @var PriceBenchmarksController */
	protected $controller;

	/** @var MockObject|MerchantPriceBenchmarks */
	protected $merchant;

	/** @var ContainerInterface */
	protected $container;

	protected const ROUTE_PRICE_BENCHMARKS = '/wc/gla/mc/price-benchmarks';

	public function setUp(): void {
		parent::setUp();

		// Mock the MerchantPriceBenchmarks dependency.
		$this->merchant = $this->createMock( MerchantPriceBenchmarks::class );

		// Mock the container to return the mocked MerchantPriceBenchmarks.
		$this->container = $this->createMock( ContainerInterface::class );
		$this->container->method( 'get' )
			->with( MerchantPriceBenchmarks::class )
			->willReturn( $this->merchant );

		// Initialize the controller.
		$this->controller = new PriceBenchmarksController( $this->server );
		$this->controller->set_container( $this->container );
		$this->controller->register_routes();
	}

	public function test_get_price_benchmarks() {
		// Mock the benchmark data.
		$mock_benchmark_data = [
			'id'                     => 'product_1',
			'title'                  => 'Product 1',
			'price_micros'           => 1000000,
			'benchmark_price_micros' => 1200000,
			'currency_code'          => 'USD',
		];

		// Mock the price insights data.
		$mock_price_insights_data = [
			'id'              => 'product_1',
			'suggested_price' => 950000,
			'price_gap'       => -50000,
		];

		// Configure the mocked methods.
		$this->merchant->method( 'get_benchmark_data' )
			->willReturn( $mock_benchmark_data );

		$this->merchant->method( 'get_price_insights' )
			->willReturn( $mock_price_insights_data );

		// Simulate a GET request.
		$response = $this->do_request( self::ROUTE_PRICE_BENCHMARKS, 'GET' );

		// Assert the response status.
		$this->assertEquals( 200, $response->get_status() );
	}
}
