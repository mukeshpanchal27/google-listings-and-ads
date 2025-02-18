/**
 * Internal dependencies
 */
import useGoogleAccount from '~/hooks/useGoogleAccount';
import AppSpinner from '~/components/app-spinner';
import AccountCard from '~/components/account-card';
import RequestFullAccessGoogleAccountCard from './request-full-access-google-account-card';
import ConnectedGoogleAccountCard from './connected-google-account-card';
import ConnectGoogleAccountCard from './connect-google-account-card';

/**
 * Renders the Google Account Card.
 *
 * Please note that this component is only used on the Settings and Reconnection pages.
 * For the onboarding flow, the `GoogleComboAccountCard` component is used instead.
 * Therefore, the `scope` is checked for reconnection requirements.
 *
 * @param {Object} props React props
 * @param {boolean} [props.disabled=false] Whether display the Card in disabled style.
 */
export default function GoogleAccountCard( { disabled = false } ) {
	const { google, scope, hasFinishedResolution } = useGoogleAccount();

	if ( ! hasFinishedResolution ) {
		return <AccountCard description={ <AppSpinner /> } />;
	}

	const isConnected = google?.active === 'yes';

	if ( isConnected && scope.reconnectionRequired ) {
		return <ConnectedGoogleAccountCard googleAccount={ google } />;
	}

	if ( isConnected && ! scope.reconnectionRequired ) {
		return (
			<RequestFullAccessGoogleAccountCard
				additionalScopeEmail={ google.email }
			/>
		);
	}

	return <ConnectGoogleAccountCard disabled={ disabled } />;
}
