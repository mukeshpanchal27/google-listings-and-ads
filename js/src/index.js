/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { lazy } from '@wordpress/element';
import { addFilter } from '@wordpress/hooks';
import { getSetting } from '@woocommerce/settings'; // eslint-disable-line import/no-unresolved
// The above is an unpublished package, delivered with WC, we use Dependency Extraction Webpack Plugin to import it.
// See https://github.com/woocommerce/woocommerce-admin/issues/7781

/**
 * Internal dependencies
 */
import './css/index.scss';
import withAdminPageShell from '~/components/withAdminPageShell';
import './data';
import { addBaseEventProperties } from '~/utils/tracks';

const Dashboard = lazy( () =>
	import( /* webpackChunkName: "dashboard" */ './pages/dashboard' )
);

const GetStartedPage = lazy( () =>
	import( /* webpackChunkName: "get-started-page" */ './pages/get-started' )
);

const Onboarding = lazy( () =>
	import( /* webpackChunkName: "onboarding" */ './pages/onboarding' )
);

const AdsOnboarding = lazy( () =>
	import( /* webpackChunkName: "ads-onboarding" */ './pages/ads-onboarding' )
);

const Reports = lazy( () =>
	import( /* webpackChunkName: "reports" */ './pages/reports' )
);

const ProductFeed = lazy( () =>
	import( /* webpackChunkName: "product-feed" */ './pages/product-feed' )
);

const AttributeMapping = lazy( () =>
	import(
		/* webpackChunkName: "attribute-mapping" */ './pages/attribute-mapping'
	)
);

const Settings = lazy( () =>
	import( /* webpackChunkName: "settings" */ './pages/settings' )
);

const Shipping = lazy( () =>
	import( /* webpackChunkName: "shipping" */ './pages/shipping' )
);

export const pagePaths = new Set();

const woocommerceTranslation =
	getSetting( 'admin' )?.woocommerceTranslation ||
	__( 'WooCommerce', 'google-listings-and-ads' );

addFilter(
	'woocommerce_admin_pages_list',
	'woocommerce/google-listings-and-ads/add-page-routes',
	( pages ) => {
		const initialBreadcrumbs = [
			[ '', woocommerceTranslation ],
			[ '/marketing', __( 'Marketing', 'google-listings-and-ads' ) ],
			__( 'Google for WooCommerce', 'google-listings-and-ads' ),
		];

		const pluginAdminPages = [
			{
				breadcrumbs: [ ...initialBreadcrumbs ],
				container: GetStartedPage,
				path: '/google/start',
				wpOpenMenu: 'toplevel_page_woocommerce-marketing',
				navArgs: {
					id: 'google-start',
				},
			},
			{
				breadcrumbs: [
					...initialBreadcrumbs,
					__( 'Setup Merchant Center', 'google-listings-and-ads' ),
				],
				container: Onboarding,
				path: '/google/setup-mc',
			},
			{
				breadcrumbs: [
					...initialBreadcrumbs,
					__( 'Setup Google Ads', 'google-listings-and-ads' ),
				],
				container: AdsOnboarding,
				path: '/google/setup-ads',
			},
			{
				breadcrumbs: [
					...initialBreadcrumbs,
					__( 'Dashboard', 'google-listings-and-ads' ),
				],
				container: Dashboard,
				path: '/google/dashboard',
				wpOpenMenu: 'toplevel_page_woocommerce-marketing',
				navArgs: {
					id: 'google-dashboard',
				},
			},
			{
				breadcrumbs: [
					...initialBreadcrumbs,
					__( 'Reports', 'google-listings-and-ads' ),
				],
				container: Reports,
				path: '/google/reports',
				wpOpenMenu: 'toplevel_page_woocommerce-marketing',
				navArgs: {
					id: 'google-reports',
				},
			},
			{
				breadcrumbs: [
					...initialBreadcrumbs,
					__( 'Product Feed', 'google-listings-and-ads' ),
				],
				container: ProductFeed,
				path: '/google/product-feed',
				wpOpenMenu: 'toplevel_page_woocommerce-marketing',
				navArgs: {
					id: 'google-product-feed',
				},
			},
			{
				breadcrumbs: [
					...initialBreadcrumbs,
					__( 'Attribute Mapping', 'google-listings-and-ads' ),
				],
				container: AttributeMapping,
				path: '/google/attribute-mapping',
				wpOpenMenu: 'toplevel_page_woocommerce-marketing',
				navArgs: {
					id: 'google-attribute-mapping',
				},
			},
			{
				breadcrumbs: [
					...initialBreadcrumbs,
					__( 'Settings', 'google-listings-and-ads' ),
				],
				container: Settings,
				path: '/google/settings',
				wpOpenMenu: 'toplevel_page_woocommerce-marketing',
				navArgs: {
					id: 'google-settings',
				},
			},
			{
				breadcrumbs: [
					...initialBreadcrumbs,
					__( 'Shipping', 'google-listings-and-ads' ),
				],
				container: Shipping,
				path: '/google/shipping',
				wpOpenMenu: 'toplevel_page_woocommerce-marketing',
				navArgs: {
					id: 'google-shipping',
				},
			},
		];

		pluginAdminPages.forEach( ( page ) => {
			page.container = withAdminPageShell( page.container );

			// Do the same thing as https://github.com/woocommerce/woocommerce/blob/6.9.0/plugins/woocommerce-admin/client/layout/index.js#L178
			const path = page.path.substring( 1 ).replace( /\//g, '_' );
			pagePaths.add( path );
		} );

		return pages.concat( pluginAdminPages );
	}
);

// Ref: https://github.com/woocommerce/woocommerce/blob/6.9.0/plugins/woocommerce/includes/tracks/class-wc-site-tracking.php#L92
addFilter(
	'woocommerce_tracks_client_event_properties',
	'woocommerce/google-listings-and-ads/add-base-event-properties-to-page-view',
	( eventProperties, eventName ) => {
		if (
			eventName === 'wcadmin_page_view' &&
			pagePaths.has( eventProperties.path )
		) {
			return addBaseEventProperties( eventProperties );
		}

		return eventProperties;
	}
);
