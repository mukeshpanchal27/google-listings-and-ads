/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { getNewPath } from '@woocommerce/navigation';

/**
 * Internal dependencies
 */
import AppTabNav from '~/components/app-tab-nav';
import { TABLE_TYPE_SUGGESTIONS, TABLE_TYPE_ADJUSTMENTS } from './constants';

const TableTypeNavigation = ( { tableType } ) => {
	const tabs = [
		{
			key: TABLE_TYPE_SUGGESTIONS,
			title: __(
				'Price Benchmark & Suggestions',
				'google-listings-and-ads'
			),
			href: getNewPath(
				{ tableType: TABLE_TYPE_SUGGESTIONS },
				'/google/price-benchmark',
				{}
			),
		},
		{
			key: TABLE_TYPE_ADJUSTMENTS,
			title: __( 'Price Adjustments', 'google-listings-and-ads' ),
			href: getNewPath(
				{ tableType: TABLE_TYPE_ADJUSTMENTS },
				'/google/price-benchmark',
				{}
			),
		},
	];

	return <AppTabNav tabs={ tabs } selectedKey={ tableType } />;
};

export default TableTypeNavigation;
