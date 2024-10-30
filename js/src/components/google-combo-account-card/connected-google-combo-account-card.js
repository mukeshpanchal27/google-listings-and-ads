/**
 * Internal dependencies
 */
import AccountCard, { APPEARANCE } from '../account-card';
import ConnectAds from './connect-ads';
import AccountDetails from './account-details';
import ConnectedAccountsActions from './connected-accounts-actions';
import Indicator from './indicator';
import getAccountCreationTexts from './getAccountCreationTexts';
import SpinnerCard from '.~/components/spinner-card';
import useAutoCreateAdsMCAccounts from '.~/hooks/useAutoCreateAdsMCAccounts';
import './connected-google-combo-account-card.scss';

/**
 * Renders a Google account card UI with connected account information.
 * It will also kickoff Ads and Merchant Center account creation if the user does not have accounts.
 */
const ConnectedGoogleComboAccountCard = () => {
	const { hasDetermined, creatingWhich } = useAutoCreateAdsMCAccounts();
	const { text, subText } = getAccountCreationTexts( creatingWhich );

	if ( ! hasDetermined ) {
		return <SpinnerCard />;
	}

	return (
		<div className="gla-account-card">
			<AccountCard
				appearance={ APPEARANCE.GOOGLE }
				alignIcon="top"
				className="gla-google-combo-account-card--connected"
				description={ text || <AccountDetails /> }
				helper={ subText }
				indicator={
					<Indicator showSpinner={ Boolean( creatingWhich ) } />
				}
			>
				<ConnectedAccountsActions />
			</AccountCard>

			{ /* @TODO: review isEditing in 2605 */ }
			<ConnectAds isEditing />
		</div>
	);
};

export default ConnectedGoogleComboAccountCard;
