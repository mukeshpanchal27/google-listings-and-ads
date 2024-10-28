/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { getNewPath, getPath } from '@woocommerce/navigation';
import { createInterpolateElement } from '@wordpress/element';
import { Notice } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { glaData } from '.~/constants';
import AppTabNav from '.~/components/app-tab-nav';
import useMenuEffect from '.~/hooks/useMenuEffect';
import TrackableLink from '.~/components/trackable-link';

let tabs = [
	{
		key: 'dashboard',
		title: __( 'Dashboard', 'google-listings-and-ads' ),
		href: getNewPath( {}, '/google/dashboard', {} ),
	},
	{
		key: 'reports',
		title: __( 'Reports', 'google-listings-and-ads' ),
		href: getNewPath( {}, '/google/reports', {} ),
	},
	{
		key: 'product-feed',
		title: __( 'Product Feed', 'google-listings-and-ads' ),
		href: getNewPath( {}, '/google/product-feed', {} ),
	},
	{
		key: 'attribute-mapping',
		title: __( 'Attributes', 'google-listings-and-ads' ),
		href: getNewPath( {}, '/google/attribute-mapping', {} ),
	},
	{
		key: 'settings',
		title: __( 'Settings', 'google-listings-and-ads' ),
		href: getNewPath( {}, '/google/settings', {} ),
	},
];

// Hide reports tab.
if ( ! glaData.enableReports ) {
	tabs = tabs.filter( ( { key } ) => key !== 'reports' );
}

const getSelectedTabKey = () => {
	const path = getPath();

	return tabs.find( ( el ) => path.includes( el.key ) )?.key;
};

const MainTabNav = () => {
	useMenuEffect();

	const selectedKey = getSelectedTabKey();

	return (
		<>
			<Notice isDismissible={ true }>
				{ createInterpolateElement(
					__(
						"The GTIN field managed by WooCommerce in the Product's inventory section, will now be used by Google for WooCommerce. It will continue to support the previous field and any mapping rules you have setup for the GTIN field. If you would like to migrate the data you can use the <link>tool here</link>",
						'google-listings-and-ads'
					),
					{
						link: (
							<TrackableLink
								eventName="gla_gtin_migration_banner_click"
								eventProps={ {
									context: 'banner',
								} }
								href="admin.php?page=wc-settings"
								type="wp-admin"
							/>
						),
					}
				) }
			</Notice>
			<AppTabNav tabs={ tabs } selectedKey={ selectedKey } />
		</>
	);
};
export default MainTabNav;
