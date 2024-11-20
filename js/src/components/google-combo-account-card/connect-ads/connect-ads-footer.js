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
import useGoogleAdsAccountStatus from '.~/hooks/useGoogleAdsAccountStatus';
import useGoogleAdsAccount from '.~/hooks/useGoogleAdsAccount';

/**
 * Footer component.
 *
 * @param {Object} props Props.
 * @param {boolean} props.isConnected Whether the account is connected.
 * @param {Function} props.onCreateNewClick Callback when clicking on the button to create a new account.
 * @param {boolean} props.disabled Whether the button is disabled.
 * @param {Object} props.restProps Rest props. Passed to AppButton.
 * @return {JSX.Element} Footer component.
 */
const ConnectAdsFooter = ( {
	isConnected,
	onCreateNewClick,
	disabled,
	...restProps
} ) => {
	const { existingAccounts } = useExistingGoogleAdsAccounts();
	const { googleAdsAccount } = useGoogleAdsAccount();
	const { hasAccess } = useGoogleAdsAccountStatus();
	const shouldClaimGoogleAdsAccount = Boolean(
		googleAdsAccount?.id && hasAccess === false
	);

	if ( isConnected && existingAccounts.length > 0 ) {
		return <DisconnectAccount />;
	}

	const disabledButton =
		disabled ||
		( shouldClaimGoogleAdsAccount && ! existingAccounts.length );
	return (
		<AppButton
			isTertiary
			onClick={ onCreateNewClick }
			disabled={ disabledButton }
			{ ...restProps }
		>
			{ __(
				'Or, create a new Google Ads account',
				'google-listings-and-ads'
			) }
		</AppButton>
	);
};

export default ConnectAdsFooter;
