/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import AccountCard, { APPEARANCE } from '../account-card';
import useAutoCreateAdsMCAccounts from '../../hooks/useAutoCreateAdsMCAccounts';
import ConnectAds from './connect-ads';
import AccountDetails from './account-details';
import Indicator from './indicator';
import getAccountCreationTexts from './getAccountCreationTexts';
import SpinnerCard from '.~/components/spinner-card';
import useGoogleAdsAccountReady from '.~/hooks/useGoogleAdsAccountReady';
import useExistingGoogleAdsAccounts from '.~/hooks/useExistingGoogleAdsAccounts';
import AppButton from '.~/components/app-button';
import SwitchAccountButton from '.~/components/google-account-card/switch-account-button';
import './connected-google-combo-account-card.scss';

/**
 * Renders a Google account card UI with connected account information.
 * It will also kickoff Ads and Merchant Center account creation if the user does not have accounts.
 */
const ConnectedGoogleComboAccountCard = () => {
	const [ editMode, setEditMode ] = useState( false );
	const { hasDetermined, creatingWhich } = useAutoCreateAdsMCAccounts();
	const { text, subText } = getAccountCreationTexts( creatingWhich );
	const { existingAccounts: existingGoogleAdsAccounts } =
		useExistingGoogleAdsAccounts();
	const isConnected = useGoogleAdsAccountReady();

	if ( ! hasDetermined ) {
		return <SpinnerCard />;
	}

	const handleEditClick = () => {
		setEditMode( true );
	};

	const hasExistingGoogleAdsAccounts = existingGoogleAdsAccounts?.length > 0;
	const showConnectAds =
		( editMode && hasExistingGoogleAdsAccounts ) ||
		( ! isConnected && hasExistingGoogleAdsAccounts );

	return (
		<div>
			<AccountCard
				appearance={ APPEARANCE.GOOGLE }
				alignIcon="top"
				className="gla-google-combo-account-card--connected"
				description={
					<>
						{ text || <AccountDetails /> }

						<div className="gla-google-combo-account-card__actions">
							{ ! editMode && (
								<AppButton
									isLink
									text={ __(
										'Edit',
										'google-listings-and-ads'
									) }
									onClick={ handleEditClick }
								/>
							) }

							{ editMode && (
								<SwitchAccountButton
									text={ __(
										'Connect to a different Google account',
										'google-listings-and-ads'
									) }
								/>
							) }
						</div>
					</>
				}
				helper={ subText }
				indicator={
					<Indicator showSpinner={ Boolean( creatingWhich ) } />
				}
			/>

			{ showConnectAds && <ConnectAds /> }
		</div>
	);
};

export default ConnectedGoogleComboAccountCard;
