/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import AppButton from '.~/components/app-button';
import DisconnectAccount from '.~/components/google-ads-account-card/disconnect-account';
import useExistingGoogleAdsAccounts from '.~/hooks/useExistingGoogleAdsAccounts';

/**
 * Footer component.
 *
 * @param {Object} props Props.
 * @param {boolean} props.isConnected Whether the account is connected.
 * @param {Function} props.onCreateNewClick Callback when clicking on the button to create a new account.
 * @param {Object} props.restProps Rest props. Passed to AppButton.
 * @return {JSX.Element} Footer component.
 */
const ConnectAdsFooter = ( {
	isConnected,
	onCreateNewClick,
	...restProps
} ) => {
	const { existingAccounts } = useExistingGoogleAdsAccounts();

	if ( isConnected && existingAccounts.length > 1 ) {
		return <DisconnectAccount />;
	}

	return (
		<AppButton isTertiary onClick={ onCreateNewClick } { ...restProps }>
			{ __(
				'Or, create a new Google Ads account',
				'google-listings-and-ads'
			) }
		</AppButton>
	);
};

export default ConnectAdsFooter;
