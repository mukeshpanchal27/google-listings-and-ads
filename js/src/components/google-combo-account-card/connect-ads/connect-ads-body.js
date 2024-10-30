/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import AdsAccountSelectControl from '.~/components/ads-account-select-control';
import ContentButtonLayout from '.~/components/content-button-layout';
import ConnectButton from '.~/components/google-ads-account-card/connect-ads/connect-button';
import LoadingLabel from '.~/components/loading-label/loading-label';
import ConnectedIconLabel from '.~/components/connected-icon-label';

/**
 * ConnectAdsBody component.
 *
 * @param {Object} props Props.
 * @param {boolean} props.isConnected Whether the account is connected.
 * @param {Function} props.onClick Callback to handle the connect click.
 * @param {boolean} props.isLoading Whether the card is in a loading state.
 * @param {Function} props.setValue Callback to set the value.
 * @param {string} props.accountID Google Ads account ID.
 * @return {JSX.Element} Body component.
 */
const ConnectAdsBody = ( {
	isConnected,
	onClick,
	isLoading,
	setValue,
	accountID,
} ) => {
	const getAction = () => {
		if ( isLoading ) {
			return (
				<LoadingLabel
					text={ __( 'Connecting…', 'google-listings-and-ads' ) }
				/>
			);
		}

		if ( isConnected ) {
			return <ConnectedIconLabel />;
		}

		if ( isConnected === null ) {
			return <ConnectButton loading />;
		}

		return <ConnectButton accountID={ accountID } onClick={ onClick } />;
	};

	return (
		<ContentButtonLayout>
			<AdsAccountSelectControl
				value={ accountID }
				onChange={ setValue }
				autoSelectFirstOption={ true }
				nonInteractive={ isConnected }
			/>

			{ getAction() }
		</ContentButtonLayout>
	);
};

export default ConnectAdsBody;
