/**
 * External dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { getSetting } from '@woocommerce/settings'; // eslint-disable-line import/no-unresolved

/**
 * Internal dependencies
 */
import MerchantCenterSelectControl from '.~/components/merchant-center-select-control';
import useExistingGoogleMCAccounts from '.~/hooks/useExistingGoogleMCAccounts';
import useGoogleMCAccount from '.~/hooks/useGoogleMCAccount';
import AppSelectControl from '.~/components/app-select-control';

/**
 * Renders the connected Merchant Center details, leveraging existing functionality
 * and styles from AppSelectControl.
 *
 * Ideally, we would use MerchantCenterSelectControl only for this purpose. However, during testing,
 * we found that when a URL is reclaimed for Merchant Center (MC), the Google API does not
 * return the newly reclaimed account in the list provided by the useExistingGoogleMCAccounts hook,
 * even though the data in the store is invalidated.
 *
 * @param {Object} props
 * @param {boolean} props.isConnected Whether the Merchant Center account is connected.
 */
const MerchantCenterSelect = ( { isConnected, ...rest } ) => {
	const { data: existingAccounts } = useExistingGoogleMCAccounts();
	const { googleMCAccount } = useGoogleMCAccount();
	const domain = new URL( getSetting( 'homeUrl' ) ).host;

	const accountIdExists = existingAccounts?.some(
		( existingAccount ) => existingAccount.id === googleMCAccount.id
	);

	if ( ! accountIdExists && isConnected ) {
		// If the account ID is not in the list of existing accounts, and we have a connected state,
		// display the connected ID only.
		return (
			<AppSelectControl
				autoSelectFirstOption
				nonInteractive
				value={ googleMCAccount.id }
				options={ [
					{
						value: googleMCAccount.id,
						label: sprintf(
							// translators: 1: account domain, 2: account ID.
							__( '%1$s (%2$s)', 'google-listings-and-ads' ),
							domain,
							googleMCAccount.id
						),
					},
				] }
			/>
		);
	}

	return (
		<MerchantCenterSelectControl
			nonInteractive={ isConnected }
			{ ...rest }
		/>
	);
};

export default MerchantCenterSelect;
