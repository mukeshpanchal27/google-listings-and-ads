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
 * @return {boolean|null} Returns `true` if the store address matches the GMC account address, otherwise, returns `false`. If the GMC account is not connected `null` or if the state is not yet determined., returns `null`.
 */
export default function useStoreAddressSynced() {
	const { isReady } = useGoogleMCAccount();

	return useSelect(
		( select ) => {
			if ( ! isReady ) {
				return null;
			}

			const { getGoogleMCContactInformation } = select( STORE_KEY );
			const { data: contact, loaded } = getGoogleMCContactInformation();

			if ( ! loaded ) {
				return null;
			}

			const {
				is_mc_address_different: isMCAddressDifferent,
				wc_address_errors: missingRequiredFields,
			} = contact;

			return (
				! Boolean( isMCAddressDifferent ) &&
				! missingRequiredFields.length
			);
		},
		[ isReady ]
	);
}
