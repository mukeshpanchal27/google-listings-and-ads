/**
 * External dependencies
 */
import { useState, useMemo } from '@wordpress/element';
import { DataViews, filterSortAndPaginate } from '@wordpress/dataviews/wp';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { TOOLTIPS } from './constants';
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
		header: TOOLTIPS.PRICE_CHANGE_EFFECTIVENESS,
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
				<span className="gla-price-benchmark-suggestions__regular-price">
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
		header: TOOLTIPS.PRICE_ON_GOOGLE,
	},
	{
		id: 'price-gap',
		enableHiding: false,
		enableSorting: false,
		enableGlobalSearch: false,
		header: TOOLTIPS.PRICE_GAP
	},
	{
		id: 'suggested-price',
		enableHiding: false,
		enableSorting: false,
		enableGlobalSearch: false,
		header: TOOLTIPS.SUGGESTED_PRICE,
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
		<div className="gla-price-benchmark-suggestions">
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
		</div>
	);
};

export default PriceBenchmarkSuggestions;
