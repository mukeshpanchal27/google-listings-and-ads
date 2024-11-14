/**
 * External dependencies
 */
import { useSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import useGoogleMCAccount from '.~/hooks/useGoogleMCAccount';
import { STORE_KEY } from '.~/data/constants';

/**
 * Checks if the store address is synchronized with the Merchant Center (GMC) account address.
 *
 * @return {boolean} Whether the store address is ready to by synced to MC.
 */
export default function useStoreAddressReady() {
	const { hasGoogleMCConnection } = useGoogleMCAccount();

	return useSelect(
		( select ) => {
			if ( ! hasGoogleMCConnection ) {
				return false;
			}

			const contact = select( STORE_KEY ).getGoogleMCContactInformation();

			if ( ! contact ) {
				return false;
			}

			return ! contact.wc_address_errors.length;
		},
		[ hasGoogleMCConnection ]
	);
}
