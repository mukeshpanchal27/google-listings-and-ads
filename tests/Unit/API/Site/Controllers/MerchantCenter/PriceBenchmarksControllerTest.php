<?php
use Automattic\WooCommerce\GoogleListingsAndAds\API\Site\Controllers\MerchantCenter\PriceBenchmarksController;
use Automattic\WooCommerce\GoogleListingsAndAds\API\Google\MerchantPriceBenchmarks;
use Automattic\WooCommerce\GoogleListingsAndAds\MerchantCenter\PriceBenchmarks;
use Automattic\WooCommerce\GoogleListingsAndAds\Tests\Tools\HelperTrait\GoogleAdsClientTrait;
use Automattic\WooCommerce\GoogleListingsAndAds\Tests\Framework\RESTControllerUnitTest;
use Automattic\WooCommerce\GoogleListingsAndAds\Vendor\League\Container\Container;
use PHPUnit\Framework\MockObject\MockObject;
/**
 * Test class for PriceBenchmarksController.
 *
 * @group price-benchmarks
 */
class PriceBenchmarksControllerTest extends RESTControllerUnitTest {

	use GoogleAdsClientTrait;

	/** @var PriceBenchmarksController */
	protected $controller;

	/** @var MockObject MerchantPriceBenchmarks */
	protected $merchant_price_benchmarks;

	/** @var MockObject PriceBenchmarks */
	protected $price_benchmarks;

	/** @var Container */
	protected $container;

	protected const ROUTE_PRICE_BENCHMARKS = '/wc/gla/mc/price-benchmarks';

	protected const ROUTE_PRICE_BENCHMARKS_SUMMARY = '/wc/gla/mc/price-benchmarks/summary';

	protected const TEST_PRODUCT_ID = 123456;

	public function setUp(): void {
		parent::setUp();

		$this->merchant_price_benchmarks = $this->createMock( MerchantPriceBenchmarks::class );

		// Mock the container to return the mocked MerchantPriceBenchmarks.
		$this->container = new Container();
		$this->container->addShared( MerchantPriceBenchmarks::class, $this->merchant_price_benchmarks );

		$this->price_benchmarks = $this->createMock( PriceBenchmarks::class );
		$this->container->addShared( PriceBenchmarks::class, $this->price_benchmarks );

		// Initialize the controller.
		$this->controller = new PriceBenchmarksController( $this->server );
		$this->controller->set_container( $this->container );
		$this->controller->register();
	}

	/**
	 * Tests the '/mc/price-benchmarks/summary' endpoint.
	 */
	public function test_get_price_benchmarks_summary() {
		// Mock the benchmark summary data.
		$mock_benchmark_summary_data = [
			'total_products' => 0,
			'price_unknown'  => 0,
			'price_lower'    => 0,
			'price_similar'  => 0,
			'price_higher'   => 0,
		];

		// Configure the mocked methods.
		$this->price_benchmarks->expects( $this->once() )
			->method( 'get_summary' )
			->willReturn( $mock_benchmark_summary_data );

		// Simulate a GET request.
		$response = $this->do_request( self::ROUTE_PRICE_BENCHMARKS_SUMMARY, 'GET' );

		// Assert the response status.
		$this->assertEquals( 200, $response->get_status() );

		// Verify that the response data matches the expected structure.
		$this->assertSameSets( $mock_benchmark_summary_data, $response->get_data(), 'The response data should match the expected structure.' );
	}

	/**
	 * Tests the '/mc/price-benchmarks' endpoint.
	 */
	public function test_get_price_benchmarks_collection() {
		// Mock the benchmark data.
		$mock_benchmark_data = $this->get_mock_price_competitiveness_results();

		// Mock the price insights data.
		$mock_price_insights_data = $this->get_mock_price_insights_results();

		// Configure the mocked methods.
		$this->merchant_price_benchmarks->expects( $this->once() )
			->method( 'get_price_comparisons_data' )
			->willReturn( $mock_benchmark_data );

		$this->merchant_price_benchmarks->expects( $this->once() )
			->method( 'get_price_insights_data' )
			->willReturn( $mock_price_insights_data );

		// Simulate a GET request.
		$response = $this->do_request( self::ROUTE_PRICE_BENCHMARKS, 'GET' );

		// Expected shape once data from the two queries are stitched together.
		$expected = [
			[
				'product'                      => [
					'id'        => self::TEST_PRODUCT_ID,
					'thumbnail' => '', // The thumbnail URL of the ID.
					'title'     => 'Example Product Title',
				],
				'effectiveness'                => 3,
				'regular_price'                => 124.99,
				'price_on_google'              => 119.92, // Converted from micros.
				'price_gap'                    => 5.07, // Reg price - Price on Google, Converted from micros.
				'suggested_price'              => 118.99, // Converted from micros.
				'predicted_clicks_change'      => '0.508745014667511',
				'predicted_conversions_change' => '2.3431060314178467',
			],
		];

		// Assert the response status.
		$this->assertEquals( 200, $response->get_status() );

		// The expected shape should pass once the implementation is updated.
		$this->assertSameSets( $expected, $response->get_data(), 'The response data should match the expected structure.' );
	}

	/**
	 * Tests the '/mc/price-benchmarks/{id}' endpoint.
	 *
	 * @dataProvider data_provider_report_product_id
	 *
	 * @param mixed $report_product_id The ID to product with and without prefix.
	 */
	public function test_get_price_benchmarks_item( $report_product_id ) {
		// Mock the benchmark data.
		$mock_benchmark_data = $this->get_mock_price_competitiveness_results( $report_product_id );

		// Mock the price insights data.
		$mock_price_insights_data = $this->get_mock_price_insights_results( $report_product_id );

		// Mock the performance data.
		$report_data = $this->get_mock_report_results( $report_product_id );

		$method_args = [
			'ids' => [ self::TEST_PRODUCT_ID ],
		];

		// Configure the mocked methods.
		$this->merchant_price_benchmarks->expects( $this->once() )
			->method( 'get_price_comparisons_data' )
			->with( $method_args )
			->willReturn( $mock_benchmark_data );

		$this->merchant_price_benchmarks->expects( $this->once() )
			->method( 'get_price_insights_data' )
			->with( $method_args )
			->willReturn( $mock_price_insights_data );

		$this->merchant_price_benchmarks->expects( $this->once() )
			->method( 'get_metrics_data' )
			->with( $method_args )
			->willReturn( $report_data );

		// Simulate a GET request.
		$response = $this->do_request( self::ROUTE_PRICE_BENCHMARKS . '/' . self::TEST_PRODUCT_ID );

		// Expected shape once data from the two queries are stitched together.
		$expected =
			[
				'product'                      => [
					'id'        => (int) self::TEST_PRODUCT_ID,
					'thumbnail' => '', // The thumbnail URL of the ID.
					'title'     => 'Example Product Title',
				],
				'effectiveness'                => 3,
				'regular_price'                => 124.99,
				'price_on_google'              => 119.92, // Converted from micros.
				'price_gap'                    => 5.07, // Reg price - Price on Google, Converted from micros.
				'suggested_price'              => 118.99, // Converted from micros.
				'predicted_clicks_change'      => '0.508745014667511',
				'predicted_conversions_change' => '2.3431060314178467',
				'clicks'                       => 734,
				'conversions'                  => 4,
			];

		// Assert the response status.
		$this->assertEquals( 200, $response->get_status() );

		// The expected shape should pass once the implementation is updated.
		$this->assertSameSets( $expected, $response->get_data(), 'The response data should match the expected structure.' );
	}

	/**
	 * Data provider for test cases involving the 'id' field.
	 *
	 * @return array
	 */
	public function data_provider_report_product_id(): array {
		return [
			'integer'                        => [
				'id' => self::TEST_PRODUCT_ID,
			],
			'With "gla_" prefix'             => [
				'id' => 'gla_' . self::TEST_PRODUCT_ID,
			],
			'With "woocommerce_gpf_" prefix' => [
				'id' => 'woocommerce_gpf_' . self::TEST_PRODUCT_ID,
			],
		];
	}

	/**
	 * Get mock price competitiveness results.
	 *
	 * @param string $program_id The program ID.
	 * @return array The mock price competitiveness results.
	 */
	private function get_mock_price_competitiveness_results( $program_id = self::TEST_PRODUCT_ID ) {
		return [
			[
				'id'                            => 'online:en:US:gla_' . $program_id,
				'offer_id'                      => $program_id,
				'title'                         => 'Example Product Title',
				'price_micros'                  => '124990000',
				'currency_code'                 => 'USD',
				'benchmark_price_micros'        => '119922291',
				'benchmark_price_currency_code' => 'USD',
			],
		];
	}

	/**
	 * Get mock price insights results.
	 *
	 * @param string $program_id The program ID.
	 * @return array The mock insights results.
	 */
	private function get_mock_price_insights_results( $program_id = self::TEST_PRODUCT_ID ) {
		return [
			[
				'id'                                    => 'online:en:US:gla_' . $program_id,
				'offer_id'                              => $program_id,
				'price_micros'                          => '124990000',
				'currency_code'                         => 'USD',
				'suggested_price_micros'                => '118990000',
				'suggested_price_currency_code'         => 'US',
				'predicted_impressions_change_fraction' => '0.12609300017356873',
				'predicted_clicks_change_fraction'      => '0.508745014667511',
				'predicted_conversions_change_fraction' => '2.3431060314178467',
				'effectiveness'                         => 3,
			],
		];
	}

	/**
	 * Get mock performance results.
	 *
	 * @param string $program_id The program ID.
	 * @return array The mock performance results.
	 */
	private function get_mock_report_results( $program_id = self::TEST_PRODUCT_ID ) {
		return [
			[
				'offer_id'    => $program_id,
				'clicks'      => 734,
				'conversions' => 4,
			],
		];
	}
}
