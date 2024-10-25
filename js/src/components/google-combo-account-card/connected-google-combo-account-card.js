/**
 * External dependencies
 */
import { useEffect, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import AccountCard, { APPEARANCE } from '../account-card';
import AccountDetails from './account-details';
import Indicator from './indicator';
import getAccountCreationTexts from './getAccountCreationTexts';
import SpinnerCard from '.~/components/spinner-card';
import useAutoCreateAdsMCAccounts from '.~/hooks/useAutoCreateAdsMCAccounts';
import useGoogleMCAccount from '.~/hooks/useGoogleMCAccount';
import useExistingGoogleMCAccounts from '.~/hooks/useExistingGoogleMCAccounts';
import useCreateMCAccount from '.~/hooks/useCreateMCAccount';
import ConnectMC from './connect-mc';
import './connected-google-combo-account-card.scss';

/**
 * Renders a Google account card UI with connected account information.
 * It will also kickoff Ads and Merchant Center account creation if the user does not have accounts.
 */
const ConnectedGoogleComboAccountCard = () => {
	// We use a single instance of the hook to create a MC (Merchant Center) account,
	// ensuring consistent results across both the main component (ConnectedGoogleComboAccountCard)
	// and its child component (ConnectMC).
	// This approach is especially useful when an MC account is automatically created,
	// and the URL needs to be reclaimed. The URL reclaiming component is rendered
	// within the ConnectMC component.
	const [ createMCAccount, resultCreateMCAccount ] = useCreateMCAccount();
	const { data: accounts } = useExistingGoogleMCAccounts();
	const [ showConnectMCCard, setShowConnectMCCard ] = useState( false );
	const { isReady: isGoogleMCReady } = useGoogleMCAccount();
	const { hasDetermined, creatingWhich } =
		useAutoCreateAdsMCAccounts( createMCAccount );
	const { text, subText } = getAccountCreationTexts( creatingWhich );

	useEffect( () => {
		// Show the Connect MC card if
		// there's no connected account and there are existing accounts.
		// there's an issue when creating an MC account. For e.g need to reclaim the URL.
		// The "Edit" button will be used to display the card within the connected state.
		if (
			( ! isGoogleMCReady && accounts?.length > 0 ) ||
			[ 403, 503 ].includes( resultCreateMCAccount.response?.status )
		) {
			setShowConnectMCCard( true );
		}
	}, [ isGoogleMCReady, accounts?.length, resultCreateMCAccount ] );

	if ( ! hasDetermined ) {
		return <SpinnerCard />;
	}

	return (
		<div className="gla-google-combo-account-cards">
			<AccountCard
				appearance={ APPEARANCE.GOOGLE }
				alignIcon="top"
				className="gla-google-combo-account-card--connected"
				description={ text || <AccountDetails /> }
				helper={ subText }
				indicator={
					<Indicator showSpinner={ Boolean( creatingWhich ) } />
				}
			/>

			{ showConnectMCCard && (
				<ConnectMC
					createMCAccount={ createMCAccount }
					resultCreateMCAccount={ resultCreateMCAccount }
				/>
			) }
		</div>
	);
};

export default ConnectedGoogleComboAccountCard;
