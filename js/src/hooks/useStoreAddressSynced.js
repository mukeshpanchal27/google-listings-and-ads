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
 * @typedef {Object} StoreAddressSyncedData
 * @property {boolean|null} isAddressFilled Whether the address is filled without errors. Returns 'null' if the state is undetermined.
 * @property {boolean|null} isAddressSynced Returns `true` if the store address matches the GMC account address, otherwise, returns `false`. If the MC account is not connected or if the state is not yet determined, returns `null`.
 */

const googleMCContactInformationSelector = 'getGoogleMCContactInformation';

/**
 * Checks if the store address is synchronized with the Merchant Center (GMC) account address.
 *
 * @return {StoreAddressSyncedData} The store address synced data.
 */
export default function useStoreAddressSynced() {
	const { isReady, hasFinishedResolutionGoogle } = useGoogleMCAccount();

	return useSelect(
		( select ) => {
			if ( ! isReady ) {
				return {
					isAddressFilled: null,
					isAddressSynced: null,
					hasFinishedResolution: hasFinishedResolutionGoogle,
				};
			}

			const selector = select( STORE_KEY );
			const contact = selector[ googleMCContactInformationSelector ]();
			const hasFinishedResolution = selector.hasFinishedResolution(
				googleMCContactInformationSelector
			);

			if ( ! contact ) {
				return {
					isAddressFilled: null,
					isAddressSynced: null,
					hasFinishedResolution,
				};
			}

			const {
				is_mc_address_different: isMCAddressDifferent,
				wc_address_errors: missingRequiredFields,
			} = contact;

			return {
				isAddressFilled: ! missingRequiredFields.length,
				isAddressSynced: ! isMCAddressDifferent,
				hasFinishedResolution,
			};
		},
		[ hasFinishedResolutionGoogle, isReady ]
	);
}
