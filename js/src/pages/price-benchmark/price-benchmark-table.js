/**
 * External dependencies
 */
import { CardBody } from '@wordpress/components';

/**
 * Internal dependencies
 */
import PriceBenchmarkSuggestions from './PriceBenchmarkSuggestions';
import PriceBenchmarkAdjustments from './PriceBenchmarkAdjustments';
import { TABLE_TYPE_ADJUSTMENTS } from './constants';

const PriceBenchmarkTable = ( { tableType } ) => {
	return (
		<CardBody size={ null }>
			{ tableType === TABLE_TYPE_ADJUSTMENTS ? (
				<PriceBenchmarkAdjustments />
			) : (
				<PriceBenchmarkSuggestions />
			) }
		</CardBody>
	);
};

export default PriceBenchmarkTable;
