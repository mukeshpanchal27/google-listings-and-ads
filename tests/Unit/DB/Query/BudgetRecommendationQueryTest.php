<?php
declare( strict_types=1 );

namespace Automattic\WooCommerce\GoogleListingsAndAds\Tests\Unit\DB\Query;

use Automattic\WooCommerce\GoogleListingsAndAds\DB\Query\BudgetRecommendationQuery;
use Automattic\WooCommerce\GoogleListingsAndAds\DB\Table\BudgetRecommendationTable;
use Automattic\WooCommerce\GoogleListingsAndAds\Tests\Framework\UnitTest;
use Automattic\WooCommerce\GoogleListingsAndAds\Proxies\WP;

/**
 * BudgetRecommendationQueryTest
 *
 * @package Automattic\WooCommerce\GoogleListingsAndAds\Tests\Unit\DB\Query
 */
class BudgetRecommendationQueryTest extends UnitTest {

	/** @var BudgetRecommendationQuery $budget_recommendation_query */
	protected $budget_recommendation_query;

	/** @var BudgetRecommendationTable $budget_recommendation_table */
	protected $budget_recommendation_table;

	/** @var WP $wp */
	protected $wp;

	/**
	 * Runs before each test is executed.
	 */
	public function setUp(): void {
		global $wpdb;

		parent::setUp();

		$this->wp                          = new WP();
		$this->budget_recommendation_table = new BudgetRecommendationTable( $this->wp, $wpdb );
		$this->budget_recommendation_query = new BudgetRecommendationQuery( $wpdb, $this->budget_recommendation_table );

		// Install DB table so we can test with actual pre populated data.
		$this->budget_recommendation_table->install();
	}

	public function test_query_single_value() {
		$this->budget_recommendation_query->where( 'currency', 'EUR' );
		$this->budget_recommendation_query->where( 'country', 'IE' );

		$results = $this->budget_recommendation_query->get_results();

		$this->assertCount( 1, $results );
		$this->assertEquals( 10, $results[0]['daily_budget'] );
	}

	public function test_query_multiple_values() {
		$this->budget_recommendation_query->where( 'currency', 'USD' );
		$this->budget_recommendation_query->where( 'country', [ 'US', 'CA' ], 'IN' );

		$results = $this->budget_recommendation_query->get_results();

		$this->assertCount( 2, $results );
		$this->assertEquals( 15, $results[0]['daily_budget'] );
		$this->assertEquals( 14, $results[1]['daily_budget'] );
	}
}
