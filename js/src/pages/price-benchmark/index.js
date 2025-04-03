/**
 * External dependencies
 */
import { getQuery } from '@woocommerce/navigation';
import { Card } from '@wordpress/components';

/**
 * Internal dependencies
 */
import MainTabNav from '~/components/main-tab-nav';
import IssueTypeNavigation from './table-type-navigation';
import PriceBenchmarkTable from './price-benchmark-table';
import { TABLE_TYPE_SUGGESTIONS } from './constants';
import './index.scss';

const PriceBenchmark = () => {
	const tableType = getQuery()?.tableType || TABLE_TYPE_SUGGESTIONS;

	return (
		<div className="gla-price-benchmark">
			<MainTabNav />
			<Card>
				<IssueTypeNavigation tableType={ tableType } />
				<PriceBenchmarkTable tableType={ tableType } />
			</Card>
		</div>
	);
};

export default PriceBenchmark;
