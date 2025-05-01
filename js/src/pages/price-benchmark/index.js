/**
 * External dependencies
 */
import { Card } from '@wordpress/components';

/**
 * Internal dependencies
 */
import MainTabNav from '~/components/main-tab-nav';
import PriceBenchmarkSuggestions from './price-benchmark-suggestions';
import ProductComparisonChart from './product-comparison-chart';
import './index.scss';

const PriceBenchmark = () => {
	return (
		<div className="gla-price-benchmark">
			<MainTabNav />

			<ProductComparisonChart />

			<Card className="gla-price-benchmark__card">
				<PriceBenchmarkSuggestions />
			</Card>
		</div>
	);
};

export default PriceBenchmark;
