/**
 * Internal dependencies
 */
import PriceBenchmarkTable from './price-benchmark-table';

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
	return (
		<div className="gla-price-benchmark-suggestions">
			<PriceBenchmarkTable data={ data } />
		</div>
	);
};

export default PriceBenchmarkSuggestions;
