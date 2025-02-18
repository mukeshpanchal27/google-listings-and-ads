/**
 * Internal dependencies
 */
import useGoogleAccount from '~/hooks/useGoogleAccount';
import AppSpinner from '~/components/app-spinner';
import AccountCard from '~/components/account-card';
import { RequestFullAccessGoogleAccountCard } from '~/components/google-account-card';
import ConnectGoogleComboAccountCard from './connect-google-combo-account-card';
import ConnectedGoogleComboAccountCard from './connected-google-combo-account-card';
import './index.scss';

export default function GoogleComboAccountCard( { disabled = false } ) {
	const { google, scope, hasFinishedResolution } = useGoogleAccount();

	if ( ! hasFinishedResolution ) {
		return <AccountCard description={ <AppSpinner /> } />;
	}

	const isConnected = google?.active === 'yes';

	if ( isConnected && scope.onboardingRequired ) {
		return <ConnectedGoogleComboAccountCard />;
	}

	if ( isConnected && ! scope.onboardingRequired ) {
		return (
			<RequestFullAccessGoogleAccountCard
				additionalScopeEmail={ google.email }
			/>
		);
	}

	return <ConnectGoogleComboAccountCard disabled={ disabled } />;
}
