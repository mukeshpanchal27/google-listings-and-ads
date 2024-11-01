/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { useRef, createInterpolateElement, useState } from '@wordpress/element';
import { Spinner } from '@woocommerce/components';
import { update as updateIcon } from '@wordpress/icons';
import { getPath, getQuery } from '@woocommerce/navigation';

/**
 * Internal dependencies
 */
import { useAppDispatch } from '.~/data';
import useStoreAddress from '.~/hooks/useStoreAddress';
import useStoreAddressSynced from '.~/hooks/useStoreAddressSynced';
import AccountCard, { APPEARANCE } from '.~/components/account-card';
import AppButton from '.~/components/app-button';
import ValidationErrors from '.~/components/validation-errors';
import TrackableLink from '.~/components/trackable-link';
import mapStoreAddressErrors from './mapStoreAddressErrors';
import LoadingLabel from '.~/components/loading-label';
import { recordGlaEvent } from '.~/utils/tracks';
import './store-address-card.scss';

/**
 * Triggered when store address "Edit in WooCommerce Settings" button is clicked.
 * Before `1.5.0` it was called `edit_mc_store_address`.
 *
 * @event gla_edit_wc_store_address
 * @property {string} path The path used in the page from which the link was clicked, e.g. `"/google/settings"`.
 * @property {string|undefined} [subpath] The subpath used in the page, e.g. `"/edit-store-address"` or `undefined` when there is no subpath.
 */

/**
 * Track how many times and what fields the store address is having validation errors.
 *
 * @event gla_wc_store_address_validation
 * @property {string} path The path used in the page from which the event tracking was sent, e.g. `"/google/setup-mc"` or `"/google/settings"`.
 * @property {string|undefined} [subpath] The subpath used in the page, e.g. `"/edit-store-address"` or `undefined` when there is no subpath.
 * @property {string} country_code The country code of store address, e.g. `"US"`.
 * @property {string} missing_fields The string of the missing required fields of store address separated by comma, e.g. `"city,postcode"`.
 */

/**
 * Renders a component with a given store address.
 *
 * @fires gla_edit_wc_store_address Whenever "Edit in WooCommerce Settings" button is clicked.
 * @fires gla_wc_store_address_validation Whenever the new store address data is fetched after clicking "Refresh to sync" button.
 *
 * @param {Object} props React props.
 *
 * @return {JSX.Element} Filled AccountCard component.
 */
const StoreAddressCard = () => {
	const { loaded, data } = useStoreAddress();
	const { isAddressFilled, isAddressSynced } = useStoreAddressSynced();
	const [ isSaving, setSaving ] = useState( false );
	const { updateGoogleMCContactInformation } = useAppDispatch();
	const path = getPath();
	const { subpath } = getQuery();

	const refetchedCallbackRef = useRef( null );

	if ( loaded && refetchedCallbackRef.current ) {
		refetchedCallbackRef.current( data );
		refetchedCallbackRef.current = null;
	}

	const handleRefreshClick = () => {
		setSaving( true );
		updateGoogleMCContactInformation()
			.then( () => setSaving( false ) )
			.catch();

		refetchedCallbackRef.current = ( storeAddress ) => {
			const eventProps = {
				path,
				subpath,
				country_code: storeAddress.countryCode,
				missing_fields: storeAddress.missingRequiredFields.join( ',' ),
			};

			recordGlaEvent( 'gla_wc_store_address_validation', eventProps );
		};
	};

	const showIndicator = isAddressFilled && ! isAddressSynced;

	const refreshButton = isSaving ? (
		<LoadingLabel />
	) : (
		<AppButton
			isSecondary
			icon={ updateIcon }
			iconSize={ 20 }
			iconPosition="right"
			text={ __( 'Refresh to sync', 'google-listings-and-ads' ) }
			onClick={ handleRefreshClick }
			disabled={ ! loaded }
		/>
	);

	const settingsLink = (
		<TrackableLink
			target="_blank"
			type="external"
			href="admin.php?page=wc-settings"
			eventName="gla_edit_wc_store_address"
			eventProps={ { path, subpath } }
		/>
	);

	let addressContent = <Spinner />;

	if ( loaded && isAddressFilled ) {
		const { address, address2, city, state, country, postcode } = data;
		const stateAndCountry = state ? `${ state } - ${ country }` : country;

		const rest = [ city, stateAndCountry, postcode ]
			.filter( Boolean )
			.join( ', ' );

		addressContent = (
			<div className="gla-store-address-card__address">
				<div>{ address }</div>
				{ address2 && <div>{ address2 }</div> }
				<div>{ rest }</div>
			</div>
		);
	} else {
		addressContent = null;
	}

	const longDescription = (
		<p>
			{ createInterpolateElement(
				__(
					'We’re using your store address for Google verification. This information won’t be public. Edit in <link>WooCommerce settings</link> if needed. Then, refresh to sync it to Google.',
					'google-listings-and-ads'
				),
				{
					link: settingsLink,
				}
			) }
		</p>
	);

	const shortDescription = (
		<p>
			{ createInterpolateElement(
				__(
					'Your store address is required by Google for verification. This information won’t be public. Complete that in <link>WooCommerce settings</link>.'
				),
				{
					link: settingsLink,
				}
			) }
		</p>
	);

	const detail = (
		<>
			{ addressContent }
			{ ! isAddressFilled && (
					<ValidationErrors
						messages={ mapStoreAddressErrors( data ) }
					/>
			) }
		</>
	)

	return (
		<AccountCard
			className="'gla-store-address-card"
			appearance={ APPEARANCE.ADDRESS }
			alignIcon="top"
			alignIndicator="top"
			description={ isAddressFilled ? longDescription : shortDescription }
			detail={ detail }
			indicator={ showIndicator && refreshButton }
		/>
	);
};

export default StoreAddressCard;
