/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState, useMemo } from '@wordpress/element';
import { DataViews, filterSortAndPaginate } from '@wordpress/dataviews/wp';

/**
 * Internal dependencies
 */
import EffectivenessIndicator from '../effectiveness-indicator';
import Label from '../label';
import Price from '../price';
import {
	LABELS,
	LABEL_PRICE_CHANGE_EFFECTIVENESS,
	LABEL_PRICE_ON_GOOGLE,
	LABEL_PRICE_GAP,
	LABEL_SUGGESTED_PRICE,
	LABEL_REGULAR_PRICE,
	LABEL_ACTION,
	TABLE_TYPE_SUGGESTIONS,
	TABLE_TYPE_ADJUSTMENTS,
} from '../constants';
import './index.scss';

const BASE_FIELDS = [
	{
		id: 'image',
		enableHiding: false,
		enableSorting: false,
		enableGlobalSearch: false,
		label: __( 'Image', 'google-listings-and-ads' ),
		render: ( { item } ) => {
			return (
				<img
					src={ item.image }
					alt={ item.title }
					className="gla-price-benchmark-table__image"
				/>
			);
		},
	},
	{
		id: 'title',
		enableHiding: false,
		enableSorting: false,
		enableGlobalSearch: true,
		label: __( 'Product', 'google-listings-and-ads' ),
	},
	{
		id: 'description',
		enableHiding: false,
		enableSorting: false,
		enableGlobalSearch: true,
		label: __( 'Description', 'google-listings-and-ads' ),
		render: ( { item } ) => {
			return <span>{ item.description }</span>;
		},
	},
];

export const SUGGESTIONS_TABLE_FIELDS = [
	...BASE_FIELDS,
	{
		id: 'price-change-effectiveness',
		enableHiding: false,
		enableSorting: false,
		enableGlobalSearch: false,
		header: (
			<Label labelKey={ LABEL_PRICE_CHANGE_EFFECTIVENESS } alignLeft />
		),
		label: LABELS[ LABEL_PRICE_CHANGE_EFFECTIVENESS ].title,
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
		label: <Label labelKey={ LABEL_REGULAR_PRICE } />,
		render: ( { item } ) => {
			return <Price amount={ item[ 'regular-price' ] } highlight />;
		},
	},
	{
		id: 'price-on-google',
		enableHiding: false,
		enableSorting: false,
		enableGlobalSearch: false,
		header: <Label labelKey={ LABEL_PRICE_ON_GOOGLE } />,
		label: LABELS[ LABEL_PRICE_ON_GOOGLE ].title,
		render: ( { item } ) => {
			return <Price amount={ item[ 'price-on-google' ] } />;
		},
	},
	{
		id: 'price-gap',
		enableHiding: false,
		enableSorting: false,
		enableGlobalSearch: false,
		header: <Label labelKey={ LABEL_PRICE_GAP } />,
		label: LABELS[ LABEL_PRICE_GAP ].title,
		render: ( { item } ) => {
			return `${ item[ 'price-gap' ] }%`;
		},
	},
	{
		id: 'suggested-price',
		enableHiding: false,
		enableSorting: false,
		enableGlobalSearch: false,
		header: <Label labelKey={ LABEL_SUGGESTED_PRICE } />,
		label: LABELS[ LABEL_SUGGESTED_PRICE ].title,
		render: ( { item } ) => {
			return <Price amount={ item[ 'suggested-price' ] } />;
		},
	},
	{
		id: 'action',
		enableHiding: false,
		enableSorting: false,
		enableGlobalSearch: false,
		label: LABELS[ LABEL_ACTION ].title,
		render: ( { item } ) => {
			return <p>Change Price</p>;
		},
	},
];

const FIELDS_MAP = {
	[ TABLE_TYPE_SUGGESTIONS ]: SUGGESTIONS_TABLE_FIELDS,
	[ TABLE_TYPE_ADJUSTMENTS ]: [
		...BASE_FIELDS,
		{
			id: 'price-change-effectiveness',
			enableHiding: false,
			enableSorting: false,
			enableGlobalSearch: false,
			label: __(
				'Price Change Effectiveness',
				'google-listings-and-ads'
			),
			render: ( { item } ) => {
				return (
					<EffectivenessIndicator
						effectiveness={ item[ 'price-change-effectiveness' ] }
					/>
				);
			},
		},
	],
};

/**
 * PriceBenchmarkTable component renders a table view for price benchmarking data.
 *
 * @param {Object} props - The component props.
 * @param {Array} props.data - The data to be displayed in the table.
 * @param {string} [props.tableType=TABLE_TYPE_SUGGESTIONS] - The type of table to render, which determines the fields to display.
 *
 * @return {JSX.Element} The rendered PriceBenchmarkTable component.
 */
const PriceBenchmarkTable = ( {
	data,
	tableType = TABLE_TYPE_SUGGESTIONS,
} ) => {
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

	const fields = FIELDS_MAP[ tableType ];
	const { data: shownData, paginationInfo } = useMemo( () => {
		const updatedData = filterSortAndPaginate( data, view, fields );

		return updatedData;
	}, [ view, data, fields ] );

	const handleOnChangeView = ( newView ) => {
		setView( newView );
	};

	return (
		<div className="gla-price-benchmark-table">
			<DataViews
				getItemId={ ( item ) => item.id }
				fields={ fields }
				data={ shownData }
				view={ view }
				paginationInfo={ paginationInfo }
				onChangeView={ handleOnChangeView }
				defaultLayouts={ [] }
			/>
		</div>
	);
};

export default PriceBenchmarkTable;
