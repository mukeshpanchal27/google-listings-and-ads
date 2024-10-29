/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { createInterpolateElement } from '@wordpress/element';
import { getPath, getQuery } from '@woocommerce/navigation';

/**
 * Internal dependencies
 */
import AccountCard, { APPEARANCE } from '.~/components/account-card';
import TrackableLink from '.~/components/trackable-link';

const EmptyStoreAddressCard = () => {
	const path = getPath();
	const { subpath } = getQuery();

	const description = (
		<p>
			{ createInterpolateElement(
				__(
					'Your store address is required by Google for verification. This information won’t be public. Complete that in <link>WooCommerce settings</link>.',
					'google-listings-and-ads'
				),
				{
					link: (
						<TrackableLink
							target="_blank"
							type="external"
							href="admin.php?page=wc-settings"
							eventName="gla_edit_wc_store_address"
							eventProps={ { path, subpath } }
						/>
					),
				}
			) }
		</p>
	);

	return (
		<AccountCard
			className="gla-store-address-card"
			appearance={ APPEARANCE.ADDRESS }
			alignIcon="top"
			alignIndicator="top"
			description={ description }
		/>
	);
};

export default EmptyStoreAddressCard;
