/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { Notice } from '@wordpress/components';

/**
 * Internal dependencies
 */
import AccountCard, { APPEARANCE } from '~/components/account-card';
import LoadingLabel from '~/components/loading-label';
import EnableNewProductSyncButton from '~/components/enable-new-product-sync-button';
import { SwitchAccountButton } from '~/components/google-account-card';
import useGoogleMCAccount from '~/hooks/useGoogleMCAccount';
import { GOOGLE_WPCOM_APP_CONNECTED_STATUS } from '~/constants';

function getDetail( status ) {
	if ( status === GOOGLE_WPCOM_APP_CONNECTED_STATUS.DISAPPROVED ) {
		return (
			<Notice status="warning" isDismissible={ false }>
				{ __(
					'Notice and status after the user denied the authorization.',
					'google-listings-and-ads'
				) }
			</Notice>
		);
	}
	if ( status === GOOGLE_WPCOM_APP_CONNECTED_STATUS.ERROR ) {
		return (
			<Notice status="error" isDismissible={ false }>
				{ __(
					'Notice and status when an error occurs.',
					'google-listings-and-ads'
				) }
			</Notice>
		);
	}

	return null;
}

/**
 * Renders a card for asking the user to grant access to the WordPress.com app,
 * which authorizes Google's shopping data integration API to fetch WooCommerce
 * products etc through the app.
 *
 * Please note that the authorization process involves multiple external
 * services, this component may be technically ambiguous in these places:
 * - Component name
 * - The directory where it is located
 * - The data source for its grant status
 * - The presenation on UI
 */
export default function AuthorizeWPComAppCard() {
	const { googleMCAccount, hasFinishedResolution } = useGoogleMCAccount();

	const getIndicator = () => {
		if ( ! hasFinishedResolution ) {
			return <LoadingLabel />;
		}

		return (
			<EnableNewProductSyncButton
				text={ __( 'Grant access', 'google-listings-and-ads' ) }
				eventProps={ { page: 'setup-mc' } }
			/>
		);
	};

	const detail = getDetail( googleMCAccount.wpcom_rest_api_status );
	const alignment = detail ? 'top' : undefined;

	return (
		<AccountCard
			appearance={ APPEARANCE.GOOGLE }
			title={ __(
				`Google's WordPress.com application`,
				'google-listings-and-ads'
			) }
			description={ __(
				'Granting access to the application is required in order to synchronize product data with Google through it.',
				'google-listings-and-ads'
			) }
			alignIcon={ alignment }
			alignIndicator={ alignment }
			expandedDetail={ Boolean( detail ) }
			indicator={ getIndicator() }
			detail={ detail }
			actions={ <SwitchAccountButton /> }
		/>
	);
}
