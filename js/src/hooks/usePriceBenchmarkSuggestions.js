/**
 * External dependencies
 */
import { useSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { STORE_KEY } from '~/data/constants';

const selectorName = 'getPriceBenchmarkSuggestions';

const usePriceBenchmarkSuggestions = ( args ) => {
	return useSelect(
		( select ) => {
			const selector = select( STORE_KEY );

			return {
				data: selector[ selectorName ]( args ),
				hasFinishedResolution: selector.hasFinishedResolution(
					selectorName,
					[ args ]
				),
			};
		},
		[ args ]
	);
};

export default usePriceBenchmarkSuggestions;
