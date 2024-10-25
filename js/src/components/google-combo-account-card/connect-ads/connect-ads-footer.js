/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { noop } from 'lodash';

/**
 * Internal dependencies
 */
import AppButton from '.~/components/app-button';
import DisconnectAccount from '.~/components/google-ads-account-card/disconnect-account';

/**
 * Footer component.
 *
 * @return {JSX.Element} Footer component.
 */
const ConnectAdsFooter = ( { isConnected, onCreateNew = noop } ) => {
	// If the account is connected, show the disconnect button.
	if ( isConnected ) {
		return <DisconnectAccount />;
	}

	return (
		<AppButton onClick={ onCreateNew } isTertiary>
			{ __(
				'Or, create a new Google Ads account',
				'google-listings-and-ads'
			) }
		</AppButton>
	);
};

export default ConnectAdsFooter;
