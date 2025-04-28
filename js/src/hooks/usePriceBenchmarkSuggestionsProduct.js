/**
 * Internal dependencies
 */
import useAppSelectDispatch from './useAppSelectDispatch';

const usePriceBenchmarkSuggestionsProduct = ( productId ) => {
	const { data: suggestions, hasFinishedResolution } = useAppSelectDispatch(
		'getPriceBenchmarkSuggestions'
	);

	if ( ! productId ) {
		return {
			product: null,
			hasFinishedResolution: true,
		};
	}

	if ( ! hasFinishedResolution ) {
		return {
			product: undefined,
			hasFinishedResolution: false,
		};
	}

	const product =
		suggestions.find(
			( suggestion ) => suggestion.product.id === productId
		) || null;

	return {
		product,
		hasFinishedResolution: true,
	};
};

export default usePriceBenchmarkSuggestionsProduct;
