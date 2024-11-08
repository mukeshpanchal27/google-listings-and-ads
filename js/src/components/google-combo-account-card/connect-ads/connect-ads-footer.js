/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import AppButton from '.~/components/app-button';
import DisconnectAccount from '.~/components/google-ads-account-card/disconnect-account';

/**
 * Footer component.
 *
 * @param {Object} props Props.
 * @param {boolean} props.isConnected Whether the account is connected.
 * @param {Function} props.onCreateNewClick Callback to create a new account.
 * @param {Object} props.restProps Rest props. Passed to AppButton.
 * @return {JSX.Element} Footer component.
 */
const ConnectAdsFooter = ( {
	isConnected,
	onCreateNewClick,
	...restProps
} ) => {
	if ( isConnected ) {
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
