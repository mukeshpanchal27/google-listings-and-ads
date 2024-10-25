/**
 * Internal dependencies
 */
import useGoogleMCAccount from '.~/hooks/useGoogleMCAccount';
import useStoreAddress from '.~/hooks/useStoreAddress';

/**
 * Checks if the store address is synchronized with the Merchant Center (GMC) account address.
 *
 * @return {boolean} Returns `true` if the store address matches the GMC account address,
 * and both data sources are ready and loaded; otherwise, returns `false`.
 */
export default function useStoreAddressSynced() {
	const { isReady } = useGoogleMCAccount();
	const { data, loaded } = useStoreAddress();

	return isReady && data.address && ! data.isMCAddressDifferent && loaded;
}
