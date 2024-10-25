/**
 * External dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { getSetting } from '@woocommerce/settings'; // eslint-disable-line import/no-unresolved

/**
 * Internal dependencies
 */
import useGoogleMCAccount from '.~/hooks/useGoogleMCAccount';
import AppSelectControl from '.~/components/app-select-control';

const ConnectedMerchantCenterDetails = () => {
	const { googleMCAccount } = useGoogleMCAccount();
	const domain = new URL( getSetting( 'homeUrl' ) ).host;

	return (
		<AppSelectControl
			autoSelectFirstOption
			nonInteractive
			value={ googleMCAccount.id }
			options={ [
				{
					value: googleMCAccount.id,
					label: sprintf(
						// translators: 1: account name, 2: account domain, 3: account ID.
						__( '%1$s ・ %2$s (%3$s)', 'google-listings-and-ads' ),
						googleMCAccount.name,
						domain,
						googleMCAccount.id
					),
				},
			] }
		/>
	);
};

export default ConnectedMerchantCenterDetails;
