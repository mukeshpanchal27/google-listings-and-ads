/**
 * Internal dependencies
 */
import useStoreAddress from '.~/hooks/useStoreAddress';

/**
 * Checks if the store address is synchronized with the Merchant Center (GMC) account address.
 *
 * @return {boolean} Returns `true` if the store address matches the GMC account address, otherwise, returns `false`.
 */
export default function useStoreAddressSynced() {
	const { data, loaded } = useStoreAddress();

	if ( ! loaded ) {
		return false;
	}

	return data.address && ! Boolean( data.isMCAddressDifferent );
}
