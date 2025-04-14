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
	LABEL_PRICE_CHANGE_EFFECTIVENESS,
	LABEL_PRICE_ON_GOOGLE,
	LABEL_PRICE_GAP,
	LABEL_SUGGESTED_PRICE,
	LABEL_REGULAR_PRICE,
	LABEL_ACTION,
} from './constants';

const data = [
	{
		title: 'Abstract Geometric Poster',
		image: 'https://live.staticflickr.com/5725/21726228300_51333bd62c_b.jpg',
		id: 1,
		description: '259252',
		'price-change-effectiveness': 3,
		'regular-price': '25',
		'price-on-google': '20',
		'price-gap': '25',
		'suggested-price': '20',
	},
	{
		title: 'Minimal Landscape Print',
		image: 'https://live.staticflickr.com/5725/21726228300_51333bd62c_b.jpg',
		id: 2,
		description: '813625',
		'price-change-effectiveness': 2,
		'regular-price': '30',
		'price-on-google': '27',
		'price-gap': '10',
		'suggested-price': '28',
	},
	{
		title: 'Modern Typography Canvas',
		image: 'https://live.staticflickr.com/5725/21726228300_51333bd62c_b.jpg',
		id: 3,
		description: '122489',
		'price-change-effectiveness': 1,
		'regular-price': '35',
		'price-on-google': '36',
		'price-gap': '-3',
		'suggested-price': '34',
	},
	{
		title: 'Surreal Mountain Scene',
		image: 'https://live.staticflickr.com/5725/21726228300_51333bd62c_b.jpg',
		id: 4,
		description: '442891',
		'price-change-effectiveness': 3,
		'regular-price': '40',
		'price-on-google': '32',
		'price-gap': '25',
		'suggested-price': '33',
	},
	{
		title: 'Retro City Poster',
		image: 'https://live.staticflickr.com/5725/21726228300_51333bd62c_b.jpg',
		id: 5,
		description: '933821',
		'price-change-effectiveness': 2,
		'regular-price': '22',
		'price-on-google': '21',
		'price-gap': '5',
		'suggested-price': '22',
	},
	{
		title: 'Futuristic Art Deco Print',
		image: 'https://live.staticflickr.com/5725/21726228300_51333bd62c_b.jpg',
		id: 6,
		description: '162349',
		'price-change-effectiveness': 1,
		'regular-price': '55',
		'price-on-google': '42',
		'price-gap': '30',
		'suggested-price': '45',
	},
	{
		title: 'Muted Color Abstract',
		image: 'https://live.staticflickr.com/5725/21726228300_51333bd62c_b.jpg',
		id: 7,
		description: '354012',
		'price-change-effectiveness': 3,
		'regular-price': '18',
		'price-on-google': '19',
		'price-gap': '-6',
		'suggested-price': '17',
	},
	{
		title: 'Bold Graffiti Wall Art',
		image: 'https://live.staticflickr.com/5725/21726228300_51333bd62c_b.jpg',
		id: 8,
		description: '781204',
		'price-change-effectiveness': 2,
		'regular-price': '60',
		'price-on-google': '48',
		'price-gap': '25',
		'suggested-price': '50',
	},
	{
		title: 'Dreamy Ocean Scene',
		image: 'https://live.staticflickr.com/5725/21726228300_51333bd62c_b.jpg',
		id: 9,
		description: '127634',
		'price-change-effectiveness': 1,
		'regular-price': '28',
		'price-on-google': '30',
		'price-gap': '-7',
		'suggested-price': '29',
	},
	{
		title: 'Grayscale Architectural Study',
		image: 'https://live.staticflickr.com/5725/21726228300_51333bd62c_b.jpg',
		id: 10,
		description: '348291',
		'price-change-effectiveness': 2,
		'regular-price': '45',
		'price-on-google': '40',
		'price-gap': '12',
		'suggested-price': '42',
	},
	{
		title: 'Botanical Print Series',
		image: 'https://live.staticflickr.com/5725/21726228300_51333bd62c_b.jpg',
		id: 11,
		description: '231495',
		'price-change-effectiveness': 3,
		'regular-price': '35',
		'price-on-google': '29',
		'price-gap': '21',
		'suggested-price': '30',
	},
	{
		title: 'Vaporwave Sunset Poster',
		image: 'https://live.staticflickr.com/5725/21726228300_51333bd62c_b.jpg',
		id: 12,
		description: '794581',
		'price-change-effectiveness': 2,
		'regular-price': '27',
		'price-on-google': '25',
		'price-gap': '8',
		'suggested-price': '26',
	},
	{
		title: 'Neon Jungle Scene',
		image: 'https://live.staticflickr.com/5725/21726228300_51333bd62c_b.jpg',
		id: 13,
		description: '409182',
		'price-change-effectiveness': 1,
		'regular-price': '32',
		'price-on-google': '34',
		'price-gap': '-6',
		'suggested-price': '33',
	},
	{
		title: 'Pop Art Character Poster',
		image: 'https://live.staticflickr.com/5725/21726228300_51333bd62c_b.jpg',
		id: 14,
		description: '137492',
		'price-change-effectiveness': 3,
		'regular-price': '50',
		'price-on-google': '37',
		'price-gap': '26',
		'suggested-price': '39',
	},
	{
		title: 'Hazy Sunset Canvas',
		image: 'https://live.staticflickr.com/5725/21726228300_51333bd62c_b.jpg',
		id: 15,
		description: '654123',
		'price-change-effectiveness': 2,
		'regular-price': '38',
		'price-on-google': '34',
		'price-gap': '11',
		'suggested-price': '35',
	},
	{
		title: 'Digital Lines Pattern',
		image: 'https://live.staticflickr.com/5725/21726228300_51333bd62c_b.jpg',
		id: 16,
		description: '823459',
		'price-change-effectiveness': 3,
		'regular-price': '19',
		'price-on-google': '14',
		'price-gap': '26',
		'suggested-price': '15',
	},
	{
		title: 'Painterly Street Scene',
		image: 'https://live.staticflickr.com/5725/21726228300_51333bd62c_b.jpg',
		id: 17,
		description: '219384',
		'price-change-effectiveness': 2,
		'regular-price': '24',
		'price-on-google': '22',
		'price-gap': '9',
		'suggested-price': '23',
	},
	{
		title: 'Vintage Travel Poster',
		image: 'https://live.staticflickr.com/5725/21726228300_51333bd62c_b.jpg',
		id: 18,
		description: '989124',
		'price-change-effectiveness': 1,
		'regular-price': '26',
		'price-on-google': '28',
		'price-gap': '-8',
		'suggested-price': '27',
	},
	{
		title: 'Cubist Portrait Study',
		image: 'https://live.staticflickr.com/5725/21726228300_51333bd62c_b.jpg',
		id: 19,
		description: '765241',
		'price-change-effectiveness': 3,
		'regular-price': '42',
		'price-on-google': '33',
		'price-gap': '21',
		'suggested-price': '34',
	},
	{
		title: 'Gradient Waves Print',
		image: 'https://live.staticflickr.com/5725/21726228300_51333bd62c_b.jpg',
		id: 20,
		description: '583024',
		'price-change-effectiveness': 2,
		'regular-price': '21',
		'price-on-google': '20',
		'price-gap': '5',
		'suggested-price': '21',
	},
];

const TABLE_FIELDS = [
	{
		id: 'price-change-effectiveness',
		enableHiding: false,
		enableSorting: true,
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
		header: <Label labelKey={ LABEL_PRICE_ON_GOOGLE } />,
		label: LABELS[ LABEL_PRICE_ON_GOOGLE ].title,
		render: ( { item } ) => {
			return <Price amount={ item[ 'price-on-google' ] } />;
		},
	},
	{
		id: 'price-gap',
		enableHiding: false,
		enableSorting: true,
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
			return <ChangePrice id={ item.id } />;
		},
	},
];

const TABLE_FIELDS_MOBILE = [ 'action' ];

const PriceBenchmarkSuggestions = () => {
	const { suggestions, hasFinishedResolution } =
		usePriceBenchmarkSuggestions();

	return (
		<div className="gla-price-benchmark-suggestions">
			<PriceBenchmarkTable
				data={ suggestions }
				fields={ TABLE_FIELDS }
				fieldsMobile={ TABLE_FIELDS_MOBILE }
				isReady={ hasFinishedResolution }
			/>
		</div>
	);
};

export default PriceBenchmarkSuggestions;
