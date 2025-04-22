/**
 * External dependencies
 */
import { useSelect } from '@wordpress/data';
import { PRODUCTS_STORE_NAME } from '@woocommerce/data';

const selectorName = 'getProduct';

/**
 * Custom hook to retrieve WooCommerce product data and resolution status from the PRODUCTS_STORE_NAME.
 *
 * @return {Object} An object containing:
 * - `product` {any}: The product data retrieved from the store.
 * - `hasFinishedResolution` {boolean}: A boolean indicating whether the resolution for the product data has finished.
 */
const useProduct = () => {
	return useSelect( ( select ) => {
		const selector = select( PRODUCTS_STORE_NAME );

		return {
			product: selector[ selectorName ](),
			hasFinishedResolution: selector.hasFinishedResolution(
				selectorName,
				[]
			),
		};
	}, [] );
};

export default useProduct;
