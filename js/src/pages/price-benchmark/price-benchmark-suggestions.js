/**
 * External dependencies
 */
import { useState, useMemo } from '@wordpress/element';
import { DataViews, filterSortAndPaginate } from '@wordpress/dataviews/wp';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import AppTooltip from '~/components/app-tooltip';
import EffectivenessIndicator from './effectiveness-indicator';

const fields = [
	{
		id: 'image',
		enableHiding: false,
		enableSorting: false,
		enableGlobalSearch: false,
		label: __( 'Image', 'google-listings-and-ads' ),
		render: ( { item } ) => {
			return (
				<img src={ item.image } alt="" style={ { width: '100%' } } />
			);
		},
	},
	{
		id: 'title',
		enableHiding: false,
		enableSorting: false,
		enableGlobalSearch: false,
		label: __( 'Product', 'google-listings-and-ads' ),
	},
	{
		id: 'description',
		enableHiding: false,
		enableSorting: false,
		enableGlobalSearch: false,
		label: __( 'Description', 'google-listings-and-ads' ),
		render: ( { item } ) => {
			return <span>{ item.description }</span>;
		},
	},
	{
		id: 'price-change-effectiveness',
		enableHiding: false,
		enableSorting: false,
		enableGlobalSearch: false,
		header: (
			<AppTooltip
				text={ __(
					'Effectiveness tells you which products would benefit most from price changes. This rating takes into consideration the performance boost predicted by adjusting the sale price and the difference between your current price and the suggested price. Price suggestions with “High” effectiveness are predicted to drive the largest increase in performance. Keep in mind that predictions do not guarantee improvements in future performance.',
					'google-listings-and-ads'
				) }
			>
				{ __(
					'Price Change Effectiveness',
					'google-listings-and-ads'
				) }
			</AppTooltip>
		),
		render: ( { item } ) => {
			return (
				<EffectivenessIndicator
					effectiveness={ item[ 'price-change-effectiveness' ] }
				/>
			);
		},
	},
	{
		id: 'regular-price',
		enableHiding: false,
		enableSorting: false,
		enableGlobalSearch: false,
		label: __( 'Regular Price', 'google-listings-and-ads' ),
		render: ( { item } ) => {
			return (
				<span className="gla-price-benchmark-suggestions__header-price">
					{ item[ 'regular-price' ] }
				</span>
			);
		},
	},
	{
		id: 'price-on-google',
		enableHiding: false,
		enableSorting: false,
		enableGlobalSearch: false,
		header: (
			<AppTooltip
				text={ __(
					'The effective price for a product across all retailers selling the same product weighted by customer clicks. Products are matched based on the GTIN you provide in the product details.',
					'google-listings-and-ads'
				) }
			>
				{ __( 'Price on Google', 'google-listings-and-ads' ) }
			</AppTooltip>
		),
	},
	{
		id: 'price-gap',
		enableHiding: false,
		enableSorting: false,
		enableGlobalSearch: false,
		header: (
			<AppTooltip
				text={ __(
					'The percentage difference between your price and the price on Google for this product.',
					'google-listings-and-ads'
				) }
			>
				{ __( 'Price Gap %', 'google-listings-and-ads' ) }
			</AppTooltip>
		),
	},
	{
		id: 'suggested-price',
		enableHiding: false,
		enableSorting: false,
		enableGlobalSearch: false,
		header: (
			<AppTooltip
				text={ __(
					'Suggested sale price predicted by Google for products that benefit most from pricing adjustments. It is based on advanced simulations at different price points over the past 7 days factoring in price elasticity, current performance and the performance impact on price changes for businesses similar to you. Use suggested sale prices as valuable directional guidance to help shape your pricing strategy. Learn more about how to change the sale price of your products. Keep in mind that predictions do not guarantee future performance outcomes.',
					'google-listings-and-ads'
				) }
			>
				{ __( 'Suggested Price', 'google-listings-and-ads' ) }
			</AppTooltip>
		),
	},
	{
		id: 'action',
		enableHiding: false,
		enableSorting: false,
		enableGlobalSearch: false,
		label: __( 'Action', 'google-listings-and-ads' ),
		render: ( { item } ) => {
			return <p>Change Price</p>;
		},
	},
];

const data = [
	{
		title: 'Abstract Geometric Poster',
		image: 'https://live.staticflickr.com/5725/21726228300_51333bd62c_b.jpg',
		id: 1,
		description: '259252',
		'price-change-effectiveness': 'high',
		'regular-price': '25',
		'price-on-google': '20',
		'price-gap': '25',
		'suggested-price': '20',
	},
	{
		title: 'Abstract Geometric Poster',
		image: 'https://live.staticflickr.com/5725/21726228300_51333bd62c_b.jpg',
		id: 1,
		description: '259252',
		'price-change-effectiveness': 'medium',
		'regular-price': '25',
		'price-on-google': '20',
		'price-gap': '25',
		'suggested-price': '20',
	},
	{
		title: 'Abstract Geometric Poster',
		image: 'https://live.staticflickr.com/5725/21726228300_51333bd62c_b.jpg',
		id: 1,
		description: '259252',
		'price-change-effectiveness': 'low',
		'regular-price': '25',
		'price-on-google': '20',
		'price-gap': '25',
		'suggested-price': '20',
	},
];

const PriceBenchmarkSuggestions = () => {
	const [ view, setView ] = useState( {
		type: 'table',
		search: '',
		page: 1,
		perPage: 10,
		layout: {},
		filters: [],
		fields: [
			'price-change-effectiveness',
			'regular-price',
			'price-on-google',
			'price-gap',
			'suggested-price',
			'action',
		],
		titleField: 'title',
		descriptionField: 'description',
		mediaField: 'image',
	} );

	const { data: shownData, paginationInfo } = useMemo( () => {
		const updatedData = filterSortAndPaginate( data, view, fields );

		return updatedData;
	}, [ view ] );

	const handleOnChangeView = ( newView ) => {
		setView( newView );
	};

	return (
		<>
			<DataViews
				getItemId={ ( item ) => item.id }
				fields={ fields }
				data={ shownData }
				view={ view }
				paginationInfo={ {
					totalItems: 0,
					totalPages: 0,
				} }
				onChangeView={ handleOnChangeView }
			/>
		</>
	);
};

export default PriceBenchmarkSuggestions;
