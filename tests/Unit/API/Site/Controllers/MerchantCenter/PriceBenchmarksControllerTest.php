<?php
use Automattic\WooCommerce\GoogleListingsAndAds\API\Site\Controllers\MerchantCenter\PriceBenchmarksController;
use Automattic\WooCommerce\GoogleListingsAndAds\API\Google\MerchantPriceBenchmarks;
use Automattic\WooCommerce\GoogleListingsAndAds\Product\ProductHelper;
use Automattic\WooCommerce\GoogleListingsAndAds\Tests\Framework\RESTControllerUnitTest;
use Automattic\WooCommerce\GoogleListingsAndAds\Vendor\League\Container\Container;
use WP_REST_Request as Request;
use WP_REST_Response as Response;

/**
 * Test class for PriceBenchmarksController.
 *
 * @group price-benchmarks
 */
class PriceBenchmarksControllerTest extends RESTControllerUnitTest {

	/** @var PriceBenchmarksController */
	protected $controller;

	/** @var Stub|ProductHelper $product_helper */
	protected $product_helper;

	/** @var MockObject|MerchantPriceBenchmarks */
	protected $merchant_price_benchmarks;

	/** @var Container */
	protected $container;

	protected const ROUTE_PRICE_BENCHMARKS = '/wc/gla/mc/price-benchmarks';

	public function setUp(): void {
		parent::setUp();

		$this->product_helper            = $this->createMock( ProductHelper::class );
		$this->merchant_price_benchmarks = $this->createMock( MerchantPriceBenchmarks::class );

		// Mock the container to return the mocked MerchantPriceBenchmarks.
		$this->container = new Container();
		$this->container->addShared( MerchantPriceBenchmarks::class, $this->merchant_price_benchmarks );
		$this->container->addShared( PriceBenchmarksController::class, $this->product_helper );

		// Initialize the controller.
		$this->controller = new PriceBenchmarksController( $this->server, $this->product_helper );
		$this->controller->set_container( $this->container );
		$this->controller->register();
	}

	public function test_get_price_benchmarks() {
		$product_id    = '123456';
		$product_title = "UGG Women's s Classic Mini";

		// Mock the benchmark data.
		$mock_benchmark_data = [
			'results'       => [
				[
					'productView'          => [
						'id'           => 'online:en:US:gla_' . $product_id,
						'offer_id'     => $product_id,
						'title'        => $product_title,
						'priceMicros'  => '124990000',
						'currencyCode' => 'USD',
					],
					'priceCompetitiveness' => [
						'countryCode'                => 'US',
						'benchmarkPriceMicros'       => '119922291',
						'benchmarkPriceCurrencyCode' => 'USD',
					],
				],
			],
			'nextPageToken' => 'next_page_token',
		];

		// Mock the price insights data.
		$mock_price_insights_data = [
			'results'       => [
				[
					'productView'          => [
						'id'           => 'online:en:US:gla_' . $product_id,
						'offer_id'     => $product_id,
						'priceMicros'  => '124990000',
						'currencyCode' => 'USD',
					],
					'priceCompetitiveness' => [
						'suggestedPriceMicros'          => '118990000',
						'suggestedPriceCurrencyCode'    => 'US',
						'predictedImpressionsChangeFraction' => '0.12609300017356873',
						'predictedClicksChangeFraction' => '0.508745014667511',
						'predictedConversionsChangeFraction' => '2.3431060314178467',
						'effectiveness'                 => 3,
					],
				],
			],
			'nextPageToken' => 'next_page_token',
		];

		// Configure the mocked methods.
		$this->merchant_price_benchmarks->expects( $this->once() )
			->method( 'get_benchmark_data' )
			->willReturn( $mock_benchmark_data );

		$this->merchant_price_benchmarks->expects( $this->once() )
			->method( 'get_price_insights' )
			->willReturn( $mock_price_insights_data );

		// Simulate a GET request.
		$response = $this->do_request( self::ROUTE_PRICE_BENCHMARKS, 'GET' );

		// Current shape.
		$current = [
			'price_benchmarks' => $mock_benchmark_data,
			'price_insights'   => $mock_price_insights_data,
		];

		// Expected shape once data from the two queries are stitched together.
		$expected = [
			[
				'product'         => [
					'id'        => $product_id,
					'thumbnail' => '', // The thumbnail URL of the ID.
					'title'     => $product_title,
				],
				'effectiveness'   => 3,
				'regular_price'   => 124.99,
				'price_on_google' => 119.92, // Converted from micros.
				'price_gap'       => 5.07, // Reg price - Price on Google, Converted from micros.
				'suggested_price' => 118.99, // Converted from micros.
			],
		];

		// Assert the response status.
		$this->assertEquals( 200, $response->get_status() );

		//$this->assertSameSets( $current, $response->get_data(), 'The current implementation is returning this shape.' );

		// The expected shape should pass once the implementation is updated.
		$this->assertSameSets( $expected, $response->get_data(), 'The response data should match the expected structure.' );
	}
}
