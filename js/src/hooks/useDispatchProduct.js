/**
 * External dependencies
 */
import { useDispatch } from '@wordpress/data';
import { PRODUCTS_STORE_NAME } from '@woocommerce/data';

const useDispatchProduct = () => {
	return useDispatch( PRODUCTS_STORE_NAME );
};

export default useDispatchProduct;
