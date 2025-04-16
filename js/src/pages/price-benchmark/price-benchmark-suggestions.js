/**
 * Internal dependencies
 */
import PriceBenchmarkTable from './price-benchmark-table';
import usePriceBenchmarkSuggestions from '~/hooks/usePriceBenchmarkSuggestions';
import ChangePrice from './change-price';
import EffectivenessIndicator from './effectiveness-indicator';
import Label from './label';
import Price from './price';
import {
	LABELS,
	LABEL_CHANGE_EFFECTIVENESS,
	LABEL_AVG_PRICE_ON_GOOGLE,
	LABEL_PRICE_GAP_PERCENT,
	LABEL_SUGGESTED_PRICE,
	LABEL_REGULAR_PRICE,
	LABEL_ACTION,
} from './constants';
import suggestions from '../../../../tests/e2e/utils/__fixtures__/price-benchmark-suggestions.json';

const TABLE_FIELDS = [
	{
		id: 'price-change-effectiveness',
		enableHiding: false,
		enableSorting: true,
		enableGlobalSearch: false,
		header: <Label labelKey={ LABEL_CHANGE_EFFECTIVENESS } alignLeft />,
		label: LABELS[ LABEL_CHANGE_EFFECTIVENESS ].title,
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
		enableSorting: true,
		enableGlobalSearch: false,
		label: <Label labelKey={ LABEL_REGULAR_PRICE } />,
		render: ( { item } ) => {
			return <Price amount={ item[ 'regular-price' ] } highlight />;
		},
	},
	{
		id: 'price-on-google',
		enableHiding: false,
		enableSorting: true,
		enableGlobalSearch: false,
		header: <Label labelKey={ LABEL_AVG_PRICE_ON_GOOGLE } />,
		label: LABELS[ LABEL_AVG_PRICE_ON_GOOGLE ].title,
		render: ( { item } ) => {
			return <Price amount={ item[ 'price-on-google' ] } />;
		},
	},
	{
		id: 'price-gap',
		enableHiding: false,
		enableSorting: true,
		enableGlobalSearch: false,
		header: <Label labelKey={ LABEL_PRICE_GAP_PERCENT } />,
		label: LABELS[ LABEL_PRICE_GAP_PERCENT ].title,
		render: ( { item } ) => {
			return `${ item[ 'price-gap' ] }%`;
		},
	},
	{
		id: 'suggested-price',
		enableHiding: false,
		enableSorting: true,
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
			return <ChangePrice productID={ item.id } />;
		},
	},
];

const TABLE_FIELDS_MOBILE = [ 'action' ];

/**
 * PriceBenchmarkSuggestions component.
 *
 * This component fetches and displays price benchmark suggestions using the
 * `usePriceBenchmarkSuggestions` hook. It renders a table with the suggestions
 * data and handles responsiveness by providing different field configurations
 * for desktop and mobile views.
 *
 * @return {JSX.Element} A div containing the PriceBenchmarkTable component.
 */
const PriceBenchmarkSuggestions = () => {
	// const { suggestions, hasFinishedResolution } =
	// 	usePriceBenchmarkSuggestions();

	return (
		<div className="gla-price-benchmark-suggestions">
			<PriceBenchmarkTable
				data={ suggestions }
				fields={ TABLE_FIELDS }
				fieldsMobile={ TABLE_FIELDS_MOBILE }
				isReady={ true }
			/>
		</div>
	);
};

export default PriceBenchmarkSuggestions;
